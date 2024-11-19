import ExclamationIcon from '@assets/exclamation-point-128.png';
import useDelay from '@hooks/useDelay';
import { ExtendedCSSProperties } from '@src/types';
import { useCallback, useEffect, useState } from 'react';
import CloseIcon from '@assets/close-icon.png';

const exclamationStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ExclamationIcon})`,
};

const closeIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${CloseIcon})`,
};
const DISPLAY_DURATION_MS = 10000;

function ChatErrorDisplay({
  errorMessage,
  onDismiss,
}: {
  errorMessage: string;
  onDismiss: () => void;
}) {
  const { isReady, resetDelay } = useDelay({ delay: DISPLAY_DURATION_MS });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isReady && !isPaused) {
      onDismiss();
    }
  }, [isReady, isPaused, onDismiss]);

  const pauseProgressBar = useCallback(() => {
    setIsPaused(true);
  }, []);

  const unpauseProgressBar = useCallback(() => {
    resetDelay();
    setIsPaused(false);
  }, [resetDelay]);

  return (
    <div
      className="rounded-lg border-[1px] border-red-300
             bg-red-900 text-red-300"
      onMouseEnter={() => {
        pauseProgressBar();
      }}
      onMouseLeave={() => {
        unpauseProgressBar();
      }}
      onFocus={() => {
        pauseProgressBar();
      }}
      onBlur={() => {
        unpauseProgressBar();
      }}
    >
      <div className="px-3">
        <div
          className={`${
            isPaused ? '' : 'error-bar-animation'
          } h-[0.125rem] w-full rounded-lg bg-red-300`}
          style={
            {
              '--error-bar-duration': `${DISPLAY_DURATION_MS}ms`,
            } as ExtendedCSSProperties
          }
        />
      </div>
      <div className="flex items-center gap-3 px-3 pb-2 pt-1">
        <div
          style={exclamationStyles}
          className="alpha-mask aspect-square h-5 w-5 min-w-0 shrink-0 grow-0
           bg-red-300"
        />
        <div className="min-w-0 break-words">{errorMessage}</div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="group ml-auto block rounded-md p-1 using-mouse:hover:bg-red-800"
        >
          <div
            className="alpha-mask aspect-square h-4 w-4 shrink-0 grow-0 bg-red-300
                using-mouse:group-hover:bg-red-200"
            style={closeIconStyles}
          />
        </button>
      </div>
    </div>
  );
}
export default ChatErrorDisplay;
