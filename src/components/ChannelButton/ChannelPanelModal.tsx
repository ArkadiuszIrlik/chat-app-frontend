import SettingsIcon from '@assets/settings-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import TextChannelIcon from '@assets/text-channel-icon.png';
import VoiceChannelIcon from '@assets/voice-channel-icon.png';
import { useCallback, useState } from 'react';
import { ChannelSettings } from '@components/ChannelSettings';
import { ModalContainer } from '@components/ModalContainer';
import { CloseButton } from '@components/CloseButton';

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
export default ChannelPanelModal;

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
  const { isChannelSettingsOpen, openSettings, closeSettings } =
    useChannelSettings();

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
        <ModalButton
          text="Channel Settings"
          ariaLabel="Open channel settings"
          iconStyleObj={settingsIconStyle}
          onClick={openSettings}
        />
      </div>
      {isChannelSettingsOpen && (
        <ChannelSettings
          server={server}
          channel={channel}
          onCloseSettings={closeSettings}
        />
      )}
    </div>
  );
}

ModalButton.defaultProps = {
  ariaLabel: '',
};

function ModalButton({
  text,
  iconStyleObj,
  ariaLabel = '',
  onClick,
}: {
  text: string;
  iconStyleObj: ExtendedCSSProperties;
  ariaLabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || undefined}
      className="group flex w-full items-center gap-4 rounded-md bg-gray-600
      px-2 py-2 text-gray-300 active:bg-gray-500 active:text-gray-200
      using-mouse:hover:bg-gray-500 using-mouse:hover:text-gray-200"
    >
      <div
        className="alpha-mask mx-1 aspect-square h-5 w-5 bg-gray-400 
        group-active:bg-gray-300 using-mouse:group-hover:bg-gray-300"
        style={iconStyleObj}
      />
      {text}
    </button>
  );
}

function useChannelSettings() {
  const [isChannelSettingsOpen, setIsChannelSettingsOpen] = useState(false);

  const openSettings = useCallback(() => {
    setIsChannelSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsChannelSettingsOpen(false);
  }, []);

  const toggleSettingsOpen = useCallback(() => {
    setIsChannelSettingsOpen((isOpen) => !isOpen);
  }, []);

  return {
    isChannelSettingsOpen,
    openSettings,
    closeSettings,
    toggleSettingsOpen,
  };
}
