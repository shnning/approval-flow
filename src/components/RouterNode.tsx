import { MouseEventHandler, useContext, useState } from 'react';
import AddNode from './Add';
import Render from './Render';
import { DagLine, TreeNode } from '../approvalFlow/types';
import WFC, { WorkFlowCtx } from '../store';
import { Button, Drawer, Select, Input, Modal, Form, Radio, Tag, message } from 'antd';
import { deepClone } from '../approvalFlow/shared';
import { deleteNode } from '../approvalFlow/core/operation';
// import { Contact } from '@/components';

type CoverLineProps = {
  first: boolean;
  last: boolean;
};
const CoverLine: (props: CoverLineProps) => JSX.Element = ({ first, last }) => (
  <>
    {first && <div className="top-left-cover-line"></div>}
    {first && <div className="bottom-left-cover-line"></div>}
    {last && <div className="top-right-cover-line"></div>}
    {last && <div className="bottom-right-cover-line"></div>}
  </>
);

type BranchNodeProps = {
  id: string;
  first: boolean;
  last: boolean;
  sortLeft?: MouseEventHandler;
  name: string;
  delBranch?: MouseEventHandler;
  sortRight?: MouseEventHandler;
  onBranchClick?: Function;
  owner?: string;
  branch?: TreeNode;
};

const FIELD_IDS = [
  {
    value: 'quantity',
    text: '数量',
  },
  {
    value: 'price',
    text: '单价',
  },
  {
    value: 'totalPrice',
    text: '总价',
  },
];

const OPERATORS = [
  {
    value: 'gt',
    text: '大于',
  },
  {
    value: 'lt',
    text: '小于',
  },
  {
    value: 'le',
    text: '小于等于',
  },
  {
    value: 'ge',
    text: '大于等于',
  },
  {
    value: 'eq',
    text: '等于',
  },
  {
    value: 'neq',
    text: '不等于',
  },
  {
    value: 'range',
    text: '范围',
  },
];

const RULE_TYPE = [
  {
    name: 'departrangeitems',
    text: '人员',
  },
  {
    name: 'fielditems',
    text: '数值',
  },
];

const transformText: (
  rules: {
    departrangeitems?: { id: string; content: string }[];
    fielditems?: {
      cond: {
        field_id?: string;
        operator?: string;
        value?: number | number[];
      }[];
      type: string;
    };
  } | null,
) => string = (rules) => {
  if (!rules) {
    return '未满足其他条件分支的情况，将使用默认流程';
  }

  const isInitial = Object.keys(rules).length === 0;

  if (isInitial) {
    return '请设置条件';
  }

  let text = `需要满足以下条件:
  `;

  if (rules.departrangeitems) {
    const nameText = rules.departrangeitems?.map((p) => p.content).join('，');
    text += `申请人为 ${nameText}`;
  }

  if (rules.fielditems) {
    const {
      fielditems: { cond },
    } = rules;
    cond.forEach(({ field_id, operator, value }) => {
      if (!field_id) {
        return;
      }
      const condText =
        FIELD_IDS.find((item) => item.value === field_id)!.text +
        OPERATORS.find((item) => item.value === operator)?.text;
      let valueText;
      if (operator === 'range') {
        valueText = `在${(value as number[])[0]}到${(value as number[])[1]}之间`;
      } else {
        valueText = value;
      }
      if (text) {
        text += ` 且 ${condText}${valueText}`;
      } else {
        text += `${condText}${valueText}`;
      }
    });
  }

  return text;
};

