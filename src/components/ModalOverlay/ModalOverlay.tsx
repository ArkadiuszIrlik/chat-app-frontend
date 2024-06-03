/* eslint-disable */
import { ReactNode } from 'react';

ModalOverlay.defaultProps = {
  onClick() {
    return undefined;
  },
  onMouseDown() {
    return undefined;
  },
};

function ModalOverlay({
  children,
  onClick,
  onMouseDown,
}: {
  children: ReactNode;
  onClick?: () => void;
  onMouseDown?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-40 bg-gray-500/30"
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}

export default ModalOverlay;
