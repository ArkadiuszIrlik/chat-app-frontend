import { useDebounce } from '@uidotdev/usehooks';
import deepEqual from 'deep-equal';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useBlocker } from 'react-router-dom';

function useBlockUnsaved({
  initialValues,
  currentValues,
  onCancelChanges,
  onConfirmChanges: handleConfirmChanges,
  changeDebounceTime = 500,
}: {
  initialValues: unknown;
  currentValues: unknown;
  onCancelChanges: () => void;
  onConfirmChanges: () => void;
  changeDebounceTime?: number;
}) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedQueue, setBlockedQueue] = useState<(() => void)[]>([]);
  const [haveValuesChanged, setHaveValuesChanged] = useState(false);
  const debouncedValues = useDebounce(currentValues, changeDebounceTime);

  useEffect(() => {
    setHaveValuesChanged(!deepEqual(initialValues, debouncedValues));
  }, [debouncedValues, initialValues]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      haveValuesChanged && currentLocation.pathname !== nextLocation.pathname,
  );

  const blockUntilSaved = useCallback(
    (cb: () => void) => {
      if (haveValuesChanged) {
        setIsBlocked(true);
        setBlockedQueue((bq) => [...bq, cb]);
      } else {
        cb();
      }
    },
    [haveValuesChanged],
  );

  const handleCancelChanges = useCallback(() => {
    onCancelChanges();
    setHaveValuesChanged(false);
  }, [onCancelChanges]);

  const handleProceedDiscard = useCallback(() => {
    setIsBlocked(false);
    blockedQueue.forEach((f) => {
      f();
    });
    setBlockedQueue([]);
    if (blocker.proceed) {
      blocker.proceed();
    }
  }, [blocker, blockedQueue]);

  const handleCancelDiscard = useCallback(() => {
    setIsBlocked(false);
    setBlockedQueue([]);
    if (blocker.reset) {
      blocker.reset();
    }
  }, [blocker]);

  return {
    blocker,
    isBlocked,
    handleProceedDiscard,
    handleCancelDiscard,
    haveValuesChanged,
    handleCancelChanges,
    handleConfirmChanges,
    blockUntilSaved,
  };
}

const BlockUnsavedContext = createContext<ReturnType<
  typeof useBlockUnsaved
> | null>(null);

BlockUnsavedProvider.defaultProps = {
  changeDebounceTime: 500,
};

export function BlockUnsavedProvider({
  initialValues,
  currentValues,
  onCancelChanges,
  onConfirmChanges,
  changeDebounceTime = 500,
  children,
}: {
  initialValues: unknown;
  currentValues: unknown;
  onCancelChanges: () => void;
  onConfirmChanges: () => void;
  changeDebounceTime?: number;
  children: ReactNode;
}) {
  const blockUnsavedProps = useBlockUnsaved({
    initialValues,
    currentValues,
    onCancelChanges,
    onConfirmChanges,
    changeDebounceTime,
  });

  return (
    <BlockUnsavedContext.Provider value={blockUnsavedProps}>
      {children}
    </BlockUnsavedContext.Provider>
  );
}

function BlockUnsavedConsumer() {
  return useContext(BlockUnsavedContext);
}

export default BlockUnsavedConsumer;
