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
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const { channelId } = useParams();
  const { addChannelUsersToStore } = useUserList() ?? {};

  useEffect(() => {
    // if channelId missing, redirect to first available text channel
    if (channelId === undefined) {
      const channelList = getChannelList(server.channelCategories);
      const nextChannel = channelList.find(
        (channel) => channel.type === 'text',
      );
      if (nextChannel !== undefined) {
        setActiveChannel(nextChannel);
        navigate(`${nextChannel._id}`, { replace: true });
      }
    } else {
      const channelList = getChannelList(server.channelCategories);
      const nextChannel = channelList.find(
        (channel) => channel._id === channelId,
      );
      if (nextChannel !== undefined) {
        setActiveChannel(nextChannel);
      } else {
        setActiveChannel(null);
        navigate('..', { replace: true });
      }
    }
  }, [channelId, navigate, server.channelCategories]);

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
