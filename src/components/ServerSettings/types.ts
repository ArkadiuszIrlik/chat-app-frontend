import { PresetImage } from '@components/ImageInput/ImageInput.types';

// Needs to be "type" instead of "interface" to be compatible with Record type
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ServerSettingsValues = {
  name: string;
  serverImg: unknown;
  selectServerImg: PresetImage | null;
  uploadServerImg: Blob | null;
  isUploadingServerImg: boolean;
};

export { type ServerSettingsValues };
