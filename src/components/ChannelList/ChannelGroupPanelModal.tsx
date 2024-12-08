import SettingsIcon from '@assets/settings-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import { ModalContainer } from '@components/ModalContainer';
import { CloseButton } from '@components/CloseButton';
import { ModalButtonA } from '@components/Modal';
import { useNavigate } from 'react-router-dom';

const settingsIconStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

function ChannelGroupPanelModal({
  isOpen,
  server,
  channelGroup,
  groupName,
  onCloseModal,
}: {
  isOpen: boolean;
  server: Server;
  channelGroup: ChannelCategory;
  groupName: string;
  onCloseModal: () => void;
}) {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      closeOnClickOutside
      darkenBackdrop
    >
      <ModalContent
        server={server}
        channelGroup={channelGroup}
        groupName={groupName}
        onCloseModal={onCloseModal}
      />
    </ModalContainer>
  );
}

function ModalContent({
  server,
  channelGroup,
  groupName,
  onCloseModal,
}: {
  server: Server;
  channelGroup: ChannelCategory;
  groupName: string;
  onCloseModal: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl text-gray-300">
          {groupName}
        </h1>
        <CloseButton
          ariaLabel='Close "Channel Group Panel" modal'
          onClose={onCloseModal}
        />
      </div>
      <div className="mx-4 flex flex-col gap-2">
        <ModalButtonA
          text="Channel Group Settings"
          ariaLabel="Open channel group settings"
          iconStyleObj={settingsIconStyle}
          onClick={() => {
            navigate(
              `/app/channel-group-settings/${server._id}/${channelGroup._id}`,
              {
                state: { server },
              },
            );
          }}
        />
      </div>
    </div>
  );
}

export default ChannelGroupPanelModal;
