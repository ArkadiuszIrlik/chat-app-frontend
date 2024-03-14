import { useState } from 'react';

interface UserAuth {
  _id: string;
  name: string;
}

function useAuth() {
  const [user, setUser] = useState<UserAuth | null>(null);

  function login(id: string, name: string) {
    setUser({ _id: id, name });
  }

  function logout() {
    setUser(null);
  }

  function isAuthenticated() {
    return user !== null;
  }
  return {
    user,
    isAuthenticated,
    logout,
    login,
  };
}

export default useAuth;
