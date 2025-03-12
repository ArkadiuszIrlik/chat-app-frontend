import { genericFetcherCredentials, HttpError } from '@helpers/fetch';
import { useAuth, useSocket } from '@hooks/index';
import { SocketEvents } from '@src/types';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useSWR from 'swr';

function useServerStore() {
  const { user } = useAuth() ?? {};
  const [serverList, setServerList] = useState<Server[]>(user?.serversIn ?? []);
  const { socket } = useSocket() ?? {};

  useUpdateOnSocketEvent({ setServerList });

  const addToStore = useCallback(
    (serversToAdd: Server | Server[]) => {
      const nextServersToAdd = Array.isArray(serversToAdd)
        ? serversToAdd
        : [serversToAdd];

      setServerList((sl) => [...sl, ...nextServersToAdd]);
      if (socket) {
        socket.emit(SocketEvents.UpdateServerList, () => undefined);
      }
    },
    [socket],
  );

  const removeFromStore = useCallback((serverId: string) => {
    setServerList((sl) => sl.filter((server) => server._id !== serverId));
  }, []);

  useEffect(() => {
    if (user?.serversIn) {
      setServerList(user.serversIn);
    }
  }, [user?.serversIn]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    function onUserLeftServer(
      removedUser: OtherUserNoStatus,
      serverId: string,
    ) {
      if (removedUser._id === user?._id) {
        removeFromStore(serverId);
      }
    }
    function onServerDeleted(serverId: string) {
      removeFromStore(serverId);
    }

    socket.on(SocketEvents.UserLeftServer, onUserLeftServer);
    socket.on(SocketEvents.ServerDeleted, onServerDeleted);

    return () => {
      socket.off(SocketEvents.UserLeftServer, onUserLeftServer);
      socket.off(SocketEvents.ServerDeleted, onServerDeleted);
    };
  }, [removeFromStore, socket, user?._id]);

  return {
    serverList,
    addToStore,
    removeFromStore,
  };
}

const ServerStoreContext = createContext<ReturnType<
  typeof useServerStore
> | null>(null);

export function ServerStoreProvider({ children }: { children: ReactNode }) {
  const serverStore = useServerStore();
  return (
    <ServerStoreContext.Provider value={serverStore}>
      {children}
    </ServerStoreContext.Provider>
  );
}

function ServerStoreConsumer() {
  return useContext(ServerStoreContext);
}

function useUpdateOnSocketEvent({
  setServerList,
}: {
  setServerList: Dispatch<SetStateAction<Server[]>>;
}) {
  const { socket } = useSocket() ?? {};

  const [serverIdToFetch, setServerIdToFetch] = useState('');
  const {
    data: fetchedServer,
    error: errorLoadServer,
    isLoading: isServerLoading,
    mutate: refetchServer,
  } = useSWR<Server, HttpError>(
    `/servers/${serverIdToFetch}`,
    genericFetcherCredentials,
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    function handleServerUpdate(serverId: string) {
      setServerIdToFetch(serverId);
      void refetchServer();
    }
    if (!socket) {
      return undefined;
    }
    socket.on(SocketEvents.ServerUpdated, handleServerUpdate);

    return () => {
      socket.off(SocketEvents.ServerUpdated, handleServerUpdate);
    };
  }, [socket, refetchServer]);

  useEffect(() => {
    if (fetchedServer && !isServerLoading && !errorLoadServer) {
      setServerList((sl) => {
        const updatedId = fetchedServer._id;
        const indexToReplace = sl.findIndex((el) => el._id === updatedId);
        if (indexToReplace === -1) {
          return sl;
        }

        const nextSL = [...sl];
        nextSL.splice(indexToReplace, 1, fetchedServer);

        return nextSL;
      });
    }
  }, [fetchedServer, isServerLoading, errorLoadServer, setServerList]);
}

export default ServerStoreConsumer;
