import { parseNetworkMessages } from '@helpers/data';
import { genericFetcherCredentials } from '@helpers/fetch';
import { useMessageStore, useSocket } from '@hooks/index';
import { SocketEvents } from '@src/types';
import { useCallback, useEffect } from 'react';
import useSWR from 'swr';

function useChatMessages(chatId: string | undefined) {
  const { socket, sendChatMessage: sendMessageToSocket } = useSocket() ?? {};
  const { messageStore, addToStore } = useMessageStore() ?? {};

  let messages: Message[] = [];
  let shouldFetch = false;

  if (chatId !== undefined) {
    const storedMessages = messageStore ? messageStore[chatId] : null;
    if (storedMessages) {
      messages = storedMessages;
    } else {
      shouldFetch = true;
    }
  }

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

  // fetch chat messages from API
  const { data, error, isLoading } = useSWR<
    { message: string; data: { messages: NetworkMessage[] } },
    BackendError
  >(() => (shouldFetch ? `/chat/${chatId}` : null), genericFetcherCredentials);

  useEffect(() => {
    if (shouldFetch && !isLoading && (data ?? error) && chatId && addToStore) {
      const networkMessages = data?.data?.messages ?? [];
      const parsedMessages = parseNetworkMessages(networkMessages);
      addToStore(chatId, parsedMessages);
    }
  }, [data, isLoading, error, shouldFetch, addToStore, chatId]);

  const sendMessage = useCallback(
    (
      message: Message & Required<Pick<Message, 'clientId'>>,
      chatSocketId: string,
    ) => {
      if (addToStore && sendMessageToSocket) {
        addToStore(message.chatId, [message]);
        sendMessageToSocket(message, chatSocketId);
      }
    },
    [addToStore, sendMessageToSocket],
  );

  return { messages, isLoading, error, sendMessage };
}

export default useChatMessages;
