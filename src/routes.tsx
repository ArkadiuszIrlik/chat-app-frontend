import { AppScreen, NavigateAwayFromAppScreen } from '@containers/AppScreen';
import { HomeScreen } from '@containers/HomeScreen';
import { createBrowserRouter } from 'react-router-dom';
import App from '@src/App';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { ServerView, ServerViewLoader } from '@components/ServerView';
import { ChatDisplay } from '@components/ChatDisplay';
import { AuthScreen } from '@containers/AuthScreen';
import { SignupForm } from '@components/SignupForm';
import { LoginForm } from '@components/LoginForm';
import { EmailVerification } from '@components/EmailVerification';
import { ServerSettings } from '@components/ServerSettings';
import { ChannelSettings } from '@components/ChannelSettings';
import { ChannelGroupSettings } from '@components/ChannelGroupSettings';

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
            element: <AppScreen />,
            children: [
              { path: '', element: <NavigateAwayFromAppScreen /> },
              {
                path: 'channels/:serverId?',
                element: <ServerView />,
                loader: ServerViewLoader,
                children: [
                  {
                    path: ':channelId',
                    element: <ChatDisplay />,
                  },
                ],
              },
              {
                path: 'server-settings/:serverId',
                element: <ServerSettings />,
              },
              {
                path: 'channel-group-settings/:serverId/:channelGroupId',
                element: <ChannelGroupSettings />,
              },
              {
                path: 'channel-settings/:serverId/:channelId',
                element: <ChannelSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
