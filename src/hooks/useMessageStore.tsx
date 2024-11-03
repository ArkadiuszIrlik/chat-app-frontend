import { getUniqueObjectArray } from '@src/utils/array';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
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

  const addToStore = useCallback((chatId: string, newMessages: Message[]) => {
    setMessageStore((ms) => {
      const currentMessageList = ms[chatId];
      let nextMessageList;
      if (currentMessageList) {
        nextMessageList = [...currentMessageList, ...newMessages];
      } else {
        nextMessageList = newMessages;
      }
      return {
        ...ms,
        [chatId]: orderMessages(
          getUniqueObjectArray(nextMessageList, [
            '_id',
            'clientId',
          ]) as Message[],
        ),
      };
    });
  }, []);

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
