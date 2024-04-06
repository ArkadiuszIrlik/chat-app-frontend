import { AppScreen } from '@containers/AppScreen';
import { HomeScreen } from '@containers/HomeScreen';
import { LoginScreen } from '@containers/LoginScreen';
import { SignupScreen } from '@containers/SignupScreen';
import { createBrowserRouter } from 'react-router-dom';
import App from '@src/App';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { ServerView, ServerViewLoader } from '@components/ServerView';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomeScreen />,
      },
      {
        path: '/login',
        element: <LoginScreen />,
      },
      {
        path: '/signup',
        element: <SignupScreen />,
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
