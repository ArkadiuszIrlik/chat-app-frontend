import { useState } from 'react';
import FieldError from '@components/form-controls/FieldError';
import useToggle from '@hooks/useToggle';
import ImageUpload from '@components/ImageInput/ImageUpload';
import ImageContainer from '@components/ImageInput/ImageContainer';
import useImageInput from '@components/ImageInput/useImageInput';
import {
  CurrentImageProps,
  IsUploadingImageProps,
  PresetImage,
  SelectImageProps,
  UploadImageProps,
} from '@components/ImageInput/ImageInput.types';
import SelectPresetImageModal from '@components/ImageInput/SelectPresetImageModal';

interface ImageInputInterface {
  initialImageUrl?: string;
  uploadedImageProps: UploadImageProps;
  presetImageProps: SelectImageProps;
  currentImageProps: CurrentImageProps;
  isUploadingImageProps: IsUploadingImageProps;
  presetImages: PresetImage[];
  sectionAriaLabel: string;
  sectionTextLabel: string;
  imageUploadUrl: string;
  selectPresetModalLabel: string;
  acceptedFileFormats?: string[];
  /** When set to true, it will use currentImage value as displayed image URL
   * when uploadedImage and presetImage are empty. Default: false
   */
  isCurrentImageUrl?: boolean;
}

ImageInput.defaultProps = {
  initialImageUrl: '',
  acceptedFileFormats: undefined,
  isCurrentImageUrl: false,
};

const imageButtonClass =
  'rounded-md border-2 border-gray-400 px-3 py-2 using-mouse:hover:bg-gray-600 shadow-md text-gray-100 using-mouse:hover:text-white';

function ImageInput({
  initialImageUrl = undefined,
  uploadedImageProps,
  presetImageProps,
  currentImageProps,
  isUploadingImageProps,
  presetImages,
  sectionAriaLabel,
  sectionTextLabel,
  imageUploadUrl,
  selectPresetModalLabel,
  acceptedFileFormats = undefined,
  isCurrentImageUrl = false,
}: ImageInputInterface) {
  const [imgUrl, setImgUrl] = useState<string | null>(initialImageUrl ?? null);
  const {
    deactivate: closeSelectImageDialog,
    toggle: toggleOpenSelectImageDialog,
    isActive: isOpenSelectImageDialog,
  } = useToggle();

  const {
    metaUpload,
    metaPreset,
    metaCurrent,
    metaIsUploading,
    fieldPreset,
    fieldUpload,
    handleSelectPresetPicture,
    handleUploadImage,
  } = useImageInput({
    currentImageProps,
    isUploadingImageProps,
    presetImageProps,
    updateImgUrl: setImgUrl,
    uploadedImageProps,
    imageUploadUrl,
    isCurrentImageUrl,
  });

  return (
    <fieldset>
      <legend className="sr-only">{sectionAriaLabel}</legend>
      <p className="mb-1">{sectionTextLabel}</p>
      <div className="flex gap-x-20">
        <div className="flex items-center">
          <ImageContainer
            imgUrl={imgUrl ?? ''}
            hasError={
              !!(metaUpload.touched && metaUpload.error) ||
              !!(metaPreset.touched && metaPreset.error) ||
              !!(metaCurrent.touched && metaCurrent.error) ||
              !!(metaIsUploading.touched && metaIsUploading.error)
            }
          />
        </div>
        <div>
          <button
            type="button"
            onClick={toggleOpenSelectImageDialog}
            aria-label={`Select from collection, ${
              fieldPreset.value?.altText ?? 'none'
            } selected`}
            className={`${imageButtonClass} mb-2 outline-offset-2`}
          >
            Select from collection
          </button>
          <SelectPresetImageModal
            isOpen={isOpenSelectImageDialog}
            imagesToSelect={presetImages}
            initialSelectedImage={fieldPreset.value}
            label={selectPresetModalLabel}
            onCloseModal={closeSelectImageDialog}
            onSelect={(nextSelection) =>
              void handleSelectPresetPicture(nextSelection)
            }
          />
          <ImageUpload
            imageFieldName={fieldUpload.name}
            imageFieldId={uploadedImageProps.id ?? fieldUpload.name}
            onImageSelected={(nextImage) => void handleUploadImage(nextImage)}
            textLabel="Upload your own"
            buttonClassName={imageButtonClass}
            acceptedFileFormats={acceptedFileFormats}
          />
        </div>
      </div>
      {metaUpload.touched && metaUpload.error ? (
        <FieldError errorMessage={metaUpload.error} />
      ) : null}
      {metaPreset.touched && metaPreset.error ? (
        <FieldError errorMessage={metaPreset.error} />
      ) : null}
      {metaCurrent.touched && metaCurrent.error ? (
        <FieldError errorMessage={metaCurrent.error} />
      ) : null}
      {metaIsUploading.touched && metaIsUploading.error ? (
        <FieldError errorMessage={metaIsUploading.error} />
      ) : null}
    </fieldset>
  );
}

export default ImageInput;
