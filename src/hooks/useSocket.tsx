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
import { SocketEvents } from '@src/types';
function useSocket() {
  const { logout } = useAuth()!;
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageEvents, setMessageEvents] = useState<Message[]>([]);
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
    socket.on(SocketEvents.ChatMessage, onMessageEvent);
    socket.on(SocketEvents.AuthenticationError, onAuthError);
    return () => {
      socket.off(SocketEvents.ChatMessage, onMessageEvent);
      socket.off(SocketEvents.AuthenticationError, onAuthError);
    };
  }, [logout]);


  const sendChatMessage = useCallback(
    (
      message: Parameters<typeof socket.emit<SocketEvents.SendChatMessage>>[1],
      socketId: string,
    ) => {
      socket.emit(SocketEvents.SendChatMessage, message, socketId);
    },
    [],
  );
  return {
    isConnected,
    messageEvents,
    sendChatMessage,
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
