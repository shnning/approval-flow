import React from 'react';
import { DagLine, DagNode, NODE_TYPES } from '../approvalFlow/types';

interface WorkFlowCtx {
  nodes: DagNode[] | null;
  lines: DagLine[] | null;
  addNode: (type: NODE_TYPES, id: string, lines: DagLine[], nodes: DagNode[], routerEndNodeId?: string, childNodeId?: string) => void;
  addBranchNode: (id: string, lines: DagLine[], routerEndNodeId?: string, childNodeId?: string) => void;
  deleteNode: (id: string, lines: DagLine[], nodes: DagNode[]) => void;
  // updateView: () => void;
  // errors: ErrorSet;
  // deleteErrors: (id: string) => void;
}

const WFC = React.createContext<WorkFlowCtx | null>(null);

export default WFC;
export type { WorkFlowCtx };
