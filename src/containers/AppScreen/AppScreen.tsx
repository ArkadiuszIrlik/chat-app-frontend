import { NotificationDisplay } from '@components/NotificationDisplay';
import {
  ServerStoreProvider,
  MessageStoreProvider,
  SettingsProvider,
  SocketProvider,
  UserListProvider,
  MessageCursorStoreProvider,
} from '@hooks/index';
import { ChatErrorsProvider } from '@hooks/useChatErrors';
import { DeleteMessageProvider } from '@hooks/useDeleteMessage';
import { Outlet } from 'react-router-dom';

function AppScreen() {
  return (
    <SocketProvider>
      <SettingsProvider>
        <ServerStoreProvider>
          <ChatErrorsProvider>
            <MessageStoreProvider>
              <DeleteMessageProvider>
                <MessageCursorStoreProvider>
                  <UserListProvider>
                    <div className="flex min-h-screen">
                      <NotificationDisplay />
                      <Outlet />
                    </div>
                  </UserListProvider>
                </MessageCursorStoreProvider>
              </DeleteMessageProvider>
            </MessageStoreProvider>
          </ChatErrorsProvider>
        </ServerStoreProvider>
      </SettingsProvider>
    </SocketProvider>
  );
}
export default AppScreen;
