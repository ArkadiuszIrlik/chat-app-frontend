import TextInput from '@components/formControls/TextInput';
import { FormikValueTracker } from '@components/FormikValueTracker';
import PrimaryButton from '@components/PrimaryButton/PrimaryButton';
import useFetch from '@hooks/useFetchNew';

import { Formik, Form } from 'formik';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

const initialData = {};

function SignupForm() {
  const [postData, setPostData] = useState(initialData);
  // const { refresh, result } = useFetch({
  //   url: 'auth/signup',
  //   method: 'POST',
  //   start: false,
  //   data: postData,
  // });
  const { refetch, data, hasError, errorMessage } = useFetch({
    initialUrl: 'auth/signup',
    method: 'POST',
    onMount: false,
    postData,
  });
  const [serverError, setServerError] = useState('');
  if (hasError && errorMessage !== serverError) {
    setServerError(errorMessage);
  }

  const handleFormValueChange = useCallback(
    (nextValues: object) => {
      setPostData(nextValues);
    },
    [setPostData],
  );

  return (
    <div>
      <h2 className="mb-3 text-2xl text-white">Sign Up</h2>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .trim()
            .email('Invalid email address.')
            .required('Please enter your email.'),
          password: Yup.string()
            .min(8, 'Password has to be at least 8 characters long.')
            .max(100, "Password can't be longer than 100 characters.")
            .required('Please enter a password.'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], "Passwords don't match.")
            .required('Please enter your password again.'),
        })}
        // onSubmit={async (values, { setSubmitting }) => {
        onSubmit={() => {
          setServerError('');
          refetch();
          // try {
          //   // await refresh();
          //   refetch()
          //   console.log(postData);
          //   console.log(result);
          // } catch (err) {
          //   console.log('runs');
          //   setServerError(
          //     'Something went wrong on our side. Try again later.',
          //   );
          // }
          // setTimeout(() => {
          //   useFetch({ url: 'login', method: 'POST', start: false });

          //   alert(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 400);
        }}
      >
        <Form className="flex flex-col">
          {serverError && (
            <div
              className="mb-2 flex items-center gap-3 rounded-lg border-[1px]
             border-red-300 bg-red-900 px-3 py-2 text-red-300"
            >
              <div className="exclamation-mask aspect-square h-5 w-5 bg-red-300" />
              {serverError}
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
              autoComplete="new-password"
            />
          </div>
          <div className="mt-2">
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
            />
          </div>
          <FormikValueTracker onValueChange={handleFormValueChange} />
          <div className="mt-10 w-44 self-center">
            <PrimaryButton type="submit">Create&nbsp;account</PrimaryButton>
          </div>
          <p className="mt-14 self-center text-gray-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-400 underline-offset-2 hover:underline"
            >
              Log&nbsp;in
            </Link>
          </p>
        </Form>
      </Formik>
    </div>
  );
}
export default SignupForm;
