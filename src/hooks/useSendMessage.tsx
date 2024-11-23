import { parseNetworkMessages } from '@helpers/data';
import { useMessageStore, useSocket } from '@hooks/index';
import useChatErrors from '@hooks/useChatErrors';
import { createContext, ReactNode, useCallback, useContext } from 'react';

function useHook() {
  const { addToStore, removeClientMsgFromStore } = useMessageStore() ?? {};

  /** Confirms sendMessageOptimistic. Use this when API acknowledges
   * the message sent over websockets.
   * @returns added message on success, null on failure
   * */
  const sendMessageConfirm = useCallback(
    (chatId: string, messageClientId: string, confirmedMessage: Message) => {
      if (!removeClientMsgFromStore || !addToStore) {
        return null;
      }
      removeClientMsgFromStore(chatId, messageClientId);
      addToStore(chatId, [confirmedMessage]);

      return confirmedMessage;
    },
    [addToStore, removeClientMsgFromStore],
  );

  /** Reverts sendMessageOptimistic. Use this when API doesn't
   * acknowledge the sent message.
   * @returns removed client message on success, null on failure
   *  */
  const sendMessageCancel = useCallback(
    (chatId: string, messageClientId: string) => {
      if (!removeClientMsgFromStore) {
        return null;
      }
      const removedMessage = removeClientMsgFromStore(chatId, messageClientId);

      return removedMessage;
    },
    [removeClientMsgFromStore],
  );

  const { sendChatMessage: sendMessageToSocket } = useSocket() ?? {};
  const { addError } = useChatErrors() ?? {};

  /** Initiates the call to send the message over websockets and notifies
   * SendMessageContext and ChatErrorsContext whether the message
   * was sent successfully. */
  const sendMessageToNetwork = useCallback(
    (chatId: string, chatSocketId: string, message: Message) => {
      function onSuccess(confirmedMessage: NetworkMessage) {
        const parsedMessage = parseNetworkMessages(confirmedMessage)[0];
        sendMessageConfirm(chatId, message.clientId!, parsedMessage);
      }

      function onError() {
        sendMessageCancel(chatId, message.clientId!);
        if (addError) {
          addError(`Failed to send message`);
        }
      }

      if (sendMessageToSocket && message.clientId !== undefined) {
        // @ts-expect-error typescript doesn't respect the type guard above
        sendMessageToSocket(message, chatSocketId, onSuccess, onError);
      }
      return undefined;
    },
    [sendMessageConfirm, sendMessageCancel, sendMessageToSocket, addError],
  );

  /** Instantly displays message in chat and sends it over the websockets.
   * @returns sent message on client-side send success
   * */
  const sendMessageOptimistic = useCallback(
    (chatId: string, chatSocketId: string, message: Message) => {
      if (!addToStore) {
        return null;
      }
      addToStore(chatId, [message]);
      sendMessageToNetwork(chatId, chatSocketId, message);
      return message;
    },
    [addToStore, sendMessageToNetwork],
  );

  return {
    sendMessageOptimistic,
  };
}

const SendMessageContext = createContext<ReturnType<typeof useHook> | null>(
  null,
);

export function SendMessageProvider({ children }: { children: ReactNode }) {
  const sendMessageProps = useHook();

  return (
    <SendMessageContext.Provider value={sendMessageProps}>
      {children}
    </SendMessageContext.Provider>
  );
}

function useSendMessage() {
  return useContext(SendMessageContext);
}

export default useSendMessage;
