import { CSSProperties, ReactNode } from 'react';

function SwipeColumn({
  children,
  index,
  swipeIndex,
  dragIndex,
  dragOffset,
  isMain,
  swipeDirection,
}: {
  children: ReactNode;
  index: number;
  swipeIndex: number;
  dragIndex: number | null;
  dragOffset: number;
  isMain: boolean;
  swipeDirection: 'right' | 'left' | null;
}) {
  let returnComp: ReactNode;
  switch (true) {
    case isMain: {
      returnComp = <div>{children}</div>;
      break;
    }
    case swipeDirection === 'right': {
      returnComp = (
        <div
          className={`swipe-slide absolute bottom-0 right-full top-0 ${
            dragIndex === index ? '' : 'transition-transform'
          }`}
          style={
            {
              '--slide-z-index': 9999 - index,
              '--slide-offset': swipeIndex <= index ? '100%' : '0%',
              '--drag-offset': `${dragIndex === index ? dragOffset : 0}px`,
            } as CSSProperties
          }
        >
          {children}
        </div>
      );
      break;
    }
    case swipeDirection === 'left': {
      returnComp = (
        <div
          className={`swipe-slide absolute bottom-0 left-full top-0 
            ${dragIndex === index ? '' : 'transition-transform'}`}
          style={
            {
              '--slide-z-index': 0 + index,
              '--slide-offset': swipeIndex >= index ? '-100%' : '0%',
              '--drag-offset': `${dragIndex === index ? dragOffset : 0}px`,
            } as CSSProperties
          }
        >
          {children}
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
