import { useState, useContext } from "react";
import { Popover } from "antd";
import WFC, { WorkFlowCtx } from "../store";
import { NODE_TYPES } from "../approvalFlow/types";
// import AddNodeList from './AddOptionList';
import classnames from "classnames";
// import styles from '../../WorkFlow/index.module.less';

type IProps = {
  id: string;
  routerEndNodeId?: string;
  childNodeId?: string;
};

const AddNode: (props: IProps) => JSX.Element = ({
  id,
  routerEndNodeId,
  childNodeId,
}) => {
  const { lines, nodes, addNode } = useContext(WFC) as WorkFlowCtx;
  const [showPop, setShowPop] = useState(false);

  function onClick() {
    setShowPop(!showPop);
  }

  const menuList = [
    {
      className: "menu-approver",
      iconName: "ww-approvalFlowIcon-Approver",
      name: "审批人",
      onClick: () => {
        addNode(
          NODE_TYPES.APPROVAL,
          id,
          lines!,
          nodes!,
          routerEndNodeId,
          childNodeId
        );
      },
    },
    {
      className: "menu-notify",
      iconName: "ww-approvalFlowIcon-Notify",
      name: "抄送人",
      onClick: () => {
        addNode(
          NODE_TYPES.CC,
          id,
          lines!,
          nodes!,
          routerEndNodeId,
          childNodeId
        );
      },
    },
    {
      className: "menu-branch",
      iconName: "ww-approvalFlowIcon-Branch",
      name: "条件分支",
      onClick: () => {
        addNode(
          NODE_TYPES.ROUTER,
          id,
          lines!,
          nodes!,
          routerEndNodeId,
          childNodeId
        );
      },
    },
  ];

  return (
    <div className="add-node-btn-box">
      <div className="add-node-btn">
        <span>
          <Popover
            trigger="click"
            placement="right"
            content={
              <div className={"add-node-menu"}>
                {menuList.map(({ className, iconName, name, onClick }) => (
                  <div
                    className={classnames("menu-item", className)}
                    onClick={onClick}
                    key={name}
                  >
                    <i
                      className={classnames(
                        "ww-icon",
                        iconName,
                        "menu-item-icon"
                      )}
                    />
                    <div>{name}</div>
                  </div>
                ))}
              </div>
            }
          >
            <button className="btn" onClick={onClick}>
              <span className="btn-add-icon"></span>
            </button>
          </Popover>
        </span>
      </div>
    </div>
  );
};

export default AddNode;
