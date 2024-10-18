import { ModalOverlay } from '@components/ModalOverlay';
import SettingsIcon from '@assets/settings-icon.png';
import { createPortal } from 'react-dom';
import CloseIcon from '@assets/close-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import TextChannelIcon from '@assets/text-channel-icon.png';
import VoiceChannelIcon from '@assets/voice-channel-icon.png';
import { useCallback, useState } from 'react';
import { ChannelSettings } from '@components/ChannelSettings';

const closeIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${CloseIcon})`,
};

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
  return createPortal(
    <ModalOverlay
      onMouseDown={() => {
        onCloseModal();
      }}
      darken
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, 
    jsx-a11y/no-static-element-interactions */}
      <div
        className="fixed left-1/2 top-1/2 w-11/12 max-w-96
            -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-700 px-5 py-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ModalContent
          server={server}
          channel={channel}
          channelName={channelName}
          channelType={channelType}
          onCloseModal={onCloseModal}
        />
      </div>
    </ModalOverlay>,
    document.body,
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
      <div className="ml-4 max-w-72">
        <ModalButton
          text="Settings"
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
