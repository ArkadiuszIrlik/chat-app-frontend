import { NotificationDisplay } from '@components/NotificationDisplay';
import { useAuth, useSocket, MessageEventsProvider } from '@hooks/index';
import ServerSelectBar from '@containers/AppScreen/ServerSelectBar';
import { Outlet } from 'react-router-dom';

function AppScreen() {
  const { logout, user } = useAuth()!;
  const { messageEvents } = useSocket();

  return (
    <MessageEventsProvider>
      <div className="flex min-h-screen">
        <NotificationDisplay messageEvents={messageEvents} />
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
    </MessageEventsProvider>
  );
}
export default AppScreen;
