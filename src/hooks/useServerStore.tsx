import { useAuth } from '@hooks/index';
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

  const addToStore = useCallback((serversToAdd: Server | Server[]) => {
    const nextServersToAdd = Array.isArray(serversToAdd)
      ? serversToAdd
      : [serversToAdd];

    setServerList((sl) => [...sl, ...nextServersToAdd]);
  }, []);

  const removeFromStore = useCallback((serverId: string) => {
    setServerList((sl) => sl.filter((server) => server._id !== serverId));
  }, []);

  useEffect(() => {
    if (user?.serversIn) {
      setServerList(user.serversIn);
    }
  }, [user?.serversIn]);

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
