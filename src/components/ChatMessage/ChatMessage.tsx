import formatDate from '@components/ChatMessage/ChatMessage.helpers';

function ChatMessage({
  authorName,
  authorImg,
  messageText,
  postedAt,
}: {
  authorName: string;
  authorImg: string;
  messageText: string;
  postedAt: Date;
}) {
  return (
    <div className="flex items-start gap-4 rounded-md bg-gray-700 px-3 py-2">
      <img
        src={authorImg}
        alt=""
        className="aspect-square h-10 w-10 rounded-full"
      />
      <div className="flex flex-col">
        <div>
          <span className="mr-2 text-blue-400">{authorName}</span>
          <span className="text-xs text-gray-200">{formatDate(postedAt)}</span>
        </div>
        <p className="max-w-prose break-words">{messageText}</p>
      </div>
    </div>
  );
}
export default ChatMessage;
