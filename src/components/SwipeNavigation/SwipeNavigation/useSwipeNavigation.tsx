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
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

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

  const processSwipe = useCallback(
    ({ deltaX }: { deltaX: number; deltaY: number }) => {
      setDragIndex(null);
      setDragOffset(0);
      if (deltaX > 0 && deltaX >= minimumDistance) {
        handleSwipeRight();
        return;
      }
      if (deltaX < 0 && deltaX <= -Math.abs(minimumDistance)) {
        handleSwipeLeft();
      }
    },
    [handleSwipeLeft, handleSwipeRight, minimumDistance],
  );

  const processSwipeUpdate = useCallback(
    ({ deltaX }: { deltaX: number; deltaY: number }) => {
      setDragOffset(Math.round(deltaX));
      if (swipeIndex === mainColIndex) {
        if (deltaX > 0) {
          setDragIndex(swipeIndex - 1);
        }
        if (deltaX < 0) {
          setDragIndex(swipeIndex + 1);
        }
        return;
      }
      if (swipeIndex < mainColIndex) {
        if (deltaX > 0) {
          setDragIndex(swipeIndex - 1);
        }
        if (deltaX < 0) {
          setDragIndex(swipeIndex);
        }
        return;
      }
      if (swipeIndex > mainColIndex) {
        if (deltaX > 0) {
          setDragIndex(swipeIndex);
        }
        if (deltaX < 0) {
          setDragIndex(swipeIndex + 1);
        }
      }
    },
    [swipeIndex, mainColIndex],
  );

  useSwipe(processSwipe, processSwipeUpdate, {
    containerRef: swipeContainerRef,
  });

  return useMemo(
    () => ({
      swipeIndex,
      dragIndex,
      dragOffset,
    }),
    [swipeIndex, dragIndex, dragOffset],
  );
}

export default useSwipeNavigation;
