import { getURL } from '@helpers/fetch';
import { UserOnlineStatus } from '@src/types';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface UserAuth {
  _id: string;
  name: string;
  profileImg: string;
  onlineStatus: UserOnlineStatus;
  prefersOnlineStatus: UserOnlineStatus;
  serversIn: Server[];
}

function useAuth() {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  const login = useCallback(async () => {
    setIsLoggingIn(true);
    try {
      const res = await fetch(getURL('/users/self'), {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = Error();
        const apiError = (await res.json()) as BackendError;
        Object.assign(error, apiError);
        throw error;
      }
      const nextUser = (await res.json()) as UserAuth;
      setUser({ ...nextUser, onlineStatus: nextUser.prefersOnlineStatus });
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoggingIn(false);
  }, []);

  const logout = useCallback(async () => {
    const res = await fetch(getURL('/auth/logout'), {
      credentials: 'include',
    });
    if (res.ok) {
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    void (async () => {
      await login();
      setIsFirstLogin(false);
    })();
  }, [login]);

  useEffect(() => {
    if (user !== null) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const changeOnlineStatus = useCallback((nextStatus: UserOnlineStatus) => {
    setUser((u) => {
      if (u === null) {
        return u;
      }
      return { ...u, onlineStatus: nextStatus };
    });
  }, []);

  const authObj = useMemo(
    () => ({
      user,
      isAuthenticated,
      logout,
      login,
      isLoggingIn,
      isFirstLogin,
      changeOnlineStatus,
    }),
    [
      user,
      isAuthenticated,
      logout,
      login,
      isLoggingIn,
      isFirstLogin,
      changeOnlineStatus,
    ],
  );

  return authObj;
}

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function AuthConsumer() {
  return useContext(AuthContext);
}

export default AuthConsumer;
