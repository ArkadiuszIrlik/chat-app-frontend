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
    function onAuthError() {
      void logout();
    }

    function onServerUpdateEvent() {
      socket.emit(SocketEvents.UpdateServerList, () => undefined);
    }

    socket.on(SocketEvents.AuthenticationError, onAuthError);
    socket.on(SocketEvents.ServerUpdated, onServerUpdateEvent);
    return () => {
      socket.off(SocketEvents.AuthenticationError, onAuthError);
      socket.off(SocketEvents.ServerUpdated, onServerUpdateEvent);
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
      onSuccess?: (savedMessage: NetworkMessage) => void | null,
      onError?: (
        message: Parameters<
          typeof socket.emit<SocketEvents.SendChatMessage>
        >[1],
        socketId: string,
      ) => void | null,
    ) => {
      async function send() {
        try {
          const response = await socket.emitWithAck(
            SocketEvents.SendChatMessage,
            message,
            socketId,
          );
          if (onSuccess) {
            onSuccess(response);
          }
        } catch {
          if (onError) {
            onError(message, socketId);
          }
        }
      }

      void send();
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
    socket,
    isConnected,
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
