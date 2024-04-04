import useSocket from '@hooks/useSocket';
import { ReactNode, createContext, useContext, useEffect } from 'react';
import EventEmitter from 'eventemitter3';

const messageEmitter = new EventEmitter();

function useMessageEvents() {
  const { messageEvents } = useSocket();
  useEffect(() => {
    const latestEvent = messageEvents[messageEvents.length - 1];
    if (latestEvent === undefined) {
      return;
    }
    messageEmitter.emit('new message', latestEvent);
  }, [messageEvents]);

  return { messageEmitter };
}

const MessageEventsContext = createContext<ReturnType<
  typeof useMessageEvents
> | null>(null);

export function MessageEventsProvider({ children }: { children: ReactNode }) {
  const messageEvents = useMessageEvents();
  return (
    <MessageEventsContext.Provider value={messageEvents}>
      {children}
    </MessageEventsContext.Provider>
  );
}

function MessageEventsConsumer() {
  return useContext(MessageEventsContext);
}

export default MessageEventsConsumer;
