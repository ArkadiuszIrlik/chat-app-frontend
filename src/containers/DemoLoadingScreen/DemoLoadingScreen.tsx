import styleConsts from '@constants/styleConsts';
import { genericFetcherCredentials, HttpError } from '@helpers/fetch';
import { useAuth } from '@hooks/index';
import useDelay from '@hooks/useDelay';
import useExponentialBackoff from '@hooks/useExponentialBackoff';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import useSWR from 'swr';

function DemoLoadingScreen() {
  const { isReady } = useDelay({ delay: 300 });
  const {
    data: demoData,
    error: demoError,
    mutate: fetchDemo,
  } = useSWR<{ message: string }, HttpError>(
    '/demo',
    genericFetcherCredentials,
    { revalidateOnMount: false },
  );
  const [isDemoUser, setIsDemoUser] = useState(false);

  const { retryCount: retryCountLogin, retry: retryLogin } =
    useExponentialBackoff({
      jitter: true,
    });
  const { retryCount: retryCountLogout, retry: retryLogout } =
    useExponentialBackoff({
      jitter: true,
    });
  const { login, loginError, logout, logoutError, isAuthenticated } =
    useAuth() ?? {};

  useEffect(() => {
    if (!logout) {
      // display error
      return;
    }
    if (isDemoUser) {
      return;
    }
    if (isAuthenticated) {
      void logout();
      return;
    }
    void fetchDemo();
  }, [
    isDemoUser,
    isAuthenticated,
    retryCountLogin,
    retryCountLogout,
    logout,
    fetchDemo,
  ]);

  useEffect(() => {
    if (logoutError) {
      retryLogout();
    }
  }, [logoutError, retryLogout]);

  useEffect(() => {
    if (!login) {
      // display error
      return;
    }
    if (demoData && !demoError) {
      void login();
      setIsDemoUser(true);
    }
  }, [demoData, demoError, login]);

  useEffect(() => {
    if (loginError) {
      retryLogin();
    }
  }, [loginError, retryLogin]);

  const navigate = useNavigate();
  useEffect(() => {
    if (isDemoUser && isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isDemoUser, isAuthenticated, navigate]);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      {isReady && (
        <div>
          <div className="mb-5 flex h-10 grow items-center justify-center">
            <SyncLoader
              color={styleConsts.colors.gray[300]}
              speedMultiplier={0.8}
              size={10}
            />
          </div>
          <span className="text-gray-100">
            {demoError ? 'Retrying...' : 'Setting up your demo...'}
          </span>
        </div>
      )}
    </div>
  );
}

export default DemoLoadingScreen;
