import { useCallback, useEffect, useState } from 'react';

interface Params {
  /** Desired delay in miliseconds */
  delay: number;
}

function useDelay({ delay }: Params) {
  const [isReady, setIsReady] = useState(false);

  const resetDelay = useCallback(() => {
    setIsReady(false);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isReady) {
      timeoutId = setTimeout(() => setIsReady(true), delay);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isReady, delay]);

  return {
    isReady,
    resetDelay,
  };
}

export default useDelay;
