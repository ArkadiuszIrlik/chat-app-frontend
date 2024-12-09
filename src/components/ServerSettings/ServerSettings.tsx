import { DestructiveSecondaryButton } from '@components/DestructiveSecondaryButton';
import {
  ErrorDisplay,
  ImageFileInput,
  ResetAfterSubmit,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import { Form } from 'formik';
import { useCallback, useEffect } from 'react';
import {
  SettingsFormikProvider,
  SettingsPage,
  TIME_UNTIL_STALE_LINK_STATE,
  useClearStaleLocationState,
} from '@components/SettingsPage';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { genericFetcherCredentials, HttpError } from '@helpers/fetch';
import useToggle from '@hooks/useToggle';
import { useSocket } from '@hooks/index';
import { SocketEvents } from '@src/types';
import FormikValueUpdater from '@components/form-controls/FormikValueUpdater';
import usePostFormData from '@components/ServerSettings/usePostFormData';
import DeleteServerModal from '@components/ServerSettings/DeleteServerModal';
import Yup from '@src/extendedYup';
import { serverSchema } from '@constants/validationSchema';
import { ServerSettingsValues } from '@components/ServerSettings/types';
import { getPropertiesChanged } from '@helpers/forms';

const serverNotFoundErrorObj = {
  message: 'Server not found',
};

const serverValidationSchema = Yup.object({
  serverImg: Yup.mixed().oneOfSchemas([Yup.string(), serverSchema.image]),
  name: serverSchema.name.required('Please enter a name for your server.'),
});

function ServerSettings() {
  const location = useLocation();
  const { state } = location as {
    state: { server?: Server } | null;
  };
  const { serverId } = useParams();

  useClearStaleLocationState({
    location,
    timeToStale: TIME_UNTIL_STALE_LINK_STATE,
  });

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

  const navigate = useNavigate();
  const handleCloseSettings = useCallback(() => {
    if (window.history?.length && window.history.length > 1) {
      navigate(-1);
    } else if (serverId) {
      navigate(`/app/channels/${serverId}`);
    } else {
      navigate('/app/');
    }
  }, [serverId, navigate]);

  const {
    isActive: isOpenDeleteServerModal,
    activate: openDeleteServerModal,
    deactivate: closeDeleteServerModal,
  } = useToggle();

  const {
    updatedValues,
    error: postError,
    isLoading: isPostLoading,
    hasSubmitted,
    handleSubmitData,
  } = usePostFormData({
    server,
    serverId: server?._id,
  });

  return (
    <SettingsFormikProvider
      initialValues={updatedValues}
      updatedInitialValues={updatedValues}
      validationSchema={serverValidationSchema}
      onSubmit={(values) => {
        handleFormSubmit(updatedValues, values, handleSubmitData);
      }}
    >
      <SettingsPage
        pageLabel="Server Settings"
        hasLoadedData={!!server}
        loadError={
          errorLoadServer ?? !server ? serverNotFoundErrorObj : undefined
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
            <TextInput label="Server Name" name="name" id="name" type="text" />
          </div>
          <div className="mb-5">
            <ImageFileInput
              textLabel="Server Image"
              buttonLabel="Upload server image"
              initialImageUrl={updatedValues.serverImg}
              name="serverImg"
              id="serverImg"
            />
          </div>
          <div className="w-40">
            <DestructiveSecondaryButton
              type="button"
              onClickHandler={openDeleteServerModal}
            >
              Delete Server
            </DestructiveSecondaryButton>
          </div>
          <DeleteServerModal
            serverId={server?._id ?? ''}
            isOpen={isOpenDeleteServerModal}
            onCloseModal={closeDeleteServerModal}
            onCancel={closeDeleteServerModal}
          />
          <ResetAfterSubmit
            hasSubmitted={hasSubmitted}
            updatedValues={updatedValues}
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

function handleFormSubmit(
  initialValues: ServerSettingsValues,
  values: ServerSettingsValues,
  onSubmitData: (data: FormData) => void,
) {
  const propertiesChanged = getPropertiesChanged(initialValues, values);
  const patchData = propertiesChanged.map((property) => ({
    op: 'replace',
    path: `/${property}`,
    value: values[property],
  }));

  const data = new FormData();
  const patchBlob = new Blob([JSON.stringify(patchData)], {
    type: 'application/json',
  });
  data.append('patch', patchBlob);

  // actual server image blob gets added in a separate
  // property
  if (propertiesChanged.includes('serverImg')) {
    data.append('serverImg', values.serverImg);
  }

  onSubmitData(data);
}

export default ServerSettings;
