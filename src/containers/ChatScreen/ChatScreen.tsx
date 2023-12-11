import ChatHeader from '@components/ChatHeader/ChatHeader';
import ChatMessage from '@components/ChatMessage/ChatMessage';
import MessageInput from '@components/MessageInput/MessageInput';

function ChatScreen() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-dark-900">
      <ChatHeader userName="Test Chat" />
      <div className="flex flex-col gap-y-6 p-8">
        <ChatMessage
          isMyMessage={false}
          messageText="Hey Billy, long time no see."
        />

        <ChatMessage isMyMessage messageText="What up. You like my chat app?" />
      </div>
      <div className="mt-auto">
        <MessageInput />
      </div>
    </div>
  );
}
export default ChatScreen;
