import { ExtendedCSSProperties } from '@src/types';
import { useBlocker } from 'react-router-dom';
import CloseIcon from '@assets/close-icon.png';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import deepEqual from 'deep-equal';
import { useDebounce, useMediaQuery } from '@uidotdev/usehooks';
import DiscardChangesModal from '@components/SettingsOverlay/DiscardChangesModal';
import { PrimaryButton } from '@components/PrimaryButton';
import { createPortal } from 'react-dom';
import styleConsts from '@constants/styleConsts';

const closeButtonStylesObj: ExtendedCSSProperties = {
  '--mask-url': `url(${CloseIcon})`,
};

function SettingsOverlay({
  label,
  onCloseSettings,
  children,
}: {
  label: string;
  onCloseSettings: () => void;
  children: ReactNode;
}) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedQueue, setBlockedQueue] = useState<(() => void)[]>([]);
  const { initialValues, values, resetForm, submitForm, isSubmitting } =
    useFormikContext();
  const [haveValuesChanged, setHaveValuesChanged] = useState(false);
  const debouncedValues = useDebounce(values, 500);

  useEffect(() => {
    setHaveValuesChanged(!deepEqual(initialValues, debouncedValues));
  }, [debouncedValues, initialValues]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      haveValuesChanged && currentLocation.pathname !== nextLocation.pathname,
  );

  const handleCloseSettings = useCallback(() => {
    if (haveValuesChanged) {
      setIsBlocked(true);
      setBlockedQueue((bq) => [...bq, onCloseSettings]);
      return;
    }
    onCloseSettings();
  }, [haveValuesChanged, onCloseSettings]);

  const handleCancelChanges = useCallback(() => {
    resetForm();
    setHaveValuesChanged(false);
  }, [resetForm]);

  const handleProceedDiscard = useCallback(() => {
    setIsBlocked(false);
    blockedQueue.forEach((f) => {
      f();
    });
    setBlockedQueue([]);
    if (blocker.proceed) {
      blocker.proceed();
    }
  }, [blocker, blockedQueue]);

  const handleCancelDiscard = useCallback(() => {
    setIsBlocked(false);
    setBlockedQueue([]);
    if (blocker.reset) {
      blocker.reset();
    }
  }, [blocker]);

  const isExtraSmallScreen = useMediaQuery(
    `only screen and (min-width: ${styleConsts.screens.xs}`,
  );

  return createPortal(
    <div className="fixed inset-0 z-40 bg-gray-700">
      <div
        className="mx-auto flex lg:mx-[8%] xl:mx-[14%] 2xl:mx-auto
       2xl:max-w-[1800px]"
      >
        {isExtraSmallScreen && (
          <div className="w-52 bg-gray-700 px-2 py-2">
            <h1 className="mb-2 text-xl text-gray-200">{label}</h1>
          </div>
        )}
        <div className="grow bg-gray-700">
          <div className="flex px-4 py-3">
            {!isExtraSmallScreen && (
              <h1 className="mb-2 text-xl text-gray-200">{label}</h1>
            )}
            <button
              type="button"
              onClick={handleCloseSettings}
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
          {(blocker.state === 'blocked' || isBlocked) && (
            <DiscardChangesModal
              onProceed={handleProceedDiscard}
              onCancel={handleCancelDiscard}
            />
          )}
          {haveValuesChanged && (
            <div
              className="fixed bottom-10 left-1/2 flex w-11/12 -translate-x-1/2
             flex-wrap items-center justify-center gap-x-10 gap-y-8 rounded-lg
              bg-gray-800 px-6 py-3 xs:w-auto xs:flex-nowrap xs:justify-between
               xs:gap-20 sm:gap-44"
            >
              <button
                type="button"
                className="block underline-offset-2 hover:underline"
                onClick={handleCancelChanges}
              >
                Cancel&nbsp;changes
              </button>
              <div>
                <PrimaryButton
                  type="button"
                  disabled={isSubmitting}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClickHandler={submitForm}
                >
                  Save&nbsp;changes
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
export default SettingsOverlay;
