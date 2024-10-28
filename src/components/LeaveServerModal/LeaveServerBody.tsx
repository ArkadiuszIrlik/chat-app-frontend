import { ErrorDisplay } from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useCallback, useEffect, useState } from 'react';
import { useAuth, useServerStore, useUserList } from '@hooks/index';
import { DestructivePrimaryButton } from '@components/DestructivePrimaryButton';

function LeaveServerBody({
  initialServer,
  onCancel,
  onCloseModal,
}: {
  initialServer: Server;
  onCancel: () => void;
  onCloseModal: () => void;
}) {
  const { user } = useAuth() ?? {};
  const { removeFromStore: removeFromServerStore } = useServerStore() ?? {};
  const { removeServerFromStore: removeFromUserList } = useUserList() ?? {};

  const [server] = useState(initialServer);

  const { refetch, hasError, errorMessage, data, isLoading } = useFetch({
    initialUrl: `servers/${server?._id}/users/${user?._id}`,
    method: 'DELETE',
    onMount: false,
  });

  useEffect(() => {
    if (!hasError && data) {
      if (removeFromUserList) {
        removeFromUserList(server?._id);
      }
      if (removeFromServerStore) {
        removeFromServerStore(server?._id);
      }
      onCloseModal();
    }
  }, [
    hasError,
    data,
    removeFromServerStore,
    removeFromUserList,
    onCloseModal,
    server?._id,
  ]);

  const handleLeaveServer = useCallback(() => {
    refetch();
  }, [refetch]);

  return server ? (
    <div>
      <p className="mb-4">
        Are you sure you want to leave{' '}
        <span className="font-bold">{server.name}</span>?
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
            onClickHandler={handleLeaveServer}
          >
            Leave&nbsp;Server
          </DestructivePrimaryButton>
        </div>
      </div>
    </div>
  ) : (
    <div>Server not found</div>
  );
}

export default LeaveServerBody;
