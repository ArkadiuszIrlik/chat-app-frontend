import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';
import { ModalContainer } from '@components/ModalContainer';

function DiscardChangesModal({
  isOpen,
  onCloseModal,
  onCancel,
  onProceed,
}: {
  isOpen: boolean;
  onCloseModal: () => void;
  onCancel: () => void;
  onProceed: () => void;
}) {
  const description =
    'You have unsaved changes. Are you sure you want to leave the page and discard all changes?';

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      ariaLabel="Confirm discard changes"
      ariaDescription={description}
      darkenBackdrop
      isAlert
    >
      <div>
        <h3 className="mb-1 text-xl text-gray-300">Discard Changes</h3>
        <p className="mb-4 text-gray-200">{description}</p>
        <div className="flex items-center justify-start gap-10">
          <button
            type="button"
            onClick={onCancel}
            className="block w-36 underline-offset-2 hover:underline"
          >
            Cancel
          </button>
          <div className="w-44">
            <DestructivePrimaryButton type="button" onClickHandler={onProceed}>
              Discard&nbsp;Changes
            </DestructivePrimaryButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}
export default DiscardChangesModal;
