import { ModalHeaderA } from '@components/Modal';
import CreateChannelBody from '@components/CreateChannelModal/CreateChannelBody';

function CreateChannelModalContent({
  server,
  channelCategories,
  onNavigateBack,
  onCloseModal,
}: {
  server: Server;
  channelCategories: ChannelCategory[];
  onNavigateBack: () => void;
  onCloseModal: () => void;
}) {
  return (
    <>
      <ModalHeaderA text="Create channel" onCloseModal={onCloseModal} />
      <CreateChannelBody
        server={server}
        channelCategories={channelCategories}
        onNavigateBack={onNavigateBack}
        onCloseModal={onCloseModal}
      />
    </>
  );
}
export default CreateChannelModalContent;
