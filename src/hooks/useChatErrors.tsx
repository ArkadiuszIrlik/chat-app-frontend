import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ChatError {
  id: string;
  message: string;
}

function useHook() {
  const [errors, setErrors] = useState<ChatError[]>([]);

  const addError = useCallback((message: ChatError['message']) => {
    const nextError = {
      id: crypto.randomUUID(),
      message,
    };
    setErrors((prevErrors) => [...prevErrors, nextError]);
  }, []);

  const removeError = useCallback(
    (errorId: string) => {
      let errorToRemove: ChatError | null = null;
      const nextErrors = errors.reduce<typeof errors>((errs, currentErr) => {
        if (currentErr.id === errorId) {
          errorToRemove = currentErr;
        } else {
          errs.push(currentErr);
        }
        return errs;
      }, []);
      setErrors(nextErrors);

      return errorToRemove as ChatError | null;
    },
    [errors],
  );

  return { errors, addError, removeError };
}

const ChatErrorsContext = createContext<ReturnType<typeof useHook> | null>(
  null,
);

export function ChatErrorsProvider({ children }: { children: ReactNode }) {
  const chatErrorProps = useHook();
  return (
    <ChatErrorsContext.Provider value={chatErrorProps}>
      {children}
    </ChatErrorsContext.Provider>
  );
}

function useChatErrors() {
  return useContext(ChatErrorsContext);
}

export default useChatErrors;
