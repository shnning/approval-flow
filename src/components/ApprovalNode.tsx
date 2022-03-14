import { DagNode, DagLine, TreeNode } from '../approvalFlow/types';
import { MouseEventHandler } from 'react';
import NodeWrap, { LEADER_LEVELS } from './NodeWrap';
import TitleElement from './TitleElement';
import { getNodeType } from '../approvalFlow/shared';

type IProps = {
  id: string;
  name: string;
  onContentClick: MouseEventHandler;
  refer: DagNode | DagLine;
  childNode: TreeNode | null;
  routerEndNodeId?: string;
};

// const transformText: (appro: {
//   type: string;
//   members?: { id: string; content: string }[];
//   leader?: {
//     order: 'LOW_2_HIGH';
//     level: string;
//   };
//   apv_rel: string;
// }) => string = (
//   { type, apv_rel, members, leader } = {} as unknown as {
//     type: string;
//     members?: { id: string; content: string }[];
//     leader?: {
//       order: 'LOW_2_HIGH';
//       level: string;
//     };
//     apv_rel: string;
//   },
// ) => {
//   if (!type) {
//     return '请设置审批节点';
//   }
//   let typeText;
//   let apvReltext;
//   let content;

//   switch (apv_rel) {
//     case 'APV_REL_OR':
//       apvReltext = '或签';
//       break;
//     case 'APV_REL_AND':
//       apvReltext = '会签';
//       break;
//     case 'APV_REL_ONE_BY_ONE':
//       apvReltext = '依次审批';
//       break;
//     default:
//       break;
//   }

//   switch (type) {
//     case 'APV_MEMBERS':
//       typeText = `指定人员${apvReltext}`;
//       break;
//     case 'APV_LEADER':
//       typeText = '指定上级审批';
//       break;
//     default:
//       break;
//   }

//   // console.log('members: ', leader);
//   if (members?.length) {
//     content = members?.map((m) => m.content).join('，');
//   } else {
//     content = LEADER_LEVELS.find((l) => l.value === leader!.level)?.text;
//   }

//   const text = `${typeText}：${content}`;

//   return text;
// };

const ApprovalNode: (props: IProps) => JSX.Element = ({ id, name, onContentClick, refer, routerEndNodeId }) => {
  const titleEl = <TitleElement id={id} placeholder={name} name={name} />;
  return (
    <NodeWrap
      refer={refer}
      id={id}
      type={getNodeType(id)}
      titleStyle={{ backgroundColor: 'rgb(255, 148, 62)' }}
      onContentClick={onContentClick}
      title={titleEl}
      routerEndNodeId={routerEndNodeId}
    >
      {/* <div className="text">{transformText((refer as DagNode).appro!)}</div> */}
      <div>审批人</div>
      <i className="anticon anticon-right arrow"></i>
    </NodeWrap>
  );
};

export default ApprovalNode;