const BranchNode: (props: BranchNodeProps) => JSX.Element = ({
  id,
  first,
  last,
  sortLeft,
  name,
  sortRight,
  onBranchClick = () => {},
  owner,
  branch,
}) => {
  const { refer } = branch!;
  const { lines, nodes, deleteNode, } = useContext(WFC) as WorkFlowCtx;
  // const [visible, setVisible] = useState(false);
  // const [ruleTypeModalVisible, setRuleTypeModalVisible] = useState(false);
  // const [userSelectorModalVisible, setUserSelectorModalVisible] = useState(false);
  // const [ruleType, setRuleType] = useState('');

  // const [rules, setRules] = useState<{
  //   departrangeitems?: { id: string; content: string }[];
  //   fielditems?: {
  //     cond: {
  //       field_id?: string;
  //       operator?: string;
  //       value?: number | number[];
  //     }[];
  //     type: string;
  //   };
  // } | null>(deepClone((refer as DagLine).rules!));
  // const [seletedUsers, setSelectedUsers] = useState<{ id: string; content: string; isDepartment?: boolean }[]>(
  //   rules?.departrangeitems || [],
  // );

  // const validateRule = () => {
  //   if (rules?.departrangeitems?.length === 0) {
  //     message.error({
  //       content: '请设置至少一个申请人',
  //     });
  //     return false;
  //   }
  //   if (rules?.fielditems?.cond) {
  //     const cond = rules?.fielditems?.cond;
  //     for (const d of cond) {
  //       if (!d.field_id || !d.operator || !d.value) {
  //         message.error({
  //           content: '请完善条件设置',
  //         });
  //         return false;
  //       }
  //     }
  //   }

  //   return true;
  // };
  

  return (
    <div className="condition-node">
      <div className="condition-node-box">
        <div
          className="auto-judge"
          // onClick={() => {
          //   if ((refer as DagLine).rules) {
          //     setVisible(!visible);
          //     deleteErrors(id);
          //   }
          // }}
        >
          {!first && <div className="sort-left" onClick={sortLeft}></div>}
          <div className="title-wrapper" style={{ display: 'flex' }}>
            <span className="editable-title">{name}{id}</span>
            <span className="priority-title" style={{ marginLeft: '10px' }}>
              优先级{(refer as DagLine)?.priority}
            </span>
            {<div className="delete-icon" onClick={() => deleteNode(id, lines!, nodes!)}></div>}
          </div>
          {!last && <div className="sort-right" onClick={sortRight}></div>}
          <div className="content" onClick={() => onBranchClick()}>
            <div className="text">
              {/* {owner ? owner : <span className="placeholder">{transformText((refer as DagLine).rules!)}</span>} */}
              条件节点
            </div>
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
        <AddNode id={id} routerEndNodeId={branch?.routerEndNodeId} />
      </div>
      {/* <Drawer
        visible={visible}
        onClose={() => setVisible(!visible)}
        showMask
        style={{
          width: '500px',
        }}
        disableCloseIcon
        footer={
          <Justify
            right={
              <>
                <Button
                  onClick={() => {
                    if (!validateRule()) {
                      return;
                    }
                    (refer as DagLine).rules = deepClone(rules!);

                    updateView();
                    setVisible(!visible);
                  }}
                >
                  确定
                </Button>
                <Button
                  onClick={() => {
                    setRules(deepClone((refer as DagLine).rules!));
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
        <Form layout="fixed" fixedLabelWidth="170px">
          <Form.Title>同时满足以下条件</Form.Title>
          {rules?.departrangeitems && (
            <Form.Item
              label="申请人为"
              suffix={
                <div
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: 0,
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    type="dismiss"
                    size="s"
                    onClick={() => {
                      rules.departrangeitems = void 0;
                      setSelectedUsers([]);
                      setRules({ ...rules });
                    }}
                  />
                </div>
              }
            >
              <Button onClick={() => setUserSelectorModalVisible(!userSelectorModalVisible)}>添加成员</Button>
              <div>
                {rules?.departrangeitems?.map((info, index) => (
                  <Tag
                    key={info.id}
                    theme="primary"
                    onClose={() => {
                      rules?.departrangeitems?.splice(index, 1);
                      setRules({ ...rules });
                    }}
                  >
                    {info.content}
                  </Tag>
                ))}
              </div>
            </Form.Item>
          )}
          {rules?.fielditems?.cond.map((rule, index) => (
            <Form.Item
              key={index}
              label={
                <>
                  <Select
                    type="simulate"
                    options={FIELD_IDS}
                    value={rule.field_id}
                    onChange={(val) => {
                      rule.field_id = val;
                      setRules({ ...rules });
                    }}
                    style={{
                      width: '70px',
                    }}
                  />
                  <Select
                    type="simulate"
                    options={OPERATORS}
                    value={rule.operator}
                    onChange={(val) => {
                      rule.operator = val;
                      if (rule.operator === 'range') {
                        rule.value = [];
                      }
                      setRules({ ...rules });
                    }}
                    style={{
                      width: '80px',
                    }}
                  />
                </>
              }
              suffix={
                <div
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: 0,
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    type="dismiss"
                    size="s"
                    onClick={() => {
                      rules.fielditems?.cond.splice(index, 1);
                      if (rules.fielditems?.cond.length === 0) {
                        rules.fielditems = void 0;
                      }
                      setRules({ ...rules });
                    }}
                  />
                </div>
              }
            >
              {rule.operator !== 'range' ? (
                <Input
                  value={`${rule.value || ''}`}
                  onChange={(value) => {
                    rule.value = Number(value);
                    setRules({ ...rules });
                  }}
                />
              ) : (
                <>
                  <Input
                    value={`${(rule.value as number[])[0] || ''}`}
                    onChange={(value) => {
                      (rule.value as number[])[0] = Number(value);
                      setRules({ ...rules });
                    }}
                  />
                  至
                  <Input
                    value={`${(rule.value as number[])[1] || ''}`}
                    onChange={(value) => {
                      (rule.value as number[])[1] = Number(value);
                      setRules({ ...rules });
                    }}
                  />
                </>
              )}
            </Form.Item>
          ))}
          <Button
            onClick={() => {
              setRuleTypeModalVisible(!ruleTypeModalVisible);
            }}
          >
            添加条件
          </Button>
        </Form>
      </Drawer> */}
      {/* <Modal visible={ruleTypeModalVisible} onClose={() => setRuleTypeModalVisible(!ruleTypeModalVisible)}>
        <Modal.Body>
          <Form>
            <Form.Item label="选择条件种类">
              <Radio.Group
                defaultValue={ruleType}
                onChange={(value) => {
                  setRuleType(value);
                }}
              >
                {RULE_TYPE.map(({ text, name }) => (
                  <Radio name={name} key={name} disabled={name === 'departrangeitems' && !!rules?.departrangeitems}>
                    {text}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
          <Modal.Footer>
            <Button
              onClick={() => {
                if (ruleType === 'departrangeitems') {
                  if (!rules!.departrangeitems) {
                    rules!.departrangeitems = [];
                  }
                } else {
                  if (!rules!.fielditems) {
                    rules!.fielditems = {
                      cond: [{}],
                      type: 'OP_AND',
                    };
                  } else {
                    rules!.fielditems.cond.push({});
                  }
                }
                setRuleTypeModalVisible(!ruleTypeModalVisible);
                setRules({ ...rules });
                setRuleType('');
              }}
            >
              确定
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal> */}
      {/* <Modal
        visible={userSelectorModalVisible}
        onClose={() => setUserSelectorModalVisible(!userSelectorModalVisible)}
        destroyOnClose={false}
        size="m"
        caption="可见范围"
      >
        <Modal.Body
          style={{
            height: '300px',
            overflow: 'auto',
          }}
        >
          <Contact
            expendNodeSelectable
            selectedIds={seletedUsers.map((user) => user.id)}
            onSelect={(selectedIds) => {
              setSelectedUsers(selectedIds);
            }}
          />
          <div>通讯录卡片</div>
        </Modal.Body>
        <Modal.Footer>
          <Justify
            right={
              <>
                <Button
                  onClick={() => {
                    rules!.departrangeitems! = seletedUsers;
                    console.log('click: ', rules);
                    setRules({ ...rules });
                    setUserSelectorModalVisible(!userSelectorModalVisible);
                  }}
                >
                  确定
                </Button>
                <Button
                  onClick={() => {
                    setSelectedUsers(rules!.departrangeitems!);
                    setUserSelectorModalVisible(!userSelectorModalVisible);
                  }}
                >
                  取消
                </Button>
              </>
            }
          />
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

type ConditionNodeProps = {
  conditionNodes: TreeNode[] | null;
  id: string;
  childNode: TreeNode | null;
  routerEndNodeId?: string;
};

const ConditionNode: (props: ConditionNodeProps) => JSX.Element = ({
  conditionNodes: branches,
  id,
  routerEndNodeId,
  childNode,
}) => {
  const { lines, addBranchNode } = useContext(WFC) as WorkFlowCtx;

  return (branches && branches.length > 0 && (
    <div className="branch-wrap">
      <div className="branch-box-wrap">
        <div className="branch-box">
          <button
            className="add-branch"
            onClick={() => {
              addBranchNode(id, lines!, routerEndNodeId, childNode?.id);
            }}
          >
            添加条件{id}
          </button>
          {branches
            .sort((branch1, branch2) => (branch1.refer as DagLine).priority! - (branch2.refer as DagLine).priority!)
            .map((branch, index) => (
              <div className="col-box" key={branch.id}>
                <BranchNode
                  {...branch}
                  first={index === 0}
                  // onBranchClick={onBranchClick}
                  // delBranch={() => delBranch(index)}
                  last={index === branches.length - 1}
                  key={branch.id}
                  branch={branch}
                />
                {branch.childNode && <Render node={branch.childNode} />}
                <CoverLine first={index === 0} last={index === branches.length - 1} />
              </div>
            ))}
        </div>
        <AddNode id={id} routerEndNodeId={routerEndNodeId} childNodeId={childNode?.id} />
      </div>
    </div>
  )) as JSX.Element;
};

export default ConditionNode;
