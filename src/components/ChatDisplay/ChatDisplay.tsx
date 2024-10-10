import MessageInput from '@components/ChatDisplay/MessageInput';
import { ChatMessage } from '@components/ChatMessage';
import { useChatMessages } from '@hooks/index';
import { RefObject, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useServerContext } from '@components/ServerView';

function autoScrollToBottom(containerRef: RefObject<HTMLElement>) {
  if (containerRef.current === null) {
    return;
  }
  const { offsetHeight, scrollHeight, scrollTop } = containerRef.current;
  if (scrollHeight <= scrollTop + offsetHeight + 100) {
    containerRef.current.scrollTo(0, scrollHeight);
  }
}

function ChatDisplay() {
  const { activeChannel } = useServerContext();
  const chatContainer = useRef<HTMLDivElement>(null);
  const { channelId } = useParams();
  const { messages, isLoading } = useChatMessages(channelId);

  useEffect(() => {
    autoScrollToBottom(chatContainer);
  }, [messages]);

  return (
    <div className="flex max-h-screen flex-1 flex-col">
      <div className="px-3 py-2">
        <h2 className="text-xl">{activeChannel?.name ?? ''}</h2>
      </div>
      <div className="flex grow flex-col overflow-hidden">
        <div
          className="flex grow flex-col gap-2 overflow-y-auto px-3"
          ref={chatContainer}
        >
          {!isLoading && messages.length === 0 && (
            <p className="text-center italic text-gray-300">
              It&apos;s empty here, how about you say hi?
            </p>
          )}
          {!isLoading &&
            messages.map((message) => (
              <ChatMessage
                key={message._id ?? message.clientId}
                postedAt={message.postedAt}
                messageText={message.text}
                authorName={message.author.username}
                authorImg={message.author.profileImg}
              />
            ))}
        </div>
      </div>
      <div />
      <div>
        <MessageInput channelSocketId={activeChannel?.socketId ?? ''} />
      </div>
    </div>
  );
}
export default ChatDisplay;
