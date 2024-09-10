import SwipeColumn from '@components/SwipeNavigation/SwipeColumn/SwipeColumn';
import { ISwipeColumn } from '@components/SwipeNavigation/SwipeNavigation/SwipeNavigation.types';
import useSwipeNavigation from '@components/SwipeNavigation/SwipeNavigation/useSwipeNavigation';
import { ReactNode, useRef } from 'react';

SwipeNavigation.defaultProps = {
  children: null,
  containerClass: '',
};

function SwipeNavigation({
  children,
  containerClass,
  columns,
}: {
  children?: ReactNode;
  containerClass?: string;
  columns: ISwipeColumn[];
}) {
  const swipeContainerRef = useRef<HTMLDivElement | null>(null);
  const { swipeIndex } = useSwipeNavigation(columns, swipeContainerRef);
  const mainIndex = columns.findIndex((col) => col.main === true);
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

        return (
          <SwipeColumn
            index={i}
            swipeIndex={swipeIndex}
            isMain={isMain}
            swipeDirection={swipeDirection}
          >
            {col.content}
          </SwipeColumn>
        );
      })}
      {children}
    </div>
  );
}

export default SwipeNavigation;
