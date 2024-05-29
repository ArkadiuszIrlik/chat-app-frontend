import { CreateChannelModal } from '@components/CreateChannelModal';
import { InviteToServerModal } from '@components/InviteToServerModal';
import { ServerSettings } from '@components/ServerSettings';
import useOnClickOutside from '@hooks/useOnClickOutside';
import { MutableRefObject, useCallback, useRef, useState } from 'react';

function ServerSettingsDropdown({
  server,
  parentButtonRef,
  onClose,
}: {
  server: Server;
  parentButtonRef: MutableRefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const [activeSettingId, setActiveSettingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(onClose, parentButtonRef, dropdownRef);

  const handleChangeActiveSettingId = useCallback((nextId: string) => {
    setActiveSettingId(nextId);
  }, []);

  const handleCloseActiveSetting = useCallback(() => {
    setActiveSettingId(null);
    onClose();
  }, [onClose]);

  const settingsList = [
    {
      id: 'serverSettings',
      label: 'Server settings',
      content: (
        <ServerSettings
          server={server}
          onCloseSettings={handleCloseActiveSetting}
        />
      ),
    },
    {
      id: 'inviteToServer',
      label: 'Invite to server',
      content: (
        <InviteToServerModal
          serverId={server._id}
          onCloseModal={handleCloseActiveSetting}
        />
      ),
    },
    {
      id: 'addChannel',
      label: 'Add channel',
      content: (
        <CreateChannelModal
          channelCategories={server.channelCategories}
          onCloseModal={handleCloseActiveSetting}
        />
      ),
    },
  ];
  const activeSetting = settingsList.find(
    (setting) => setting.id === activeSettingId,
  );

  return activeSetting ? (
    activeSetting.content
  ) : (
    <div
      className="absolute top-[105%] z-10 w-full rounded-md bg-gray-600"
      ref={dropdownRef}
    >
      <div className="flex flex-col gap-1 px-2 py-2">
        {settingsList.map((setting) => (
          <button
            type="button"
            onClick={() => handleChangeActiveSettingId(setting.id)}
            className="rounded-md px-2 py-1 text-start hover:bg-gray-500"
            key={setting.id}
          >
            {setting.label}
          </button>
        ))}
      </div>
    </div>
  );
}
export default ServerSettingsDropdown;
