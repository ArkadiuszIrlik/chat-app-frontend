import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

function useMessageInput() {
  const [input, setInput] = useState('');

  const handleUpdateInput = useCallback((nextInput: string) => {
    setInput(nextInput);
  }, []);

  return {
    input,
    handleUpdateInput,
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
