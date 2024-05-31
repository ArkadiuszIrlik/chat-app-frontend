import { CSSProperties } from 'react';

type ExtendedCSSProperties = CSSProperties &
  Record<`--${string}`, number | string>;

enum UserOnlineStatus {
  Online = 'ONLINE',
  Away = 'AWAY',
  DoNotDisturb = 'DO NOT DISTURB',
  Offline = 'OFFLINE',
}

enum SocketEvents {
  ChatMessage = 'chat message',
  GetOnlineStatus = 'get online status',
  AuthenticationError = 'authentication error',
  SendChatMessage = 'send chat message',
  ChangeOnlineStatus = 'change online status',
  OnlineStatusChanged = 'online status changed',
  UserJoinedServer = 'user joined server',
  ServerUpdated = 'server updated',
  ServerDeleted = 'server deleted',
  UserConnected = 'user connected',
  UpdateServerList = 'update server list',
}

enum ClientEvents {
  ChatMessage = 'CHAT MESSAGE',
  OnlineStatusChanged = 'ONLINE STATUS CHANGED',
  ServerUpdated = 'SERVER UPDATED',
  ServerDeleted = 'SERVER DELETED',
}


export {
  UserOnlineStatus,
  type ExtendedCSSProperties,
  SocketEvents,
  ClientEvents,
};
