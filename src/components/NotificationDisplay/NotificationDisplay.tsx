import Notification from '@components/NotificationDisplay/Notification';
import { useSocketEvents } from '@hooks/index';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientEvents } from '@src/types';

const NOTIFICATION_DISPLAY_TIME = 5000;

function NotificationDisplay() {
  const [eventQueue, setEventQueue] = useState<Message[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Message | null>(null);
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { messageEmitter } = useSocketEvents()!;
  // add new events to queue
  useEffect(() => {
    function addToEventQueue(newEvent: Message) {
      // don't display notifications for chat that's already on screen
      if (newEvent.chatId === channelId) {
        return;
      }
      setEventQueue((eq) => [...eq, newEvent]);
    }

    messageEmitter.on(ClientEvents.ChatMessage, addToEventQueue);

    return () => {
      messageEmitter.off(ClientEvents.ChatMessage, addToEventQueue);
    };
  }, [messageEmitter, channelId]);

  // display queued events
  useEffect(() => {
    if (eventQueue.length > 0 && currentEvent === null) {
      setCurrentEvent(eventQueue[0]);
      setTimeout(() => {
        setEventQueue((eq) => eq.slice(1));
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
