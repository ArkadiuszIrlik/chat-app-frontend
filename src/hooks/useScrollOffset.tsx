import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

export type ScrollOffsetValue = number | 'bottom';
type ScrollOffsetStore = Record<string, ScrollOffsetValue>;

function useOffset() {
  const [scrollOffsetStore, setScrollOffsetStore] = useState<ScrollOffsetStore>(
    {},
  );

  const getScrollOffset = useCallback<
    (chatId: string) => ScrollOffsetValue | undefined
  >((chatId: string) => scrollOffsetStore[chatId], [scrollOffsetStore]);

  const getMessageScrollOffset = useCallback(
    (message: Message) => message.postedAt.getTime(),
    [],
  );

  const updateScrollOffset = useCallback(
    (chatId: string, nextOffset: ScrollOffsetValue) => {
      setScrollOffsetStore((sos) => ({
        ...sos,
        [chatId]: nextOffset,
      }));
    },
    [],
  );

  return {
    scrollOffsetStore,
    getScrollOffset,
    getMessageScrollOffset,
    updateScrollOffset,
  };
}

const ScrollOffsetContext = createContext<ReturnType<typeof useOffset> | null>(
  null,
);

export function ScrollOffsetProvider({ children }: { children: ReactNode }) {
  const scrollOffsetProps = useOffset();

  return (
    <ScrollOffsetContext.Provider value={scrollOffsetProps}>
      {children}
    </ScrollOffsetContext.Provider>
  );
}

function useScrollOffset() {
  return useContext(ScrollOffsetContext);
}

export default useScrollOffset;
