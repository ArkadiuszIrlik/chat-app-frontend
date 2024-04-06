import MessageInput from '@components/ChatDisplay/MessageInput';
// import { MessageInput } from '@components/MessageInput';
import { ChatMessage } from '@components/ChatMessage';
import { genericFetcherCredentials } from '@helpers/fetch';
import { useMessageEvents } from '@hooks/index';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import parseMessageDates from '@helpers/data';

function orderMessages(messageList: Message[]) {
  const nextMessageList = [...messageList];
  nextMessageList.sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime());
  return nextMessageList;
}

function autoScrollToBottom(containerRef: RefObject<HTMLElement>) {
  if (containerRef.current === null) {
    return;
  }
  const { offsetHeight, scrollHeight, scrollTop } = containerRef.current;
  if (scrollHeight <= scrollTop + offsetHeight + 100) {
    containerRef.current.scrollTo(0, scrollHeight);
  }
}

function ChatDisplay({
  channelName,
  channelSocketId,
  // messagesId,
  chatId,
}: {
  channelName: string;
  channelSocketId: string;
  // messagesId: string;
  chatId: string;
}) {
  const { messageEmitter } = useMessageEvents()!;
  const { channelId } = useParams();
  const chatContainer = useRef<HTMLDivElement>(null);
  // const { data: messages } = useSWR<Message[]>(
  //   `/messages/${messagesId}`,
  //   genericFetcherCredentials,
  // );
  // console.log(channelSocketId);

  console.log(chatId);
  const { data, error, isLoading } = useSWR<Message[], BackendError>(
    `/chat/${channelId}`,
    genericFetcherCredentials,
  );
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (isLoading || error !== undefined || data === undefined) {
      return;
    }
    parseMessageDates(data);
    setMessages((msgs) => orderMessages([...data, ...msgs]));
  }, [data, error, isLoading]);

  useEffect(() => {
    function addToMessages(newEvent: Message) {
      if (newEvent.chatId === channelId) {
        setMessages((msgs) => [...msgs, newEvent]);
      }
    }

    messageEmitter.on('new message', addToMessages);

    return () => {
      messageEmitter.off('new message', addToMessages);
    };
  }, [messageEmitter, channelId]);

  useEffect(() => {
    autoScrollToBottom(chatContainer);
  }, [messages]);

  return (
    <div className="flex max-h-screen flex-1 flex-col">
      <div className="px-3 py-2">
        <h2 className="text-xl">{channelName}</h2>
      </div>
      <div className="flex grow flex-col overflow-hidden">
        <div
          className="flex grow flex-col gap-2 overflow-y-auto px-3"
          ref={chatContainer}
        >
          {messages?.map((message) => (
            <ChatMessage
              key={message._id}
              postedAt={message.postedAt}
              messageText={message.text}
              authorName={message.authorName}
              authorImg={message.authorImg}
            />
          ))}
        </div>
      </div>
      <div />
      <div>
        <MessageInput channelSocketId={channelSocketId} />
      </div>
    </div>
  );
}
export default ChatDisplay;
