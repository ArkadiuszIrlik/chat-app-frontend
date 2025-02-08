import { NotificationDisplay } from '@components/NotificationDisplay';
import {
  ServerStoreProvider,
  MessageStoreProvider,
  SettingsProvider,
  SocketProvider,
  UserListProvider,
  MessageCursorStoreProvider,
  MessageInputProvider,
} from '@hooks/index';
import { ChatErrorsProvider } from '@hooks/useChatErrors';
import { DeleteMessageProvider } from '@hooks/useDeleteMessage';
import { ScrollOffsetProvider } from '@hooks/useScrollOffset';
import { SendMessageProvider } from '@hooks/useSendMessage';
import { Outlet } from 'react-router-dom';

function AppScreen() {
  return (
    <SocketProvider>
      <SettingsProvider>
        <ServerStoreProvider>
          <ChatErrorsProvider>
            <MessageStoreProvider>
              <SendMessageProvider>
                <DeleteMessageProvider>
                  <MessageCursorStoreProvider>
                    <UserListProvider>
                      <ScrollOffsetProvider>
                        <MessageInputProvider>
                          <div className="flex min-h-dvh">
                            <NotificationDisplay />
                            <Outlet />
                          </div>
                        </MessageInputProvider>
                      </ScrollOffsetProvider>
                    </UserListProvider>
                  </MessageCursorStoreProvider>
                </DeleteMessageProvider>
              </SendMessageProvider>
            </MessageStoreProvider>
          </ChatErrorsProvider>
        </ServerStoreProvider>
      </SettingsProvider>
    </SocketProvider>
  );
}
export default AppScreen;
