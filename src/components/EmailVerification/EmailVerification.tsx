import styleConsts from '@constants/styleConsts';
import genericFetcher, { HttpError } from '@helpers/fetch';
import { useSearchParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import ExclamationIcon from '@assets/exclamation-point-128.png';
import CheckmarkIcon from '@assets/checkmark.png';
import useSWR from 'swr';
import { ExtendedCSSProperties } from '@src/types';
import { PrimaryLink } from '@components/Link';

const errorStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ExclamationIcon})`,
};
const successStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${CheckmarkIcon})`,
};

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { data, isLoading, error } = useSWR<object, HttpError>(
    `/auth/verify-email?token=${token ?? ''}`,
    genericFetcher,
    {
      revalidateOnFocus: false,
      onErrorRetry: () => {},
    },
  );

  switch (true) {
    case isLoading:
      return (
        <div>
          <h2 className="mb-8 text-center text-2xl">Verifying your email</h2>
          <div className="flex justify-center">
            <SyncLoader
              color={styleConsts.colors.gray[300]}
              speedMultiplier={0.8}
            />
          </div>
        </div>
      );
    case !!error:
      return (
        <div>
          <h2 className="mb-2 flex items-center justify-center gap-2 text-2xl">
            <div
              aria-hidden
              className="alpha-mask aspect-square h-7 w-7 shrink-0 grow-0 bg-red-300"
              style={errorStyles}
            />
            Couldn&apos;t verify email
          </h2>
          <p className="mb-6">
            Sorry, but we couldn&apos;t verify your e-mail. Remember that the
            verification link is only valid for 24 hours. If you would like to
            create a new account again, you can do so by clicking the link
            below.
          </p>
          <div className="mx-auto w-44">
            <PrimaryLink to="/signup">Create account</PrimaryLink>
          </div>
        </div>
      );
    case !!data:
      return (
        <div>
          <h2 className="mb-2 flex items-center justify-center gap-2 text-center text-2xl">
            E-mail verified successfully
            <div
              aria-hidden
              className="alpha-mask aspect-square h-7 w-7 bg-green-500"
              style={successStyles}
            />
          </h2>
          <p className="mb-6">Thank you. You can log into your account now.</p>
          <div className="mx-auto w-36">
            <PrimaryLink to="/login" replace>
              Log in
            </PrimaryLink>
          </div>
        </div>
      );
    default:
      return null;
  }
}
export default EmailVerification;
