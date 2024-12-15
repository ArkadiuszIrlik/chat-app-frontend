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
  ChatMessageDeleted = 'chat message deleted',
  GetOnlineStatus = 'get online status',
  AuthenticationError = 'authentication error',
  SendChatMessage = 'send chat message',
  ChangeOnlineStatus = 'change online status',
  OnlineStatusChanged = 'online status changed',
  UserJoinedServer = 'user joined server',
  UserLeftServer = 'user left server',
  ServerUpdated = 'server updated',
  ServerDeleted = 'server deleted',
  UserConnected = 'user connected',
  UpdateServerList = 'update server list',
}

enum UserAccountStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
}

export {
  UserOnlineStatus,
  type ExtendedCSSProperties,
  SocketEvents,
  UserAccountStatus,
};
