import useScrollOffset, { ScrollOffsetValue } from '@hooks/useScrollOffset';
import useResizeObserver from '@hooks/useResizeObserver';
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

function useScrollPosition({
  channelId,
  messages,
  chatContainerRef,
}: {
  channelId: string | undefined;
  messages: Message[] | undefined;
  chatContainerRef: RefObject<HTMLDivElement>;
}) {
  const { getScrollOffset, getMessageScrollOffset, updateScrollOffset } =
    useScrollOffset() ?? {};
  let scrollOffset: ScrollOffsetValue | undefined;
  if (getScrollOffset && channelId) {
    scrollOffset = getScrollOffset(channelId);
  }

  const prevScrollHeight = chatContainerRef.current?.scrollHeight;
  const prevScrollTop = chatContainerRef.current?.scrollTop;

  const channelIdBeforeRenderRef = useRef<typeof channelId | undefined>(
    undefined,
  );

  // maintain scroll position when new messages load
  useLayoutEffect(() => {
    function cleanup() {
      // holds channelId value from before the effect ran
      channelIdBeforeRenderRef.current = channelId;
    }
    const hasChannelChanged = channelIdBeforeRenderRef.current !== channelId;
    const containerEl = chatContainerRef.current;
    if (
      !containerEl ||
      prevScrollHeight === undefined ||
      prevScrollTop === undefined ||
      hasChannelChanged
    ) {
      return cleanup;
    }
    const nextScrollPosition =
      containerEl.scrollHeight - (prevScrollHeight - prevScrollTop);
    containerEl.scroll(0, nextScrollPosition);

    return cleanup;
  }, [messages]);

  // restore scroll position when changing channels
  useEffect(() => {
    if (!messages || !chatContainerRef.current || !getMessageScrollOffset) {
      return;
    }

    function navigateToBottom() {
      if (chatContainerRef.current) {
        const containerBottomDistance = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTo(0, containerBottomDistance);
      }
    }

    if (scrollOffset === undefined || scrollOffset === 'bottom') {
      navigateToBottom();
      return;
    }

    const offsetMessage = messages.find(
      (message) => getMessageScrollOffset(message) >= scrollOffset,
    );
    if (offsetMessage) {
      const messageEl = chatContainerRef.current.querySelector(
        `[data-scroll-offset="${getMessageScrollOffset(offsetMessage)}"]`,
      );
      if (messageEl) {
        messageEl.scrollIntoView();
        return;
      }
    }

    navigateToBottom();
    // shouldn't rerun with messages and scrollOffset changes to
    // prevent janky scroll
  }, [channelId, chatContainerRef, getMessageScrollOffset]);

  // update offset on scroll
  useEffect(() => {
    const containerEl = chatContainerRef.current;
    if (!containerEl) {
      return undefined;
    }

    function handleScrollEnd() {
      if (!containerEl || !updateScrollOffset || !channelId) {
        return;
      }

      // check if scrolled to the bottom
      const { offsetHeight, scrollHeight, scrollTop } = containerEl;
      const allowedScrollFromBottomPx = 100;
      if (
        scrollHeight <=
        scrollTop + offsetHeight + allowedScrollFromBottomPx
      ) {
        updateScrollOffset(channelId, 'bottom');
        return;
      }

      // check scroll offset
      const messageEls = [...containerEl.children];
      const topMessage = messageEls.find(
        (el) =>
          el instanceof HTMLElement && el.offsetTop >= containerEl.scrollTop,
      );
      if (topMessage && topMessage instanceof HTMLElement) {
        if (topMessage.dataset.scrollOffset) {
          updateScrollOffset(
            channelId,
            parseInt(topMessage.dataset.scrollOffset, 10),
          );
        }
      }
    }

    containerEl.addEventListener('scrollend', handleScrollEnd);
    return () => {
      containerEl.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [channelId, updateScrollOffset, chatContainerRef]);

  // auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollOffset === 'bottom') {
      scrollToBottom(chatContainerRef);
    }
  }, [messages, scrollOffset, chatContainerRef]);

  const handleChatResize = useCallback(() => {
    if (scrollOffset === 'bottom') {
      scrollToBottom(chatContainerRef);
    }
  }, [scrollOffset, chatContainerRef]);

  useResizeObserver(chatContainerRef, handleChatResize);
}

function scrollToBottom(containerRef: RefObject<HTMLElement>) {
  const containerEl = containerRef.current;
  if (!containerEl) {
    return;
  }
  containerEl.scrollTo(0, containerEl.scrollHeight);
}

export default useScrollPosition;
