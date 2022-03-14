import { DagNode, DagLine } from '../approvalFlow/types';
import { MouseEventHandler } from 'react';
import { getNodeType } from '../approvalFlow/shared';
import NodeWrap from './NodeWrap';
import TitleElement from './TitleElement';

type IProps = {
  id: string;
  name: string;
  onContentClick: MouseEventHandler;
  refer: DagNode | DagLine;
  // childNode: TreeNode | null;
  routerEndNodeId?: string;
};

const transformText: (cc: { is_allow: boolean } | undefined) => string = (cc) => {
  if (!cc) {
    return '请设置审批节点';
  }

  if (cc.is_allow) {
    return '允许抄送人自选';
  }
  return '不允许抄送人自选';
};

const CCNode: (props: IProps) => JSX.Element = ({ id, name, onContentClick, refer, routerEndNodeId }) => {
  const titleEl = <TitleElement id={id} placeholder={name} name={name} />;
  return (
    <NodeWrap
      refer={refer}
      id={id}
      type={getNodeType(id)}
      titleStyle={{ backgroundColor: '#3cb4b2' }}
      onContentClick={onContentClick}
      title={titleEl}
      routerEndNodeId={routerEndNodeId}
    >
      {/* <div className="text">{transformText((refer as DagNode).cc)}</div> */}
      <div>抄送人</div>
      <i className="anticon anticon-right arrow"></i>
    </NodeWrap>
  );
};

export default CCNode;
