import SettingsIcon from '@assets/settings-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import { ReactNode, useCallback, useState } from 'react';
import { ModalContainer } from '@components/ModalContainer';
import { CloseButton } from '@components/CloseButton';
import { ModalButtonA } from '@components/Modal';
import { InviteToServerModalContent } from '@components/InviteToServerModal';
import { CreateChannelModalContent } from '@components/CreateChannelModal';
import { LeaveServerModalContent } from '@components/LeaveServerModal';
import { useAuth } from '@hooks/index';
import { Navigate } from 'react-router-dom';
import { ServerImage } from '@components/ServerImage';

const settingsIconStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

interface ServerPanelOption {
  id: string;
  label: string;
  content: ReactNode;
}

function ServerPanelModal({
  server,
  isOpen,
  onCloseModal,
}: {
  server: Server;
  isOpen: boolean;
  onCloseModal: () => void;
}) {
  const { user } = useAuth() ?? {};

  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);

  const handleChangeActiveOptionId = useCallback((nextId: string) => {
    setActiveOptionId(nextId);
  }, []);
  const handleNavigateToMain = useCallback(() => {
    setActiveOptionId(null);
  }, []);

  const isAdmin = server.ownerId === user?._id;
  const availableOptions = getOptionsList({
    isAdmin,
    server,
    onNavigateBack: handleNavigateToMain,
    onCloseModal,
  });

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      closeOnClickOutside
      darkenBackdrop
    >
      {activeOptionId === null ? (
        <MainContent
          onCloseModal={onCloseModal}
          onSelectOption={handleChangeActiveOptionId}
          optionsList={availableOptions}
          server={server}
        />
      ) : (
        getActiveOptionContent(availableOptions, activeOptionId)
      )}
    </ModalContainer>
  );
}

export default ServerPanelModal;

function MainContent({
  server,
  onCloseModal,
  optionsList,
  onSelectOption,
}: {
  server: Server;
  onCloseModal: () => void;
  optionsList: ServerPanelOption[];
  onSelectOption: (optionId: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="aspect-square h-12 w-12 shrink-0 grow-0">
          <ServerImage image={server.serverImg} />
        </div>
        <h1 className="flex items-center gap-2 truncate text-xl text-gray-300">
          {server.name}
        </h1>
        <CloseButton
          ariaLabel='Close "Server Panel" modal'
          onClose={onCloseModal}
        />
      </div>
      <div className="ml-4 flex max-w-72 flex-col gap-2">
        {optionsList.map((option) => (
          <ModalButtonA
            text={option.label}
            ariaLabel={`Open ${option.label}`}
            iconStyleObj={settingsIconStyle}
            onClick={() => {
              onSelectOption(option.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getOptionsList({
  isAdmin,
  server,
  onNavigateBack,
  onCloseModal,
}: {
  isAdmin: boolean;
  server: Server;
  onNavigateBack: () => void;
  onCloseModal: () => void;
}): ServerPanelOption[] {
  const adminOptionsList: ServerPanelOption[] = [
    {
      id: 'serverSettings',
      label: 'Server settings',
      content: (
        <Navigate
          to={`/app/server-settings/${server._id}`}
          state={{ server }}
        />
      ),
    },
    {
      id: 'inviteToServer',
      label: 'Invite to server',
      content: (
        <InviteToServerModalContent
          onNavigateBack={onNavigateBack}
          serverId={server._id}
          onCloseModal={onCloseModal}
        />
      ),
    },
    {
      id: 'addChannel',
      label: 'Add channel',
      content: (
        <CreateChannelModalContent
          server={server}
          channelCategories={server.channelCategories}
          onNavigateBack={onNavigateBack}
          onCloseModal={onCloseModal}
        />
      ),
    },
  ];

  const regularMemberOptionsList: ServerPanelOption[] = [
    {
      id: 'leaveServer',
      label: 'Leave server',
      content: (
        <LeaveServerModalContent
          server={server}
          onCancel={onNavigateBack}
          onCloseModal={onCloseModal}
        />
      ),
    },
  ];

  const authorizedOptions = isAdmin
    ? adminOptionsList
    : regularMemberOptionsList;

  return authorizedOptions;
}

function getActiveOptionContent(
  optionsList: ServerPanelOption[],
  activeOptionId: ServerPanelOption['id'],
) {
  return optionsList.find((option) => option.id === activeOptionId)?.content;
}
