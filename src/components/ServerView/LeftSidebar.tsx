import { ChannelList } from '@components/ChannelList';
import DesktopNavBar from '@components/ServerView/DesktopNavBar';
import ServersMenu from '@components/ServerView/ServersMenu';
import { UserBar } from '@components/UserBar';
import styleConsts from '@constants/styleConsts';
import { useCallback, useState } from 'react';
import { SyncLoader } from 'react-spinners';

LeftSidebar.defaultProps = {
  server: undefined,
};

interface Props {
  server?: Server;
  isServerLoading: boolean;
  isEmptyServerList: boolean;
}

function LeftSidebar({ server, isServerLoading, isEmptyServerList }: Props) {
  const [isServersMenuOpen, setIsServersMenuOpen] = useState(false);

  const handleOpenServersMenu = useCallback(() => {
    setIsServersMenuOpen(true);
  }, []);
  const handleCloseServersMenu = useCallback(() => {
    setIsServersMenuOpen(false);
  }, []);

  function renderSwitch() {
    switch (true) {
      case isEmptyServerList:
        return <ServersMenu />;
      case isServersMenuOpen:
        return <ServersMenu onCloseMenu={handleCloseServersMenu} />;
      case isServerLoading:
        return (
          <div className="flex grow items-center justify-center">
            <SyncLoader
              color={styleConsts.colors.gray[300]}
              speedMultiplier={0.8}
              size={10}
            />
          </div>
        );
      case server && !isServerLoading:
        return (
          <ChannelList
            channelCategories={server.channelCategories}
            serverName={server.name}
            server={server}
          />
        );
      case !server && !isServerLoading:
        return <ServersMenu />;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-0 w-full shrink-0 flex-col bg-gray-700 px-2 py-2 xs:w-48">
      {renderSwitch()}
      <div className="mt-auto flex flex-col">
        <DesktopNavBar
          isServersMenuOpen={isEmptyServerList ? true : isServersMenuOpen}
          onOpenServers={handleOpenServersMenu}
        />
        <UserBar />
      </div>
    </div>
  );
}
export default LeftSidebar;
