import { NavigateAwayFromAppScreen } from '@containers/AppScreen';
import { HomeScreen } from '@containers/HomeScreen';
import { createBrowserRouter } from 'react-router-dom';
import App from '@src/App';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { ServerViewLoader } from '@components/ServerView';
import { AuthScreen } from '@containers/AuthScreen';
import { SignupForm } from '@components/SignupForm';
import { LoginForm } from '@components/LoginForm';
import { EmailVerification } from '@components/EmailVerification';
import { lazy, Suspense } from 'react';

const LazyAppScreen = lazy(() =>
  import('@src/routes/app').then((module) => ({
    default: module.AppScreen,
  })),
);
const LazyServerView = lazy(() =>
  import('@src/routes/app').then((module) => ({
    default: module.ServerView,
  })),
);
const LazyChatDisplay = lazy(() =>
  import('@src/routes/app').then((module) => ({
    default: module.ChatDisplay,
  })),
);
const LazySettingsScreen = lazy(() =>
  import('@src/routes/app').then((module) => ({
    default: module.SettingsScreen,
  })),
);
const LazyServerSettings = lazy(() =>
  import('@src/routes/app').then((module) => ({
    default: module.ServerSettings,
  })),
);
const LazyChannelGroupSettings = lazy(() =>
  import('@src/routes/app').then((module) => ({
    default: module.ChannelGroupSettings,
  })),
);
const LazyChannelSettings = lazy(() =>
  import('@src/routes/app').then((module) => ({
    default: module.ChannelSettings,
  })),
);

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
          {
            path: '/verify-email',
            element: <EmailVerification />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/app',
            element: (
              <Suspense>
                <LazyAppScreen />
              </Suspense>
            ),
            children: [
              { path: '', element: <NavigateAwayFromAppScreen /> },
              {
                path: 'channels/:serverId?',
                element: <LazyServerView />,
                loader: ServerViewLoader,
                children: [
                  {
                    path: ':channelId',
                    element: <LazyChatDisplay />,
                  },
                ],
              },
              {
                path: 'settings',
                element: <LazySettingsScreen />,
              },
              {
                path: 'server-settings/:serverId',
                element: <LazyServerSettings />,
              },
              {
                path: 'channel-group-settings/:serverId/:channelGroupId',
                element: <LazyChannelGroupSettings />,
              },
              {
                path: 'channel-settings/:serverId/:channelId',
                element: <LazyChannelSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
