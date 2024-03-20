import TextInput from '@components/form-controls/TextInput';
import useFetch from '@hooks/useFetch';
import { Formik, Form, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/index';
import { SubmitButtonPrimary } from '@components/form-controls';

function LoginForm() {
  const [postData, setPostData] = useState({});

  const { refetch, hasError, errorMessage, data, isLoading } = useFetch({
    initialUrl: 'auth/login',
    method: 'POST',
    onMount: false,
    postData,
  });

  const { login } = useAuth()!;
  if (data && hasError === false) {
    void login();
  }

  return (
    <div>
      <h2 className="mb-3 text-2xl text-white">Login</h2>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .trim()
            .email('Invalid email address.')
            .required('Please enter your email.'),
          password: Yup.string()
            .min(8, 'Password has to be at least 8 characters long.')
            .max(100, "Password can't be longer than 100 characters.")
            .required('Please enter your password.'),
        })}
        onSubmit={(values) => {
          setPostData(values);
          refetch();
        }}
      >
        <Form className="flex flex-col">
          {hasError && (
            <div
              className="mb-2 flex items-center gap-3 rounded-lg border-[1px]
             border-red-300 bg-red-900 px-3 py-2 text-red-300"
            >
              <div className="exclamation-mask aspect-square h-5 w-5 bg-red-300" />
              {errorMessage}
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

function SubmittingUpdater({ isFetchLoading }: { isFetchLoading: boolean }) {
  const { setSubmitting } = useFormikContext();
  useEffect(() => {
    if (!isFetchLoading) {
      setSubmitting(false);
    }
  }, [isFetchLoading, setSubmitting]);

  return null;
}

export default LoginForm;
