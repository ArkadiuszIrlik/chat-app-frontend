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
}

export {
  UserOnlineStatus,
  type ExtendedCSSProperties,
  SocketEvents,
};
