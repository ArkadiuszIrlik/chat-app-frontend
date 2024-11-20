import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

function useMessageInput() {
  const [inputStore, setInputStore] = useState<Record<string, string>>({});

  const getInput = useCallback(
    (chatId: string): string | undefined => inputStore[chatId],
    [inputStore],
  );

  const updateInput = useCallback((nextInput: string, chatId: string) => {
    setInputStore((prevStore) => ({ ...prevStore, [chatId]: nextInput }));
  }, []);

  return {
    getInput,
    updateInput,
  };
}

const MessageInputContext = createContext<ReturnType<
  typeof useMessageInput
> | null>(null);

export function MessageInputProvider({ children }: { children: ReactNode }) {
  const messageInputProps = useMessageInput();

  return (
    <MessageInputContext.Provider value={messageInputProps}>
      {children}
    </MessageInputContext.Provider>
  );
}

function MessageInputConsumer() {
  return useContext(MessageInputContext);
}

export default MessageInputConsumer;
