import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NavigateAwayFromAppScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('channels', { replace: true });
  }, [navigate]);
  return null;
}
export default NavigateAwayFromAppScreen;
