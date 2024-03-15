import { getURL } from '@helpers/fetch';
import { useEffect, useState } from 'react';

interface UserAuth {
  _id: string;
  name: string;
}

function useAuth() {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-void
    void login();
  }, []);

  useEffect(() => {
    if (user !== null) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  async function login() {
    try {
      const res = await fetch(getURL('/auth/user'));
      const nextUser = (await res.json()) as UserAuth;
      setUser(nextUser);
    } catch {
      setUser(null);
    }
  }

  function logout() {
    setUser(null);
  }

  return {
    user,
    isAuthenticated,
    logout,
    login,
  };
}

export default useAuth;
