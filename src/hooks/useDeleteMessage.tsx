import { useFetch, useMessageStore } from '@hooks/index';
import useChatErrors from '@hooks/useChatErrors';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface DeletedMessageObject {
  chatId: string;
  message: Message;
}

function useHook() {
  const { addToStore, removeFromStore } = useMessageStore() ?? {};
  const [deletedMessagesConfirmQueue, setDeletedMessagesConfirmQueue] =
    useState<DeletedMessageObject[]>([]);

  /** Instantly removes message from display and starts request to remove it
   * from the API.
   * @returns removed message on client-side remove success, null on failure
   * */
  const deleteMessageOptimistic = useCallback(
    (chatId: string, messageId: string) => {
      if (!removeFromStore) {
        return null;
      }
      const removedMessage = removeFromStore(chatId, messageId);
      if (removedMessage) {
        const deletedMessageObject = {
          chatId: removedMessage.chatId,
          message: removedMessage,
        };
        setDeletedMessagesConfirmQueue((prevQueue) => [
          ...prevQueue,
          deletedMessageObject,
        ]);
      }

      return removedMessage;
    },
    [removeFromStore],
  );

  /** Confirms deleteMessageOptimistic. Use this when API responds with success
   * code.
   * @returns removed message on success, null on failure
   * */
  const deleteMessageConfirm = useCallback(
    (messageId: string) => {
      let messageToConfirm: Message | null = null;
      const nextQueue = deletedMessagesConfirmQueue.reduce<
        typeof deletedMessagesConfirmQueue
      >((queue, entry) => {
        if (entry.message._id === messageId) {
          messageToConfirm = entry.message;
        } else {
          queue.push(entry);
        }
        return queue;
      }, []);
      setDeletedMessagesConfirmQueue(nextQueue);

      return messageToConfirm;
    },
    [deletedMessagesConfirmQueue],
  );

  /** Reverts deleteMessageOptimistic. Use this when API delete request
   * fails. */
  const deleteMessageCancel = useCallback(
    (messageId: string) => {
      if (!addToStore) {
        return null;
      }
      let messageToRevert: Message | null = null;
      let messageChatId: string | null = null;
      const nextQueue = deletedMessagesConfirmQueue.reduce<
        typeof deletedMessagesConfirmQueue
      >((queue, entry) => {
        if (entry.message._id === messageId) {
          messageToRevert = entry.message;
          messageChatId = entry.chatId;
        } else {
          queue.push(entry);
        }
        return queue;
      }, []);
      setDeletedMessagesConfirmQueue(nextQueue);

      if (messageToRevert && messageChatId) {
        addToStore(messageChatId, [messageToRevert]);
      }
      return messageToRevert;
    },
    [deletedMessagesConfirmQueue, addToStore],
  );

  return {
    deletedMessagesConfirmQueue,
    deleteMessageOptimistic,
    deleteMessageConfirm,
    deleteMessageCancel,
  };
}

interface DeleteMessageContextPublicProps {
  deleteMessageOptimistic: ReturnType<
    typeof useHook
  >['deleteMessageOptimistic'];
}
const DeleteMessageContext =
  createContext<DeleteMessageContextPublicProps | null>(null);

export function DeleteMessageProvider({ children }: { children: ReactNode }) {
  const {
    deleteMessageCancel,
    deleteMessageConfirm,
    deletedMessagesConfirmQueue,
    ...deleteMessagePublicProps
  } = useHook();

  return (
    <DeleteMessageContext.Provider value={deleteMessagePublicProps}>
      <MessageRemoverContainer
        deleteQueue={deletedMessagesConfirmQueue}
        onCancelRemove={deleteMessageCancel}
        onConfirmRemove={deleteMessageConfirm}
      />
      {children}
    </DeleteMessageContext.Provider>
  );
}

function useDeleteMessage() {
  return useContext(DeleteMessageContext);
}

function MessageRemoverContainer({
  deleteQueue,
  onConfirmRemove,
  onCancelRemove,
}: {
  deleteQueue: DeletedMessageObject[];
  onConfirmRemove: (messageId: string) => void;
  onCancelRemove: (messageId: string) => void;
}) {
  return (
    <>
      {deleteQueue.map((el) => (
        <MessageRemover
          chatId={el.chatId}
          messageId={el.message._id}
          onConfirmRemove={onConfirmRemove}
          onCancelRemove={onCancelRemove}
          key={el.message._id ?? el.message.clientId}
        />
      ))}
    </>
  );
}

/** Following client calls to optimistically delete messages from display,
 * this component makes the actual API calls to delete the message from
 * the database and notifies DeleteMessageContext and ChatErrorsContext
 * about the result of those operations.
 */
function MessageRemover({
  chatId,
  messageId,
  onConfirmRemove,
  onCancelRemove,
}: {
  chatId: string;
  messageId: string | undefined;
  onConfirmRemove: (messageId: string) => void;
  onCancelRemove: (messageId: string) => void;
}) {
  const { addError } = useChatErrors() ?? {};
  const { refetch, data, isLoading, hasError, error } = useFetch({
    onMount: false,
    initialUrl: `/chat/${chatId}/messages/${messageId}`,
    method: 'DELETE',
  });

  // makes sure fetch doesn't happen for client-only messages
  useEffect(() => {
    if (messageId) {
      refetch();
    }
  }, [messageId, refetch]);

  // on successful API delete
  useEffect(() => {
    if (data && !isLoading && !hasError) {
      if (messageId) {
        onConfirmRemove(messageId);
      }
    }
  }, [data, isLoading, hasError, messageId, onConfirmRemove]);

  // on failed API delete
  useEffect(() => {
    if (error) {
      if (messageId) {
        onCancelRemove(messageId);
      }
      if (!addError) {
        return;
      }
      if (error.status === 403) {
        addError(`You're not allowed to remove this message.`);
        return;
      }
      if (error.status === 404) {
        addError(`Message couldn't be found. Try refreshing.`);
        return;
      }
      addError('Failed to remove message.');
    }
  }, [error, messageId, onCancelRemove, addError]);

  return null;
}

export default useDeleteMessage;
