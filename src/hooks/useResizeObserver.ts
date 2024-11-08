import { MutableRefObject, useEffect } from 'react';

function useResizeObserver(
  ref: MutableRefObject<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void,
) {
  useEffect(() => {
    const element = ref?.current;

    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      callback(entries[0]);
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [callback, ref]);

  return ref;
}

export default useResizeObserver;
