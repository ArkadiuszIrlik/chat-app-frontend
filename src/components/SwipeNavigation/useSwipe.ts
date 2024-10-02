import { MutableRefObject, useCallback, useEffect, useState } from 'react';

type Options =
  | {
      containerRef: MutableRefObject<HTMLElement | null>;
      constrainToContainer: true;
    }
  | {
      containerRef?: MutableRefObject<HTMLElement | null>;
      constrainToContainer?: false;
    };

function unifyEvent(e: TouchEvent | MouseEvent) {
  if ('changedTouches' in e) {
    return e.changedTouches[0];
  }
  return e;
}

function useSwipe(
  onSwipe:
    | ((params: {
        deltaX: number;
        deltaY: number;
        e: MouseEvent | TouchEvent;
      }) => void)
    | null,
  onSwipeUpdate:
    | ((params: {
        deltaX: number;
        deltaY: number;
        e: MouseEvent | TouchEvent;
      }) => void)
    | null,
  { containerRef, constrainToContainer = false }: Options,
) {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSwipeStart = useCallback(
    (e: TouchEvent | MouseEvent) => {
      const uE = unifyEvent(e);
      if (containerRef) {
        if (
          !containerRef.current ||
          (uE.target instanceof Node &&
            !containerRef.current.contains(uE.target))
        ) {
          return;
        }
      }

      setIsSwiping(true);
      setStartX(uE.clientX);
      setStartY(uE.clientY);
    },
    [containerRef],
  );

  const handleSwipeEnd = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!isSwiping) {
        return;
      }
      const uE = unifyEvent(e);
      if (constrainToContainer) {
        if (
          !containerRef?.current ||
          (uE.target instanceof Node &&
            !containerRef.current.contains(uE.target))
        ) {
          setIsSwiping(false);
          return;
        }
      }

      const endX = uE.clientX;
      const endY = uE.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      setIsSwiping(false);
      if (onSwipe) {
        onSwipe({ deltaX, deltaY, e });
      }
    },
    [constrainToContainer, containerRef, startX, startY, onSwipe, isSwiping],
  );

  const handleSwipeUpdate = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!isSwiping) {
        return;
      }
      const uE = unifyEvent(e);
      if (constrainToContainer) {
        if (
          !containerRef?.current ||
          (uE.target instanceof Node &&
            !containerRef.current.contains(uE.target))
        ) {
          return;
        }
      }

      const endX = uE.clientX;
      const endY = uE.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      if (onSwipeUpdate) {
        onSwipeUpdate({ deltaX, deltaY, e });
      }
    },
    [
      constrainToContainer,
      containerRef,
      isSwiping,
      startX,
      startY,
      onSwipeUpdate,
    ],
  );

  //   some browsers navigate back/forward on swipe gestures, this bit of
  // code prevents that behavior
  const preventNavigation = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    window.addEventListener('touchstart', handleSwipeStart);
    window.addEventListener('mousedown', handleSwipeStart);
    window.addEventListener('touchend', handleSwipeEnd);
    window.addEventListener('mouseup', handleSwipeEnd);
    if (onSwipeUpdate) {
      window.addEventListener('touchmove', handleSwipeUpdate, {
        passive: false,
      });
      window.addEventListener('mousemove', handleSwipeUpdate, {
        passive: false,
      });
    }

    window.addEventListener('touchmove', preventNavigation, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleSwipeStart);
      window.removeEventListener('mousedown', handleSwipeStart);
      window.removeEventListener('touchend', handleSwipeEnd);
      window.removeEventListener('mouseup', handleSwipeEnd);
      window.removeEventListener('touchmove', handleSwipeUpdate);
      window.removeEventListener('mousemove', handleSwipeUpdate);

      window.removeEventListener('touchmove', preventNavigation);
    };
  }, [
    handleSwipeStart,
    handleSwipeEnd,
    handleSwipeUpdate,
    preventNavigation,
    onSwipeUpdate,
  ]);
}

export default useSwipe;
