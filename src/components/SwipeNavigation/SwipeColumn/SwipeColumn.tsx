import { CSSProperties, ReactNode } from 'react';
import DarkenOverlay from '@components/SwipeNavigation/SwipeColumn/DarkenOverlay';

interface BaseProps {
  children: ReactNode;
  index: number;
  swipeIndex: number;
  dragIndex: number | null;
  dragOffset: number;
  isMain: boolean;
  swipeDirection: 'right' | 'left' | null;
  className?: string;
}

type DarkenProps =
  | {
      darkenLowerColumn: true;
      firstIndex: number;
      lastIndex: number;
      maxDarkenPercentage: number;
      containerWidth: number;
    }
  | {
      darkenLowerColumn?: false;
      firstIndex?: never;
      lastIndex?: never;
      maxDarkenPercentage?: never;
      containerWidth?: never;
    };

type Props = BaseProps & DarkenProps;

function SwipeColumn({
  children,
  index,
  swipeIndex,
  dragIndex,
  dragOffset,
  isMain,
  swipeDirection,
  className,
  firstIndex,
  lastIndex,
  darkenLowerColumn = false,
  maxDarkenPercentage,
  containerWidth,
}: Props) {
  let returnComp: ReactNode;
  switch (true) {
    case isMain: {
      returnComp = (
        <div className={`relative ${className}`}>
          {children}
          {darkenLowerColumn && (
            <DarkenOverlay
              containerWidth={containerWidth!}
              dragIndex={dragIndex}
              dragOffset={dragOffset}
              firstIndex={firstIndex!}
              index={index}
              isMain={isMain}
              lastIndex={lastIndex!}
              maxDarkenPercentage={maxDarkenPercentage!}
              swipeDirection={swipeDirection}
              swipeIndex={swipeIndex}
            />
          )}
        </div>
      );
      break;
    }
    case swipeDirection === 'right': {
      returnComp = (
        <div
          className={`swipe-slide absolute bottom-0 right-full top-0 ${
            dragIndex === index ? '' : 'transition-transform'
          } ${className}`}
          style={
            {
              '--slide-z-index': 9999 - index,
              '--slide-offset': swipeIndex <= index ? '100%' : '0%',
              '--drag-offset': `${dragIndex === index ? dragOffset : 0}px`,
            } as CSSProperties
          }
        >
          {children}
          {darkenLowerColumn && (
            <DarkenOverlay
              containerWidth={containerWidth!}
              dragIndex={dragIndex}
              dragOffset={dragOffset}
              firstIndex={firstIndex!}
              index={index}
              isMain={isMain}
              lastIndex={lastIndex!}
              maxDarkenPercentage={maxDarkenPercentage!}
              swipeDirection={swipeDirection}
              swipeIndex={swipeIndex}
            />
          )}
        </div>
      );
      break;
    }
    case swipeDirection === 'left': {
      returnComp = (
        <div
          className={`swipe-slide absolute bottom-0 left-full top-0 justify-end 
          ${dragIndex === index ? '' : 'transition-transform'} ${className}`}
          style={
            {
              '--slide-z-index': 0 + index,
              '--slide-offset': swipeIndex >= index ? '-100%' : '0%',
              '--drag-offset': `${dragIndex === index ? dragOffset : 0}px`,
            } as CSSProperties
          }
        >
          {children}
          {darkenLowerColumn && (
            <DarkenOverlay
              containerWidth={containerWidth!}
              dragIndex={dragIndex}
              dragOffset={dragOffset}
              firstIndex={firstIndex!}
              index={index}
              isMain={isMain}
              lastIndex={lastIndex!}
              maxDarkenPercentage={maxDarkenPercentage!}
              swipeDirection={swipeDirection}
              swipeIndex={swipeIndex}
            />
          )}
        </div>
      );
      break;
    }
    default:
      returnComp = null;
  }

  return returnComp;
}

export default SwipeColumn;
