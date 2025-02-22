import MessageInput from '@components/ChatDisplay/MessageInput/MessageInput';
import { ChatMessage } from '@components/ChatMessage';
import { useChatMessages } from '@hooks/index';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useServerContext } from '@components/ServerView';
import useScrollOffset from '@hooks/useScrollOffset';
import LoadingBlock from '@components/ChatDisplay/LoadingBlock';
import useScrollPosition from '@components/ChatDisplay/useScrollPosition';
import { SyncLoader } from 'react-spinners';
import styleConsts from '@constants/styleConsts';
import useDelay from '@hooks/useDelay';
import ChatErrorDisplay from '@components/ChatDisplay/ChatErrorDisplay';
import useChatErrors from '@hooks/useChatErrors';
import useChatAuth from '@components/ChatDisplay/useChatAuth';

function ChatDisplay() {
  const { activeChannel, server } = useServerContext();
  const { userRoles } = useChatAuth({ server });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { channelId } = useParams();
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);
  const handleLoaded = useCallback(() => {
    setHasLoadedMessages(true);
  }, []);
  const { messages, hasFirstMessage, isLoading, loadMoreMessages } =
    useChatMessages(channelId, handleLoaded);
  const { getMessageScrollOffset } = useScrollOffset() ?? {};
  useScrollPosition({
    channelId,
    chatContainerRef,
    messages,
    isLoadingFromTop: hasLoadedMessages,
  });
  const { errors, removeError } = useChatErrors() ?? {};

  const currentError = errors ? errors[0] : undefined;

  useEffect(() => {
    if (hasLoadedMessages) {
      setHasLoadedMessages(false);
    }
  }, [hasLoadedMessages]);

  return (
    <div className="flex max-h-dvh min-h-dvh min-w-0 grow flex-col">
      <div className="px-3 py-2">
        <h2 className="text-xl">{activeChannel?.name ?? ''}</h2>
      </div>
      <div className="relative flex grow flex-col overflow-hidden">
        <div
          // needs to be positioned (non-static) for offsetTop check inside
          // useScrollPosition to work
          className="relative flex grow flex-col gap-2 overflow-y-auto overscroll-y-contain px-3"
          ref={chatContainerRef}
        >
          {!messages && <LoadingSpinner />}
          {hasFirstMessage && (
            <div className="flex items-center gap-1">
              <div className="h-[2px] grow bg-gray-400" />
              <div className="shrink-0 text-gray-200">Channel created</div>
              <div className="h-[2px] grow bg-gray-400" />
            </div>
          )}
          {!isLoading && messages && messages.length === 0 && (
            <p className="text-center italic text-gray-300">
              It&apos;s looking empty here, let&apos;s get the conversation
              started!
            </p>
          )}
          {messages && !hasFirstMessage && (
            <LoadingBlock
              chatContainerRef={chatContainerRef}
              isLoading={isLoading}
              onLoadMoreMessages={loadMoreMessages}
            />
          )}
          {messages?.map((message) => (
            <ChatMessage
              key={message._id ?? message.clientId}
              postedAt={message.postedAt}
              messageText={message.text}
              authorId={message.author._id}
              authorName={message.author.username}
              authorImg={message.author.profileImg}
              scrollOffset={getMessageScrollOffset?.(message)}
              messageId={message._id}
              chatId={channelId ?? ''}
              chatRoles={userRoles}
            />
          ))}
        </div>
        {currentError && (
          <div className="absolute bottom-0 left-0 right-0 px-3">
            <div className="mx-auto">
              <ChatErrorDisplay
                errorMessage={currentError.message}
                onDismiss={() => {
                  if (removeError) {
                    removeError(currentError.id);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <MessageInput
          chatId={channelId ?? ''}
          channelSocketId={activeChannel?.socketId ?? ''}
        />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  const { isReady } = useDelay({ delay: 300 });

  return isReady ? (
    <div className="mt-5 flex h-10 grow items-center justify-center">
      <SyncLoader
        color={styleConsts.colors.gray[300]}
        speedMultiplier={0.8}
        size={10}
      />
    </div>
  ) : null;
}

export default ChatDisplay;
