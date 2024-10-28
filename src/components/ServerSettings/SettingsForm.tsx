import { ServerSettingsValues } from '@components/ServerSettings/types';
import useToggle from '@hooks/useToggle';
import { Form } from 'formik';
import { DestructiveSecondaryButton } from '@components/DestructiveSecondaryButton';
import DeleteServerModal from '@components/ServerSettings/DeleteServerModal';
import {
  ErrorDisplay,
  ImageFileInput,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';

function SettingsForm({
  hasError,
  errorMessage,
  initialValues,
  server,
  isUpdateFetchLoading,
}: {
  hasError: boolean;
  errorMessage: string;
  initialValues: ServerSettingsValues;
  server: Server;
  isUpdateFetchLoading: boolean;
}) {
  const {
    isActive: isDeleteServerModalOpen,
    activate: handleOpenDeleteServerModal,
    deactivate: handleCloseDeleteServerModal,
  } = useToggle();

  return (
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
      <DeleteServerModal
        isOpen={isDeleteServerModalOpen}
        onCloseModal={handleCloseDeleteServerModal}
        onCancel={handleCloseDeleteServerModal}
        serverId={server._id}
      />
      <SubmittingUpdater isFetchLoading={isUpdateFetchLoading} />
    </Form>
  );
}

export default SettingsForm;
