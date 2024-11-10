import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

export type CursorValue = number | null;
type MessageCursorStore = Record<string, CursorValue>;

function useStore() {
  const [messageCursorStore, setMessageCursorStore] =
    useState<MessageCursorStore>({});

  const getPreviousCursor = useCallback(
    (chatId: string) => messageCursorStore[chatId],
    [messageCursorStore],
  );

  const updatePreviousCursor = useCallback(
    (chatId: string, cursor: CursorValue) => {
      setMessageCursorStore((mcs) => ({ ...mcs, [chatId]: cursor }));
    },
    [],
  );

  return {
    messageCursorStore,
    getPreviousCursor,
    updatePreviousCursor,
  };
}

const MessageCursorStoreContext = createContext<ReturnType<
  typeof useStore
> | null>(null);

export function MessageCursorStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const chatMessages = useStore();
  return (
    <MessageCursorStoreContext.Provider value={chatMessages}>
      {children}
    </MessageCursorStoreContext.Provider>
  );
}

function useMessageCursorStore() {
  return useContext(MessageCursorStoreContext);
}

export default useMessageCursorStore;
