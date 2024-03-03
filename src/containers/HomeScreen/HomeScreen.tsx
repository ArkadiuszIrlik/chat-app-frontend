import WaveImage from '@assets/wave.svg';
import PhoneImage from '@assets/phone-placeholder.svg';
import LaptopImage from '@assets/laptop-placeholder.svg';
import { useMediaQuery } from '@uidotdev/usehooks';
import styleConsts from '@constants/styleConsts';
import { PrimaryLink, SecondaryLink } from '@components/Link';

function HomeScreen() {
  const isSmallScreen = useMediaQuery(
    `only screen and (min-width: ${styleConsts.screens.sm}`,
  );
  return (
    <div className="flex min-h-screen flex-col sm:block">
      <div
        className="relative flex w-full grow-[7] basis-0 flex-col items-center
       sm:aspect-[3024/1605] sm:h-auto"
      >
        <img
          src={WaveImage}
          alt=""
          srcSet=""
          draggable="false"
          className="visual-search-none absolute -left-[80%] -top-[0%] w-[250%] max-w-none -rotate-12
           select-none object-center sm:-left-[20%] sm:-top-[23%] sm:w-full sm:-rotate-6"
        />

        <div className="absolute left-0 right-0 top-[15%] sm:left-[10%] sm:top-[8%]">
          <div
            className="beluga-mask mx-auto aspect-square w-4/5 bg-gradient-to-tr
           from-clairvoyant-900 to-cerise-600 text-white sm:mx-0 sm:w-1/3"
          />
        </div>
        <div
          className="absolute left-0 right-0 top-[80%] text-center 
          sm:left-[29%] sm:top-[44%] sm:text-start"
        >
          <p className="mb-2 font-beluga text-5xl text-white xl:mb-4 xl:text-7xl">
            Beluga
          </p>
          {isSmallScreen && (
            <p className="text-2xl text-white xl:text-4xl">
              Making every conversation a splash of joy
            </p>
          )}
        </div>
      </div>
      <div className="relative grow-[3] basis-0 sm:-mt-[17%] sm:bg-gray-700">
        <div className="flex justify-between px-16 py-5">
          {isSmallScreen && (
            <div className="flex w-1/3 items-center gap-12 py-3">
              <img src={LaptopImage} alt="" className="w-[73%]" />
              <img src={PhoneImage} alt="" className="w-[27%]" />
            </div>
          )}
          <div
            className="mx-auto flex w-44 flex-col items-center justify-center
           gap-4 sm:mr-0 sm:w-80"
          >
            {isSmallScreen && (
              <p className="text-2xl text-white">Get chatting now</p>
            )}
            <PrimaryLink to="/login">Log in</PrimaryLink>
            <SecondaryLink to="/signup">Create account</SecondaryLink>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomeScreen;
