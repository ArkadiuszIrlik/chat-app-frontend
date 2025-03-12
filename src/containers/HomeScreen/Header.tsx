import WaveImage from '@assets/wave.svg';
import BelugaLogo from '@assets/beluga-black-logo.png';
import { ExtendedCSSProperties } from '@src/types';

const belugaLogoStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${BelugaLogo})`,
};

function HeaderSmall() {
  return (
    <>
      <div className="relative mx-auto mt-20 w-4/5 max-w-80">
        <WaveImageEl />
        <div
          style={belugaLogoStyles}
          className="alpha-mask aspect-square bg-gradient-to-tr
             from-clairvoyant-900 to-cerise-600 text-white"
        />
      </div>
      <div className="relative">
        <span className="block text-center font-beluga text-5xl text-white xl:mb-4 xl:text-7xl">
          Beluga
        </span>
        <p className="mt-2 hidden text-center text-2xl text-gray-200 xs:block xl:text-4xl">
          Making every conversation a splash of joy
        </p>
      </div>
    </>
  );
}

function HeaderLarge() {
  return (
    <div className="relative ml-[10%] mt-20 w-[28%]">
      <WaveImageEl />
      <div
        style={belugaLogoStyles}
        className="alpha-mask aspect-square bg-gradient-to-tr
                 from-clairvoyant-900 to-cerise-600 text-white"
      />
      <div className="absolute left-[65%] top-[70%] w-[50dvw]">
        <span className="block text-center font-beluga text-5xl text-white sm:text-left xl:mb-4 xl:text-7xl">
          Beluga
        </span>
        <p className="mt-2 hidden min-w-10 text-center text-2xl text-gray-200 xs:block sm:text-left xl:text-4xl">
          Making every conversation a splash of joy
        </p>
      </div>
    </div>
  );
}

function WaveImageEl() {
  return (
    <img
      src={WaveImage}
      alt=""
      srcSet=""
      draggable="false"
      className="visual-search-none absolute left-0 top-0 w-[425%] max-w-none -translate-x-[35%]
                 -translate-y-[27%] -rotate-12 select-none object-center
                 xs:w-[500%] xs:-translate-y-[30%] xs:-rotate-6 sm:w-[405%] sm:-translate-y-[31%]"
    />
  );
}

export { HeaderLarge, HeaderSmall };
