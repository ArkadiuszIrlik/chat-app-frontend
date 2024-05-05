import useSocket from '@hooks/useSocket';
import { ReactNode, createContext, useContext, useEffect } from 'react';
import EventEmitter from 'eventemitter3';

const messageEmitter = new EventEmitter();

function useSocketEvents() {
  const { messageEvents, statusEvents } = useSocket()!;
  useEffect(() => {
    const latestEvent = messageEvents[messageEvents.length - 1];
    if (latestEvent === undefined) {
      return;
    }
    messageEmitter.emit('new message', latestEvent);
  }, [messageEvents]);

  useEffect(() => {
    const latestEvent = statusEvents[statusEvents.length - 1];
    if (latestEvent === undefined) {
      return;
    }
    messageEmitter.emit('online status changed', latestEvent);
  }, [statusEvents]);

  return { messageEmitter };
}

const SocketEventsContext = createContext<ReturnType<
  typeof useSocketEvents
> | null>(null);

export function SocketEventsProvider({ children }: { children: ReactNode }) {
  const socketEvents = useSocketEvents();
  return (
    <SocketEventsContext.Provider value={socketEvents}>
      {children}
    </SocketEventsContext.Provider>
  );
}

function SocketEventsConsumer() {
  return useContext(SocketEventsContext);
}

export default SocketEventsConsumer;
