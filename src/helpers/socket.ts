import { SocketEvents, UserOnlineStatus } from '@src/types';
import { Socket, io } from 'socket.io-client';

interface ClientToServerEvents {
  [SocketEvents.GetOnlineStatus]: (
    roomSocketId: string,
    callback: (
      data: {
        _id: string;
        onlineStatus: UserOnlineStatus;
      }[],
    ) => void,
  ) => void;
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
  [SocketEvents.UserJoinedServer]: (
    user: OtherUserNoStatus,
    serverId: string,
  ) => void;
  [SocketEvents.UserConnected]: (user: {
    _id: string;
    onlineStatus: UserOnlineStatus;
  }) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SOCKET_IO_URL,
  {
    autoConnect: false,
    withCredentials: true,
  },
);

export default socket;
