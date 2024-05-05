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
  SendChatMessage = 'send chat message',
  OnlineStatusChanged = 'online status changed',
}

export {
  UserOnlineStatus,
  type ExtendedCSSProperties,
  SocketEvents,
};
