import StartNode from './StartNode';
import ApprovalNode from './ApprovalNode';
import CCNode from './CCNode';
import RouterNode from './RouterNode';
import { TreeNode } from '../approvalFlow/types';

export enum NodeTypes {
  Start,
  Approval,
  CC,
  Router,
}
type RenderNode = typeof StartNode | typeof ApprovalNode | typeof CCNode | typeof RouterNode;

const getNode = (id: string) => {
  const type = id.split('-')[0];
  let node: RenderNode | null;
  switch (type) {
    case 'START':
      node = StartNode;
      break;
    case 'APPROVAL':
      node = ApprovalNode;
      break;
    case 'CC':
      node = CCNode;
      break;
    case 'ROUTER':
      node = RouterNode;
      break;
    default:
      node = null;
      break;
  }

  return node!;
};

type IProps = {
  node: TreeNode;
};

const MatchNode: (props: IProps) => JSX.Element = ({ node }) => {
  const Node = getNode(node.id);
  // console.log(node.id, Node);
  return Node && <Node {...node} onContentClick={() => {}} key={node.id} />;
};

export default MatchNode;
