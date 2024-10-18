import { useSettings } from '@hooks/index';
import { useCallback, useEffect, useState } from 'react';

function useLongPressVibration() {
  const { settings } = useSettings() ?? {};

  const [shouldVibrationPlay, setShouldVibrationPlay] = useState(true);
  useEffect(() => {
    if (!settings || !settings.ENABLE_VIBRATION.value || !navigator.vibrate) {
      setShouldVibrationPlay(false);
    }
  }, [settings]);

  const handlePlayVibration = useCallback(() => {
    if (shouldVibrationPlay) {
      navigator.vibrate(30);
    }
  }, [shouldVibrationPlay]);

  return {
    shouldVibrationPlay,
    handlePlayVibration,
  };
}

export default useLongPressVibration;
