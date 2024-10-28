import { ErrorDisplay } from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useFormikContext } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { SettingsContainer } from '@components/SettingsContainer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { genericFetcherCredentials } from '@helpers/fetch';
import { SyncLoader } from 'react-spinners';
import styleConsts from '@constants/styleConsts';
import SettingsContainerBlockUnsaved from '@components/SettingsContainer/SettingsContainerBlockUnsaved';
import { BlockUnsavedProvider, useBlockUnsaved } from '@hooks/index';
import { ServerSettingsValues } from '@components/ServerSettings/types';
import SettingsForm from '@components/ServerSettings/SettingsForm';
import SettingsFormikProvider from '@components/ServerSettings/SettingsFormikProvider';

function ServerSettings() {
  const { state } = useLocation() as { state: { server?: Server } | null };
  const { serverId } = useParams();
  const shouldFetch = !state?.server;

  const { data, error, isLoading } = useSWR<Server, BackendError>(
    shouldFetch ? `/servers/${serverId}` : null,
    genericFetcherCredentials,
  );

  const server = state?.server ?? data;

  const navigate = useNavigate();
  const handleCloseSettings = useCallback(() => {
    if (window.history?.length && window.history.length > 1) {
      navigate(-1);
    } else if (serverId) {
      navigate(`/app/channels/${serverId}`);
    } else {
      navigate('/app/');
    }
  }, [navigate, serverId]);

  return server && !isLoading ? (
    <SettingsWithServer
      server={server}
      handleCloseSettings={handleCloseSettings}
    />
  ) : (
    <SettingsNoServer
      hasError={!!error}
      errorMessage={error?.message ?? ''}
      isLoading={isLoading}
      handleCloseSettings={handleCloseSettings}
    />
  );
}

function SettingsNoServer({
  handleCloseSettings,
  hasError,
  errorMessage,
  isLoading,
}: {
  handleCloseSettings: () => void;
  hasError: boolean;
  errorMessage: string;
  isLoading: boolean;
}) {
  return (
    <SettingsContainer
      label="Server settings"
      onCloseSettings={handleCloseSettings}
    >
      {hasError && !isLoading && (
        <div className="max-w-prose">
          <ErrorDisplay errorMessage={errorMessage} />
        </div>
      )}
      {isLoading && (
        <div className="flex grow items-center justify-center">
          <SyncLoader
            color={styleConsts.colors.gray[300]}
            speedMultiplier={0.8}
            size={10}
          />
        </div>
      )}
    </SettingsContainer>
  );
}

function SettingsWithServer({
  server,
  handleCloseSettings,
}: {
  server: Server;
  handleCloseSettings: () => void;
}) {
  const initialValues = useMemo(
    () => ({
      name: server.name,
      serverImg: server.serverImg,
    }),
    [server],
  );

  const [postData, setPostData] = useState(new FormData());

  const { refetch, isLoading, hasError, errorMessage } = useFetch({
    initialUrl: `servers/${server._id}`,
    method: 'PATCH',
    onMount: false,
    postData,
    isFileUpload: true,
  });

  const handleSubmitForm = useCallback(
    (data: FormData) => {
      setPostData(data);
      refetch();
    },
    [refetch],
  );

  return (
    <SettingsFormikProvider
      initialValues={initialValues}
      onSubmitData={handleSubmitForm}
    >
      <BlockUnsavedWrapper
        server={server}
        handleCloseSettings={handleCloseSettings}
        errorMessage={errorMessage}
        hasError={hasError}
        isLoading={isLoading}
      />
    </SettingsFormikProvider>
  );
}

function BlockUnsavedWrapper({
  server,
  handleCloseSettings,
  hasError,
  errorMessage,
  isLoading,
}: {
  server: Server;
  handleCloseSettings: () => void;
  hasError: boolean;
  errorMessage: string;
  isLoading: boolean;
}) {
  const { initialValues, values, resetForm, submitForm, isSubmitting } =
    useFormikContext<ServerSettingsValues>();

  return (
    <BlockUnsavedProvider
      onCancelChanges={resetForm}
      onConfirmChanges={() => void submitForm()}
      initialValues={initialValues}
      currentValues={values}
    >
      <SettingsWrapper
        server={server}
        handleCloseSettings={handleCloseSettings}
        errorMessage={errorMessage}
        hasError={hasError}
        isLoading={isLoading}
        initialValues={initialValues}
        isSubmitting={isSubmitting}
      />
    </BlockUnsavedProvider>
  );
}

function SettingsWrapper({
  server,
  handleCloseSettings,
  initialValues,
  hasError,
  errorMessage,
  isLoading,
  isSubmitting,
}: {
  server: Server;
  handleCloseSettings: () => void;
  initialValues: ServerSettingsValues;
  hasError: boolean;
  errorMessage: string;
  isLoading: boolean;
  isSubmitting: boolean;
}) {
  const blockUnsavedProps = useBlockUnsaved();
  const { blockUntilSaved } = blockUnsavedProps ?? {};

  const blockedHandleCloseSettings = useCallback(() => {
    if (blockUntilSaved) {
      blockUntilSaved(handleCloseSettings);
    }
    handleCloseSettings();
  }, [blockUntilSaved, handleCloseSettings]);

  return (
    <SettingsContainer
      label="Server settings"
      onCloseSettings={blockedHandleCloseSettings}
    >
      <SettingsForm
        hasError={hasError}
        errorMessage={errorMessage}
        initialValues={initialValues}
        isUpdateFetchLoading={isLoading}
        server={server}
      />
      {blockUnsavedProps && (
        <SettingsContainerBlockUnsaved
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...blockUnsavedProps}
          isSaveButtonDisabled={isSubmitting}
        />
      )}
    </SettingsContainer>
  );
}

export default ServerSettings;
