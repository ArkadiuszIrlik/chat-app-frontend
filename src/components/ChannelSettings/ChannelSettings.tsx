import { DestructiveSecondaryButton } from '@components/DestructiveSecondaryButton';
import { SettingsOverlay } from '@components/SettingsOverlay';
import {
  ErrorDisplay,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { Form, Formik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import DeleteChannelModal from '@components/ChannelSettings/DeleteChannelModal';
import { getPropertiesChanged } from '@helpers/forms';
import { channelSchema } from '@constants/validationSchema';
import Yup from '@src/extendedYup';

function ChannelSettings({
  server,
  channel,
  onCloseSettings,
}: {
  server: Server;
  channel: Channel;
  onCloseSettings: () => void;
}) {
  const initialValues = useMemo(
    () => ({
      name: channel.name,
    }),
    [channel],
  );
  const [postData, setPostData] = useState(new FormData());

  const { refetch, isLoading, hasError, errorMessage } = useFetch({
    initialUrl: `servers/${server._id}/channels/${channel._id}`,
    method: 'PATCH',
    onMount: false,
    postData,
    isFileUpload: true,
  });

  const [isDeleteChannelModalOpen, setIsDeleteChannelModalOpen] =
    useState(false);
  const handleOpenDeleteChannelModal = useCallback(() => {
    setIsDeleteChannelModalOpen(true);
  }, []);
  const handleCloseDeleteChannelModal = useCallback(() => {
    setIsDeleteChannelModalOpen(false);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={Yup.object({
        name: channelSchema.name.required(
          'Please enter a name for the channel',
        ),
      })}
      onSubmit={(values) => {
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

        setPostData(data);
        refetch();
      }}
    >
      <SettingsOverlay
        label="Channel settings"
        onCloseSettings={onCloseSettings}
      >
        <Form className="flex flex-col">
          {hasError && (
            <div className="max-w-prose">
              <ErrorDisplay errorMessage={errorMessage} />
            </div>
          )}
          <div className="mb-3 w-56">
            <TextInput label="Channel Name" name="name" id="name" type="text" />
          </div>
          <div className="w-40">
            <DestructiveSecondaryButton
              type="button"
              onClickHandler={handleOpenDeleteChannelModal}
            >
              Delete Channel
            </DestructiveSecondaryButton>
          </div>
          {isDeleteChannelModalOpen && (
            <DeleteChannelModal
              onCancel={handleCloseDeleteChannelModal}
              serverId={server._id}
              channelId={channel._id}
            />
          )}
          <SubmittingUpdater isFetchLoading={isLoading} />
        </Form>
      </SettingsOverlay>
    </Formik>
  );
}
export default ChannelSettings;
