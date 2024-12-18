import { useAuth } from '@hooks/index';
import useSocket from '@hooks/useSocket';
import { SocketEvents, UserOnlineStatus } from '@src/types';
import { backOff } from 'exponential-backoff';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type UserStore = Record<string, OtherUser[]>;
type StatusList = { _id: string; onlineStatus: UserOnlineStatus }[];

function mapStatusToUsers(
  userList: OtherUserNoStatus[],
  userStatusList: StatusList,
) {
  const mappedUserList: OtherUser[] = userList.map((user) => {
    const onlineStatus =
      userStatusList.find((u) => u._id === user._id)?.onlineStatus ??
      UserOnlineStatus.Offline;
    return { ...user, onlineStatus };
  });
  return mappedUserList;
}

function useUserList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [userStore, setUserStore] = useState<UserStore>({});
  const [socketsToRetry, setSocketsToRetry] = useState<
    { socketId: string; serverId: string }[]
  >([]);
  const { getUsersStatus, isConnected: isSocketConnected } = useSocket() ?? {};
  const { socket } = useSocket() ?? {};
  const { user: authUser } = useAuth() ?? {};

  const removeServerFromStore = useCallback((serverId: string) => {
    setUserStore((us) => {
      const nextUserStore: typeof us = {};
      Object.keys(us).forEach((key) => {
        if (key !== serverId) {
          nextUserStore[key] = us[key];
        }
      });
      return nextUserStore;
    });
  }, []);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }
    function onUserJoinedServerEvent(
      user: OtherUserNoStatus,
      serverId: string,
    ) {
      setUserStore((us) => {
        if (!(serverId in us)) {
          return us;
        }
        const nextUsersInServer = [
          ...us[serverId],
          { ...user, onlineStatus: UserOnlineStatus.Offline },
        ];
        return { ...us, [serverId]: nextUsersInServer };
      });
    }

    function onUserConnectedEvent(user: {
      _id: string;
      onlineStatus: UserOnlineStatus;
    }) {
      setUserStore((us) => {
        const nextUserStore: UserStore = {};
        const keys = Object.keys(us);
        for (let i = 0; i < keys.length; i++) {
          const serverId = keys[i];
          const nextUserList = us[serverId].map((u) =>
            u._id === user._id ? { ...u, onlineStatus: user.onlineStatus } : u,
          );
          nextUserStore[serverId] = nextUserList;
        }
        return nextUserStore;
      });
    }

    function onUserLeftServerEvent(user: OtherUserNoStatus, serverId: string) {
      setUserStore((us) => {
        if (!(serverId in us)) {
          return us;
        }
        if (user._id === authUser?._id) {
          removeServerFromStore(serverId);
        }
        const nextUserList = us[serverId].filter((u) => u._id !== user._id);
        return { ...us, [serverId]: nextUserList };
      });
    }

    function updateUserStatus(userId: string, nextStatus: UserOnlineStatus) {
      setUserStore((us) => {
        const nextStore: UserStore = {};
        Object.entries(us).forEach(([k, v]) => {
          const nextV = v.map((user) =>
            user._id === userId ? { ...user, onlineStatus: nextStatus } : user,
          );
          nextStore[k] = nextV;
        });
        return nextStore;
      });
    }

    socket.on(SocketEvents.UserJoinedServer, onUserJoinedServerEvent);
    socket.on(SocketEvents.UserLeftServer, onUserLeftServerEvent);
    socket.on(SocketEvents.UserConnected, onUserConnectedEvent);
    socket.on(SocketEvents.OnlineStatusChanged, updateUserStatus);

    return () => {
      socket.off(SocketEvents.UserJoinedServer, onUserJoinedServerEvent);
      socket.off(SocketEvents.UserLeftServer, onUserLeftServerEvent);
      socket.off(SocketEvents.UserConnected, onUserConnectedEvent);
      socket.off(SocketEvents.OnlineStatusChanged, updateUserStatus);
    };
  }, [socket, removeServerFromStore, authUser?._id]);

  useEffect(() => {
    async function retrySocketMap() {
      if (
        socketsToRetry.length > 0 &&
        !isLoading &&
        !isRetrying &&
        isSocketConnected &&
        getUsersStatus
      ) {
        setIsRetrying(true);
        const tempStatusLists: Record<string, Promise<StatusList>> = {};
        for (let i = 0; i < socketsToRetry.length; i++) {
          const currentSocket = socketsToRetry[i];
          tempStatusLists[currentSocket.serverId] = backOff(() =>
            getUsersStatus(currentSocket.socketId),
          );
        }
        try {
          await Promise.all(Object.values(tempStatusLists));
          const statusLists: Record<string, StatusList> = {};
          const entries = Object.entries(tempStatusLists);
          for (let i = 0; i < entries.length; i++) {
            const [k, v] = entries[i];
            // eslint-disable-next-line no-await-in-loop
            statusLists[k] = await v;
          }
          setUserStore((us) => {
            const nextUserStore: UserStore = {};
            const keys = Object.keys(statusLists);
            for (let i = 0; i < keys.length; i++) {
              const serverId = keys[i];
              nextUserStore[serverId] = mapStatusToUsers(
                us[serverId],
                statusLists[serverId],
              );
            }
            return { ...us, ...nextUserStore };
          });
        } finally {
          setSocketsToRetry((str) => {
            const nextStr = str.filter(
              (v) => !socketsToRetry.find((soc) => soc.serverId === v.serverId),
            );
            return nextStr;
          });
        }
        setIsRetrying(false);
      }
    }
    void retrySocketMap();
  }, [
    socketsToRetry,
    isSocketConnected,
    getUsersStatus,
    isLoading,
    isRetrying,
  ]);

  // const getChannelUsers = useCallback(
  //   (channelId: string) => {
  //     if (channelId in userStore) {
  //       return userStore[channelId];
  //     }
  //     return [];
  //   },
  //   [userStore],
  // );

  const getServerUsers = useCallback(
    (serverId: string) => {
      if (serverId in userStore) {
        return userStore[serverId];
      }
      return [];
    },
    [userStore],
  );

  const addServerUsersToStore = useCallback(
    async (
      serverId: string,
      serverSocketId: string,
      userList: OtherUserNoStatus[],
    ) => {
      if (serverId in userStore || !getUsersStatus) {
        return;
      }
      setIsLoading(true);
      let statusList: Awaited<ReturnType<typeof getUsersStatus>> = [];
      try {
        if (!isSocketConnected) {
          throw new Error();
        }
        statusList = await getUsersStatus(serverSocketId);
      } catch (err) {
        setSocketsToRetry((sockets) => [
          ...sockets,
          { socketId: serverSocketId, serverId },
        ]);
      }
      const nextUserList = mapStatusToUsers(userList, statusList);
      setUserStore((us) =>
        // console.log('setting store');
        ({ ...us, [serverId]: nextUserList }),
      );
      setIsLoading(false);
    },
    [userStore, getUsersStatus, isSocketConnected],
  );

  /*
  const addChannelUsersToStore = useCallback(
    async (
      channelId: string,
      socketId: string,
      userList: OtherUserNoStatus[],
    ) => {
      if (channelId in userStore) {
        return;
      }
      setIsLoading(true);
      let statusList: Awaited<ReturnType<typeof getUsersStatus>> = [];
      let retrySockets = false;
      try {
        if (!isSocketConnected) {
          throw new Error();
        }
        statusList = await getUsersStatus(socketId);
      } catch (err) {
        retrySockets = true;
        setSocketsToRetry((sockets) => [...sockets, { socketId, channelId }]);
      }
      const nextUserList = mapStatusToUsers(userList, statusList);
      // setUserStore({ ...userStore, [channelId]: nextUserList });
      setUserStore((us) =>
        // console.log('setting store');
        ({ ...us, [channelId]: nextUserList }),
      );
      if (retrySockets) {
        // setSocketsToRetry((sockets) => [...sockets, { socketId, channelId }]);
      }

      setIsLoading(false);
    },
    [userStore, getUsersStatus, isSocketConnected],
  );
*/

  // return { getChannelUsers, addChannelUsersToStore, isLoading };
  return {
    getServerUsers,
    addServerUsersToStore,
    removeServerFromStore,
    isLoading,
  };
}

const UserListContext = createContext<ReturnType<typeof useUserList> | null>(
  null,
);

export function UserListProvider({ children }: { children: ReactNode }) {
  const userList = useUserList();
  return (
    <UserListContext.Provider value={userList}>
      {children}
    </UserListContext.Provider>
  );
}

function UserListConsumer() {
  return useContext(UserListContext);
}

export default UserListConsumer;
