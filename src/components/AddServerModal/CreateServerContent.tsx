import { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import {
  ErrorDisplay,
  ImageFileInput,
  SubmitButtonPrimary,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import Yup from '@src/extendedYup';
import useFetch from '@hooks/useFetch';
import { serverSchema } from '@constants/validationSchema';
import { useServerStore } from '@hooks/index';
import { useNavigate } from 'react-router-dom';

function CreateServerContent({
  onNavigateBack,
  onCloseModal,
  onCloseServersMenu,
}: {
  onNavigateBack: () => void;
  onCloseModal: () => void;
  onCloseServersMenu: () => void;
}) {
  const [postData, setPostData] = useState(new FormData());

  const { refetch, isLoading, data, hasError, errorMessage } = useFetch({
    initialUrl: 'servers',
    method: 'POST',
    onMount: false,
    postData,
    isFileUpload: true,
  });

  const { addToStore } = useServerStore() ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasError && data && addToStore) {
      const { server } = data.data as { server: Server | undefined };
      if (!server) {
        return;
      }
      addToStore(server);
      navigate(`/app/channels/${server._id}`);
      onCloseModal();
      onCloseServersMenu();
    }
  }, [hasError, data, addToStore, navigate, onCloseModal, onCloseServersMenu]);

  return (
    <Formik
      initialValues={{
        image: '',
        name: '',
      }}
      validationSchema={Yup.object({
        image: serverSchema.image.required(
          'Please provide an image for your server.',
        ),
        name: serverSchema.name.required(
          'Please enter a name for your server.',
        ),
      })}
      onSubmit={(values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) =>
          formData.append(key, value),
        );
        setPostData(formData);
        refetch();
      }}
    >
      <Form>
        {hasError && <ErrorDisplay errorMessage={errorMessage} />}
        <div className="mb-1">
          <ImageFileInput
            textLabel="Server image"
            buttonLabel="Upload server image"
            name="image"
            id="image"
          />
        </div>
        <div className="mb-3">
          <TextInput label="Server name" name="name" id="name" type="text" />
        </div>
        <SubmittingUpdater isFetchLoading={isLoading} />
        <div className="mb-3 flex items-center gap-10">
          <button
            type="button"
            onClick={onNavigateBack}
            className="block w-32 underline-offset-2 hover:underline"
          >
            Back
          </button>
          <div className="w-40">
            <SubmitButtonPrimary>Create&nbsp;server</SubmitButtonPrimary>
          </div>
        </div>
      </Form>
    </Formik>
  );
}

export default CreateServerContent;
