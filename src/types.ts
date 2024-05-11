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
  AuthenticationError = 'authentication error',
  SendChatMessage = 'send chat message',
  ChangeOnlineStatus = 'change online status',
  OnlineStatusChanged = 'online status changed',
  ServerUpdated = 'server updated',
}

enum ClientEvents {
  ChatMessage = 'CHAT MESSAGE',
  OnlineStatusChanged = 'ONLINE STATUS CHANGED',
  ServerUpdated = 'SERVER UPDATED',
}


export {
  UserOnlineStatus,
  type ExtendedCSSProperties,
  SocketEvents,
  ClientEvents,
};
