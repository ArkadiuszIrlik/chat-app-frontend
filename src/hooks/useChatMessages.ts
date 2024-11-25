import { parseNetworkMessages } from '@helpers/data';
import { genericFetcherCredentials, HttpError } from '@helpers/fetch';
import {
  CursorValue,
  useMessageCursorStore,
  useMessageStore,
} from '@hooks/index';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

const defaultLimit = 20;
const defaultCursor = undefined;

function useChatMessages(
  chatId: string | undefined,
  onLoadedMessages?: () => void,
) {
  const { messageStore, addToStore } = useMessageStore() ?? {};
  const { messageCursorStore, getPreviousCursor, updatePreviousCursor } =
    useMessageCursorStore() ?? {};
  const [shouldFetch, setShouldFetch] = useState(false);
  const [limit, setLimit] = useState(defaultLimit);
  const [previousCursor, setPreviousCursor] = useState<CursorValue | undefined>(
    defaultCursor,
  );

  const [hasFirstMessage, setHasFirstMessage] = useState(false);
  useEffect(() => {
    if (getPreviousCursor && chatId) {
      const currentChatCursor = getPreviousCursor(chatId);
      if (currentChatCursor === null) {
        setHasFirstMessage(true);
      } else {
        setHasFirstMessage(false);
      }
    }
  }, [messageCursorStore, getPreviousCursor, chatId]);

  let messages: Message[] | undefined;
  if (chatId !== undefined && messageStore) {
    messages = messageStore[chatId];
  }

  // initiate fetch when no messages
  useEffect(() => {
    if (!messages) {
      setShouldFetch(true);
    }
  }, [messages]);

  // fetch chat messages from API
  const messageUrl = getMessageUrl(chatId ?? '', limit, previousCursor);
  const { data, error, isLoading } = useSWR<
    {
      message: string;
      data: { messages: NetworkMessage[]; previousCursor: number | null };
    },
    HttpError
  >(() => (shouldFetch ? messageUrl : null), genericFetcherCredentials);

  // reset values after successful fetch
  useEffect(() => {
    if (data ?? (error && error.data.message === 'Messages not found')) {
      setShouldFetch(false);
      setLimit(defaultLimit);
      setPreviousCursor(defaultCursor);
    }
  }, [data, error]);

  // process fetch results
  useEffect(() => {
    if (shouldFetch && !isLoading && (data ?? error) && chatId && addToStore) {
      let nextMessages: NetworkMessage[];
      let nextPreviousCursor: CursorValue;
      if (data) {
        nextMessages = data.data.messages;
        nextPreviousCursor = data.data.previousCursor;
      } else if (error && error.data.message === 'Messages not found') {
        nextMessages = [];
        nextPreviousCursor = null;
      } else {
        return;
      }
      const parsedMessages = parseNetworkMessages(nextMessages);
      addToStore(chatId, parsedMessages);
      if (onLoadedMessages) {
        onLoadedMessages();
      }
      if (updatePreviousCursor) {
        updatePreviousCursor(chatId, nextPreviousCursor);
      }
    }
  }, [
    data,
    isLoading,
    error,
    shouldFetch,
    addToStore,
    chatId,
    updatePreviousCursor,
    onLoadedMessages,
  ]);

  const loadMoreMessages = useCallback(
    (messageCount = defaultLimit) => {
      let nextPreviousCursor;
      if (getPreviousCursor && chatId) {
        nextPreviousCursor = getPreviousCursor(chatId);
      }
      // cancel if nothing more to fetch
      if (nextPreviousCursor === null) {
        return;
      }
      setLimit(messageCount);
      setPreviousCursor(nextPreviousCursor);
      setShouldFetch(true);
    },
    [chatId, getPreviousCursor],
  );

  return {
    messages,
    hasFirstMessage,
    isLoading,
    error,
    loadMoreMessages,
  };
}

function getMessageUrl(chatId: string, limit: number, cursor?: CursorValue) {
  const dummyBaseUrl = 'https://example.com';
  const messageUrl = new URL(`/chat/${chatId}/messages`, dummyBaseUrl);
  messageUrl.searchParams.set('limit', limit.toString());
  if (cursor !== undefined) {
    messageUrl.searchParams.set('cursor', String(cursor));
  }

  return messageUrl.pathname + messageUrl.search;
}

export default useChatMessages;
