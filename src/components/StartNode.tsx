import { MouseEventHandler } from 'react';
import NodeWrap from './NodeWrap';
import { getNodeType } from '../approvalFlow/shared';

type IProps = {
  onContentClick: MouseEventHandler;
  name: string;
  id: string;
  routerEndNodeId?: string;
};

const StartNode: (props: IProps) => JSX.Element = ({ id, name, onContentClick, routerEndNodeId }) => (
  <NodeWrap
    id={id}
    type={getNodeType(id)}
    onContentClick={onContentClick}
    title={<span>{name}</span>}
    routerEndNodeId={routerEndNodeId}
  >
    <div className="text">{'所有人'}</div>
    <i className="anticon anticon-right arrow"></i>
  </NodeWrap>
);

export default StartNode;
