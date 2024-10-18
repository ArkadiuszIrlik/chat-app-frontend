import useSwipe from '@hooks/useSwipe';

function LongPressSwipeCancel({ onCancel }: { onCancel: () => void }) {
  function cancelLongPressOnSwipe({
    deltaX,
    deltaY,
  }: {
    deltaX: number;
    deltaY: number;
  }) {
    if (
      Math.abs(deltaX) > window.innerWidth * 0.1 ||
      Math.abs(deltaY) > window.innerHeight * 0.1
    ) {
      onCancel();
    }
  }
  useSwipe(null, cancelLongPressOnSwipe);
  return null;
}
export default LongPressSwipeCancel;
