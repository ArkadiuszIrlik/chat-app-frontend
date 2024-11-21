import { MutableRefObject, useEffect, useRef } from 'react';

function useResizeObserver(
  ref: MutableRefObject<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void,
  { runOnInitialObserve = true }: { runOnInitialObserve?: boolean } = {},
) {
  const isInitialObserveRef = useRef(false);
  useEffect(() => {
    isInitialObserveRef.current = true;
    const element = ref?.current;

    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      if (!isInitialObserveRef.current || runOnInitialObserve) {
        callback(entries[0]);
      }
      isInitialObserveRef.current = false;
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [callback, ref, runOnInitialObserve]);

  return ref;
}

export default useResizeObserver;
