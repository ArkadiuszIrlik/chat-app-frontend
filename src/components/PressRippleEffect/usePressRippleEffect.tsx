import { MouseEvent, TouchEvent, useCallback, useMemo, useState } from 'react';

function usePressRippleEffect({
  startWidth = 40,
  startHeight = 40,
  endHeight,
  endWidth,
  targetContainer,
  delay = 0,
  duration = 500,
  color = 'gray',
  autoHeight = false,
  extraScaleMultiply = 1,
}: {
  startWidth?: number;
  startHeight?: number;
  endHeight?: number;
  endWidth?: number;
  targetContainer?: HTMLElement | null;
  delay?: number;
  duration?: number;
  color?: string;
  autoHeight?: boolean;
  extraScaleMultiply?: number;
} = {}) {
  const [isRippleShown, setIsRippleShown] = useState(false);
  const [top, setTop] = useState('0px');
  const [left, setLeft] = useState('0px');
  const [scaleX, setScaleX] = useState(4);
  const [scaleY, setScaleY] = useState(4);

  const handleTouchStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (e.currentTarget) {
        const target = targetContainer ?? e.currentTarget;
        const targetRect = target.getBoundingClientRect();

        let clientX = 0;
        if ('clientX' in e) {
          clientX = e.clientX;
        } else {
          clientX = e.touches ? e.touches[0].clientX : 0;
        }
        let clientY = 0;
        if ('clientY' in e) {
          clientY = e.clientY;
        } else {
          clientY = e.touches ? e.touches[0].clientY : 0;
        }

        setLeft(`${clientX - (targetRect.left + startWidth / 2)}px`);
        setTop(`${clientY - (targetRect.top + startHeight / 2)}px`);

        let distanceToScaleX = 0;
        if (endWidth) {
          distanceToScaleX = endWidth;
        } else {
          const centerX = clientX - targetRect.left;
          if (centerX >= targetRect.width / 2) {
            distanceToScaleX = centerX;
          } else {
            distanceToScaleX = targetRect.width - centerX;
          }
        }

        let distanceToScaleY = 0;
        if (autoHeight) {
          distanceToScaleY = distanceToScaleX;
        } else if (endHeight) {
          distanceToScaleY = endHeight;
        } else {
          const centerY = clientY - targetRect.top;
          if (centerY >= targetRect.height / 2) {
            distanceToScaleY = centerY;
          } else {
            distanceToScaleY = targetRect.height - centerY;
          }
        }

        setScaleX((distanceToScaleX / (startWidth / 2)) * extraScaleMultiply);
        setScaleY((distanceToScaleY / (startHeight / 2)) * extraScaleMultiply);

        setIsRippleShown(true);
      }
    },
    [
      startHeight,
      startWidth,
      endHeight,
      endWidth,
      targetContainer,
      autoHeight,
      extraScaleMultiply,
    ],
  );

  const handleTouchEnd = useCallback(() => {
    setIsRippleShown(false);
  }, []);

  const attributes = useMemo(
    () => ({
      isRippleShown,
      style: {
        top,
        left,
        backgroundColor: color,
        '--scale-x': scaleX,
        '--scale-y': scaleY,
        '--duration': `${duration}ms`,
        '--delay': `${delay}ms`,
        width: `${startWidth}px`,
        height: `${startHeight}px`,
      },
    }),
    [
      isRippleShown,
      top,
      left,
      startWidth,
      startHeight,
      scaleX,
      scaleY,
      duration,
      delay,
      color,
    ],
  );

  return { attributes, handleTouchStart, handleTouchEnd };
}

export default usePressRippleEffect;
