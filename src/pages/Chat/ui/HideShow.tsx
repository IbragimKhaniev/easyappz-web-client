import React, { memo } from 'react';

interface IHideShowProps {
  children: React.ReactElement;

  hidden?: boolean;
}

export const HideShow = memo((props: IHideShowProps) => {
  return (
    <div
      style={{
        opacity: props.hidden ? 0 : 1,
        pointerEvents: props.hidden ? 'none' : 'auto',
      }}
    >
      {props.children}
    </div>
  );
});
