import useChatErrors from '@hooks/useChatErrors';
import useDeleteMessage from '@hooks/useDeleteMessage';
import { useCallback } from 'react';

function useDelete({
  chatId,
  messageId,
}: {
  chatId: string;
  messageId: string | undefined;
}) {
  const { deleteMessageOptimistic } = useDeleteMessage() ?? {};
  const { addError } = useChatErrors() ?? {};

  const deleteMessage = useCallback(() => {
    // for client-only messages
    if (!messageId) {
      if (addError) {
        addError(
          `Can't delete the message. Wait a moment or refresh and try again.`,
        );
      }
      return;
    }
    if (!deleteMessageOptimistic) {
      if (addError) {
        addError(`Couldn't delete the message.`);
      }
      return;
    }
    deleteMessageOptimistic(chatId, messageId);
  }, [chatId, messageId, addError, deleteMessageOptimistic]);

  return { deleteMessage };
}

export default useDelete;
