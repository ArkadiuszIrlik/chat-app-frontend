import MessageInput from '@components/ChatDisplay/MessageInput';
import { ChatMessage } from '@components/ChatMessage';
import { useChatMessages } from '@hooks/index';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useServerContext } from '@components/ServerView';
import useScrollOffset from '@hooks/useScrollOffset';
import useScrollPosition from '@components/ChatDisplay/useScrollPosition';

function ChatDisplay() {
  const { activeChannel } = useServerContext();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { channelId } = useParams();
  const { messages, isLoading } = useChatMessages(channelId);
  const { getMessageScrollOffset } = useScrollOffset() ?? {};
  useScrollPosition({ channelId, chatContainerRef, messages });

  return (
    <div className="flex max-h-dvh min-h-dvh min-w-0 grow flex-col">
      <div className="px-3 py-2">
        <h2 className="text-xl">{activeChannel?.name ?? ''}</h2>
      </div>
      <div className="flex grow flex-col overflow-hidden">
        <div
          // needs to be positioned (non-static) for offsetTop check inside
          // useScrollPosition to work
          className="relative flex grow flex-col gap-2 overflow-y-auto overscroll-y-contain px-3"
          ref={chatContainerRef}
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
                scrollOffset={getMessageScrollOffset?.(message)}
              />
            ))}
        </div>
      </div>
      <div className="mt-auto">
        <MessageInput channelSocketId={activeChannel?.socketId ?? ''} />
      </div>
    </div>
  );
}
export default ChatDisplay;
