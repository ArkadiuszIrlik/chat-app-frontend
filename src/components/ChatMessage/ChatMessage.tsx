function ChatMessage({
  isMyMessage,
  messageText,
}: {
  isMyMessage: boolean;
  messageText: string;
}) {
  return (
    <div
      className={`self-start rounded-lg bg-dark-600 p-4 text-white ${
        isMyMessage
          ? 'self-end rounded-ee-none bg-primary-600'
          : 'self-start rounded-es-none bg-dark-600'
      }`}
    >
      <p className="max-w-prose break-words">{messageText}</p>
    </div>
  );
}
export default ChatMessage;
