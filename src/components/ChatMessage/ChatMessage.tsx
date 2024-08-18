import formatDate from '@components/ChatMessage/ChatMessage.helpers';
import MessageBody from '@components/ChatMessage/MessageBody';
import { UserProfileImage } from '@components/UserProfileImage';

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
      <div className="aspect-square h-10 w-10 shrink-0 grow-0">
        <UserProfileImage image={authorImg} />
      </div>
      <div className="flex flex-col">
        <div>
          <span className="mr-2 text-blue-400">{authorName}</span>
          <span className="text-xs text-gray-200">{formatDate(postedAt)}</span>
        </div>
        <MessageBody text={messageText} />
      </div>
    </div>
  );
}
export default ChatMessage;
