import { ModalOverlay } from '@components/ModalOverlay';
import SettingsIcon from '@assets/settings-icon.png';
import { createPortal } from 'react-dom';
import CloseIcon from '@assets/close-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import { useCallback, useState } from 'react';
import { ChannelGroupSettings } from '@components/ChannelGroupSettings';

const closeIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${CloseIcon})`,
};

const settingsIconStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

function ChannelGroupPanelModal({
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
          channelGroup={channelGroup}
          groupName={groupName}
          onCloseModal={onCloseModal}
        />
      </div>
    </ModalOverlay>,
    document.body,
  );
}
export default ChannelGroupPanelModal;

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
  const { isChannelGroupSettingsOpen, openSettings, closeSettings } =
    useChannelGroupSettings();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl text-gray-300">
          {groupName}
        </h1>
        <button
          type="button"
          onClick={onCloseModal}
          aria-label='Close "Add server" modal'
          className="group ml-auto block rounded-md p-1 using-mouse:hover:bg-gray-600"
        >
          <div
            className="alpha-mask aspect-square h-5 w-5 shrink-0 grow-0 bg-gray-400
              using-mouse:group-hover:bg-gray-300"
            style={closeIconStyles}
          />
        </button>
      </div>
      <div className="mx-4 flex flex-col gap-2">
        <ModalButton
          text="Channel Group Settings"
          ariaLabel="Open channel group settings"
          iconStyleObj={settingsIconStyle}
          onClick={openSettings}
        />
      </div>
      {isChannelGroupSettingsOpen && (
        <ChannelGroupSettings
          server={server}
          channelGroup={channelGroup}
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

function useChannelGroupSettings() {
  const [isChannelGroupSettingsOpen, setIsChannelGroupSettingsOpen] =
    useState(false);

  const openSettings = useCallback(() => {
    setIsChannelGroupSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsChannelGroupSettingsOpen(false);
  }, []);

  const toggleSettingsOpen = useCallback(() => {
    setIsChannelGroupSettingsOpen((isOpen) => !isOpen);
  }, []);

  return {
    isChannelGroupSettingsOpen,
    openSettings,
    closeSettings,
    toggleSettingsOpen,
  };
}
