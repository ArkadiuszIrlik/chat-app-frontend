import useFetch from '@hooks/useFetch';
import { UserAccountStatus, UserOnlineStatus } from '@src/types';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface UserAuth {
  _id: string;
  username: string;
  profileImg: string;
  onlineStatus: UserOnlineStatus;
  prefersOnlineStatus: UserOnlineStatus;
  serversIn: Server[];
  accountStatus: UserAccountStatus;
}

function useAuth() {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const isAuthenticated = !!user;
  const isSetupComplete = user?.accountStatus === UserAccountStatus.Approved;

  const handleUserLogin = useCallback((nextUser: UserAuth) => {
    const nextUserProcessed = {
      ...nextUser,
      onlineStatus: nextUser.prefersOnlineStatus,
    };
    setUser(nextUserProcessed);
  }, []);

  const { loginData, loginIsLoading, loginError, login } = useLogin({
    onSuccess: handleUserLogin,
  });

  useEffect(() => {
    if (loginError) {
      setUser(null);
    }
  }, [loginError]);
  const isLoggingIn = loginIsLoading;

  useEffect(() => {
    login();
  }, [login]);

  useEffect(() => {
    if (loginData ?? loginError) {
      setIsFirstLogin(false);
    }
  }, [loginData, loginError]);
  const handleUserLogout = useCallback(() => {
    setUser(null);
  }, []);

  const { logoutData, logoutIsLoading, logoutError, logout } = useLogout({
    onSuccess: handleUserLogout,
  });

  const changeOnlineStatus = useCallback((nextStatus: UserOnlineStatus) => {
    setUser((u) => {
      if (u === null) {
        return u;
      }
      return { ...u, onlineStatus: nextStatus };
    });
  }, []);

  return {
    user,
    isAuthenticated,
    logout,
    logoutData,
    logoutIsLoading,
    logoutError,
    login,
    loginData,
    loginIsLoading,
    loginError,
    isLoggingIn,
    isFirstLogin,
    isSetupComplete,
    changeOnlineStatus,
  };
}

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function AuthConsumer() {
  return useContext(AuthContext);
}

function useLogin({ onSuccess }: { onSuccess: (data: UserAuth) => unknown }) {
  const { refetch, isLoading, data, error } = useFetch<UserAuth>({
    initialUrl: '/users/self',
    method: 'GET',
    onMount: false,
  });

  useEffect(() => {
    if (data && !error) {
      onSuccess(data);
    }
  }, [data, error, onSuccess]);

  return {
    loginData: data,
    loginIsLoading: isLoading,
    loginError: error,
    login: refetch,
  };
}

function useLogout({ onSuccess }: { onSuccess: () => unknown }) {
  const { refetch, isLoading, data, error } = useFetch({
    initialUrl: '/auth/logout',
    method: 'GET',
    onMount: false,
  });

  useEffect(() => {
    if (data && !error) {
      onSuccess();
    }
  }, [data, error, onSuccess]);

  return {
    logoutData: data,
    logoutIsLoading: isLoading,
    logoutError: error,
    logout: refetch,
  };
}

export default AuthConsumer;
