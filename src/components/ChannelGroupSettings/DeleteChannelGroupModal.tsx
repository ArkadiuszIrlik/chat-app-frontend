import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';
import { ModalContainer } from '@components/ModalContainer';
import { ErrorDisplay } from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useCallback, useEffect } from 'react';

function DeleteChannelGroupModal({
  serverId,
  channelGroupId,
  isOpen,
  onCloseModal,
  onCancel,
}: {
  serverId: string;
  channelGroupId: string;
  isOpen: boolean;
  onCloseModal: () => void;
  onCancel: () => void;
}) {
  const { refetch, isLoading, error, updateUrl } = useFetch({
    initialUrl: `servers/${serverId}/channelCategories/${channelGroupId}`,
    method: 'DELETE',
    onMount: false,
  });

  useEffect(() => {
    updateUrl(`servers/${serverId}/channelCategories/${channelGroupId}`);
  }, [channelGroupId, serverId, updateUrl]);

  const handleDeleteGroup = useCallback(() => {
    refetch();
  }, [refetch]);

  const description =
    'Are you sure you want to delete this channel group? All the messages sent in channels inside it will be gone forever. This cannot be reversed.';

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
        <h3 className="mb-1 text-xl text-gray-300">Delete Channel Group</h3>
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
              onClickHandler={handleDeleteGroup}
            >
              Delete Channel&nbsp;Group
            </DestructivePrimaryButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}

export default DeleteChannelGroupModal;
