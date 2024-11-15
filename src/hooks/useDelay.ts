import { useCallback, useEffect, useRef, useState } from 'react';

interface Params {
  /** Desired delay in miliseconds */
  delay: number;
}

function useDelay({ delay }: Params) {
  const [isReady, setIsReady] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const startTimeout = useCallback(() => {
    timeoutIdRef.current = setTimeout(() => setIsReady(true), delay);
  }, [delay]);

  const resetDelay = useCallback(() => {
    setIsReady(false);
    clearTimeout(timeoutIdRef.current);
    startTimeout();
  }, [startTimeout]);

  useEffect(() => {
    startTimeout();
    return () => {
      clearTimeout(timeoutIdRef.current);
    };
    // leave dependency array empty or timeouts will get reset every time
    // "delay" param changes
  }, []);

  return {
    isReady,
    resetDelay,
  };
}

export default useDelay;
