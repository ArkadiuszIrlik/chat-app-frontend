import { parseNetworkMessages } from '@helpers/data';
import { useSocket } from '@hooks/index';
import { SocketEvents } from '@src/types';
import { getUniqueObjectArray } from '@src/utils/array';
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
  const { socket } = useSocket() ?? {};

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

  const removeClientMsgFromStore = useCallback(
    (chatId: string, messageClientId: string) => {
      let removedMessage: Message | null = null;
      setMessageStore((prevMessageStore) => {
        const prevChat = prevMessageStore[chatId];
        const nextChat = prevChat.reduce<Message[]>((chat, message) => {
          if (message.clientId === messageClientId) {
            removedMessage = message;
          } else {
            chat.push(message);
          }
          return chat;
        }, []);
        return { ...prevMessageStore, [chatId]: nextChat };
      });

      return removedMessage as Message | null;
    },
    [],
  );

  // add incoming socket ChatMessage events to store
  useEffect(() => {
    if (socket && addToStore) {
      const addToMessages = (networkMessage: NetworkMessage) => {
        const nextMessage = parseNetworkMessages(networkMessage)[0];
        addToStore(nextMessage.chatId, [nextMessage]);
      };
      socket.on(SocketEvents.ChatMessage, addToMessages);

      return () => {
        socket.off(SocketEvents.ChatMessage, addToMessages);
      };
    }
    return undefined;
  }, [socket, addToStore]);

  // remove messages from ChatMessageDeleted events from store
  useEffect(() => {
    if (!socket || !removeFromStore) {
      return cleanup;
    }
    function cleanup() {
      if (socket) {
        socket.off(SocketEvents.ChatMessageDeleted, deleteFromMessages);
      }
    }
    function deleteFromMessages(
      networkMessage: NetworkMessage,
      chatId: string,
    ) {
      if (removeFromStore && networkMessage._id) {
        removeFromStore(chatId, networkMessage._id);
      }
    }

    socket.on(SocketEvents.ChatMessageDeleted, deleteFromMessages);
    return cleanup;
  }, [socket, removeFromStore]);

  return {
    messageStore,
    addToStore,
    removeFromStore,
    removeClientMsgFromStore,
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
