import {
  ErrorDisplay,
  SubmitButtonPrimary,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import { ImageInput } from '@components/ImageInput';
import { PresetImage } from '@components/ImageInput/ImageInput.types';
import { SUPPORTED_PROFILE_IMG_MIME_TYPES } from '@constants/apiData';
import { Form } from 'formik';

function SetupForm({
  hasError,
  errorMessage,
  isUpdateFetchLoading,
  presetImages,
}: {
  hasError: boolean;
  errorMessage: string;
  isUpdateFetchLoading: boolean;
  presetImages: PresetImage[];
}) {
  return (
    <Form className="flex flex-col">
      {hasError && (
        <div className="max-w-prose">
          <ErrorDisplay errorMessage={errorMessage} />
        </div>
      )}
      <div className="mb-3 w-56">
        <TextInput label="Username" name="username" id="username" type="text" />
      </div>
      <ImageInput
        uploadedImageProps={{
          name: 'uploadProfilePicture',
          id: 'uploadProfilePicture',
        }}
        presetImageProps={{
          name: 'selectProfilePicture',
          id: 'selectProfilePicture',
        }}
        currentImageProps={{
          name: 'profileImg',
          id: 'profileImg',
        }}
        isUploadingImageProps={{
          name: 'isUploadingProfilePicture',
          id: 'isUploadingProfilePicture',
        }}
        imageUploadUrl="images/profile-img"
        presetImages={presetImages}
        sectionAriaLabel="Choose your profile image"
        sectionTextLabel="Profile Picture"
        selectPresetModalLabel="Select Profile Picture"
        acceptedFileFormats={SUPPORTED_PROFILE_IMG_MIME_TYPES}
      />
      <div className="mb-16 mt-16 w-52">
        <SubmitButtonPrimary>Complete Account</SubmitButtonPrimary>
      </div>
      <SubmittingUpdater isFetchLoading={isUpdateFetchLoading} />
    </Form>
  );
}
export default SetupForm;
