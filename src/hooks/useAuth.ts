import { getURL } from '@helpers/fetch';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UserAuth {
  _id: string;
  name: string;
}

function useAuth() {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async () => {
    try {
      const res = await fetch(getURL('/auth/user'));
      const nextUser = (await res.json()) as UserAuth;
      setUser(nextUser);
    } catch {
      setUser(null);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    // eslint-disable-next-line no-void
    void login();
  }, [login]);

  useEffect(() => {
    if (user !== null) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const authObj = useMemo(
    () => ({
      user,
      isAuthenticated,
      logout,
      login,
    }),
    [user, isAuthenticated, logout, login],
  );
  return authObj;
}

export default useAuth;
