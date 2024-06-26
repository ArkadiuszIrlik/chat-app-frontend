import { SubmitButtonPrimary } from '@components/form-controls';
import TextInput from '@components/form-controls/TextInput';
import useFetch from '@hooks/useFetch';
import ExtendedCSSProperties from '@src/types';
import { Formik, Form, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import EmailIcon from '@assets/mail.png';

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

function SubmittingUpdater({ isFetchLoading }: { isFetchLoading: boolean }) {
  const { setSubmitting } = useFormikContext();
  useEffect(() => {
    if (!isFetchLoading) {
      setSubmitting(false);
    }
  }, [isFetchLoading, setSubmitting]);

  return null;
}

export default SignupForm;
