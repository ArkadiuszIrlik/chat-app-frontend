import { DestructiveSecondaryButton } from '@components/DestructiveSecondaryButton';
import DeleteServerModal from '@components/ServerSettings/DeleteServerModal';
import { SettingsOverlay } from '@components/SettingsOverlay';
import {
  ErrorDisplay,
  ImageFileInput,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import { serverSchema } from '@constants/validationSchema';
import useFetch from '@hooks/useFetch';
import { Form, Formik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import Yup from '@src/extendedYup';
import { getPropertiesChanged } from '@helpers/forms';

function ServerSettings({
  server,
  onCloseSettings,
}: {
  server: Server;
  onCloseSettings: () => void;
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

  const [isDeleteServerModalOpen, setIsDeleteServerModalOpen] = useState(false);
  const handleOpenDeleteServerModal = useCallback(() => {
    setIsDeleteServerModalOpen(true);
  }, []);
  const handleCloseDeleteServerModal = useCallback(() => {
    setIsDeleteServerModalOpen(false);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={Yup.object({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        serverImg: Yup.mixed().oneOfSchemas([
          Yup.string(),
          // .test(
          //   'is-empty-string',
          //   (d) => `${d.path} should be an image file or an empty string`,
          //   (value) => value === initialValues.serverImg,
          // )
          serverSchema.image,
        ]),
        name: serverSchema.name.required(
          'Please enter a name for your server.',
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

        // actual server image blob gets added in a separate
        // property
        if (propertiesChanged.includes('serverImg')) {
          data.append('serverImg', values.serverImg);
        }

        setPostData(data);
        refetch();
      }}
    >
      <SettingsOverlay
        label="Server settings"
        onCloseSettings={onCloseSettings}
      >
        <Form className="flex flex-col">
          {hasError && (
            <div className="max-w-prose">
              <ErrorDisplay errorMessage={errorMessage} />
            </div>
          )}
          <div className="mb-3 w-56">
            <TextInput label="Server Name" name="name" id="name" type="text" />
          </div>
          <div className="mb-5">
            <ImageFileInput
              textLabel="Server Image"
              buttonLabel="Upload server image"
              // label="Server Image"
              initialImageUrl={initialValues.serverImg}
              name="serverImg"
              id="serverImg"
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            {/* <label
              aria-hidden
              htmlFor="serverImg"
              className="block cursor-pointer bg-green-500"
            >
              <SecondaryButton type="button">Change Image</SecondaryButton>
            </label> */}
          </div>
          <div className="w-40">
            <DestructiveSecondaryButton
              type="button"
              onClickHandler={handleOpenDeleteServerModal}
            >
              Delete&nbsp;Server
            </DestructiveSecondaryButton>
          </div>
          {isDeleteServerModalOpen && (
            <DeleteServerModal
              onCancel={handleCloseDeleteServerModal}
              serverId={server._id}
            />
          )}
          <SubmittingUpdater isFetchLoading={isLoading} />
        </Form>
      </SettingsOverlay>
    </Formik>
  );
}
export default ServerSettings;
