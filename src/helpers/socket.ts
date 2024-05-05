import { SocketEvents } from '@src/types';
import { Socket, io } from 'socket.io-client';

interface ClientToServerEvents {
  [SocketEvents.SendChatMessage]: (
    message: { text: string; clientId: string },
    socketId: string,
  ) => void;
}

interface ServerToClientEvents {
  [SocketEvents.ChatMessage]: (message: NetworkMessage) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SOCKET_IO_URL,
  {
    autoConnect: false,
    withCredentials: true,
  },
);

export default socket;
