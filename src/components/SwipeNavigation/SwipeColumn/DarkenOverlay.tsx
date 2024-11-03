import { CSSProperties, ReactNode } from 'react';

// requires a non-static positioned parent to work
function DarkenOverlay({
  index,
  swipeIndex,
  dragIndex,
  dragOffset,
  isMain,
  swipeDirection,
  firstIndex,
  lastIndex,
  maxDarkenPercentage,
  containerWidth,
}: {
  index: number;
  swipeIndex: number;
  dragIndex: number | null;
  dragOffset: number;
  isMain: boolean;
  swipeDirection: 'right' | 'left' | null;
  firstIndex: number;
  lastIndex: number;
  maxDarkenPercentage: number;
  containerWidth: number;
}) {
  let returnComp: ReactNode;

  const dragDarkenOffset =
    maxDarkenPercentage *
    Math.min(Math.abs(dragOffset * 2) / containerWidth, 1);

  function getDarkenPercentage(
    startsDarkened: boolean,
    isDarkenedByDrag: boolean,
  ) {
    let darkenPercentage = 0;
    if (isDarkenedByDrag) {
      darkenPercentage = startsDarkened
        ? maxDarkenPercentage - dragDarkenOffset
        : dragDarkenOffset;
    } else {
      darkenPercentage = startsDarkened ? maxDarkenPercentage : 0;
    }
    return darkenPercentage;
  }

  switch (true) {
    case isMain: {
      const startsDarkened = swipeIndex !== index;
      const isDarkenedByDrag =
        dragIndex !== null &&
        ((dragIndex - 1 === index && dragIndex <= lastIndex) ||
          (dragIndex + 1 === index && dragIndex >= firstIndex));
      const darkenPercentage = getDarkenPercentage(
        startsDarkened,
        isDarkenedByDrag,
      );

      returnComp = (
        <Overlay
          darkenPercentage={darkenPercentage}
          isDarkenedByDrag={isDarkenedByDrag}
        />
      );
      break;
    }
    case swipeDirection === 'right': {
      const startsDarkened = swipeIndex < index;
      const isDarkenedByDrag =
        dragIndex !== null &&
        dragIndex >= firstIndex &&
        dragIndex + 1 === index;
      const darkenPercentage = getDarkenPercentage(
        startsDarkened,
        isDarkenedByDrag,
      );

      returnComp = (
        <Overlay
          darkenPercentage={darkenPercentage}
          isDarkenedByDrag={isDarkenedByDrag}
        />
      );
      break;
    }
    case swipeDirection === 'left': {
      const startsDarkened = swipeIndex > index;
      const isDarkenedByDrag =
        dragIndex !== null && dragIndex <= lastIndex && dragIndex - 1 === index;
      const darkenPercentage = getDarkenPercentage(
        startsDarkened,
        isDarkenedByDrag,
      );

      returnComp = (
        <Overlay
          darkenPercentage={darkenPercentage}
          isDarkenedByDrag={isDarkenedByDrag}
        />
      );
      break;
    }
    default:
      returnComp = null;
  }

  return returnComp;
}

function Overlay({
  darkenPercentage,
  isDarkenedByDrag,
}: {
  darkenPercentage: number;
  isDarkenedByDrag: boolean;
}) {
  return (
    <div
      className={`swipe-slide-darken pointer-events-none absolute inset-0 touch-none bg-gray-900 ${
        isDarkenedByDrag ? '' : 'transition-opacity'
      }`}
      style={{ '--darken-percentage': `${darkenPercentage}%` } as CSSProperties}
    />
  );
}

export default DarkenOverlay;
