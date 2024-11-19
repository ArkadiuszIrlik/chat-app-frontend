import { ExtendedCSSProperties } from '@src/types';
import MeatballTightIcon from '@assets/meatball-tight-icon.png';
import MessageDisplay from '@components/ChatMessage/MessageDisplay';
import useMessagePanel from '@components/ChatMessage/useMessagePanel';
import MessagePanel from '@components/ChatMessage/MessagePanel';

function ChatMessage({
  messageId,
  authorName,
  authorImg,
  messageText,
  postedAt,
  chatId,
  scrollOffset,
}: {
  messageId: string | undefined;
  authorName: string;
  authorImg: string;
  messageText: string;
  postedAt: Date;
  chatId: string;
  scrollOffset: unknown;
}) {
  const {
    isOpenMessagePanel,
    messagePanelContainerRef,
    toggleOpenMessagePanel,
    handleChangePanelOption,
  } = useMessagePanel();

  return (
    <MessageDisplay
      authorImg={authorImg}
      authorName={authorName}
      messageText={messageText}
      postedAt={postedAt}
      scrollOffset={scrollOffset}
      headerSlot={
        <div
          className="relative ml-auto self-center"
          ref={messagePanelContainerRef}
        >
          <MessagePanelToggle
            onClick={toggleOpenMessagePanel}
            isPanelOpen={isOpenMessagePanel}
          />
          {isOpenMessagePanel && (
            <MessagePanel
              chatId={chatId}
              messageId={messageId}
              authorName={authorName}
              authorImg={authorImg}
              messageText={messageText}
              postedAt={postedAt}
              onChangeActiveOption={handleChangePanelOption}
            />
          )}
        </div>
      }
    />
  );
}

const moreOptionsStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${MeatballTightIcon})`,
};

function MessagePanelToggle({
  isPanelOpen,
  onClick,
}: {
  isPanelOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isPanelOpen ? 'Close' : 'Open'} message panel`}
      className="group/settings flex aspect-square
        items-center justify-center rounded-md p-1
       opacity-0 outline-offset-4 focus-visible:opacity-100
        using-touch:opacity-100 using-mouse:hover:bg-gray-600
     using-mouse:group-hover/message-container:opacity-100"
    >
      <div
        style={moreOptionsStyle}
        className="alpha-mask aspect-square h-5 w-5 bg-gray-400
           using-mouse:group-hover/settings:bg-gray-300"
      />
    </button>
  );
}

export default ChatMessage;
