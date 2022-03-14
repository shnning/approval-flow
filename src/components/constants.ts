// 添加节点类型
export const OptionTypes = {
  APPROVER: 1,
  NOTIFIER: 2,
  BRANCH: 3,
  CONDITION: 4,
};
// 节点类型默认标题名
export const OptionNames = {
  [OptionTypes.APPROVER]: '审批人',
  [OptionTypes.NOTIFIER]: '抄送人',
  [OptionTypes.CONDITION]: '条件分支',
};
// 节点模板

const NODE_TYPES = {
  APPROVAL: 'APPROVAL',
  CC: 'CC',
  ROUTER: 'ROUTER',
};

const NODE_TYPES_NAMES = {
  [NODE_TYPES.APPROVAL]: '审批人',
  [NODE_TYPES.CC]: '抄送人',
};

const LINE_TYPES = {
  LINE: 'LINE',
  CONDITION: 'CONDITION',
};

export { NODE_TYPES, NODE_TYPES_NAMES, LINE_TYPES };
