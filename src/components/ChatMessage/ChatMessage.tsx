import MessageDisplay from '@components/ChatMessage/MessageDisplay';

function ChatMessage({
  authorName,
  authorImg,
  messageText,
  postedAt,
  scrollOffset,
}: {
  authorName: string;
  authorImg: string;
  messageText: string;
  postedAt: Date;
  scrollOffset: unknown;
}) {
  return (
    <MessageDisplay
      authorImg={authorImg}
      authorName={authorName}
      messageText={messageText}
      postedAt={postedAt}
      scrollOffset={scrollOffset}
    />
  );
}
export default ChatMessage;
