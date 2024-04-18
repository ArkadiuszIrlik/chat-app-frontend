import { AppScreen } from '@containers/AppScreen';
import { HomeScreen } from '@containers/HomeScreen';
import { createBrowserRouter } from 'react-router-dom';
import App from '@src/App';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { ServerView, ServerViewLoader } from '@components/ServerView';
import { AuthScreen } from '@containers/AuthScreen';
import { SignupForm } from '@components/SignupForm';
import { LoginForm } from '@components/LoginForm';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomeScreen />,
      },
      {
        element: <AuthScreen />,
        children: [
          {
            path: '/login',
            element: <LoginForm />,
          },
          {
            path: '/signup',
            element: <SignupForm />,
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/app',
            element: <AppScreen />,
            children: [
              {
                path: 'channels/:serverId',
                element: <ServerView />,
                loader: ServerViewLoader,
                children: [{ path: ':channelId' }],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
