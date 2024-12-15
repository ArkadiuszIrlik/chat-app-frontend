import { getURL, HttpError } from '@helpers/fetch';
import { UserOnlineStatus } from '@src/types';
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
        const data = (await res.json()) as BackendError;
        const error = new HttpError('Error during login', data, res.status);
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

  return {
    user,
    isAuthenticated,
    logout,
    login,
    isLoggingIn,
    isFirstLogin,
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

export default AuthConsumer;
