import { UserList } from '@components/UserList';
import { useEffect, memo, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import LeftSidebar from '@components/ServerView/LeftSidebar';
import { useServerStore, useSocket, useUserList } from '@hooks/index';
import { ServerContextInterface } from '@components/ServerView/useServerContext';
import useSWR from 'swr';
import { genericFetcherCredentials } from '@helpers/fetch';
import { SocketEvents } from '@src/types';
import { ErrorDisplay } from '@components/form-controls';

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

  const [shouldFetch, setShouldFetch] = useState(!!serverId);

  useEffect(() => {
    if (!!serverId !== shouldFetch) {
      setShouldFetch(!!serverId);
    }
  }, [serverId, shouldFetch]);

  const {
    data: server,
    error,
    mutate,
    isLoading,
  } = useSWR<Server, BackendError>(
    shouldFetch ? `/servers/${serverId}` : null,
    genericFetcherCredentials,
  );

  const { socket } = useSocket() ?? {};
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

  const { addServerUsersToStore } = useUserList() ?? {};
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
      }
    }
  }, [navigate, server?.channelCategories, server?._id, activeChannel]);

  useEffect(() => {
    if (server && addServerUsersToStore) {
      void addServerUsersToStore(server._id, server.socketId, server.members);
    }
  }, [server, addServerUsersToStore]);

  function renderServerContentSwitch() {
    switch (true) {
      case isServerListEmpty:
        return (
          <div className="px-2 pt-2 md:px-10 md:pt-12">
            <div className="max-w-prose text-gray-100">
              It looks like you haven&apos;t joined any servers yet. Let&apos;s
              get you set up. Click &quot;Add a server&quot; in the panel to the
              left to join or create a new server.
            </div>
          </div>
        );
      case !isLoading && !!error:
        return (
          <div className="mx-auto">
            <ErrorDisplay
              errorMessage={error.message ?? 'Error loading server'}
            />
          </div>
        );
      case !isLoading && !!server:
        return (
          <Outlet
            context={{ activeChannel } satisfies ServerContextInterface}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex max-h-screen min-h-screen grow">
      <LeftSidebar
        isEmptyServerList={isServerListEmpty}
        isServerLoading={isLoading}
        server={server}
      />
      <div className="flex grow">{renderServerContentSwitch()}</div>
      {!isServerListEmpty && <MemoizedUserList />}
    </div>
  );
}

export default ServerView;
