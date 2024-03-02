import { AppScreen } from '@containers/AppScreen';
import { HomeScreen } from '@containers/HomeScreen';
import { LoginScreen } from '@containers/LoginScreen';
import { SignupScreen } from '@containers/SignupScreen';
import { createBrowserRouter } from 'react-router-dom';
import App from '@src/App';

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
        path: '/app',
        element: <AppScreen />,
      },
    ],
  },
]);

export default router;
