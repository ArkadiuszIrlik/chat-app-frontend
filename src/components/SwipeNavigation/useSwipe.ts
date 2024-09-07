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
  onSwipe: (params: { deltaX: number; deltaY: number }) => void,
  { containerRef, constrainToContainer = false }: Options,
) {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

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

      e.preventDefault();
      setStartX(uE.clientX);
      setStartY(uE.clientY);
    },
    [containerRef],
  );

  const handleSwipeEnd = useCallback(
    (e: TouchEvent | MouseEvent) => {
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

      e.preventDefault();

      const endX = uE.clientX;
      const endY = uE.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      onSwipe({ deltaX, deltaY });
    },
    [constrainToContainer, containerRef, startX, startY, onSwipe],
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

    window.addEventListener('touchmove', preventNavigation);

    return () => {
      window.removeEventListener('touchstart', handleSwipeStart);
      window.removeEventListener('mousedown', handleSwipeStart);
      window.removeEventListener('touchend', handleSwipeEnd);
      window.removeEventListener('mouseup', handleSwipeEnd);

      window.removeEventListener('touchmove', preventNavigation);
    };
  }, [handleSwipeStart, handleSwipeEnd, preventNavigation]);
}

export default useSwipe;
