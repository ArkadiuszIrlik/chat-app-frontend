import { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import {
  ErrorDisplay,
  SubmitButtonPrimary,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import Yup from '@src/extendedYup';
import useFetch from '@hooks/useFetch';
import { serverSchema } from '@constants/validationSchema';
import { useServerStore } from '@hooks/index';
import { useNavigate } from 'react-router-dom';
import { ImageInput } from '@components/ImageInput';
import { SUPPORTED_SERVER_IMG_MIME_TYPES } from '@constants/apiData';
import usePresetPictures from '@hooks/usePresetPictures';

const initialValues = {
  serverName: '',
  selectServerImg: null,
  uploadServerImg: null,
  serverImg: '',
  isUploadingServerImg: false,
};

function CreateServerContent({
  onNavigateBack,
  onCloseModal,
  onCloseServersMenu,
}: {
  onNavigateBack: () => void;
  onCloseModal: () => void;
  onCloseServersMenu: () => void;
}) {
  const [postData, setPostData] = useState({});
  const { pictures: presetPictures } = usePresetPictures({
    type: 'server image',
  });

  const { refetch, isLoading, data, hasError, errorMessage } = useFetch({
    initialUrl: 'servers',
    method: 'POST',
    onMount: false,
    postData,
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
      initialValues={initialValues}
      validationSchema={Yup.object({
        serverName: serverSchema.name.required(
          'Please enter a name for your server',
        ),
        serverImg: Yup.mixed().required(
          'Please select or upload a server image',
        ),
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
      })}
      onSubmit={(values) => {
        setPostData({
          serverName: values.serverName,
          serverImg: values.serverImg,
        });
        refetch();
      }}
    >
      <Form>
        {hasError && <ErrorDisplay errorMessage={errorMessage} />}
        <div className="mb-1">
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
          />
        </div>
        <div className="mb-3">
          <TextInput
            label="Server name"
            name="serverName"
            type="text"
            maxLength={30}
          />
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
