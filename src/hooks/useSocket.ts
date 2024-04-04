import { useEffect, useState } from 'react';
import socket from '@helpers/socket';
import { useAuth } from '@hooks/index';

interface NetworkMessage extends Omit<Message, 'postedAt'> {
  postedAt: string;
}

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
      setMessageEvents([...messageEvents, nextMessageEvent]);
    }

    function onAuthError() {
      void logout();
    }

    socket.on('chat message', onMessageEvent);
    socket.on('authentication error', onAuthError);
    return () => {
      socket.off('chat message', onMessageEvent);
      socket.off('authentication error', onAuthError);
    };
  }, [logout, messageEvents]);

  return { isConnected, messageEvents };
}
export default useSocket;
