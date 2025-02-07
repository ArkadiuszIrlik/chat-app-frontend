import { ErrorDisplay } from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useServerStore } from '@hooks/index';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ServerImage } from '@components/ServerImage';
import { PrimaryButton } from '@components/PrimaryButton';

function JoinServerContent({
  inviteCode,
  server,
  onNavigateBack,
  onCloseModal,
  onCloseServersMenu,
}: {
  inviteCode: string;
  server: Server | null;
  onNavigateBack: () => void;
  onCloseModal: () => void;
  onCloseServersMenu: () => void;
}) {
  const [postData, setPostData] = useState<{ inviteCode: string }>({
    inviteCode,
  });
  useEffect(() => {
    setPostData({ inviteCode });
  }, [inviteCode]);

  const { refetch, hasError, errorMessage, data, isLoading } = useFetch({
    initialUrl: `servers/invites`,
    method: 'POST',
    onMount: false,
    postData,
  });

  const { addToStore } = useServerStore() ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasError && data && addToStore) {
      const { server: nextServer } = data.data as {
        server: Server | undefined;
      };
      if (!nextServer) {
        return;
      }
      addToStore(nextServer);
      navigate(`/app/channels/${nextServer._id}`);
      onCloseModal();
      onCloseServersMenu();
    }
  }, [hasError, data, addToStore, navigate, onCloseModal, onCloseServersMenu]);

  return (
    <div className="flex flex-col items-start">
      {hasError && (
        <div className="max-w-prose">
          <ErrorDisplay errorMessage={errorMessage} />
        </div>
      )}
      {server ? (
        <div className="flex items-center gap-4">
          <div className="aspect-square h-20 w-20">
            <ServerImage image={server.serverImg} />
          </div>
          <div>
            <div className="text-xl text-gray-100">{server.name}</div>
            <div className="text-gray-200">
              <span className="font-bold">
                {server.members.length.toLocaleString('en-US')}
              </span>{' '}
              members
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-200">Server not found</div>
      )}
      <div className="mx-auto mb-3 mt-2 flex items-center gap-10">
        <button
          type="button"
          onClick={onNavigateBack}
          className="block w-32 underline-offset-2 hover:underline"
        >
          Back
        </button>
        <div className="w-32">
          <PrimaryButton
            type="button"
            onClickHandler={() => refetch()}
            disabled={isLoading}
          >
            Join&nbsp;server
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default JoinServerContent;
