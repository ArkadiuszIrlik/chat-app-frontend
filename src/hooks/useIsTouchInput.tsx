import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

function useIsTouchInput() {
  const [isUsingTouch, setIsUsingTouch] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | number>(0);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    if (pointerQuery.matches) {
      setIsUsingTouch(true);
    }
  }, []);

  useEffect(() => {
    let isTouch = false;

    function setTouchInput() {
      clearTimeout(timeoutRef.current);
      isTouch = true;
      document.documentElement.classList.remove('is-using-mouse');
      document.documentElement.classList.add('is-using-touch');
      setIsUsingTouch(true);

      const isTouchTimer = setTimeout(() => {
        isTouch = false;
      }, 1000);
      timeoutRef.current = isTouchTimer;
    }

    function setMouseInput() {
      // isTouch ensures the "mouseover" event wasn't triggered by a touch
      if (!isTouch) {
        document.documentElement.classList.remove('is-using-touch');
        document.documentElement.classList.add('is-using-mouse');
        setIsUsingTouch(false);
      }
    }

    document.addEventListener('touchstart', setTouchInput, false);
    document.addEventListener('mouseover', setMouseInput, false);

    return () => {
      document.removeEventListener('touchstart', setTouchInput, false);
      document.removeEventListener('mouseover', setMouseInput, false);
    };
  }, []);

  return isUsingTouch;
}

const IsTouchInputContext = createContext(false);

export function IsTouchInputProvider({ children }: { children: ReactNode }) {
  const isTouchInput = useIsTouchInput();

  return (
    <IsTouchInputContext.Provider value={isTouchInput}>
      {children}
    </IsTouchInputContext.Provider>
  );
}

function IsTouchInputConsumer() {
  return useContext(IsTouchInputContext);
}

export default IsTouchInputConsumer;
