import { NotificationDisplay } from '@components/NotificationDisplay';
import {
  ServerStoreProvider,
  MessageStoreProvider,
  SettingsProvider,
  SocketProvider,
  UserListProvider,
  MessageCursorStoreProvider,
} from '@hooks/index';
import { Outlet } from 'react-router-dom';

function AppScreen() {
  return (
    <SocketProvider>
      <SettingsProvider>
        <ServerStoreProvider>
          <MessageStoreProvider>
            <MessageCursorStoreProvider>
              <UserListProvider>
                <div className="flex min-h-screen">
                  <NotificationDisplay />
                  <Outlet />
                </div>
              </UserListProvider>
            </MessageCursorStoreProvider>
          </MessageStoreProvider>
        </ServerStoreProvider>
      </SettingsProvider>
    </SocketProvider>
  );
}
export default AppScreen;
