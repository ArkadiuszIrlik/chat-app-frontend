import styleConsts from '@constants/styleConsts';
import genericFetcher, { HttpError } from '@helpers/fetch';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import ExclamationIcon from '@assets/exclamation-point-128.png';
import CheckmarkIcon from '@assets/checkmark.png';
import useSWR from 'swr';
import { ExtendedCSSProperties } from '@src/types';
import useDelay from '@hooks/useDelay';
import { useEffect } from 'react';

const errorStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ExclamationIcon})`,
};
const successStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${CheckmarkIcon})`,
};

const REDIRECT_DELAY = 3 * 1000; // ms
const REDIRECT_URL = '/app/';

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
            verification link is only valid for 24 hours.
          </p>
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
          <p className="mb-6">You will be redirected shortly...</p>
          <AppRedirect />
        </div>
      );
    default:
      return null;
  }
}

function AppRedirect() {
  const { isReady } = useDelay({ delay: REDIRECT_DELAY });
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady) {
      navigate(REDIRECT_URL, { replace: true });
    }
  }, [isReady, navigate]);

  return null;
}

export default EmailVerification;
