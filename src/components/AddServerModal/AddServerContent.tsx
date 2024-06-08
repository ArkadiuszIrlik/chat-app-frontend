import { ReactNode } from 'react';
import LinkIcon from '@assets/link-icon.png';
import PlusIcon from '@assets/plus-icon.png';
import { ExtendedCSSProperties } from '@src/types';

const linkIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${LinkIcon})`,
};
const plusIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${PlusIcon})`,
};

function AddServerContent({
  onJoinServer,
  onCreateServer,
}: {
  onJoinServer: () => void;
  onCreateServer: () => void;
}) {
  return (
    <div className="mb-5 flex flex-col items-center gap-3">
      <div>
        <span className="mb-1 block text-gray-200">Have an invite link?</span>
        <ModalButton onClick={onJoinServer}>
          Join server
          <div
            className="alpha-mask aspect-square h-5 w-5 shrink-0 grow-0 bg-gray-300
                group-hover:bg-gray-200"
            style={linkIconStyles}
          />
        </ModalButton>
      </div>
      <span className="text-gray-200">OR</span>
      <div>
        <ModalButton onClick={onCreateServer}>
          Create new server
          <div
            className="alpha-mask aspect-square h-5 w-5 shrink-0 grow-0 bg-gray-300
                group-hover:bg-gray-200"
            style={plusIconStyles}
          />
        </ModalButton>
      </div>
    </div>
  );
}

function ModalButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="group flex items-center gap-2 rounded-lg border-2
        border-gray-100 px-4 py-1 hover:bg-gray-600"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export default AddServerContent;
