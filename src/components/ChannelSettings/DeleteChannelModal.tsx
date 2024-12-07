import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';
import { ModalContainer } from '@components/ModalContainer';
import { ErrorDisplay } from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useCallback, useEffect } from 'react';

function DeleteChannelModal({
  serverId,
  channelId,
  isOpen,
  onCloseModal,
  onCancel,
}: {
  serverId: string;
  channelId: string;
  isOpen: boolean;
  onCloseModal: () => void;
  onCancel: () => void;
}) {
  const { refetch, isLoading, error, updateUrl } = useFetch({
    initialUrl: `servers/${serverId}/channels/${channelId}`,
    method: 'DELETE',
    onMount: false,
  });

  useEffect(() => {
    updateUrl(`servers/${serverId}/channels/${channelId}`);
  }, [channelId, serverId, updateUrl]);

  const handleDeleteServer = useCallback(() => {
    refetch();
  }, [refetch]);

  const description =
    'Are you sure you want to delete this channel? All the messages sent here will be gone forever. This cannot be reversed.';

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      ariaLabel="Confirm delete channel"
      ariaDescription={description}
      darkenBackdrop
      isAlert
    >
      <div>
        <h3 className="mb-1 text-xl text-gray-300">Delete Channel</h3>
        <p className="mb-4 text-gray-100">{description}</p>
        {error && (
          <div className="max-w-prose">
            <ErrorDisplay errorMessage={error.message} />
          </div>
        )}
        <div className="flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={onCancel}
            className="block w-36 underline-offset-2 using-mouse:hover:underline"
          >
            Cancel
          </button>
          <div className="w-44">
            <DestructivePrimaryButton
              type="button"
              disabled={isLoading}
              onClickHandler={handleDeleteServer}
            >
              Delete&nbsp;Channel
            </DestructivePrimaryButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}

export default DeleteChannelModal;
