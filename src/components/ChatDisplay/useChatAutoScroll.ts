import useResizeObserver from '@hooks/useResizeObserver';
import { RefObject, useCallback, useEffect, useState } from 'react';

function useChatAutoScroll({
  chatContainerRef,
  messages,
}: {
  chatContainerRef: RefObject<HTMLElement>;
  messages: Message[];
}) {
  const [isNewUserSentMessage, setIsNewUserSentMessage] = useState(false);

  const onMessageSent = useCallback(() => {
    setIsNewUserSentMessage(true);
  }, []);

  const handleChatResize = useCallback(() => {
    if (isNewUserSentMessage) {
      scrollOnMessageSent(chatContainerRef);
      setIsNewUserSentMessage(false);
      return;
    }
    autoScrollToBottom(chatContainerRef);
  }, [isNewUserSentMessage, chatContainerRef]);
  useResizeObserver(chatContainerRef, handleChatResize);

  useEffect(() => {
    autoScrollToBottom(chatContainerRef);
  }, [messages, chatContainerRef]);

  return { onMessageSent };
}

function autoScrollToBottom(containerRef: RefObject<HTMLElement>) {
  if (containerRef.current === null) {
    return;
  }
  const { offsetHeight, scrollHeight, scrollTop } = containerRef.current;
  const allowedScrollFromBottomPx = 100;
  if (scrollHeight <= scrollTop + offsetHeight + allowedScrollFromBottomPx) {
    containerRef.current.scrollTo(0, scrollHeight);
  }
}

function scrollOnMessageSent(containerRef: RefObject<HTMLElement>) {
  if (containerRef.current === null) {
    return;
  }
  const lastMessageEl = containerRef.current.lastElementChild;
  if (lastMessageEl instanceof HTMLElement) {
    const { offsetHeight, scrollHeight, scrollTop } = containerRef.current;
    const bottomContainerScrollOffset = scrollTop + offsetHeight;
    const lastMessageScrollOffset = lastMessageEl?.offsetTop;
    // to account for differences caused by padding, margin, borders etc.
    const marginOfErrorPx = 30;
    if (
      bottomContainerScrollOffset + marginOfErrorPx >=
      lastMessageScrollOffset
    ) {
      containerRef.current.scrollTo(0, scrollHeight);
    }
  }
}

export default useChatAutoScroll;
