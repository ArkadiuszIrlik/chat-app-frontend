import formatDate from '@components/ChatMessage/ChatMessage.helpers';
import MessageBody from '@components/ChatMessage/MessageBody';
import MessageImageContainer from '@components/ChatMessage/MessageImageContainer';
import { UserProfileImage } from '@components/UserProfileImage';
import { ReactNode } from 'react';

MessageDisplay.defaultProps = {
  scrollOffset: undefined,
  headerSlot: null,
  areImagesShown: false,
};

function MessageDisplay({
  authorName,
  authorImg,
  messageText,
  postedAt,
  scrollOffset = undefined,
  headerSlot = null,
  areImagesShown = false,
}: {
  authorName: string;
  authorImg: string;
  messageText: string;
  postedAt: Date;
  scrollOffset?: unknown;
  headerSlot?: ReactNode;
  areImagesShown?: boolean;
}) {
  return (
    <div
      // "group" can be used as needed by elements in the headerSlot
      className="group/message-container flex items-start gap-4 rounded-md
       bg-gray-700 px-3 py-2"
      data-scroll-offset={scrollOffset}
    >
      <div className="aspect-square h-10 w-10 shrink-0 grow-0">
        <UserProfileImage image={authorImg} />
      </div>
      <div className="flex w-full min-w-0 max-w-prose flex-col">
        <div className="flex items-baseline gap-2">
          <div className="flex min-w-10 flex-wrap items-baseline gap-x-2">
            <span className="min-w-10 shrink truncate text-blue-400">
              {authorName}
            </span>
            <span className="min-w-14 text-xs text-gray-200">
              {formatDate(postedAt)}
            </span>
          </div>
          {headerSlot}
        </div>
        <MessageBody text={messageText} />
        {areImagesShown && <MessageImageContainer messageText={messageText} />}
      </div>
    </div>
  );
}
export default MessageDisplay;
