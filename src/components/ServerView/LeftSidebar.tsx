import { ChannelList } from '@components/ChannelList';
import DesktopNavBar from '@components/ServerView/DesktopNavBar';
import ServersMenu from '@components/ServerView/ServersMenu';
import { UserBar } from '@components/UserBar';
import { useCallback, useState } from 'react';

const defaultChannelCategories: Server['channelCategories'] = [];

function LeftSidebar({
  channelCategories = defaultChannelCategories,
  serverName,
}: {
  channelCategories: Server['channelCategories'];
  serverName: string;
}) {
  const [isServersMenuOpen, setIsServersMenuOpen] = useState(false);

  const handleOpenServersMenu = useCallback(() => {
    setIsServersMenuOpen(true);
  }, []);
  const handleCloseServersMenu = useCallback(() => {
    setIsServersMenuOpen(false);
  }, []);

  return (
    <div className="flex w-52 flex-col bg-gray-700 px-2 py-2">
      {isServersMenuOpen ? (
        <ServersMenu onCloseMenu={handleCloseServersMenu} />
      ) : (
        <ChannelList
          channelCategories={channelCategories}
          serverName={serverName}
        />
      )}
      <div className="mt-auto flex flex-col">
        <DesktopNavBar
          isServersMenuOpen={isServersMenuOpen}
          onOpenServers={handleOpenServersMenu}
        />
        <UserBar />
      </div>
    </div>
  );
}
export default LeftSidebar;
