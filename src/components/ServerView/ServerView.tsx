/* eslint-disable */
import { ChannelCategory, ChannelList } from '@components/ChannelList';
import { ChatDisplay } from '@components/ChatDisplay';
import { UserList } from '@components/UserList';
import useSWR from 'swr';
import { genericFetcherCredentials } from '@helpers/fetch';
import { useCallback, useEffect, useState } from 'react';
import ProfileIcon1 from '@assets/profile-icon-1.webp';
import ProfileIcon2 from '@assets/profile-icon-2.webp';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import loader from '@components/ServerView/ServerView.loader';
import UserBar from '@components/ServerView/UserBar';

function getChannelList(channelCategories: ChannelCategory[]) {
  const channelList: Channel[] = [];
  channelCategories.forEach((category) => {
    channelList.push(...category.channels);
  });
  return channelList;
}

// function ServerView({ serverId }: { serverId: string }) {
function ServerView() {
  const { server } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const { channelId } = useParams();

  useEffect(() => {
    // if channelId missing, redirect to first available text channel
    if (channelId === undefined) {
      console.log(server);
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
  }, []);

  // const { serverId } = useParams();
  // const { data, isLoading } = useSWR<Server>(
  //   `/servers/${serverId}`,
  //   genericFetcherCredentials,
  // );
  // const [activeChannelId, setActiveChannelId] = useState('');

  const handleChangeActiveChannel = useCallback(
    (channel: Channel) => {
      setActiveChannel(channel);
      navigate(`${channel._id}`, { replace: true, relative: 'path' });
    },
    [setActiveChannel],
  );
  return (
    <div className="flex min-h-screen grow">
      {
        // isLoading === true ? (
        //   <div>Loading...</div>
        // ) :
        server !== undefined && (
          <>
            <div className="flex w-52 flex-col bg-gray-700 px-2 py-2">
              <ChannelList
                channelCategories={
                  server.channelCategories as ChannelCategory[]
                }
                serverName={server.name}
                activeChannel={activeChannel}
                onChangeActiveChannel={handleChangeActiveChannel}
              />
              <UserBar />
            </div>
            <ChatDisplay
              channelName={activeChannel?.name ?? ''}
              // channelId={activeChannel._id}
              // messagesId={activeChannel?.messagesId ?? ''}
              chatId={activeChannel?.messagesId ?? ''}
              channelSocketId={activeChannel?.socketId ?? ''}
            />
            <UserList userList={users} />
          </>
        )
      }
    </div>
  );
}

export default ServerView;
