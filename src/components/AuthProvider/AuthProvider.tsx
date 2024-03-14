import useAuth from '@hooks/useAuth';
import { ReactNode, createContext } from 'react';

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
export default AuthProvider;
