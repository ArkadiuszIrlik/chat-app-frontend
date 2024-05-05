import { NotificationDisplay } from '@components/NotificationDisplay';
import {
  useAuth,
  SocketProvider,
} from '@hooks/index';
import ServerSelectBar from '@containers/AppScreen/ServerSelectBar';
import { Outlet } from 'react-router-dom';

function AppScreen() {
  const { logout, user } = useAuth()!;

  return (
    <SocketProvider>
              <div className="flex min-h-screen">
                <NotificationDisplay />
                <button
                  type="button"
                  className="bg-red-500 p-4"
                  onClick={() => {
                    void logout();
                  }}
                >
                  Log Out
                </button>
                <ServerSelectBar serverList={user?.serversIn ?? []} />
                <Outlet />
              </div>
    </SocketProvider>
  );
}
export default AppScreen;
