import {
  createDagNode,
  getNodeType,
  createConditionLine,
  createDagLine,
  getUnrelatedNodes,
  getRootDagNode,
  getTargetDstNodeIdLines,
  patchUpdateLineDstNodeId,
  getSameParentLines,
  getTargetSrcNodeIdLines,
} from "../shared";
import { log } from "../shared/log";
import { NODE_TYPES, LINE_TYPES, DagLine, DagNode } from "../types";

export function addNode(
  nodeType: NODE_TYPES,
  currNodeId: string,
  lines: DagLine[],
  nodes: DagNode[],
  onLinesChange: Function,
  onNodesChange: Function,
  routerEndNodeId?: string,
  childNodeId?: string
) {
  const newNode = createDagNode(nodeType);
  const newNodeId = newNode.id;

  // 如果是条件节点下创建的，由于不存在条件节点node，所以必然在lines中找不到对应以其为起点的边
  let targetLineIndex = lines.findIndex(
    (line) => line.src_node_id === currNodeId
  );
  // 非条件分支节点下添加节点
  if (targetLineIndex !== -1) {
    // 要添加的节点类型是路由节点
    if (nodeType === NODE_TYPES.ROUTER) {
      // 如果在router节点下添加新节点
      if (getNodeType(currNodeId) === NODE_TYPES.ROUTER) {
        const dstLines = getTargetDstNodeIdLines(
          lines,
          childNodeId || (routerEndNodeId as string)
        );
        const targetLines = getSameParentLines(dstLines, currNodeId);

        patchUpdateLineDstNodeId(targetLines, newNodeId);

        const conditionLine1 = createConditionLine(
          LINE_TYPES.CONDITION,
          newNodeId,
          childNodeId! || routerEndNodeId!,
          1,
          {}
        );
        const conditionLine2 = createConditionLine(
          LINE_TYPES.CONDITION,
          newNodeId,
          routerEndNodeId!,
          2,
          null
        );
        lines.splice(targetLineIndex, 0, conditionLine1, conditionLine2);
      } else {
        const targetLine = lines[targetLineIndex];
        const dstNodeId = targetLine.dst_node_id;
        targetLine.dst_node_id = newNodeId;
        const conditionLine1 = createConditionLine(
          LINE_TYPES.CONDITION,
          newNodeId,
          dstNodeId,
          1,
          {}
        );
        const conditionLine2 = createConditionLine(
          LINE_TYPES.CONDITION,
          newNodeId,
          routerEndNodeId!,
          2,
          null
        );
        lines.splice(targetLineIndex, 0, conditionLine1, conditionLine2);
      }
    } else {
      if (getNodeType(currNodeId) === NODE_TYPES.ROUTER) {
        const dstLines = getTargetDstNodeIdLines(
          lines,
          childNodeId || (routerEndNodeId as string)
        );
        const targetLines = getSameParentLines(dstLines, currNodeId);

        patchUpdateLineDstNodeId(targetLines, newNodeId);

        const line = createDagLine(
          LINE_TYPES.LINE,
          newNodeId,
          childNodeId || routerEndNodeId!
        );
        lines.splice(targetLineIndex, 0, line);
        log("childNodeId: ", childNodeId);
      } else {
        const targetLine = lines[targetLineIndex];
        const dstNodeId = targetLine.dst_node_id;
        targetLine.dst_node_id = newNodeId;
        const line = createDagLine(LINE_TYPES.LINE, newNodeId, dstNodeId);
        lines.splice(targetLineIndex, 0, line);
      }
    }
  } else {
    // 条件分支节点下添加节点
    if (nodeType === NODE_TYPES.ROUTER) {
      targetLineIndex = lines!.findIndex((line) => line.id === currNodeId);
      const targetLine = lines[targetLineIndex];
      const dstNodeId = targetLine.dst_node_id;
      targetLine.dst_node_id = newNodeId;
      const conditionline1 = createConditionLine(
        LINE_TYPES.CONDITION,
        newNodeId,
        dstNodeId,
        1,
        {}
      );
      const conditionline2 = createConditionLine(
        LINE_TYPES.CONDITION,
        newNodeId,
        routerEndNodeId!,
        2,
        null
      );
      log(conditionline1, conditionline2);
      lines!.splice(targetLineIndex, 0, conditionline1, conditionline2);
    } else {
      targetLineIndex = lines.findIndex((line) => line.id === currNodeId);
      const targetLine = lines[targetLineIndex];
      const line = createDagLine(
        LINE_TYPES.LINE,
        newNodeId,
        targetLine.dst_node_id
      );
      targetLine.dst_node_id = newNodeId;
      lines.splice(targetLineIndex, 0, line);
    }
  }

  // TODO: 返回or设置新数据
  onLinesChange([...lines]);
  onNodesChange([...nodes, newNode]);
}

