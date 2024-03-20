import { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { useAuth } from '@hooks/index';

function SWRConfigProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth()!;
  return (
    <SWRConfig
      value={{
        onError: (error: { status: number }) => {
          if (error.status === 401) {
            void logout();
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
export default SWRConfigProvider;
