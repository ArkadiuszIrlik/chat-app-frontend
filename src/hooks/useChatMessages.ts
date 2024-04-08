import parseMessageDates from '@helpers/data';
import { genericFetcherCredentials } from '@helpers/fetch';
import { useMessageStore } from '@hooks/index';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

function useChatMessages(chatId: string | undefined) {
  const { messageStore, addToStore } = useMessageStore()!;
  const [shouldFetch, setShouldFetch] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { data, error, isLoading } = useSWR<Message[], BackendError>(
    () => (shouldFetch ? `/chat/${chatId}` : null),
    genericFetcherCredentials,
  );

  useEffect(() => {
    if (chatId === undefined) {
      return;
    }
    const storedMessages = messageStore[chatId];
    if (storedMessages) {
      setMessages(storedMessages);
    } else {
      setShouldFetch(true);
    }
  }, [chatId, messageStore]);

  useEffect(() => {
    if (shouldFetch && !isLoading && !error && data && chatId) {
      parseMessageDates(data);
      addToStore(chatId, data);
      setShouldFetch(false);
    }
  }, [data, isLoading, error, shouldFetch, addToStore, chatId]);

  return { messages, isLoading, error };
}

export default useChatMessages;
