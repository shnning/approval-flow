export interface DagNode {
  id: string;
  type: string;
  name: string;
}

export interface DagLine {
  id: string;
  src_node_id: string;
  dst_node_id: string;
  name?: string;
  priority?: number;
}

export interface TreeNode {
  id: string;
  name: string;
  childNode: TreeNode | null;
  conditionNodes: TreeNode[] | null;
  refer: DagNode | DagLine;
  // fakeChildNode?: TreeNode | null;
  // 当节点出现在条件分支当中时，用来标记该条件分支的结束节点
  routerEndNodeId?: string;
}

export const enum NODE_TYPES {
  APPROVAL = "APPROVAL",
  CC = "CC",
  ROUTER = 'ROUTER',
}

export enum NODE_TYPES_NAMES {
  APPROVAL = '审批人',
  CC = '抄送人',
};

export enum LINE_TYPES {
  LINE = 'LINE',
  CONDITION = 'CONDITION',
};
