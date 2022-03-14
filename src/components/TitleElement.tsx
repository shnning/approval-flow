import { useState, useEffect, useRef, useContext } from 'react';
import WFC, { WorkFlowCtx } from '../store';

type IProps = {
  name: string;
  placeholder: string;
  onTitleChange?: Function;
  icon?: string;
  id: string;
  // delNode: MouseEventHandler;
};

const TitleElement: (props: IProps) => JSX.Element = ({ id, name, placeholder, onTitleChange, icon }) => {
  const { lines, nodes, deleteNode } = useContext(WFC) as WorkFlowCtx;
  const [title, setTitle] = useState('');
  const [editable, setEditable] = useState(false);
  const input = useRef(null);
  useEffect(() => {
    setTitle(name);
  }, []);

  function onFocus(e: { currentTarget: { select: () => void } }) {
    e.currentTarget.select();
  }
  function onBlur() {
    setEditable(false);
    if (!title) {
      setTitle(placeholder);
    }
  }
  // function onClick() {
  //   setEditable(true);
  // }
  function onChange(e: { target: { value: string } }) {
    const val = e.target.value as string;
    onTitleChange?.(val);
    setTitle(val);
  }
  function delNode() {
    deleteNode(id, lines!, nodes!);
  }
  useEffect(() => {
    if (editable) {
      (input.current! as HTMLInputElement).focus();
    }
  }, [editable]);
  return (
    <>
      {icon && <span className="iconfont">{icon}</span>}
      {false ? (
        <input
          ref={input}
          type="text"
          className="ant-input editable-title-input"
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          value={title}
          placeholder={placeholder}
        />
      ) : (
        <span className="editable-title">{title}</span>
      )}
      <div className="delete-icon" onClick={delNode} />
    </>
  );
};

export default TitleElement;
