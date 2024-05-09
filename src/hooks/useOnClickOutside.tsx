import { MutableRefObject, useEffect } from 'react';

/** Runs provided callback function on "mousedown" events
 * outside the provided list of refs.
 */
function useOnClickOutside(
  onClickOutside: () => void,
  ...refs: MutableRefObject<HTMLElement | null>[]
) {
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      for (let i = 0; i < refs.length; i++) {
        const ref = refs[i];
        if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
          return;
        }
      }
      onClickOutside();
    }

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClickOutside, refs]);
}

export default useOnClickOutside;
