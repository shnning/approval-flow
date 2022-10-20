import { MouseEventHandler, useState, useContext } from 'react';
import { Checkbox, Drawer, Radio, Button, Select, Modal, Tag, message } from 'antd';
import AddNode from './Add';
import { DagLine, DagNode, TreeNode } from '../approvalFlow/types';
import WFC, { WorkFlowCtx } from '../store';
// import { Contact } from '@/components';
import { deepClone } from '../approvalFlow/shared';

type IProps = {
  id: string;
  title: string | JSX.Element;
  titleStyle?: Record<string, string>;
  type: string;
  onContentClick?: MouseEventHandler;
  children: JSX.Element[] | JSX.Element;
  refer?: DagLine | DagNode;
  childNode?: TreeNode | null;
  routerEndNodeId?: string;
};

const APPRO = [
  {
    name: 'APV_MEMBERS',
    text: '指定人员',
  },
  {
    name: 'APV_LEADER',
    text: '指定上级',
  },
];

const MEMBERS_APV_REL = [
  {
    name: 'APV_REL_OR',
    text: '或签（ 一名成员同意即可 ）',
  },
  {
    name: 'APV_REL_AND',
    text: '会签（ 须所有成员同意 ）',
  },
  {
    name: 'APV_REL_ONE_BY_ONE',
    text: '依次审批（按顺序依次审批）',
  },
];

const LEADER_APV_REL = [
  {
    name: 'APV_REL_OR',
    text: '或签（ 一名成员同意即可 ）',
  },
  {
    name: 'APV_REL_AND',
    text: '会签（ 须所有成员同意 ）',
  },
];

export const LEADER_LEVELS = [
  {
    text: '直接上级',
    value: '1',
  },
  {
    text: '第二级上级',
    value: '2',
  },
  {
    text: '第三级上级',
    value: '3',
  },
  {
    text: '第四级上级',
    value: '4',
  },
  {
    text: '第五级上级',
    value: '5',
  },
  {
    text: '第六集上级',
    value: '6',
  },
];

