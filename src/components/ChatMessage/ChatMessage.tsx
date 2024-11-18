import formatDate from '@components/ChatMessage/ChatMessage.helpers';
import MessageBody from '@components/ChatMessage/MessageBody';
import MessageImageContainer from '@components/ChatMessage/MessageImageContainer';
import { UserProfileImage } from '@components/UserProfileImage';

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
    <div
      className="flex items-start gap-4 rounded-md bg-gray-700 px-3 py-2"
      data-scroll-offset={scrollOffset}
    >
      <div className="aspect-square h-10 w-10 shrink-0 grow-0">
        <UserProfileImage image={authorImg} />
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-baseline gap-2">
          <div className="flex min-w-10 flex-wrap items-baseline gap-x-2">
            <span className="min-w-10 shrink truncate text-blue-400">
              {authorName}
            </span>
            <span className="min-w-14 text-xs text-gray-200">
              {formatDate(postedAt)}
            </span>
          </div>
        </div>
        <MessageBody text={messageText} />
        <MessageImageContainer messageText={messageText} />
      </div>
    </div>
  );
}
export default ChatMessage;
