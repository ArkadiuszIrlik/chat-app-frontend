import Notification from '@components/NotificationDisplay/Notification';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const NOTIFICATION_DISPLAY_TIME = 5000;

function NotificationDisplay({ messageEvents }: { messageEvents: Message[] }) {
  const [eventQueue, setEventQueue] = useState<Message[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Message | null>(null);
  const [previousEvent, setPreviousEvent] = useState<Message | null>(null);
  const { channelId } = useParams();
  const navigate = useNavigate();

  // add latest event to queue
  useEffect(() => {
    const latestEvent = messageEvents[messageEvents.length - 1];
    if (latestEvent === undefined) {
      return;
    }
    // don't display notifications for chat that's already on screen
    if (latestEvent.chatId === channelId) {
      return;
    }
    if (eventQueue.length === 0) {
      if (latestEvent._id !== previousEvent?._id) {
        setEventQueue((eq) => [...eq, latestEvent]);
      }
    } else if (latestEvent._id !== eventQueue[eventQueue.length - 1]._id) {
      setEventQueue((eq) => [...eq, latestEvent]);
    }
  }, [messageEvents, eventQueue, previousEvent, channelId]);

  // display queued events
  useEffect(() => {
    if (eventQueue.length > 0 && currentEvent === null) {
      setCurrentEvent(eventQueue[0]);
      setTimeout(() => {
        setEventQueue((eq) => eq.slice(1));
        setPreviousEvent(eventQueue[0]);
        setCurrentEvent(null);
      }, NOTIFICATION_DISPLAY_TIME);
    }
  }, [eventQueue, currentEvent]);

  const handleClickNotification = useCallback(() => {
    if (currentEvent === null) {
      return;
    }
    const { serverId, chatId } = currentEvent;
    if (serverId && chatId) {
      navigate(`/app/channels/${serverId}/${chatId}`);
    }
  }, [currentEvent, navigate]);

  return currentEvent ? (
    <Notification
      authorName={currentEvent.authorName}
      authorImg={currentEvent.authorImg}
      // channelName={currentEvent.channelName}
      text={currentEvent.text}
      onClick={handleClickNotification}
    />
  ) : null;
}
export default NotificationDisplay;