export function deleteNode(
  id: string,
  nodes: DagNode[],
  lines: DagLine[],
  onLinesChange: Function,
  onNodesChange: Function
) {
  const currNodeId = id;
  let currNodeIndex = nodes.findIndex((node) => node.id === currNodeId);

  if (currNodeIndex !== -1) {
    // 删除非条件分支下节点
    nodes?.splice(currNodeIndex, 1);

    const dstLines = getTargetDstNodeIdLines(lines, currNodeId);
    const srcLineIndex = lines.findIndex(
      (line) => line.src_node_id === currNodeId
    );
    const srcLine = lines[srcLineIndex];

    patchUpdateLineDstNodeId(dstLines, srcLine.dst_node_id);
    lines.splice(srcLineIndex, 1);

    // setCurrNodes([...currNodes!]);
    // setCurrLines([...lines]);
    onNodesChange([...nodes]);
    onLinesChange([...lines]);
  } else {
    // 删除条件分支节点
    currNodeIndex = lines!.findIndex((line) => line.id === currNodeId);
    const currConditionLine = lines![currNodeIndex];
    lines.splice(currNodeIndex, 1);
    const { src_node_id: routerNodeId } = currConditionLine;
    const otherConditionLines = getTargetSrcNodeIdLines(lines, routerNodeId);
    if (otherConditionLines.length === 1) {
      // 此时要完全删除router节点
      const beforeRouterLines = getTargetDstNodeIdLines(lines, routerNodeId);
      const otherConditionLine = otherConditionLines[0];
      const afterRouterNodeId = otherConditionLine.dst_node_id;
      const otherConditionLineIndex = lines.findIndex(
        (line) => line.id === otherConditionLine.id
      );
      lines?.splice(otherConditionLineIndex, 1);

      patchUpdateLineDstNodeId(beforeRouterLines, afterRouterNodeId);
    } else {
      otherConditionLines
        .sort(
          (line1, line2) =>
            (line1.priority as number) - (line2.priority as number)
        )
        .forEach((line, index) => {
          line.priority = index + 1;
        });
    }
    log(
      "after delete: ",
      JSON.parse(JSON.stringify(nodes)),
      JSON.parse(JSON.stringify(lines))
    );
    const [a, b] = getUnrelatedNodes(getRootDagNode(nodes!), nodes!, lines!);
    log("getUnrelatedNodes: ", a, b);
    // setCurrLines([...b]);
    // setCurrNodes([...a]);
    onNodesChange([...a]);
    onLinesChange([...b]);
  }
}

export function addBranchNode(
  id: string,
  lines: DagLine[],
  onLinesChange: Function,
  routerEndNodeId?: string,
  childNodeId?: string
) {
  const routerId = id;
  const sameLevelBranchNodes = getTargetSrcNodeIdLines(lines, routerId).sort(
    (line1, line2) => line1.priority! - line2.priority!
  );
  log(routerId, sameLevelBranchNodes);
  const maxPriority =
    sameLevelBranchNodes[sameLevelBranchNodes.length - 1].priority!;
  sameLevelBranchNodes[sameLevelBranchNodes.length - 1].priority =
    maxPriority + 1;

  const line = createConditionLine(
    LINE_TYPES.CONDITION,
    routerId,
    childNodeId! || routerEndNodeId || "END",
    maxPriority,
    {}
  );
  // 更新数据
  onLinesChange([...lines, line]);
  // setCurrLines([...lines, line]); 设置
}
