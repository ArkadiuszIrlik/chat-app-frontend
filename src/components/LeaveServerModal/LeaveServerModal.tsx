import { ModalContainer } from '@components/ModalContainer';
import LeaveServerModalContent from '@components/LeaveServerModal/LeaveServerModalContent';

function LeaveServerModal({
  isOpen,
  server,
  onCancel,
  onCloseModal,
}: {
  isOpen: boolean;
  server: Server;
  onCancel: () => void;
  onCloseModal: () => void;
}) {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      closeOnClickOutside
      darkenBackdrop
    >
      <LeaveServerModalContent
        server={server}
        onCancel={onCancel}
        onCloseModal={onCloseModal}
      />
    </ModalContainer>
  );
}

export default LeaveServerModal;
