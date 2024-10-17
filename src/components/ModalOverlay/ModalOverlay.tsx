import { ReactNode } from 'react';

ModalOverlay.defaultProps = {
  onClick() {
    return undefined;
  },
  onMouseDown() {
    return undefined;
  },
  darken: false,
};

function ModalOverlay({
  children,
  onClick,
  onMouseDown,
  darken = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  onMouseDown?: () => void;
  darken?: boolean;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`fixed inset-0 z-40 ${
        darken ? 'bg-gray-900/70' : 'bg-gray-500/30'
      }`}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}

export default ModalOverlay;
