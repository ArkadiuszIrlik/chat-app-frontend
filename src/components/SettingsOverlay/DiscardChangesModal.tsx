import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';
import { ModalOverlay } from '@components/ModalOverlay';

function DiscardChangesModal({
  onProceed,
  onCancel,
}: {
  onProceed: () => void;
  onCancel: () => void;
}) {
  return (
    <ModalOverlay>
      <div
        className="fixed left-1/2 top-1/2 w-96 -translate-x-1/2
       -translate-y-1/2 rounded-md bg-gray-800 px-5 py-4"
      >
        <div>
          <h3 className="mb-1 text-xl text-gray-300">Discard Changes</h3>
          <p className="mb-4">
            You have unsaved changes. Are you sure you want to leave the page
            and discard all changes?
          </p>
          <div className="flex items-center justify-center gap-10">
            <button
              type="button"
              onClick={onCancel}
              className="block w-36 underline-offset-2 hover:underline"
            >
              Cancel
            </button>
            <div className="w-44">
              <DestructivePrimaryButton
                type="button"
                onClickHandler={onProceed}
              >
                Discard&nbsp;Changes
              </DestructivePrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
export default DiscardChangesModal;
