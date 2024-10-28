import { ModalContainer } from '@components/ModalContainer';
import CreateChannelModalContent from '@components/CreateChannelModal/CreateChannelModalContent';

function CreateChannelModal({
  isOpen,
  server,
  channelCategories,
  onNavigateBack,
  onCloseModal,
}: {
  isOpen: boolean;
  server: Server;
  channelCategories: ChannelCategory[];
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
      <CreateChannelModalContent
        server={server}
        channelCategories={channelCategories}
        onNavigateBack={onNavigateBack}
        onCloseModal={onCloseModal}
      />
    </ModalContainer>
  );
}

export default CreateChannelModal;
