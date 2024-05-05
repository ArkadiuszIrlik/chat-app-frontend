import { CSSProperties } from 'react';

type ExtendedCSSProperties = CSSProperties &
  Record<`--${string}`, number | string>;

enum SocketEvents {
  ChatMessage = 'chat message',
  SendChatMessage = 'send chat message',
}

export {
  type ExtendedCSSProperties,
  SocketEvents,
};
