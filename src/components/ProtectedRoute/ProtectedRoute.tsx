import { useAuth } from '@hooks/index';
import { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated, isLoggingIn, isFirstLogin, isSetupComplete } =
    useAuth() ?? {};
  const location = useLocation();
  let returnedComponent: ReactNode;

  switch (true) {
    case isAuthenticated && isSetupComplete:
      returnedComponent = <Outlet />;
      break;
    case isAuthenticated && !isSetupComplete:
      returnedComponent = (
        <Navigate
          to="/complete-account"
          replace
          state={{ returnTo: location.pathname }}
        />
      );
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
