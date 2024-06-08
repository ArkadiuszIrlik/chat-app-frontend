import { NotificationDisplay } from '@components/NotificationDisplay';
import {
  SocketEventsProvider,
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
        <SocketEventsProvider>
          <ServerStoreProvider>
            <MessageStoreProvider>
              <UserListProvider>
                <div className="flex min-h-screen">
                  <NotificationDisplay />
                  <Outlet />
                </div>
              </UserListProvider>
            </MessageStoreProvider>
          </ServerStoreProvider>
        </SocketEventsProvider>
      </SettingsProvider>
    </SocketProvider>
  );
}
export default AppScreen;
