import { ISwipeColumn } from '@components/SwipeNavigation/SwipeNavigation/SwipeNavigation.types';
import useSwipe from '@components/SwipeNavigation/useSwipe';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface IOptions {
  /** Specifies minimum distance (in pixels) for a swipe to be
   *  registered */
  minimumDistance?: number;
}

function useSwipeNavigation(
  columns: ISwipeColumn[],
  swipeContainerRef: MutableRefObject<HTMLElement | null>,
  { minimumDistance = 0 }: IOptions = {},
) {
  const lowestIndex = 0;
  const highestIndex = columns.length - 1;
  const mainColIndex = columns.findIndex((col) => col.main === true);

  const [swipeIndex, setSwipeIndex] = useState(mainColIndex);

  // whenever columns.length changes, reset swipeIndex
  useEffect(() => {
    if (mainColIndex === -1) {
      setSwipeIndex(0);
    } else {
      setSwipeIndex(mainColIndex);
    }
  }, [mainColIndex, columns.length]);

  const handleSwipeRight = useCallback(() => {
    setSwipeIndex((si) => {
      if (si > lowestIndex) {
        return si - 1;
      }
      return si;
    });
  }, [lowestIndex]);

  const handleSwipeLeft = useCallback(() => {
    setSwipeIndex((si) => {
      if (si < highestIndex) {
        return si + 1;
      }
      return si;
    });
  }, [highestIndex]);

  function processSwipe({ deltaX }: { deltaX: number; deltaY: number }) {
    if (deltaX > 0 && deltaX >= minimumDistance) {
      handleSwipeRight();
      return;
    }
    if (deltaX < 0 && deltaX <= -Math.abs(minimumDistance)) {
      handleSwipeLeft();
    }
  }

  useSwipe(processSwipe, {
    containerRef: swipeContainerRef,
  });

  return useMemo(
    () => ({
      swipeIndex,
    }),
    [swipeIndex],
  );
}

export default useSwipeNavigation;
