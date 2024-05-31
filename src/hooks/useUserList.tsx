import { useSocketEvents } from '@hooks/index';
import useSocket from '@hooks/useSocket';
import { ClientEvents, UserOnlineStatus } from '@src/types';
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
  const { getUsersStatus, isConnected: isSocketConnected } = useSocket()!;
  const { messageEmitter } = useSocketEvents() ?? {};

  useEffect(() => {
    async function retrySocketMap() {
      if (
        socketsToRetry.length > 0 &&
        !isLoading &&
        !isRetrying &&
        isSocketConnected
      ) {
        setIsRetrying(true);
        const tempStatusLists: Record<string, Promise<StatusList>> = {};
        for (let i = 0; i < socketsToRetry.length; i++) {
          const socket = socketsToRetry[i];
          tempStatusLists[socket.serverId] = backOff(() =>
            getUsersStatus(socket.socketId),
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
              (v) =>
                !socketsToRetry.find(
                  (socket) => socket.serverId === v.serverId,
                ),
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

  useEffect(() => {
    if (!messageEmitter) {
      return undefined;
    }
    function updateUserStatus({
      userId,
      nextStatus,
    }: {
      userId: string;
      nextStatus: UserOnlineStatus;
    }) {
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

    messageEmitter.on(ClientEvents.OnlineStatusChanged, updateUserStatus);

    return () => {
      messageEmitter.off(ClientEvents.OnlineStatusChanged, updateUserStatus);
    };
  }, [messageEmitter]);

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
      if (serverId in userStore) {
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
  return { getServerUsers, addServerUsersToStore, isLoading };
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
