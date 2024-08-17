import { useSettings } from '@hooks/index';
import { useCallback, useEffect, useState } from 'react';
import NotificationSound from '@assets/notification-pop.mp3';

const notificationAudio = new Audio(NotificationSound);

function useNotificationSound(eventQueue: Message[]) {
  const { settings } = useSettings() ?? {};

  const [shouldAudioPlay, setShouldAudioPlay] = useState(false);
  useEffect(() => {
    if (!settings || !settings.ENABLE_NOTIFICATION_SOUND.value) {
      setShouldAudioPlay(false);
      return;
    }
    notificationAudio.volume = settings.NOTIFICATION_SOUND_VOLUME.value / 100;

    // don't play sound when multiple displayed in queue
    if (eventQueue.length === 2) {
      setShouldAudioPlay(false);
    }
    if (eventQueue.length === 0) {
      setShouldAudioPlay(true);
    }
  }, [settings, eventQueue]);

  const handlePlayNotificationSound = useCallback(() => {
    if (shouldAudioPlay) {
      void notificationAudio.play();
    }
  }, [shouldAudioPlay]);

  return {
    shouldAudioPlay,
    handlePlayNotificationSound,
  };
}
export default useNotificationSound;
