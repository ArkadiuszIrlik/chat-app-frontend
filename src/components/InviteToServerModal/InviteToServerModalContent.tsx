import InviteToServerBody from '@components/InviteToServerModal/InviteToServerBody';
import { ModalHeaderA } from '@components/Modal';

function InviteToServerModalContent({
  serverId,
  onNavigateBack,
  onCloseModal,
}: {
  serverId: string;
  onNavigateBack: () => void;
  onCloseModal: () => void;
}) {
  return (
    <>
      <ModalHeaderA text="Invite to server" onCloseModal={onCloseModal} />
      <InviteToServerBody serverId={serverId} onNavigateBack={onNavigateBack} />
    </>
  );
}
export default InviteToServerModalContent;
