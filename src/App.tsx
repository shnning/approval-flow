import { useMemo, useState } from "react";
import "./App.scss";
import {
  addNode,
  deleteNode,
  addBranchNode,
} from "./approvalFlow/core/operation";
import { DagLine, DagNode, NODE_TYPES } from "./approvalFlow/types";
import EndNode from "./components/EndNode";
import ZoomLayout from "./components/Layout";
import Render from "./components/Render";
import WFC from "./store";
import initialData from "./approvalFlow/__test__/data/data0.json";
import { dagToTree } from "./approvalFlow/core";
import { ConfigProvider } from "antd";
const { nodes: initialNodes, lines: initialLines } = initialData;

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [lines, setLines] = useState(initialLines);
  const root = useMemo(() => dagToTree(lines, nodes), [nodes, lines]);

  const handleAddNode = (
    type: NODE_TYPES,
    id: string,
    lines: DagLine[],
    nodes: DagNode[],
    routerEndNodeId?: string,
    childNodeId?: string
  ) => {
    addNode(
      type,
      id,
      lines,
      nodes,
      setLines,
      setNodes,
      routerEndNodeId,
      childNodeId
    );
  };

  const handleDeleteNode = (id: string, lines: DagLine[], nodes: DagNode[]) => {
    deleteNode(id, nodes, lines, setLines, setNodes);
  };

  const handleAddBranchNode = (
    id: string,
    lines: DagLine[],
    routerEndNodeId?: string,
    childNodeId?: string
  ) => {
    addBranchNode(id, lines, setLines, routerEndNodeId, childNodeId);
  };

  return (
    <ConfigProvider getPopupContainer={(trigger) => (trigger as HTMLElement).parentElement as HTMLElement}>
      <WFC.Provider
        value={{
          nodes,
          lines,
          addNode: handleAddNode,
          deleteNode: handleDeleteNode,
          addBranchNode: handleAddBranchNode,
          // updateView,
          // errors,
          // deleteErrors,
        }}
      >
        <section className="dingflow-design">
          <ZoomLayout>
            <Render node={root} />
            <EndNode />
          </ZoomLayout>
        </section>
      </WFC.Provider>
    </ConfigProvider>
  );
}

export default App;
