// import useSocketStatus from '@hooks/useSocketStatus';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@hooks/useAuth';

function App() {
  // const isSocketConnected = useSocketStatus();
  return (
    <AuthProvider>
      <div className="bg-gray-800">
        <div
          className="mx-auto flex min-h-screen flex-col overflow-clip font-ui
         text-white lg:mx-[8%] xl:mx-[14%] 2xl:mx-auto 2xl:max-w-[1800px]"
        >
          <Outlet />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
