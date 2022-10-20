import { createTreeNode, arrayToMap, isRouterNode } from "../shared";
import { DagNode, DagLine, TreeNode } from "../types";
import { log } from "../shared/log";

let nodesMap: Record<string, DagNode>;

export function dagToTree(lines: DagLine[], nodes: DagNode[]): TreeNode {
  log(
    "DagToTree: ",
    JSON.parse(JSON.stringify(lines)),
    JSON.parse(JSON.stringify(nodes))
  );

  nodesMap = arrayToMap<DagNode>(nodes, "id");
  const root = createTreeNode(
    nodes[0].id,
    nodes[0].name,
    null,
    null,
    nodes[0],
    "END"
  );

  let prevNode: TreeNode = root;

  while (prevNode.id !== "END") {
    const { id } = prevNode;
    let prevId: string;
    let childNodeId: string;
    let childNodeName: string;

    log('prevNode: ', prevNode);

    if (isRouterNode(id)) {
      prevId = buildRouter(prevNode, lines)!;
      // if (prevId === 'END') break;
      childNodeId = prevId;
      childNodeName = nodesMap[childNodeId].name;
    } else {
      childNodeId = (lines.find((line) => line.src_node_id === id) as DagLine)
        .dst_node_id;
      childNodeName = nodesMap[childNodeId].name;
    }

    if (isRouterNode(childNodeId)) {
      const childNode = createTreeNode(
        childNodeId,
        childNodeName,
        null,
        null,
        nodesMap[childNodeId],
        "END"
      );
      prevNode.childNode = childNode;
      const prevNodeId = buildRouter(childNode, lines)!;
      childNode.childNode = prevNodeId
        ? createTreeNode(
            prevNodeId!,
            nodesMap[prevNodeId].name,
            null,
            null,
            nodesMap[prevNodeId],
            "END"
          )
        : null;
      prevNode = childNode.childNode as TreeNode;
      // prevNode = buildRouter(childNode, lines)!;
    } else {
      const childNode = createTreeNode(
        childNodeId,
        childNodeName,
        null,
        null,
        nodesMap[childNodeId],
        "END"
      );
      prevNode.childNode = childNode;
      prevNode = childNode;
    }
  }

  log("---->: ", root);

  return root;
}

export function buildRouter(
  routerNode: TreeNode,
  lines: DagLine[],
  commonId?: string
): string | null {
  // 收集所有的以当前routerId为起点的边，然后创建以路由边id为节点id的条件节点
  // 因为条件节点没有真正的node，但是在流程图上需要展示节点，而且对应的tree结构也需要这么一个node
  const conditionLines = lines.filter(
    (line) => line.src_node_id === routerNode.id
  );
  const conditionNodes = conditionLines.map((line) =>
    createTreeNode(line.id, line.name!, null, null, line)
  );

  // 获取条件节点下面第一个连接的真实节点
  const children = conditionNodes.map((node, index) => {
    const childNodeId = conditionLines[index].dst_node_id;
    const childNodeName = nodesMap[childNodeId].name;
    node.childNode = createTreeNode(
      childNodeId,
      childNodeName,
      null,
      null,
      nodesMap[childNodeId]
    );
    return node.childNode;
  });

  const branchNodes: string[][] = [];

  // 从每个条件节点下面的真实节点开始遍历直到end，并记录
  children.forEach((node, index) => {
    if (!branchNodes[index]) {
      branchNodes[index] = [node.id];
    }
    let prevNodeId = node.id;
    while (prevNodeId !== "END") {
      const currNodeId = lines.find((line) => line.src_node_id === prevNodeId)!
        .dst_node_id!;
      branchNodes[index].push(currNodeId);
      prevNodeId = currNodeId;
    }
  });

  // firstCommonId为所有分支第一个相交的节点
  const firstBranchNodes = branchNodes.splice(0, 1)[0];
  let firstCommonId: string;
  for (const id of firstBranchNodes) {
    if (branchNodes.every((nodeIds) => nodeIds.some((oid) => oid === id))) {
      firstCommonId = id;
      break;
    }
  }

  // 处理条件节点的子节点，如果按照之前的处理，条件节点的子节点正好为所有分支第一个相交的节点，那么设置为null，因为相交要作为路由节点的子节点
  children.map((node, index) => {
    conditionNodes[index].routerEndNodeId = firstCommonId;

    if (node.id === firstCommonId) {
      conditionNodes[index].childNode = null;
      return null;
    }
  });

  log(
    "buildRouter: ",
    routerNode.id,
    firstCommonId!,
    commonId,
    firstBranchNodes,
    branchNodes
  );

  children.forEach((node) => {
    if (!node) {
      return;
    }
    let prevNode: TreeNode | null = node;

    node.routerEndNodeId = firstCommonId;

    while (prevNode && prevNode.id !== firstCommonId && prevNode.id !== "END") {
      log("prevNodeId: ", prevNode.id);
      if (isRouterNode(prevNode.id)) {
        const routerEndNodeId: string | null = buildRouter(
          prevNode,
          lines,
          firstCommonId
        )!;
        prevNode.childNode = routerEndNodeId
          ? createTreeNode(
              routerEndNodeId!,
              nodesMap[routerEndNodeId].name,
              null,
              null,
              nodesMap[routerEndNodeId],
              commonId || firstCommonId
            )
          : null;
        prevNode = prevNode.childNode;
      } else {
        const currNodeId = lines.find(
          (line) => line.src_node_id === (prevNode as TreeNode).id
        )!.dst_node_id!;
        const currNodeName = nodesMap[currNodeId].name;
        const currNode = createTreeNode(
          currNodeId,
          currNodeName,
          null,
          null,
          nodesMap[currNodeId],
          commonId || firstCommonId
        );
        if (currNodeId !== firstCommonId) {
          prevNode.childNode = currNode;
        }

        prevNode = currNode;
      }
    }
  });

  routerNode.conditionNodes = conditionNodes;
  // 说明此router对应的childNode和父router对应的childNode相同，那么子router的childNode不需要
  if (commonId === firstCommonId!) {
    return null;
  }
  return firstCommonId!;
}
