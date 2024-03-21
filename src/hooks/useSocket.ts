import { useEffect, useState } from 'react';
import socket from '@helpers/socket';
import { useAuth } from '@hooks/index';

function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { logout } = useAuth()!;

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
    socket.on('authentication error', () => {
      void logout();
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [logout]);

  return isConnected;
}
export default useSocket;
