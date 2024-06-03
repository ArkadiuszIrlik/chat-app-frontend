import { UserList } from '@components/UserList';
import { useEffect, useState } from 'react';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom';
import loader from '@components/ServerView/ServerView.loader';
import LeftSidebar from '@components/ServerView/LeftSidebar';
import { useUserList } from '@hooks/index';
import { ServerContextInterface } from '@components/ServerView/useServerContext';

function getChannelList(channelCategories: Server['channelCategories']) {
  const channelList: Channel[] = [];
  channelCategories.forEach((category) => {
    channelList.push(...category.channels);
  });
  return channelList;
}

function ServerView() {
  const { server } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const navigate = useNavigate();
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
    if (server && addChannelUsersToStore) {
      const channelList = getChannelList(server.channelCategories);
      channelList.forEach((channel) => {
        void addChannelUsersToStore(
          channel._id,
          channel.socketId,
          server.members,
        );
      });
    }
  }, [server, addChannelUsersToStore]);

  return (
    <div className="flex min-h-screen grow">
      {server !== undefined && (
        <>
          <LeftSidebar
            channelCategories={server.channelCategories}
            serverName={server.name}
          />
          <div className="flex grow">
            <Outlet
              context={{ activeChannel } satisfies ServerContextInterface}
            />
          </div>
          <UserList />
        </>
      )}
    </div>
  );
}

export default ServerView;
