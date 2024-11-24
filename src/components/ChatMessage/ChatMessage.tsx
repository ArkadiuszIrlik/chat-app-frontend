import { ExtendedCSSProperties } from '@src/types';
import MeatballTightIcon from '@assets/meatball-tight-icon.png';
import MessageDisplay from '@components/ChatMessage/MessageDisplay';
import useMessagePanel from '@components/ChatMessage/useMessagePanel';
import MessagePanel from '@components/ChatMessage/MessagePanel';
import { useSettings } from '@hooks/index';
import { ChatRole } from '@components/ChatDisplay/useChatAuth.types';
import useMessageAuth from '@components/ChatMessage/useMessageAuth';
import useMessagePanelOptions from '@components/ChatMessage/useMessagePanelOptions';

function ChatMessage({
  messageId,
  authorId,
  authorName,
  authorImg,
  messageText,
  postedAt,
  chatId,
  chatRoles,
  scrollOffset,
}: {
  messageId: string | undefined;
  authorId: string;
  authorName: string;
  authorImg: string;
  messageText: string;
  postedAt: Date;
  chatId: string;
  chatRoles: ChatRole[];
  scrollOffset: unknown;
}) {
  const {
    isOpenMessagePanel,
    messagePanelContainerRef,
    toggleOpenMessagePanel,
    handleChangePanelOption,
  } = useMessagePanel();
  const { settings } = useSettings() ?? {};
  const { userRoles } = useMessageAuth({ authorId, chatRoles });
  const { allowedOptions } = useMessagePanelOptions({ userRoles });

  return (
    <MessageDisplay
      authorImg={authorImg}
      authorName={authorName}
      messageText={messageText}
      postedAt={postedAt}
      scrollOffset={scrollOffset}
      areImagesShown={settings?.DISPLAY_LINKED_IMAGES.value ?? false}
      headerSlot={
        <div
          className="relative ml-auto self-center"
          ref={messagePanelContainerRef}
        >
          <MessagePanelToggle
            onClick={toggleOpenMessagePanel}
            isPanelOpen={isOpenMessagePanel}
            hidden={allowedOptions.length === 0}
          />
          {isOpenMessagePanel && (
            <MessagePanel
              chatId={chatId}
              messageId={messageId}
              authorName={authorName}
              authorImg={authorImg}
              messageText={messageText}
              postedAt={postedAt}
              optionsToDisplay={allowedOptions}
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

MessagePanelToggle.defaultProps = {
  hidden: false,
};

function MessagePanelToggle({
  isPanelOpen,
  onClick,
  hidden = false,
}: {
  isPanelOpen: boolean;
  onClick: () => void;
  hidden?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isPanelOpen ? 'Close' : 'Open'} message panel`}
      className={`group/settings flex aspect-square 
        items-center justify-center rounded-md p-1 ${hidden ? 'invisible' : ''}
       opacity-0 outline-offset-4 focus-visible:opacity-100
        using-touch:opacity-100 using-mouse:hover:bg-gray-600
     using-mouse:group-hover/message-container:opacity-100`}
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
