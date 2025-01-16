import { ExtendedCSSProperties } from '@src/types';
import CloseIcon from '@assets/close-icon.png';
import { ReactNode } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';
import styleConsts from '@constants/styleConsts';

const closeButtonStylesObj: ExtendedCSSProperties = {
  '--mask-url': `url(${CloseIcon})`,
};

function SettingsContainer({
  label,
  onCloseSettings,
  children,
}: {
  label: string;
  onCloseSettings: () => void;
  children: ReactNode;
}) {
  const isExtraSmallScreen = useMediaQuery(
    `only screen and (min-width: ${styleConsts.screens.xs}`,
  );

  return (
    <div className="fixed inset-0 z-40 bg-gray-700">
      <div
        className="mx-auto flex lg:mx-[8%] xl:mx-[14%] 2xl:mx-auto
       2xl:max-w-[1800px]"
      >
        {isExtraSmallScreen && (
          <div className="w-52 bg-gray-700 px-2 py-2">
            <h1 className="mb-2 py-1 text-xl text-gray-200">{label}</h1>
          </div>
        )}
        <div className="grow bg-gray-700">
          <div className="flex px-4 py-3">
            {!isExtraSmallScreen && (
              <h1 className="mb-2 py-1 text-xl text-gray-200">{label}</h1>
            )}
            <button
              type="button"
              onClick={onCloseSettings}
              aria-label={`Close ${label}`}
              className="group ml-auto block rounded-md p-1 hover:bg-gray-600"
            >
              <div
                className="alpha-mask aspect-square h-5 w-5 shrink-0 grow-0 bg-gray-400
              group-hover:bg-gray-300"
                style={closeButtonStylesObj}
              />
            </button>
          </div>
          <div className="px-3 xs:px-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
export default SettingsContainer;
