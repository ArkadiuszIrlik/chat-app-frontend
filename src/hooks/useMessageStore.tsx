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

  const removeFromStore = useCallback((chatId: string, messageId: string) => {
    let removedMessage: Message | null = null;
    setMessageStore((prevMessageStore) => {
      const prevChat = prevMessageStore[chatId];
      const nextChat = prevChat.reduce<Message[]>((chat, message) => {
        if (message._id === messageId) {
          removedMessage = message;
        } else {
          chat.push(message);
        }
        return chat;
      }, []);
      return { ...prevMessageStore, [chatId]: nextChat };
    });

    return removedMessage as Message | null;
  }, []);

  return {
    messageStore,
    addToStore,
    removeFromStore,
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
