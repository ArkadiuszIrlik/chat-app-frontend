import TextInput from '@components/formControls/TextInput';
import PrimaryButton from '@components/PrimaryButton/PrimaryButton';
import useFetch from '@hooks/useFetch';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/index';

function LoginForm() {
  const [postData, setPostData] = useState({});

  const { refetch, hasError, errorMessage, data, isLoading } = useFetch({
    initialUrl: 'auth/login',
    method: 'POST',
    start: false,
    data: postData,
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
        // onSubmit={async (values, { setSubmitting }) => {
        onSubmit={async (values) => {
          setPostData(values);
          await refresh();
          console.log(postData);
          console.log(result);
          // setTimeout(() => {
          //   useFetch({ url: 'login', method: 'POST', start: false });

          //   alert(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 400);
        }}
      >
        <Form className="flex flex-col">
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
          <div className="mt-10 w-44 self-center">
            <PrimaryButton type="submit" onClickHandler={() => undefined}>
              Log&nbsp;in
            </PrimaryButton>
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
