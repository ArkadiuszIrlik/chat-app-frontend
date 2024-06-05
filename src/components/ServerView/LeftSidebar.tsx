import { ChannelList } from '@components/ChannelList';
import DesktopNavBar from '@components/ServerView/DesktopNavBar';
import ServersMenu from '@components/ServerView/ServersMenu';
import { UserBar } from '@components/UserBar';
import styleConsts from '@constants/styleConsts';
import { useCallback, useState } from 'react';
import { SyncLoader } from 'react-spinners';

const defaultChannelCategories: Server['channelCategories'] = [];

LeftSidebar.defaultProps = {
  isEmptyServerList: false,
};

interface LoadingProps {
  isEmptyServerList?: false;
  isServerLoading: true;
  channelCategories?: Server['channelCategories'];
  serverName?: string;
}

interface NotLoadingProps {
  isEmptyServerList?: false;
  isServerLoading: false;
  channelCategories: Server['channelCategories'];
  serverName: string;
}

interface EmptyServerListProps {
  isEmptyServerList: true;
  isServerLoading?: never;
  channelCategories?: never;
  serverName?: never;
}

type Props = LoadingProps | NotLoadingProps | EmptyServerListProps;

function LeftSidebar({
  channelCategories = defaultChannelCategories,
  serverName,
}: {
  isServerLoading,
  isEmptyServerList,
}: Props) {
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
      case !isServerLoading:
        return (
          <ChannelList
            channelCategories={channelCategories}
            serverName={serverName}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-0 w-52 flex-col bg-gray-700 px-2 py-2">
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
