import { TreeNode } from '../approvalFlow/types';
import MatchNode from './MatchNode';

type IProps = {
  node: TreeNode | null;
};

const Render: (props: IProps) => JSX.Element = ({ node }) => (
  <>
    {node && <MatchNode node={node} />}
    {node?.childNode && <Render node={node.childNode} />}
  </>
);

export default Render;
