import { ISwipeColumn } from '@components/SwipeNavigation/SwipeNavigation/SwipeNavigation.types';
import useSwipe from '@hooks/useSwipe';
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
  /** Specifies minimum distance (in pixels) for a drag be
   *  registered */
  minimumDragDistance?: number;
  /** Swipe distance (in pixels) when swiping direction is
   * decided (vertical or horizontal) */
  directionLockThreshold?: number;
}

function useSwipeNavigation(
  columns: ISwipeColumn[],
  swipeContainerRef: MutableRefObject<HTMLElement | null>,
  {
    minimumDistance = 0,
    minimumDragDistance = 0,
    directionLockThreshold = 5,
  }: IOptions = {},
) {
  const lowestIndex = 0;
  const highestIndex = columns.length - 1;
  const mainColIndex = columns.findIndex((col) => col.main === true);

  const [swipeIndex, setSwipeIndex] = useState(mainColIndex);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<
    'vertical' | 'horizontal' | null
  >(null);

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
      if (swipeDirection === 'horizontal') {
        if (deltaX > 0 && deltaX >= minimumDistance) {
          handleSwipeRight();
        }
        if (deltaX < 0 && deltaX <= -Math.abs(minimumDistance)) {
          handleSwipeLeft();
        }
      }
      setSwipeDirection(null);
    },
    [handleSwipeLeft, handleSwipeRight, minimumDistance, swipeDirection],
  );

  const processSwipeUpdate = useCallback(
    ({
      deltaX,
      deltaY,
      e,
    }: {
      deltaX: number;
      deltaY: number;
      e: MouseEvent | TouchEvent;
    }) => {
      if (!swipeDirection) {
        if (e.cancelable) {
          e.preventDefault();
        }
        if (
          Math.abs(deltaX) >= directionLockThreshold ||
          Math.abs(deltaY) >= directionLockThreshold
        ) {
          // soft preference for vertical direction
          if (Math.abs(deltaY) >= Math.abs(deltaX)) {
            setSwipeDirection('vertical');
          } else {
            setSwipeDirection('horizontal');
          }
        } else {
          return;
        }
      }

      if (swipeDirection === 'horizontal') {
        if (e.cancelable) {
          e.preventDefault();
        }
        setDragOffset(Math.round(deltaX));
        if (Math.abs(deltaX) < minimumDragDistance) {
          setDragIndex(null);
          return;
        }
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
      }
    },
    [
      swipeIndex,
      mainColIndex,
      minimumDragDistance,
      directionLockThreshold,
      swipeDirection,
    ],
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
