import {
  ErrorDisplay,
  SubmitButtonPrimary,
  SubmittingUpdater,
} from '@components/form-controls';
import TextInput from '@components/form-controls/TextInput';
import useFetch from '@hooks/useFetch';
import { ExtendedCSSProperties } from '@src/types';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Yup from '@src/extendedYup';
import EmailIcon from '@assets/mail.png';
import { userSchema } from '@constants/validationSchema';

const emailIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${EmailIcon})`,
};

function SignupForm() {
  const [postData, setPostData] = useState({});

  const { data, refetch, hasError, errorMessage, isLoading } = useFetch({
    initialUrl: 'auth/signup',
    method: 'POST',
    onMount: false,
    postData,
  });

  return data ? (
    <div>
      <h2 className="mb-2 flex items-center justify-center gap-4 text-2xl">
        Verify your e-mail
        <div
          aria-hidden
          className="alpha-mask aspect-square h-11 w-11 shrink-0 grow-0
           bg-gradient-to-tr from-clairvoyant-900 to-cerise-600"
          style={emailIconStyles}
        />
      </h2>
      <p>
        We&apos;ve sent a verification e-mail to the provided address. Please
        use the link inside to confirm your e-mail address. If you can&apos;t
        find the e-mail, make sure to check inside the “junk” folder.
      </p>
    </div>
  ) : (
    <div>
      <h2 className="mb-3 text-2xl text-white">Sign Up</h2>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={Yup.object({
          email: userSchema.email.required('Please enter your email.'),
          password: userSchema.password.required('Please enter a password.'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], "Passwords don't match.")
            .required('Please enter your password again.'),
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
          <SubmittingUpdater isFetchLoading={isLoading} />
          <div className="mt-10 w-44 self-center">
            <SubmitButtonPrimary>Create&nbsp;account</SubmitButtonPrimary>
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
