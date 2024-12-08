import { DestructiveSecondaryButton } from '@components/DestructiveSecondaryButton';
import {
  ErrorDisplay,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import { Form } from 'formik';
import { useCallback, useEffect } from 'react';
import { SettingsFormikProvider, SettingsPage } from '@components/SettingsPage';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { genericFetcherCredentials, HttpError } from '@helpers/fetch';
import useToggle from '@hooks/useToggle';
import { useSocket } from '@hooks/index';
import { SocketEvents } from '@src/types';
import FormikValueUpdater from '@components/form-controls/FormikValueUpdater';
import DeleteChannelGroupModal from '@components/ChannelGroupSettings/DeleteChannelGroupModal';
import usePostFormData from '@components/ChannelGroupSettings/usePostFormData';
import Yup from '@src/extendedYup';
import { channelGroupSchema } from '@constants/validationSchema';

function getChannelGroupFromServer(server: Server, channelGroupId: string) {
  const groupToFind = server.channelCategories.find(
    (category) => category._id === channelGroupId,
  );

  return groupToFind;
}

const channelGroupNotFoundErrorObj = {
  message: 'Channel group not found',
};

const yupValidationSchema = Yup.object({
  name: channelGroupSchema.name.required(
    'Please enter a name for the channel group',
  ),
});

function ChannelGroupSettings() {
  const { state } = useLocation() as {
    state: { server?: Server } | null;
  };
  const { channelGroupId, serverId } = useParams();

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
  const channelGroup =
    server && channelGroupId
      ? getChannelGroupFromServer(server, channelGroupId)
      : undefined;

  const navigate = useNavigate();
  const handleCloseSettings = useCallback(() => {
    if (window.history?.length && window.history.length > 1) {
      navigate(-1);
    } else if (serverId && channelGroupId) {
      const firstChannel = channelGroup?.channels[0];
      if (!firstChannel) {
        navigate(`/app/channels/${serverId}`);
        return;
      }
      navigate(`/app/channels/${serverId}/${firstChannel._id}`);
    } else {
      navigate('/app/');
    }
  }, [channelGroup, channelGroupId, serverId, navigate]);

  const {
    isActive: isOpenDeleteGroupModal,
    activate: openDeleteGroupModal,
    deactivate: closeDeleteGroupModal,
  } = useToggle();

  const {
    updatedValues,
    error: postError,
    isLoading: isPostLoading,
    handleSubmitData,
  } = usePostFormData({
    channelGroup,
    channelGroupId: channelGroup?._id,
    serverId: server?._id,
  });

  return (
    <SettingsFormikProvider
      initialValues={updatedValues}
      updatedInitialValues={updatedValues}
      validationSchema={yupValidationSchema}
      onSubmitData={handleSubmitData}
    >
      <SettingsPage
        pageLabel="Channel Group Settings"
        hasLoadedData={!!(server && channelGroup)}
        loadError={
          errorLoadServer ?? !channelGroup
            ? channelGroupNotFoundErrorObj
            : undefined
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
            <TextInput
              label="Channel Group Name"
              name="name"
              id="name"
              type="text"
            />
          </div>
          <div className="w-40">
            <DestructiveSecondaryButton
              type="button"
              onClickHandler={openDeleteGroupModal}
            >
              Delete Channel Group
            </DestructiveSecondaryButton>
          </div>
          <DeleteChannelGroupModal
            serverId={server?._id ?? ''}
            channelGroupId={channelGroup?._id ?? ''}
            isOpen={isOpenDeleteGroupModal}
            onCloseModal={closeDeleteGroupModal}
            onCancel={closeDeleteGroupModal}
          />
          <FormikValueUpdater updatedValues={updatedValues} />
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

export default ChannelGroupSettings;
