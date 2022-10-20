import {
  TreeNode,
  DagNode,
  DagLine,
  NODE_TYPES,
  NODE_TYPES_NAMES,
  LINE_TYPES,
} from "../types";
import { log } from "./log";

export function arrayToMap<T extends { [propName: string]: any }>(
  arr: T[],
  keyName: string
): { [propName: string]: T } {
  const map: { [propName: string]: T } = {};
  for (const item of arr) {
    const key = item[keyName];
    map[key] = item;
  }
  return map;
}

export function isRouterNode(nodeId: string): boolean {
  return getNodeType(nodeId) === NODE_TYPES.ROUTER;
}

export function getNodeType(nodeId: string): string {
  return nodeId.split("-")[0];
}

export function createTreeNode(
  id: string,
  name: string,
  childNode: TreeNode | null,
  conditionNodes: TreeNode[] | null,
  refer: DagNode | DagLine,
  routerEndNodeId?: string
): TreeNode {
  return {
    id,
    name,
    childNode,
    conditionNodes,
    refer,
    routerEndNodeId,
  };
}

export function createDagNode(type: NODE_TYPES) {
  const id = generateId(type);
  let name: string;

  switch (type) {
    case NODE_TYPES.APPROVAL:
      name = "审批人";
      break;
    case NODE_TYPES.CC:
      name = "抄送人";
      break;
    case NODE_TYPES.ROUTER:
      name = "路由";
      break;
    default:
      name = "";
      break;
  }
  const node: DagNode = {
    id,
    name,
    type,
  };

  return node;
}

export function createDagLine(
  type: string,
  src_node_id: string,
  dst_node_id: string
) {
  const id = generateId(type);
  return {
    id,
    src_node_id,
    dst_node_id,
  };
}

export function createConditionLine(
  type: string,
  src_node_id: string,
  dst_node_id: string,
  priority: number,
  rules: Record<string, any> | null
) {
  const id = generateId(type);
  return {
    id,
    src_node_id,
    dst_node_id,
    priority,
    rules,
  };
}

export function generateId(type: string): string {
  return `${type}-${Math.ceil(Math.random() * 10000)}-${Math.ceil(
    Math.random() * 10000
  )}`;
}

export function getRootDagNode(nodes: DagNode[]): DagNode {
  return nodes.find((node) => node.id === "START")!;
}

export function getUnrelatedNodes(
  root: DagNode,
  nodes: DagNode[],
  lines: DagLine[]
) {
  const nodeIdsSet = new Set(nodes.map((node) => node.id));
  nodeIdsSet.delete(root.id);

  const layer: string[] = [root.id];

  while (layer.length) {
    let len = layer.length;

    while (len) {
      const nodeId = layer.shift();
      const childrenIds = lines
        .filter((line) => line.src_node_id === nodeId)
        .map((line) => line.dst_node_id);
      childrenIds.forEach((id) => nodeIdsSet.delete(id));
      layer.push(...childrenIds);
      len -= 1;
    }
  }

  const nodeIds = Array.from(nodeIdsSet);

  nodeIds.forEach((id) => {
    const nodeIndex = nodes.findIndex((node) => node.id === id);
    nodes.splice(nodeIndex, 1);
    const srclineIndex = lines.findIndex((line) => line.src_node_id === id);
    srclineIndex !== -1 && lines.splice(srclineIndex, 1);
    const dstLineIndex = lines.findIndex((line) => line.dst_node_id === id);
    dstLineIndex !== -1 && lines.splice(dstLineIndex, 1);
    log(
      JSON.parse(JSON.stringify(lines)),
      id,
      srclineIndex,
      dstLineIndex
    );
  });

  log("getUnrelatedNodes -----> :", nodes, lines);

  return [nodes, lines];
}

export function isConditionNode(nodeId: string) {
  return getNodeType(nodeId) === LINE_TYPES.CONDITION;
}

export function getTargetDstNodeIdLines(
  lines: DagLine[],
  targetNodeId: string
) {
  return lines.filter((line) => line.dst_node_id === targetNodeId);
}

export function getTargetSrcNodeIdLines(
  lines: DagLine[],
  targetNodeId: string
) {
  return lines.filter((line) => line.src_node_id === targetNodeId);
}

export function patchUpdateLineDstNodeId(
  lines: DagLine[],
  targetNodeId: string
) {
  lines.forEach((line) => {
    line.dst_node_id = targetNodeId;
  });
}

export function getSameParentLines(lines: DagLine[], parentNodeId: string): DagLine[] {
  const res = [];

  for (const line of lines) {
    let tempLine: DagLine | undefined = line;
    while (tempLine && tempLine.src_node_id !== parentNodeId) {
      tempLine = lines.find(
        (cline) => cline.dst_node_id === tempLine?.src_node_id
      );
    }
    if (tempLine) {
      res.push(line);
    }
  }

  return res;
}

export function deepClone<T>(o: T): T | null {
  try {
    return JSON.parse(JSON.stringify(o))
  } catch {
    return null
  }
}
