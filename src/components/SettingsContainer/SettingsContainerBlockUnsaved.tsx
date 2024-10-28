import { PrimaryButton } from '@components/PrimaryButton';
import DiscardChangesModal from '@components/SettingsContainer/DiscardChangesModal';
import { useBlockUnsaved } from '@hooks/index';

type ContextProps = NonNullable<ReturnType<typeof useBlockUnsaved>>;
interface DisplayProps {
  isSaveButtonDisabled?: boolean;
}

SettingsContainerBlockUnsaved.defaultProps = {
  isSaveButtonDisabled: false,
};

function SettingsContainerBlockUnsaved({
  blocker,
  isBlocked,
  handleProceedDiscard,
  handleCancelDiscard,
  haveValuesChanged,
  handleCancelChanges,
  handleConfirmChanges,
  isSaveButtonDisabled = false,
}: ContextProps & DisplayProps) {
  const isDiscardChangesModalOpen = blocker.state === 'blocked' || isBlocked;
  return (
    <>
      <DiscardChangesModal
        isOpen={isDiscardChangesModalOpen}
        onCancel={handleCancelDiscard}
        onProceed={handleProceedDiscard}
        onCloseModal={handleCancelDiscard}
      />
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
              disabled={isSaveButtonDisabled}
              onClickHandler={handleConfirmChanges}
            >
              Save&nbsp;changes
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsContainerBlockUnsaved;
