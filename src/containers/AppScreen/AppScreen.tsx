import { NotificationDisplay } from '@components/NotificationDisplay';
import {
  ServerStoreProvider,
  MessageStoreProvider,
  SettingsProvider,
  SocketProvider,
  UserListProvider,
} from '@hooks/index';
import { Outlet } from 'react-router-dom';

function AppScreen() {
  return (
    <SocketProvider>
      <SettingsProvider>
        <ServerStoreProvider>
          <MessageStoreProvider>
            <UserListProvider>
              <UserListProvider>
                <div className="flex min-h-screen">
                  <NotificationDisplay />
                  <Outlet />
                </div>
              </UserListProvider>
            </UserListProvider>
          </MessageStoreProvider>
        </ServerStoreProvider>
      </SettingsProvider>
    </SocketProvider>
  );
}
export default AppScreen;
