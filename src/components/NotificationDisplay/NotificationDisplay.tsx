import Notification from '@components/NotificationDisplay/Notification';
import { useSocket } from '@hooks/index';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketEvents } from '@src/types';
import { parseNetworkMessages } from '@helpers/data';
import useNotificationSound from '@components/NotificationDisplay/useNotificationSound';

const NOTIFICATION_DISPLAY_TIME = 5000;

function NotificationDisplay() {
  const { socket } = useSocket() ?? {};
  const [eventQueue, setEventQueue] = useState<Message[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Message | null>(null);
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { handlePlayNotificationSound } = useNotificationSound(eventQueue);

  // add new events to queue
  useEffect(() => {
    if (!socket) {
      return undefined;
    }
    function addToEventQueue(message: NetworkMessage) {
      // don't display notifications for chat that's already on screen
      if (message.chatId === channelId) {
        return;
      }
      const parsedMessage = parseNetworkMessages(message)[0];
      setEventQueue((eq) => [...eq, parsedMessage]);
    }

    socket.on(SocketEvents.ChatMessage, addToEventQueue);
    return () => {
      socket.off(SocketEvents.ChatMessage, addToEventQueue);
    };
  }, [socket, channelId]);

  const dismissCurrentEvent = useCallback(() => {
    setEventQueue((eq) => eq.slice(1));
    setCurrentEvent(null);
  }, []);

  // display queued events
  useEffect(() => {
    if (eventQueue.length > 0 && currentEvent === null) {
      setCurrentEvent(eventQueue[0]);
      setTimeout(() => {
        dismissCurrentEvent();
      }, NOTIFICATION_DISPLAY_TIME);
    }
  }, [eventQueue, currentEvent, dismissCurrentEvent]);

  const handleClickNotification = useCallback(() => {
    if (currentEvent === null) {
      return;
    }
    const { serverId, chatId } = currentEvent;
    if (serverId && chatId) {
      navigate(`/app/channels/${serverId}/${chatId}`);
    }
    dismissCurrentEvent();
  }, [currentEvent, navigate, dismissCurrentEvent]);

  return currentEvent ? (
    <Notification
      authorName={currentEvent.author.username}
      authorImg={currentEvent.author.profileImg}
      text={currentEvent.text}
      onClick={handleClickNotification}
      onDisplayNotification={handlePlayNotificationSound}
    />
  ) : null;
}
export default NotificationDisplay;
