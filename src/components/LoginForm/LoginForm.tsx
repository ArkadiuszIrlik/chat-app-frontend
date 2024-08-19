import TextInput from '@components/form-controls/TextInput';
import useFetch from '@hooks/useFetch';
import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import Yup from '@src/extendedYup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/index';
import {
  ErrorDisplay,
  SubmitButtonPrimary,
  SubmittingUpdater,
} from '@components/form-controls';
import { userSchema } from '@constants/validationSchema';

function LoginForm() {
  const { login, isAuthenticated } = useAuth() ?? {};
  const [postData, setPostData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  const { refetch, hasError, errorMessage, data, isLoading } = useFetch({
    initialUrl: 'auth/login',
    method: 'POST',
    onMount: false,
    postData,
  });

  useEffect(() => {
    if (data && hasError === false && login) {
      void login();
    }
  }, [data, hasError, login]);

  return (
    <div>
      <h2 className="mb-3 text-2xl text-white">Login</h2>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object({
          email: userSchema.email.required('Please enter your email.'),
          password: userSchema.password.required('Please enter your password.'),
        })}
        onSubmit={(values) => {
          setPostData(values);
          refetch();
        }}
      >
        <Form className="flex flex-col">
          {hasError && (
            <div className="max-w-prose">
              <ErrorDisplay errorMessage={errorMessage} />
            </div>
          )}
          <div>
            <TextInput
              label="E-mail"
              name="email"
              id="email"
              type="email"
              autoComplete="email"
            />
          </div>
          <div className="mt-2">
            <TextInput
              label="Password"
              name="password"
              id="password"
              type="password"
              autoComplete="current-password"
            />
          </div>
          <Link
            to="#_"
            className="ml-auto mt-1 underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
          <SubmittingUpdater isFetchLoading={isLoading} />
          <div className="mt-10 w-44 self-center">
            <SubmitButtonPrimary>Log&nbsp;in</SubmitButtonPrimary>
          </div>
          <p className="mt-14 self-center text-gray-300">
            Don&apos;t have an account yet?{' '}
            <Link
              to="/signup"
              className="text-blue-400 underline-offset-2 hover:underline"
            >
              Sign&nbsp;up
            </Link>
          </p>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginForm;
