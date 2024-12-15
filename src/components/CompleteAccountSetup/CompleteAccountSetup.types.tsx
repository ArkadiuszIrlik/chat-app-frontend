import { PresetImage } from '@components/ImageInput/ImageInput.types';

interface FormValues {
  username: string;
  selectProfilePicture: PresetImage | null;
  uploadProfilePicture: Blob | null;
  profileImg: unknown;
  isUploadingProfilePicture: boolean;
}

export { type FormValues };
