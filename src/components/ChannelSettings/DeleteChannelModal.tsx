import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';
import { ModalOverlay } from '@components/ModalOverlay';
import { ErrorDisplay } from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useCallback } from 'react';

function DeleteChannelModal({
  serverId,
  channelId,
  onCancel,
}: {
  serverId: string;
  channelId: string;
  onCancel: () => void;
}) {
  const { refetch, isLoading, hasError, errorMessage } = useFetch({
    initialUrl: `servers/${serverId}/channels/${channelId}`,
    method: 'DELETE',
    onMount: false,
  });

  const handleDeleteChannel = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ModalOverlay>
      <div
        className="fixed left-1/2 top-1/2 w-96 -translate-x-1/2
       -translate-y-1/2 rounded-md bg-gray-800 px-5 py-4"
      >
        <div>
          <h3 className="mb-1 text-xl text-gray-300">Delete Channel</h3>
          <p className="mb-4">
            Are you sure you want to remove this channel? Any messages sent here
            will also be removed.
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
                onClickHandler={handleDeleteChannel}
              >
                Delete Channel
              </DestructivePrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
export default DeleteChannelModal;
