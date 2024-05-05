import { useSocketEvents } from '@hooks/index';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type MessageStore = Record<string, Message[]>;

function orderMessages(messageList: Message[]) {
  const nextMessageList = [...messageList];
  nextMessageList.sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime());
  return nextMessageList;
}

function useMessageStore() {
  const [messageStore, setMessageStore] = useState<MessageStore>({});
  const { messageEmitter } = useSocketEvents()!;

  const addToStore = useCallback((chatId: string, newMessages: Message[]) => {
    setMessageStore((ms) => {
      const currentMessageList = ms[chatId];
      return {
        ...ms,
        [chatId]: currentMessageList
          ? orderMessages([...currentMessageList, ...newMessages])
          : orderMessages(newMessages),
      };
    });
  }, []);

  useEffect(() => {
    function addToMessages(newEvent: Message) {
      setMessageStore((ms) => {
        const currentMessageList = ms[newEvent.chatId];
        return {
          ...ms,
          [newEvent.chatId]: currentMessageList
            ? [...currentMessageList, newEvent]
            : [newEvent],
        };
      });
    }

    messageEmitter.on('new message', addToMessages);

    return () => {
      messageEmitter.off('new message', addToMessages);
    };
  }, [messageEmitter]);

  return {
    messageStore,
    addToStore,
  };
}

const MessageStoreContext = createContext<ReturnType<
  typeof useMessageStore
> | null>(null);

export function MessageStoreProvider({ children }: { children: ReactNode }) {
  const chatMessages = useMessageStore();
  return (
    <MessageStoreContext.Provider value={chatMessages}>
      {children}
    </MessageStoreContext.Provider>
  );
}

function MessageStoreConsumer() {
  return useContext(MessageStoreContext);
}

export default MessageStoreConsumer;
