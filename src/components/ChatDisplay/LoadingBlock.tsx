import styleConsts from '@constants/styleConsts';
import { RefObject, useEffect, useRef } from 'react';
import { SyncLoader } from 'react-spinners';

function LoadingBlock({
  isLoading,
  chatContainerRef,
  onLoadMoreMessages,
}: {
  isLoading: boolean;
  chatContainerRef: RefObject<HTMLElement>;
  onLoadMoreMessages: () => void;
}) {
  const loadingBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatContainerRef.current || !loadingBlockRef.current) {
      return undefined;
    }

    let isIntersecting = false;
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      const entry = entries[0];
      isIntersecting = entry.isIntersecting;
      if (entry.isIntersecting) {
        // timeout makes sure the fetch doesn't start before automatic scroll
        setTimeout(() => {
          if (isIntersecting && !isLoading) {
            onLoadMoreMessages();
          }
        }, 10);
      }
    }
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 1,
      root: chatContainerRef.current,
    });
    observer.observe(loadingBlockRef.current);

    return () => {
      observer.disconnect();
    };
  }, [chatContainerRef, isLoading, onLoadMoreMessages]);

  return (
    <div>
      <div className="mt-5 flex h-10 grow items-center justify-center">
        <SyncLoader
          color={styleConsts.colors.gray[300]}
          speedMultiplier={0.8}
          size={10}
        />
      </div>
      <div className="h-10" ref={loadingBlockRef} />
    </div>
  );
}

export default LoadingBlock;
