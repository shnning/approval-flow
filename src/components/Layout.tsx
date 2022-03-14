import { useState } from 'react';

const ZOOM = {
  DOWN: 1,
  UP: 2,
  MIN: 50,
  MAX: 300,
};

type IProps = {
  children: JSX.Element[] | JSX.Element;
};

const ZoomLayout: (props: IProps) => JSX.Element = ({ children }) => {
  // 放大比例, 按百分制给 100 为 100%
  const [scale, setScale] = useState(100);

  const zoomSize = (type: number) => {
    if (type === ZOOM.DOWN) {
      if (scale === ZOOM.MIN) {
        return;
      }
      setScale(scale - 10);
    }
    if (type === ZOOM.UP) {
      if (scale === ZOOM.MAX) {
        return;
      }
      setScale(scale + 10);
    }
  };

  return (
    <>
      <div className="zoom">
        <div className={`zoom-out${scale === ZOOM.MIN ? ' disabled' : ''}`} onClick={() => zoomSize(ZOOM.DOWN)}></div>
        <span>{scale}%</span>
        <div className={`zoom-in${scale === ZOOM.MAX ? ' disabled' : ''}`} onClick={() => zoomSize(ZOOM.UP)}></div>
      </div>
      <div
        className="box-scale"
        id="box-scale"
        style={{
          transform: `scale(${scale / 100})`,
          transformOrigin: '50% 0px 0px',
        }}
      >
        {children}
      </div>
    </>
  );
};

export default ZoomLayout;
