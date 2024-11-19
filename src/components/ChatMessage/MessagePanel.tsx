import { ExtendedCSSProperties } from '@src/types';
import TrashIcon from '@assets/trash-icon.png';
import { useEffect, useState } from 'react';
import DeleteMessageModal from '@components/ChatMessage/DeleteMessageModal';

const removeStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${TrashIcon})`,
};

enum PanelOptionsIds {
  DeleteMessage = 'delete_message',
}

function MessagePanel({
  chatId,
  messageId,
  authorName,
  authorImg,
  messageText,
  postedAt,
  onChangeActiveOption,
}: {
  chatId: string;
  messageId: string | undefined;
  authorName: string;
  authorImg: string;
  messageText: string;
  postedAt: Date;
  onChangeActiveOption: (activeOption: PanelOptionsIds | null) => void;
}) {
  const [activeOptionId, setActiveOptionId] = useState<PanelOptionsIds | null>(
    null,
  );
  useEffect(() => {
    onChangeActiveOption(activeOptionId);
  }, [activeOptionId, onChangeActiveOption]);

  return (
    <div
      className="absolute right-0 top-0 min-h-10 min-w-48 max-w-72
       overscroll-contain rounded-lg bg-gray-800 p-2"
    >
      <button
        type="button"
        onClick={() => {
          setActiveOptionId(PanelOptionsIds.DeleteMessage);
        }}
        className="group/delete flex w-full items-center gap-4 rounded-lg
         px-2 py-1 using-mouse:hover:bg-gray-700"
      >
        <div
          className="alpha-mask aspect-square h-4 w-4 shrink-0 grow-0 bg-red-600"
          style={removeStyle}
        />
        <span className="min-w-0 text-red-300">Delete Message</span>
      </button>
      <DeleteMessageModal
        isOpen={activeOptionId === PanelOptionsIds.DeleteMessage}
        chatId={chatId}
        messageId={messageId}
        authorName={authorName}
        authorImg={authorImg}
        messageText={messageText}
        postedAt={postedAt}
        onCloseModal={() => setActiveOptionId(null)}
      />
    </div>
  );
}

export default MessagePanel;
