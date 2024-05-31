import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import socket from '@helpers/socket';
import { useAuth } from '@hooks/index';
import { SocketEvents, UserOnlineStatus } from '@src/types';

function useSocket() {
  const { logout } = useAuth()!;
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageEvents, setMessageEvents] = useState<Message[]>([]);
  const [statusEvents, setStatusEvents] = useState<
    { userId: string; nextStatus: UserOnlineStatus }[]
  >([]);
  const [serverUpdateEvents, setServerUpdateEvents] = useState<string[]>([]);
  const [serverDeleteEvents, setServerDeleteEvents] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function onMessageEvent(nextEvent: NetworkMessage) {
      const nextMessageEvent: Message = {
        ...nextEvent,
        postedAt: new Date(nextEvent.postedAt),
      };
      setMessageEvents((me) => [...me, nextMessageEvent]);
    }

    function onAuthError() {
      void logout();
    }

    function onStatusEvent(userId: string, nextStatus: UserOnlineStatus) {
      const nextStatusEvent = {
        userId,
        nextStatus,
      };
      setStatusEvents((se) => [...se, nextStatusEvent]);
    }

    function onServerUpdateEvent(serverId: string) {
      setServerUpdateEvents((se) => [...se, serverId]);
    }

    function onServerDeleteEvent(serverId: string) {
      setServerDeleteEvents((se) => [...se, serverId]);
    }

    socket.on(SocketEvents.ChatMessage, onMessageEvent);
    socket.on(SocketEvents.AuthenticationError, onAuthError);
    socket.on(SocketEvents.OnlineStatusChanged, onStatusEvent);
    socket.on(SocketEvents.ServerUpdated, onServerUpdateEvent);
    socket.on(SocketEvents.ServerDeleted, onServerDeleteEvent);
    return () => {
      socket.off(SocketEvents.ChatMessage, onMessageEvent);
      socket.off(SocketEvents.AuthenticationError, onAuthError);
      socket.off(SocketEvents.OnlineStatusChanged, onStatusEvent);
      socket.off(SocketEvents.ServerUpdated, onServerUpdateEvent);
      socket.off(SocketEvents.ServerDeleted, onServerDeleteEvent);
    };
  }, [logout]);

  const getUsersStatus = useCallback(async (roomSocketId: string) => {
    const timeout = 2000;
    return new Promise<
      Parameters<
        Parameters<typeof socket.emit<SocketEvents.GetOnlineStatus>>[2]
      >[number]
    >((resolve, reject) => {
      const timeoutId = setTimeout(reject, timeout);
      socket.emit(SocketEvents.GetOnlineStatus, roomSocketId, (data) => {
        clearTimeout(timeoutId);
        resolve(data);
      });
    });
  }, []);

  const sendChatMessage = useCallback(
    (
      message: Parameters<typeof socket.emit<SocketEvents.SendChatMessage>>[1],
      socketId: string,
    ) => {
      socket.emit(SocketEvents.SendChatMessage, message, socketId);
    },
    [],
  );

  const changeOnlineStatus = useCallback((nextStatus: UserOnlineStatus) => {
    const timeout = 2000;
    return new Promise<{ ok: boolean }>((resolve, reject) => {
      const timeoutId = setTimeout(reject, timeout);
      socket.emit(SocketEvents.ChangeOnlineStatus, nextStatus, () => {
        clearTimeout(timeoutId);
        resolve({ ok: true });
      });
    });
  }, []);

  return {
    isConnected,
    messageEvents,
    statusEvents,
    serverUpdateEvents,
    serverDeleteEvents,
    getUsersStatus,
    sendChatMessage,
    changeOnlineStatus,
  };
}

const SocketContext = createContext<ReturnType<typeof useSocket> | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketObj = useSocket();
  return (
    <SocketContext.Provider value={socketObj}>
      {children}
    </SocketContext.Provider>
  );
}

function SocketConsumer() {
  return useContext(SocketContext);
}

export default SocketConsumer;
