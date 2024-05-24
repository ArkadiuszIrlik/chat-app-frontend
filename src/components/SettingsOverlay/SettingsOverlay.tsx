import { ExtendedCSSProperties } from '@src/types';
import { useBlocker } from 'react-router-dom';
import CloseIcon from '@assets/close-icon.png';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import deepEqual from 'deep-equal';
import { useDebounce } from '@uidotdev/usehooks';
import DiscardChangesModal from '@components/SettingsOverlay/DiscardChangesModal';
import { PrimaryButton } from '@components/PrimaryButton';

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

  return (
    <div className="fixed inset-0 z-40 flex grow">
      <div className="w-52 bg-gray-700 px-2 py-2">
        <h1 className="mb-2 text-xl text-gray-200">{label}</h1>
      </div>
      <div className="grow bg-gray-700">
        <div className="px-4 py-3">
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
        <div>{children}</div>
        {(blocker.state === 'blocked' || isBlocked) && (
          <DiscardChangesModal
            onProceed={handleProceedDiscard}
            onCancel={handleCancelDiscard}
          />
        )}
        {haveValuesChanged && (
          <div
            className="fixed bottom-10 left-1/2 flex -translate-x-1/2
         items-center justify-between gap-44 rounded-lg bg-gray-800 px-6 py-3"
          >
            <button
              type="button"
              className="block underline-offset-2 hover:underline"
              onClick={handleCancelChanges}
            >
              Cancel&nbsp;changes
            </button>
            <PrimaryButton
              type="button"
              disabled={isSubmitting}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickHandler={submitForm}
            >
              Save&nbsp;changes
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
export default SettingsOverlay;
