import { DestructiveSecondaryButton } from '@components/DestructiveSecondaryButton';
import {
  ErrorDisplay,
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
import { ImageInput } from '@components/ImageInput';
import { SUPPORTED_SERVER_IMG_MIME_TYPES } from '@constants/apiData';
import usePresetPictures from '@hooks/usePresetPictures';

const serverNotFoundErrorObj = {
  message: 'Server not found',
};

const serverValidationSchema = Yup.object({
  serverImg: Yup.mixed().required('Please select or upload a server image'),
  name: serverSchema.name.required('Please enter a name for your server.'),
  selectServerImg: Yup.mixed().nullable(),
  uploadServerImg: Yup.mixed()
    .oneOfSchemas(
      [
        // this schema is here just to allow null values
        Yup.string().nullable(),
        serverSchema.image,
      ],
      { passNestedError: 1 },
    )
    .nullable(),
  isUploadingServerImg: Yup.boolean()
    .isFalse('Please wait while your server image is uploaded')
    .required(),
});

function ServerSettings() {
  const location = useLocation();
  const { state } = location as {
    state: { server?: Server } | null;
  };
  const { serverId } = useParams();
  const { pictures: presetPictures } = usePresetPictures({
    type: 'server image',
  });

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
            <TextInput
              label="Server Name"
              name="name"
              type="text"
              maxLength={30}
            />
          </div>
          <div className="mb-5">
            <ImageInput
              uploadedImageProps={{
                name: 'uploadServerImg',
                id: 'uploadServerImg',
              }}
              presetImageProps={{
                name: 'selectServerImg',
                id: 'selectServerImg',
              }}
              currentImageProps={{
                name: 'serverImg',
                id: 'serverImg',
              }}
              isUploadingImageProps={{
                name: 'isUploadingServerImg',
                id: 'isUploadingServerImg',
              }}
              imageUploadUrl="images/server-img"
              presetImages={presetPictures}
              sectionAriaLabel="Choose your server image"
              sectionTextLabel="Server Image"
              selectPresetModalLabel="Select Server Image"
              acceptedFileFormats={SUPPORTED_SERVER_IMG_MIME_TYPES}
              isCurrentImageUrl
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
  onSubmitData: (data: { patch: Record<string, unknown>[] }) => void,
) {
  const patchableProperties = ['name', 'serverImg'] as const;

  const initialValuesSubset = Object.fromEntries(
    patchableProperties.map((key) => [key, initialValues[key]]),
  ) as Record<keyof ServerSettingsValues, unknown>;
  const valuesSubset = Object.fromEntries(
    patchableProperties.map((key) => [key, values[key]]),
  ) as Record<keyof ServerSettingsValues, unknown>;
  const propertiesChanged = getPropertiesChanged(
    initialValuesSubset,
    valuesSubset,
  );

  const patch = propertiesChanged.map((property) => ({
    op: 'replace',
    path: `/${property}`,
    value: values[property],
  }));

  onSubmitData({ patch });
}

export default ServerSettings;
