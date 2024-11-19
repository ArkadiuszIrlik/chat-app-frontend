import { ModalContainer } from '@components/ModalContainer';
import MessageDisplay from '@components/ChatMessage/MessageDisplay';
import useDelete from '@components/ChatMessage/useDelete';
import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';

const dialogBodyText = 'Are you sure you want to delete the following message:';

function DeleteMessageModal({
  isOpen,
  chatId,
  messageId,
  authorName,
  authorImg,
  messageText,
  postedAt,
  onCloseModal,
}: {
  isOpen: boolean;
  chatId: string;
  messageId: string | undefined;
  authorName: string;
  authorImg: string;
  messageText: string;
  postedAt: Date;
  onCloseModal: () => void;
}) {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      ariaLabel="Confirm delete message"
      ariaDescription={dialogBodyText}
      closeOnClickOutside
      darkenBackdrop
    >
      <ModalContent
        chatId={chatId}
        messageId={messageId}
        authorName={authorName}
        authorImg={authorImg}
        messageText={messageText}
        postedAt={postedAt}
        onCloseModal={onCloseModal}
      />
    </ModalContainer>
  );
}

function ModalContent({
  chatId,
  messageId,
  authorName,
  authorImg,
  messageText,
  postedAt,
  onCloseModal,
}: {
  chatId: string;
  messageId: string | undefined;
  authorName: string;
  authorImg: string;
  messageText: string;
  postedAt: Date;
  onCloseModal: () => void;
}) {
  const { deleteMessage } = useDelete({ chatId, messageId });

  return (
    <div>
      <h1 className="mb-3 text-gray-300">Delete Message</h1>
      <p className="mb-2">{dialogBodyText}</p>
      <div className="mb-4 max-h-32 overflow-y-auto overscroll-contain">
        <MessageDisplay
          authorName={authorName}
          authorImg={authorImg}
          messageText={messageText}
          postedAt={postedAt}
          scrollOffset={null}
        />
      </div>
      <div className="flex items-center justify-center gap-10">
        <button
          type="button"
          onClick={onCloseModal}
          className="block w-24 text-gray-100 underline-offset-2 hover:underline"
        >
          Cancel
        </button>
        <div className="w-24">
          <DestructivePrimaryButton
            type="button"
            onClickHandler={() => {
              deleteMessage();
              onCloseModal();
            }}
          >
            Delete
          </DestructivePrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default DeleteMessageModal;
