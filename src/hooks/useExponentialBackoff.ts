import { useCallback, useEffect, useState } from 'react';

const STARTING_DELAY_MS = 100;
const DELAY_MULTIPLIER = 2;
const initialRetryIndex = -1;

function useExponentialBackoff({
  jitter = false,
  maxRetries = 10,
}: { jitter?: boolean; maxRetries?: number } = {}) {
  const [retryIndex, setRetryIndex] = useState(initialRetryIndex);
  // completed retries
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setRetryIndex((ri) => ri + 1);
  }, []);

  useEffect(() => {
    if (retryIndex === initialRetryIndex || retryIndex === maxRetries) {
      return undefined;
    }
    const nextDelay = STARTING_DELAY_MS * DELAY_MULTIPLIER ** (retryIndex + 1);
    const jitteredDelay = getJitteredDelay(nextDelay, jitter);

    const timeoutId = setTimeout(() => {
      setRetryCount((count) => count + 1);
    }, jitteredDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [retryIndex, jitter, maxRetries]);

  return {
    retryCount,
    retry,
  };
}

function getJitteredDelay(delay: number, isJittered: boolean) {
  let jitteredDelay = 0;
  if (isJittered) {
    jitteredDelay = Math.round(Math.random() * delay);
  } else {
    jitteredDelay = delay;
  }

  return jitteredDelay;
}

export default useExponentialBackoff;
