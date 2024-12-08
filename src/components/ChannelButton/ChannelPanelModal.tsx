import SettingsIcon from '@assets/settings-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import TextChannelIcon from '@assets/text-channel-icon.png';
import VoiceChannelIcon from '@assets/voice-channel-icon.png';
import { ModalContainer } from '@components/ModalContainer';
import { CloseButton } from '@components/CloseButton';
import { ModalButtonA } from '@components/Modal';
import { useNavigate } from 'react-router-dom';

const textChannelStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${TextChannelIcon})`,
};

const voiceChannelStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${VoiceChannelIcon})`,
};

const settingsIconStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

function ChannelPanelModal({
  isOpen,
  server,
  channel,
  channelName,
  channelType,
  onCloseModal,
}: {
  isOpen: boolean;
  server: Server;
  channel: Channel;
  channelName: string;
  channelType: 'text' | 'voice';
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
        channel={channel}
        channelName={channelName}
        channelType={channelType}
        onCloseModal={onCloseModal}
      />
    </ModalContainer>
  );
}

function ModalContent({
  server,
  channel,
  channelName,
  channelType,
  onCloseModal,
}: {
  server: Server;
  channel: Channel;
  channelName: string;
  channelType: 'text' | 'voice';
  onCloseModal: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl text-gray-300">
          <div
            style={
              channelType === 'text' ? textChannelStyle : voiceChannelStyle
            }
            className="alpha-mask aspect-square h-6 w-6 shrink-0 grow-0 bg-gray-400"
          />
          {channelName}
        </h1>
        <CloseButton
          ariaLabel='Close "Channel Panel" modal'
          onClose={onCloseModal}
        />
      </div>
      <div className="mx-4 flex flex-col gap-2">
        <ModalButtonA
          text="Channel Settings"
          ariaLabel="Open channel settings"
          iconStyleObj={settingsIconStyle}
          onClick={() => {
            navigate(`/app/channel-settings/${server._id}/${channel._id}`, {
              state: { channel, server },
            });
          }}
        />
      </div>
    </div>
  );
}

export default ChannelPanelModal;
