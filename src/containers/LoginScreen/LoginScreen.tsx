import WaveImage from '@assets/wave.svg';
import LoginForm from '@components/LoginForm/LoginForm';
import { useMediaQuery } from '@uidotdev/usehooks';
import styleConsts from '@constants/styleConsts';
import { useAuth } from '@hooks/index';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginScreen() {
  const { isAuthenticated } = useAuth()!;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const isMediumScreen = useMediaQuery(
    `only screen and (min-width: ${styleConsts.screens.md}`,
  );
  return (
    <div className="relative flex h-full min-h-screen">
      {isMediumScreen && (
        <div className="flex-1">
          <div className="sticky top-0 flex flex-col overflow-hidden">
            <div className="relative aspect-[628/498]">
              <img
                src={WaveImage}
                alt=""
                srcSet=""
                draggable="false"
                className="visual-search-none absolute bottom-0 left-1/2
                 right-0 top-0 w-[250%] max-w-none -translate-x-1/2
                  -translate-y-[20%] -rotate-6 select-none object-center"
              />
              <div className="absolute left-0 right-0 top-1/4">
                <div
                  className="beluga-mask mx-auto aspect-square
                 w-1/2 bg-gradient-to-tr from-clairvoyant-900
                  to-cerise-600 text-white"
                />
              </div>
            </div>
            <div className="left-0 right-1/2 top-[68%] shrink grow-[1] ">
              <p
                className="mb-2 text-center font-beluga text-5xl text-white
               xl:text-7xl"
              >
                Beluga
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 bg-gray-700">
        <div
          className="flex flex-col
       items-center justify-center py-3 sm:px-10 sm:py-20"
        >
          <div className="w-64">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginScreen;
