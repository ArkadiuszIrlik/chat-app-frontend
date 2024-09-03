import { ModalOverlay } from '@components/ModalOverlay';
import CloseIcon from '@assets/close-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import InviteToServerContent from '@components/InviteToServerModal/InviteToServerContent';

const closeIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${CloseIcon})`,
};

function InviteToServerModal({
  serverId,
  onCloseModal,
}: {
  serverId: string;
  onCloseModal: () => void;
}) {
  return (
    <ModalOverlay onMouseDown={onCloseModal}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, 
      jsx-a11y/no-static-element-interactions */}
      <div
        className="fixed left-1/2 top-1/2 w-96 -translate-x-1/2
      -translate-y-1/2 rounded-lg bg-gray-700 px-5 py-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl text-gray-200">Invite to server</h1>
          <button
            type="button"
            onClick={onCloseModal}
            aria-label='Close "Add server" modal'
            className="group ml-auto block rounded-md p-1 hover:bg-gray-600"
          >
            <div
              className="alpha-mask aspect-square h-5 w-5 shrink-0 grow-0 bg-gray-400
              group-hover:bg-gray-300"
              style={closeIconStyles}
            />
          </button>
        </div>
        <InviteToServerContent
          serverId={serverId}
          onCloseModal={onCloseModal}
        />
      </div>
    </ModalOverlay>
  );
}

export default InviteToServerModal;
