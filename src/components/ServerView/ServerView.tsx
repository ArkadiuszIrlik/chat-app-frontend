import { UserList } from '@components/UserList';
import { useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftSidebar from '@components/ServerView/LeftSidebar';
import {
  MessageInputProvider,
  useIsTouchInput,
  useServerStore,
  useSocket,
  useUserList,
} from '@hooks/index';
import useSWR, { KeyedMutator } from 'swr';
import { genericFetcherCredentials, HttpError } from '@helpers/fetch';
import { SocketEvents } from '@src/types';
import { useMediaQuery } from '@uidotdev/usehooks';
import styleConsts from '@constants/styleConsts';
import { SwipeNavigation } from '@components/SwipeNavigation';
import ServerContent from '@components/ServerView/ServerContent';
import { ScrollOffsetProvider } from '@hooks/useScrollOffset';

function getChannelList(channelCategories: Server['channelCategories']) {
  const channelList: Channel[] = [];
  channelCategories.forEach((category) => {
    channelList.push(...category.channels);
  });
  return channelList;
}

const MemoizedUserList = memo(UserList);

function ServerView() {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();

  // if user not in server, navigate away
  const { serverList } = useServerStore() ?? { serverList: [] };
  const isServerListEmpty = serverList.length === 0;
  const isServerIdInServerList = !!serverList.find(
    (server) => server._id === serverId,
  );

  useEffect(() => {
    if (isServerListEmpty) {
      navigate('/app/channels');
    }
  }, [isServerListEmpty, navigate]);

  // if serverId invalid or undefined navigate to first available server
  useEffect(() => {
    if (!isServerIdInServerList && !isServerListEmpty) {
      navigate(`/app/channels/${serverList[0]._id}`, { replace: true });
    }
  }, [isServerIdInServerList, isServerListEmpty, navigate, serverList]);

  const shouldFetch = !!serverId;

  const {
    data: server,
    error,
    mutate,
    isLoading,
  } = useSWR<Server, HttpError>(
    shouldFetch ? `/servers/${serverId}` : null,
    genericFetcherCredentials,
  );

  useSocketInteraction({ serverId, mutate });

  const activeChannel =
    getChannelList(server?.channelCategories ?? []).find(
      (channel) => channel._id === channelId,
    ) ?? null;

  useEffect(() => {
    if (server?.channelCategories === undefined) {
      return;
    }
    // if channelId is missing or doesn't point to valid channel
    // redirect to first available text channel
    if (!activeChannel) {
      const channelList = getChannelList(server.channelCategories);
      const nextChannel = channelList.find(
        (channel) => channel.type === 'text',
      );
      if (nextChannel !== undefined) {
        navigate(`/app/channels/${server._id}/${nextChannel._id}`, {
          replace: true,
        });
      } else {
        navigate(`/app/channels/${server._id}`);
      }
    }
  }, [navigate, server?.channelCategories, server?._id, activeChannel]);

  const { addServerUsersToStore } = useUserList() ?? {};
  useEffect(() => {
    if (server && addServerUsersToStore) {
      void addServerUsersToStore(server._id, server.socketId, server.members);
    }
  }, [server, addServerUsersToStore]);

  const isSmallScreen = useMediaQuery(
    `only screen and (min-width: ${styleConsts.screens.sm}`,
  );
  const isExtraSmallScreen = useMediaQuery(
    `only screen and (min-width: ${styleConsts.screens.xs}`,
  );
  const isUsingTouch = useIsTouchInput();

  return (
    <ScrollOffsetProvider>
      <MessageInputProvider>
        <div className="flex max-h-dvh min-w-0 flex-1 grow">
          {(() => {
            switch (true) {
              case isSmallScreen:
                return (
                  <DesktopServerView
                    activeChannel={activeChannel}
                    errorMessage={
                      error?.data?.message ?? 'Error loading server'
                    }
                    hasError={!!error}
                    isServerListEmpty={isServerListEmpty}
                    isServerLoaded={!!server}
                    isServerLoading={isLoading}
                    server={server}
                  />
                );
              case isExtraSmallScreen:
                return (
                  <TabletServerView
                    activeChannel={activeChannel}
                    errorMessage={
                      error?.data?.message ?? 'Error loading server'
                    }
                    hasError={!!error}
                    isServerListEmpty={isServerListEmpty}
                    isServerLoaded={!!server}
                    isServerLoading={isLoading}
                    isUsingTouch={isUsingTouch}
                    server={server}
                  />
                );
              default:
                return (
                  <PhoneServerView
                    activeChannel={activeChannel}
                    errorMessage={
                      error?.data?.message ?? 'Error loading server'
                    }
                    hasError={!!error}
                    isServerListEmpty={isServerListEmpty}
                    isServerLoaded={!!server}
                    isServerLoading={isLoading}
                    isUsingTouch={isUsingTouch}
                    server={server}
                  />
                );
            }
          })()}
        </div>
      </MessageInputProvider>
    </ScrollOffsetProvider>
  );
}

export default ServerView;

function useSocketInteraction({
  serverId,
  mutate,
}: {
  serverId: string | undefined;
  mutate: KeyedMutator<Server>;
}) {
  const { socket } = useSocket() ?? {};
  const navigate = useNavigate();
  useEffect(() => {
    if (!socket) {
      return undefined;
    }
    function onServerUpdated(updatedId: string) {
      if (updatedId === serverId) {
        void mutate();
      }
    }

    function onServerDeleted(deletedId: string) {
      if (deletedId === serverId) {
        navigate('/app/channels', { replace: true });
      }
    }

    socket.on(SocketEvents.ServerUpdated, onServerUpdated);
    socket.on(SocketEvents.ServerDeleted, onServerDeleted);

    return () => {
      socket.off(SocketEvents.ServerUpdated, onServerUpdated);
      socket.off(SocketEvents.ServerDeleted, onServerDeleted);
    };
  }, [socket, serverId, mutate, navigate]);
}

DesktopServerView.defaultProps = {
  server: undefined,
};

function DesktopServerView({
  isServerListEmpty,
  isServerLoading,
  hasError,
  errorMessage,
  isServerLoaded,
  activeChannel,
  server,
}: {
  isServerListEmpty: boolean;
  isServerLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isServerLoaded: boolean;
  activeChannel: Channel | null;
  server?: Server;
}) {
  return (
    <>
      <LeftSidebar
        isEmptyServerList={isServerListEmpty}
        isServerLoading={isServerLoading}
        server={server}
      />
      <div className="flex min-w-0 grow">
        <ServerContent
          activeChannel={activeChannel}
          errorMessage={errorMessage}
          hasError={hasError}
          isServerListEmpty={isServerListEmpty}
          isServerLoaded={isServerLoaded}
          isServerLoading={isServerLoading}
        />
      </div>
      {!isServerListEmpty && <MemoizedUserList />}
    </>
  );
}

TabletServerView.defaultProps = {
  server: undefined,
};

function TabletServerView({
  isServerListEmpty,
  isServerLoading,
  hasError,
  errorMessage,
  isServerLoaded,
  activeChannel,
  isUsingTouch,
  server,
}: {
  isServerListEmpty: boolean;
  isServerLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isServerLoaded: boolean;
  activeChannel: Channel | null;
  isUsingTouch: boolean;
  server?: Server;
}) {
  return (
    <SwipeNavigation
      containerClass="grow"
      options={{ allowMouseSwipe: !isUsingTouch }}
      columns={[
        {
          content: (
            <div className="flex h-dvh grow">
              <LeftSidebar
                isEmptyServerList={isServerListEmpty}
                isServerLoading={isServerLoading}
                server={server}
              />
              <div className="flex min-w-0 grow">
                <ServerContent
                  activeChannel={activeChannel}
                  errorMessage={errorMessage}
                  hasError={hasError}
                  isServerListEmpty={isServerListEmpty}
                  isServerLoaded={isServerLoaded}
                  isServerLoading={isServerLoading}
                />
              </div>
            </div>
          ),
          main: true,
        },
        {
          content: (
            <div className="flex h-full">
              <MemoizedUserList />
            </div>
          ),
        },
      ]}
    />
  );
}

PhoneServerView.defaultProps = {
  server: undefined,
};

function PhoneServerView({
  isServerListEmpty,
  isServerLoading,
  hasError,
  errorMessage,
  isServerLoaded,
  activeChannel,
  isUsingTouch,
  server,
}: {
  isServerListEmpty: boolean;
  isServerLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isServerLoaded: boolean;
  activeChannel: Channel | null;
  isUsingTouch: boolean;
  server?: Server;
}) {
  return (
    <SwipeNavigation
      containerClass="grow"
      options={{ allowMouseSwipe: !isUsingTouch }}
      columns={[
        {
          content: (
            <div className="flex h-full">
              <LeftSidebar
                isEmptyServerList={isServerListEmpty}
                isServerLoading={isServerLoading}
                server={server}
              />
            </div>
          ),
          className: 'w-2/3',
        },
        {
          content: (
            <div className="flex">
              <ServerContent
                activeChannel={activeChannel}
                errorMessage={errorMessage}
                hasError={hasError}
                isServerListEmpty={isServerListEmpty}
                isServerLoaded={isServerLoaded}
                isServerLoading={isServerLoading}
              />
            </div>
          ),
          main: true,
        },
        {
          content: (
            <div className="flex h-full">
              <MemoizedUserList />
            </div>
          ),
        },
      ]}
    />
  );
}
