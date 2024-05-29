import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';
import { ModalOverlay } from '@components/ModalOverlay';
import { ErrorDisplay } from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useCallback } from 'react';

function DeleteServerModal({
  serverId,
  onCancel,
}: {
  serverId: string;
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

  return (
    <ModalOverlay>
      <div
        className="fixed left-1/2 top-1/2 w-96 -translate-x-1/2
       -translate-y-1/2 rounded-md bg-gray-800 px-5 py-4"
      >
        <div>
          <h3 className="mb-1 text-xl text-gray-300">Delete Server</h3>
          <p className="mb-4">
            Are you sure you want to delete this server? All the messages sent
            here will be gone forever. This cannot be reversed.
          </p>
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
      </div>
    </ModalOverlay>
  );
}
export default DeleteServerModal;
