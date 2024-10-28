import LeaveServerBody from '@components/LeaveServerModal/LeaveServerBody';
import { ModalHeaderA } from '@components/Modal';

function LeaveServerModalContent({
  server,
  onCancel,
  onCloseModal,
}: {
  server: Server;
  onCancel: () => void;
  onCloseModal: () => void;
}) {
  return (
    <>
      <ModalHeaderA text="Leave server" onCloseModal={onCloseModal} />
      <LeaveServerBody
        initialServer={server}
        onCancel={onCancel}
        onCloseModal={onCloseModal}
      />
    </>
  );
}
export default LeaveServerModalContent;
