import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';
import { ModalContainer } from '@components/ModalContainer';
import { ErrorDisplay } from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useCallback } from 'react';

function DeleteServerModal({
  serverId,
  isOpen,
  onCloseModal,
  onCancel,
}: {
  serverId: string;
  isOpen: boolean;
  onCloseModal: () => void;
  onCancel: () => void;
}) {
  const { refetch, isLoading, hasError, errorMessage } = useFetch({
    initialUrl: `servers/${serverId}`,
    method: 'DELETE',
    onMount: false,
  });

  const handleDeleteServer = useCallback(() => {
    refetch();
  }, [refetch]);

  const description =
    'Are you sure you want to delete this server? All the messages sent here will be gone forever. This cannot be reversed.';

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      ariaLabel="Confirm delete server"
      ariaDescription={description}
      darkenBackdrop
      isAlert
    >
      <div>
        <h3 className="mb-1 text-xl text-gray-300">Delete Server</h3>
        <p className="mb-4">{description}</p>
        {hasError && (
          <div className="max-w-prose">
            <ErrorDisplay errorMessage={errorMessage} />
          </div>
        )}
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
              disabled={isLoading}
              onClickHandler={handleDeleteServer}
            >
              Delete&nbsp;Server
            </DestructivePrimaryButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}
export default DeleteServerModal;
