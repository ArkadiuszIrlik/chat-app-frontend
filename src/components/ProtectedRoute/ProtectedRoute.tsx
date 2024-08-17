import { useAuth } from '@hooks/index';
import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated, isLoggingIn, isFirstLogin } = useAuth() ?? {};
  let returnedComponent: ReactNode;

  switch (true) {
    case isAuthenticated:
      returnedComponent = <Outlet />;
      break;
    case isFirstLogin:
    case isLoggingIn:
      returnedComponent = <LoadingScreen />;
      break;
    default:
      returnedComponent = <Navigate to="/login" replace />;
  }

  return returnedComponent;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      Loading...
    </div>
  );
}

export default ProtectedRoute;
