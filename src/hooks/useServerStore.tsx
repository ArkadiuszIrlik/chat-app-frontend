import { useAuth, useSocket, useSocketEvents } from '@hooks/index';
import { ClientEvents, SocketEvents } from '@src/types';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

function useServerStore() {
  const [serverList, setServerList] = useState<Server[]>([]);
  const { user } = useAuth() ?? {};
  const { messageEmitter } = useSocketEvents() ?? {};
  const { socket } = useSocket() ?? {};

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
    if (!messageEmitter) {
      return undefined;
    }
    function onServerDeleted(serverId: string) {
      removeFromStore(serverId);
    }
    messageEmitter.on(ClientEvents.ServerDeleted, onServerDeleted);
    return () => {
      messageEmitter.off(ClientEvents.ServerDeleted, onServerDeleted);
    };
  }, [messageEmitter, removeFromStore]);

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

export default ServerStoreConsumer;
