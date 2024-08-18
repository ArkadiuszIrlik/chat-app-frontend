import { DestructiveSecondaryButton } from '@components/DestructiveSecondaryButton';
import DeleteChannelGroupModal from '@components/ChannelGroupSettings/DeleteChannelGroupModal';
import { SettingsOverlay } from '@components/SettingsOverlay';
import {
  ErrorDisplay,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { Form, Formik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import Yup from '@src/extendedYup';
import { getPropertiesChanged } from '@helpers/forms';
import { channelGroupSchema } from '@constants/validationSchema';

function ChannelGroupSettings({
  server,
  channelGroup,
  onCloseSettings,
}: {
  server: Server;
  channelGroup: ChannelCategory;
  onCloseSettings: () => void;
}) {
  const initialValues = useMemo(
    () => ({
      name: channelGroup.name,
    }),
    [channelGroup],
  );

  const [postData, setPostData] = useState(new FormData());

  const { refetch, isLoading, hasError, errorMessage } = useFetch({
    initialUrl: `servers/${server._id}/channelCategories/${channelGroup._id}`,
    method: 'PATCH',
    onMount: false,
    postData,
    isFileUpload: true,
  });

  const [isDeleteChannelGroupModalOpen, setIsDeleteChannelGroupModalOpen] =
    useState(false);
  const handleOpenDeleteChannelGroupModal = useCallback(() => {
    setIsDeleteChannelGroupModalOpen(true);
  }, []);
  const handleCloseDeleteChannelGroupModal = useCallback(() => {
    setIsDeleteChannelGroupModalOpen(false);
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object({
        name: channelGroupSchema.name.required(
          'Please enter a name for the channel group',
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
        label="Channel group settings"
        onCloseSettings={onCloseSettings}
      >
        <Form className="flex flex-col">
          {hasError && (
            <div className="max-w-prose">
              <ErrorDisplay errorMessage={errorMessage} />
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
              onClickHandler={handleOpenDeleteChannelGroupModal}
            >
              Delete Channel Group
            </DestructiveSecondaryButton>
          </div>
          {isDeleteChannelGroupModalOpen && (
            <DeleteChannelGroupModal
              onCancel={handleCloseDeleteChannelGroupModal}
              channelGroupId={channelGroup._id}
              serverId={server._id}
            />
          )}
          <SubmittingUpdater isFetchLoading={isLoading} />
        </Form>
      </SettingsOverlay>
    </Formik>
  );
}
export default ChannelGroupSettings;
