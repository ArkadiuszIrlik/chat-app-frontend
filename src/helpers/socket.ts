import { SocketEvents, UserOnlineStatus } from '@src/types';
import { Socket, io } from 'socket.io-client';

interface ClientToServerEvents {
  [SocketEvents.SendChatMessage]: (
    message: { text: string; clientId: string },
    socketId: string,
  ) => void;
  [SocketEvents.ChangeOnlineStatus]: (
    nextStatus: UserOnlineStatus,
    callback: () => void,
  ) => void;
}

interface ServerToClientEvents {
  [SocketEvents.ChatMessage]: (message: NetworkMessage) => void;
  [SocketEvents.AuthenticationError]: (error: string) => void;
  [SocketEvents.OnlineStatusChanged]: (
    userId: string,
    nextStatus: UserOnlineStatus,
  ) => void;
  [SocketEvents.ServerUpdated]: (serverId: string) => void;
  [SocketEvents.ServerDeleted]: (serverId: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SOCKET_IO_URL,
  {
    autoConnect: false,
    withCredentials: true,
  },
);

export default socket;
