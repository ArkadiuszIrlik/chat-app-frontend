import { useCallback, useState } from 'react';

function useToggle({ startState = false }: { startState?: boolean } = {}) {
  const [isActive, setIsActive] = useState(startState);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  const toggle = useCallback(() => {
    setIsActive((ia) => !ia);
  }, []);

  return { isActive, activate, deactivate, toggle };
}
export default useToggle;
