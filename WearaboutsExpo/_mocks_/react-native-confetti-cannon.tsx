import React from 'react';

const ConfettiCannon = React.forwardRef((_props: any, ref) => {
  React.useImperativeHandle(ref, () => ({
    start: jest.fn(),
  }));
  return null;
});

export default ConfettiCannon;
