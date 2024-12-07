import { DestructiveSecondaryButton } from '@components/DestructiveSecondaryButton';
import {
  ErrorDisplay,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import { Form } from 'formik';
import { useCallback, useEffect } from 'react';
import DeleteChannelModal from '@components/ChannelSettings/DeleteChannelModal';
import { SettingsPage } from '@components/SettingsPage';
import SettingsFormikProvider from '@components/ChannelSettings/SettingsFormikProvider';
import usePostFormData from '@components/ChannelSettings/usePostFormData';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { genericFetcherCredentials, HttpError } from '@helpers/fetch';
import useToggle from '@hooks/useToggle';
import { useSocket } from '@hooks/index';
import { SocketEvents } from '@src/types';
import FormikValueUpdater from '@components/form-controls/FormikValueUpdater';

function getChannelFromServer(server: Server, channelId: string) {
  let channelToFind: Channel | undefined;
  server.channelCategories.find((category) => {
    const foundChannel = category.channels.find(
      (channel) => channel._id === channelId,
    );
    if (foundChannel) {
      channelToFind = foundChannel;
      return true;
    }
    return false;
  });

  return channelToFind;
}

const channelNotFoundErrorObj = {
  message: 'Channel not found',
};

function ChannelSettings() {
  const { state } = useLocation() as {
    state: { server?: Server; channel?: Channel } | null;
  };
  const { channelId, serverId } = useParams();

  const {
    data: server,
    error: errorLoadServer,
    isLoading: isServerLoading,
    mutate: refetchServer,
  } = useSWR<Server, HttpError>(
    `/servers/${serverId}`,
    genericFetcherCredentials,
    {
      fallbackData: state?.server,
      revalidateOnMount: !state?.server,
      revalidateOnFocus: false,
    },
  );
  useSocketInteraction({
    serverId: serverId ?? '',
    onRefetchServer: refetchServer,
  });
  const channel =
    server && channelId ? getChannelFromServer(server, channelId) : undefined;

  const navigate = useNavigate();
  const handleCloseSettings = useCallback(() => {
    if (window.history?.length && window.history.length > 1) {
      navigate(-1);
    } else if (serverId && channelId) {
      navigate(`/app/channels/${serverId}/${channelId}`);
    } else {
      navigate('/app/');
    }
  }, [navigate, channelId, serverId]);

  const {
    isActive: isOpenDeleteChannelModal,
    activate: openDeleteChannelModal,
    deactivate: closeDeleteChannelModal,
  } = useToggle();

  const {
    updatedValues,
    error: postError,
    isLoading: isPostLoading,
    handleSubmitData,
  } = usePostFormData({
    channel,
    channelId: channel?._id,
    serverId: server?._id,
  });

  return (
    <SettingsFormikProvider
      initialValues={updatedValues}
      updatedInitialValues={updatedValues}
      onSubmitData={handleSubmitData}
    >
      <SettingsPage
        pageLabel="Channel Settings"
        hasLoadedData={!!(server && channel)}
        loadError={
          errorLoadServer ?? !channel ? channelNotFoundErrorObj : undefined
        }
        isLoading={isServerLoading}
        nextInitialValues={updatedValues}
        nextResetFormValues={updatedValues}
        onCloseSettings={handleCloseSettings}
      >
        <Form className="flex flex-col">
          {postError && (
            <div className="max-w-prose">
              <ErrorDisplay errorMessage={postError.message} />
            </div>
          )}
          <div className="mb-3 w-56">
            <TextInput label="Channel Name" name="name" id="name" type="text" />
          </div>
          <div className="w-40">
            <DestructiveSecondaryButton
              type="button"
              onClickHandler={openDeleteChannelModal}
            >
              Delete Channel
            </DestructiveSecondaryButton>
          </div>
          <DeleteChannelModal
            serverId={server?._id ?? ''}
            channelId={channel?._id ?? ''}
            isOpen={isOpenDeleteChannelModal}
            onCloseModal={closeDeleteChannelModal}
            onCancel={closeDeleteChannelModal}
          />
          <FormikValueUpdater
            // @ts-expect-error interface doesn't work with Record type
            updatedValues={updatedValues}
          />
          <SubmittingUpdater isFetchLoading={isPostLoading} />
        </Form>
      </SettingsPage>
    </SettingsFormikProvider>
  );
}

function useSocketInteraction({
  serverId,
  onRefetchServer,
}: {
  serverId: string;
  onRefetchServer: () => unknown;
}) {
  const { socket } = useSocket() ?? {};

  useEffect(() => {
    function cleanup() {
      if (socket) {
        socket.off(SocketEvents.ServerUpdated, onServerUpdated);
      }
    }

    function onServerUpdated(updatedServerId: string) {
      if (updatedServerId === serverId) {
        onRefetchServer();
      }
    }

    if (!socket) {
      return cleanup;
    }

    socket.on(SocketEvents.ServerUpdated, onServerUpdated);
    return cleanup;
  }, [serverId, socket, onRefetchServer]);
}

export default ChannelSettings;
