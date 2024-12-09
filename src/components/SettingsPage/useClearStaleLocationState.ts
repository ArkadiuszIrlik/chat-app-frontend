import { useEffect, useRef } from 'react';
import { Location, useNavigate } from 'react-router-dom';

function useClearStaleLocationState({
  location,
  timeToStale,
  once = true,
}: {
  location: Location<unknown>;
  /** Time in ms until link state should be considered stale */
  timeToStale: number;
  /** Should the clear function run only once or reset every time new props
   * are passed
   */
  once?: boolean;
}) {
  const navigate = useNavigate();
  const hasClearedRef = useRef(false);

  useEffect(() => {
    function clearState() {
      if (once && hasClearedRef.current) {
        return;
      }
      navigate(location, {
        replace: true,
        state: null,
      });
      hasClearedRef.current = true;
    }

    const timeoutId = setTimeout(clearState, timeToStale);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location, timeToStale, once, navigate]);
}

export default useClearStaleLocationState;
