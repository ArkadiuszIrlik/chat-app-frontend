import InviteToServerModalContent from '@components/InviteToServerModal/InviteToServerModalContent';
import { ModalContainer } from '@components/ModalContainer';

function InviteToServerModal({
  isOpen,
  serverId,
  onNavigateBack,
  onCloseModal,
}: {
  isOpen: boolean;
  serverId: string;
  onNavigateBack: () => void;
  onCloseModal: () => void;
}) {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      closeOnClickOutside
      darkenBackdrop
    >
      <InviteToServerModalContent
        serverId={serverId}
        onNavigateBack={onNavigateBack}
        onCloseModal={onCloseModal}
      />
    </ModalContainer>
  );
}

export default InviteToServerModal;
