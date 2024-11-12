import SwipeColumn from '@components/SwipeNavigation/SwipeColumn/SwipeColumn';
import { ISwipeColumn } from '@components/SwipeNavigation/SwipeNavigation/SwipeNavigation.types';
import useSwipeNavigation from '@components/SwipeNavigation/SwipeNavigation/useSwipeNavigation';
import { ReactNode, useEffect, useRef, useState } from 'react';

SwipeNavigation.defaultProps = {
  children: null,
  containerClass: '',
  options: {},
};

interface Options {
  darkenLowerColumns?: boolean;
  maxDarkenPercentage?: number;
  allowMouseSwipe?: boolean;
}

function SwipeNavigation({
  children,
  containerClass,
  columns,
  options: {
    darkenLowerColumns = true,
    maxDarkenPercentage = 80,
    allowMouseSwipe = false,
  } = {},
}: {
  children?: ReactNode;
  containerClass?: string;
  columns: ISwipeColumn[];
  options?: Options;
}) {
  const swipeContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { swipeIndex, dragIndex, dragOffset } = useSwipeNavigation(
    columns,
    swipeContainerRef,
    {
      minimumDistance: Math.min(containerWidth * 0.2, 300),
      allowMouse: allowMouseSwipe,
    },
  );
  const mainIndex = columns.findIndex((col) => col.main === true);

  useEffect(() => {
    function updateContainerWidth(entries: ResizeObserverEntry[]) {
      entries.forEach((entry) => {
        setContainerWidth(entry.contentRect.width);
      });
    }

    const containerObserver = new ResizeObserver(updateContainerWidth);

    containerObserver.disconnect();
    if (swipeContainerRef.current) {
      containerObserver.observe(swipeContainerRef.current);
    }

    return () => {
      containerObserver.disconnect();
    };
  }, [swipeContainerRef, setContainerWidth]);

  const lastIndex = columns.length - 1;
  return (
    <div
      className={`relative z-0 overflow-x-hidden ${containerClass}`}
      ref={swipeContainerRef}
    >
      {columns.map((col, i) => {
        const isMain = i === mainIndex;
        let swipeDirection: 'right' | 'left' | null = null;
        if (i < mainIndex) {
          swipeDirection = 'right';
        }
        if (i > mainIndex) {
          swipeDirection = 'left';
        }

        let returnComp: ReactNode;
        if (darkenLowerColumns) {
          returnComp = (
            <SwipeColumn
              index={i}
              swipeIndex={swipeIndex}
              dragIndex={dragIndex}
              dragOffset={dragOffset}
              isMain={isMain}
              swipeDirection={swipeDirection}
              className={col.className}
              darkenLowerColumn={darkenLowerColumns}
              firstIndex={0}
              lastIndex={lastIndex}
              maxDarkenPercentage={maxDarkenPercentage}
              containerWidth={containerWidth}
            >
              {col.content}
            </SwipeColumn>
          );
        } else {
          returnComp = (
            <SwipeColumn
              index={i}
              swipeIndex={swipeIndex}
              dragIndex={dragIndex}
              dragOffset={dragOffset}
              isMain={isMain}
              swipeDirection={swipeDirection}
              className={col.className}
            >
              {col.content}
            </SwipeColumn>
          );
        }
        return returnComp;
      })}
      {children}
    </div>
  );
}

export default SwipeNavigation;