const NodeWrap: (props: IProps) => JSX.Element = ({
  id,
  title,
  titleStyle,
  type,
  children,
  refer,
  routerEndNodeId,
}) => {
  const [visible, setVisible] = useState(false);
  // const [userSelectorModalVisible, setUserSelectorModalVisible] = useState(false);
  // const { updateView, deleteErrors } = useContext(WFC) as WorkFlowCtx;

  // const [appro, setAppro] = useState<{
  //   type: string;
  //   members?: { id: string; content: string }[];
  //   leader?: {
  //     order: 'LOW_2_HIGH';
  //     level: string;
  //   };
  //   apv_rel: string;
  // }>(
  //   deepClone(
  //     (refer as DagNode)?.appro || {
  //       type: 'APV_MEMBERS',
  //       apv_rel: 'APV_REL_OR',
  //     },
  //   ),
  // );
  // const [cc, setCc] = useState<{
  //   is_allow: boolean;
  // }>((refer as DagNode)?.cc || { is_allow: false });
  // const [seletedUsers, setSelectedUsers] = useState<{ id: string; content: string }[]>([...(appro.members || [])]);

  // console.log('routerEndNodeId: ', id, ' ', routerEndNodeId);

  return (
    <div>
      <div className="node-wrap">
        <div className={`node-wrap-box ${type === 'START' ? 'start-node' : ''}`}>
          <div className="title" style={titleStyle}>
            {title}{id}
          </div>
          <div
            className="content"
            onClick={() => {
              if (type === 'APPROVAL' || type === 'CC') {
                setVisible(!visible);
                // deleteErrors(id);
              }
            }}
          >
            {children}
          </div>
          {/* {errors[id] ? (
            <Icon
              type="error"
              size="l"
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translate(50px, -50%)',
              }}
            />
          ) : (
            ''
          )} */}
        </div>
        <AddNode id={id} routerEndNodeId={routerEndNodeId} />
      </div>
      {/* <Drawer
        visible={visible}
        onClose={() => setVisible(!visible)}
        disableCloseIcon
        showMask
        style={{
          width: '500px',
        }}
        footer={
          <Justify
            right={
              <>
                <Button
                  onClick={() => {
                    if (type === 'APPROVAL') {
                      // 检验逻辑
                      if (appro.type === 'APV_MEMBERS' && (!appro.members || appro.members.length === 0)) {
                        message.error({
                          content: '请选择审批人',
                        });
                        return;
                      }
                      (refer as DagNode).appro = appro;
                    } else {
                      (refer as DagNode).cc = cc;
                    }

                    updateView();
                    setVisible(!visible);
                  }}
                >
                  确定
                </Button>
                <Button
                  onClick={() => {
                    setVisible(!visible);
                  }}
                >
                  取消
                </Button>
              </>
            }
          />
        }
      >
        {type === 'APPROVAL' && (
          <div>
            <div>
              <Radio.Group
                defaultValue={appro.type}
                onChange={(value) => {
                  appro.type = value;

                  // 对于审批条件是领导的，需要设置一个默认值
                  if (!appro.leader) {
                    appro.leader = {
                      order: 'LOW_2_HIGH',
                      level: '1',
                    };
                  }

                  appro.apv_rel = 'APV_REL_OR';
                  setAppro({ ...appro });
                }}
              >
                {APPRO.map(({ text, name }) => (
                  <Radio name={name} key={name}>
                    {text}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <hr style={{ margin: '20px 0' }} />
            <div>
              <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>添加成员</h3>
              {appro.type === 'APV_MEMBERS' && (
                <div>
                  <Button onClick={() => setUserSelectorModalVisible(!userSelectorModalVisible)}>添加成员</Button>
                  <div>
                    {appro?.members?.map((member, index) => (
                      <Tag
                        key={member.id}
                        theme="primary"
                        onClose={() => {
                          appro.members?.splice(index, 1);
                          setAppro({ ...appro });
                        }}
                      >
                        {member.content}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
              {appro.type === 'APV_LEADER' && (
                <div>
                  从下至上
                  <Select
                    options={LEADER_LEVELS}
                    value={appro.leader?.level || '1'}
                    onChange={(value) => {
                      appro.leader = {
                        level: value,
                        order: 'LOW_2_HIGH',
                      };
                      setAppro({ ...appro });
                    }}
                  />
                </div>
              )}
            </div>
            <hr style={{ margin: '20px 0' }} />
            <div>
              <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>多人审批方式</h3>
              <Radio.Group
                onChange={(value) => {
                  appro.apv_rel = value;
                  setAppro({ ...appro });
                }}
                value={appro.apv_rel}
              >
                {appro.type === 'APV_MEMBERS' &&
                  MEMBERS_APV_REL.map(({ name, text }) => (
                    <Radio name={name} key={name}>
                      {text}
                    </Radio>
                  ))}
                {appro.type === 'APV_LEADER' &&
                  LEADER_APV_REL.map(({ name, text }) => (
                    <Radio name={name} key={name}>
                      {text}
                    </Radio>
                  ))}
              </Radio.Group>
            </div>
          </div>
        )}
        {type === 'CC' && (
          <div>
            <div>
              <Checkbox.Group>
                <Checkbox
                  defaultValue={cc.is_allow}
                  onChange={(value) => {
                    cc.is_allow = value;
                    setCc({ ...cc });
                  }}
                >
                  允许抄送人自选
                </Checkbox>
              </Checkbox.Group>
            </div>
          </div>
        )}
      </Drawer> */}
      {/* <Modal
        visible={userSelectorModalVisible}
        onCancel={() => setUserSelectorModalVisible(!userSelectorModalVisible)}
        destroyOnClose={false}
        // size="m"
        title="可见范围"
        footer={<>
          <Button
            onClick={() => {
              appro.members = seletedUsers;
              console.log('seletedUsers', seletedUsers);
              setAppro({ ...appro });
              setUserSelectorModalVisible(!userSelectorModalVisible);
            }}
          >
            确定
          </Button>
          <Button onClick={() => setUserSelectorModalVisible(!userSelectorModalVisible)}>取消</Button>
        </>}
      > */}
        {/* <Modal.Body
          style={{
            height: '300px',
            overflow: 'auto',
          }}
        > */}
          {/* <Contact
            expendNodeSelectable={false}
            selectedIds={seletedUsers.map((user) => user.id)}
            onSelect={(selectedIds) => {
              console.log('seletedUsers: ', selectedIds);
              setSelectedUsers([...selectedIds]);
            }}
          /> */}
          {/* <div>通讯录卡片</div> */}
        {/* </Modal.Body> */}
        {/* <Modal.Footer>
          <Justify
            right={
              <>
                <Button
                  onClick={() => {
                    appro.members = seletedUsers;
                    console.log('seletedUsers', seletedUsers);
                    setAppro({ ...appro });
                    setUserSelectorModalVisible(!userSelectorModalVisible);
                  }}
                >
                  确定
                </Button>
                <Button onClick={() => setUserSelectorModalVisible(!userSelectorModalVisible)}>取消</Button>
              </>
            }
          />
        </Modal.Footer> */}
      {/* </Modal> */}
    </div>
  );
};
export default NodeWrap;
