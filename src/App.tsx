// import useSocketStatus from '@hooks/useSocketStatus';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@hooks/useAuth';
import { SWRConfigProvider } from '@components/SWRConfigProvider';
import { IsTouchInputProvider } from '@hooks/useIsTouchInput';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    function handlePreloadError() {
      window.location.reload();
    }
    window.addEventListener('vite:preloadError', handlePreloadError);

    return () => {
      window.removeEventListener('vite:preloadError', handlePreloadError);
    };
  }, []);

  // const isSocketConnected = useSocketStatus();
  return (
    <AuthProvider>
      <IsTouchInputProvider>
        <SWRConfigProvider>
          <div className="bg-gray-800">
            <div
              className="mx-auto flex min-h-screen flex-col overflow-clip font-ui
          text-white lg:mx-[8%] xl:mx-[14%] 2xl:mx-auto 2xl:max-w-[1800px]"
            >
              <Outlet />
            </div>
          </div>
        </SWRConfigProvider>
      </IsTouchInputProvider>
    </AuthProvider>
  );
}

export default App;
