import useFetch from '@hooks/useFetch';
import { useField, useFormikContext } from 'formik';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  CurrentImageProps,
  IsUploadingImageProps,
  PresetImage,
  SelectImageProps,
  UploadImageProps,
} from '@components/ImageInput/ImageInput.types';

const fileReader = new FileReader();
const emptyFormData = new FormData();

function useImageInput({
  uploadedImageProps,
  presetImageProps,
  currentImageProps,
  isUploadingImageProps,
  imageUploadUrl,
  isCurrentImageUrl = false,
  updateImgUrl,
}: {
  uploadedImageProps: UploadImageProps;
  presetImageProps: SelectImageProps;
  currentImageProps: CurrentImageProps;
  isUploadingImageProps: IsUploadingImageProps;
  imageUploadUrl: string;
  /** When set to true, it will call updateImgUrl with currentImage value
   * instead of null when uploadedImage and presetImage are empty.
   * Default: false
   */
  isCurrentImageUrl?: boolean;
  updateImgUrl: (nextUrl: string | null) => void;
}) {
  const [fieldPreset, metaPreset] = useField(presetImageProps);
  const [fieldUpload, metaUpload] = useField({
    ...uploadedImageProps,
    type: 'file',
  });
  const [fieldCurrent, metaCurrent] = useField(currentImageProps);
  const [fieldIsUploading, metaIsUploading] = useField(isUploadingImageProps);
  const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUploadFormData, setImageUploadFormData] =
    useState<FormData>(emptyFormData);

  const {
    data: uploadData,
    isLoading: isUploading,
    error: uploadError,
    refetch,
    abort,
  } = useFetch<{
    message: string;
    data: { image: unknown };
  }>({
    initialUrl: imageUploadUrl,
    onMount: false,
    method: 'POST',
    isFileUpload: true,
    postData: imageUploadFormData,
  });

  const handleUploadImage = useCallback(
    async (imageFile: File) => {
      // reset fieldPreset
      await setFieldValue(fieldPreset.name, null, true);
      void setFieldTouched(fieldPreset.name, true, false);
      // hide "no value" validation until the api upload completes
      void setFieldTouched(fieldCurrent.name, false, true);

      const formData = new FormData();
      formData.set('image', imageFile);

      setImageUploadFormData(formData);
      refetch();
    },
    [
      fieldPreset.name,
      fieldCurrent.name,
      setFieldTouched,
      setFieldValue,
      refetch,
    ],
  );

  const resetUploadInput = useCallback(async () => {
    fileReader.abort();
    abort();
    if (uploadImageInputRef.current) {
      uploadImageInputRef.current.value = '';
    }
    await setFieldValue(fieldUpload.name, null, true);
  }, [fieldUpload.name, setFieldValue, abort]);

  useEffect(() => {
    if (uploadData) {
      const nextImage = uploadData.data.image;
      void setFieldValue(fieldCurrent.name, nextImage, true);
    }
  }, [uploadData, fieldCurrent.name, setFieldValue]);

  useEffect(() => {
    async function handleError() {
      if (uploadError) {
        await resetUploadInput();
        setFieldError(fieldUpload.name, uploadError.message);
      }
    }
    void handleError();
  }, [uploadError, fieldUpload.name, resetUploadInput, setFieldError]);

  useEffect(() => {
    void setFieldValue(fieldIsUploading.name, isUploading, false);
    // set touched to false to stop validation until form is submitted
    void setFieldTouched(fieldIsUploading.name, false, false);
  }, [fieldIsUploading.name, isUploading, setFieldValue, setFieldTouched]);

  // keep imgUrl in sync with currently selected image
  useEffect(() => {
    fileReader.abort();
    function setFileAsImgUrl() {
      if (metaUpload.error) {
        updateImgUrl(null);
        return;
      }
      if (typeof fileReader.result === 'string') {
        updateImgUrl(fileReader.result);
      }
    }

    // in case somehow both are defined, reset
    if (fieldPreset.value && fieldUpload.value) {
      updateImgUrl(null);
      return;
    }
    if (fieldPreset.value) {
      const nextUrl = fieldPreset.value?.url ?? null;
      updateImgUrl(nextUrl);
      return;
    }
    if (fieldUpload.value) {
      const uploadedFile = fieldUpload.value;
      fileReader.readAsDataURL(uploadedFile);
      fileReader.addEventListener('load', setFileAsImgUrl);
      return;
    }

    if (
      isCurrentImageUrl &&
      fieldCurrent.value &&
      typeof fieldCurrent.value === 'string'
    ) {
      updateImgUrl(fieldCurrent.value);
      return;
    }

    updateImgUrl(null);
  }, [
    fieldPreset.value,
    fieldUpload.value,
    fieldCurrent.value,
    metaUpload.error,
    isCurrentImageUrl,
    resetUploadInput,
    updateImgUrl,
  ]);

  const handleSelectPresetPicture = useCallback(
    async (nextSelection: PresetImage) => {
      await resetUploadInput();
      await setFieldValue(fieldPreset.name, nextSelection, true);
      void setFieldTouched(fieldPreset.name, true, false);
      await setFieldValue(fieldCurrent.name, nextSelection.id, true);
      void setFieldTouched(fieldCurrent.name, true, false);
    },
    [
      fieldPreset.name,
      fieldCurrent.name,
      resetUploadInput,
      setFieldValue,
      setFieldTouched,
    ],
  );

  return {
    fieldCurrent,
    fieldIsUploading,
    fieldPreset,
    fieldUpload,
    metaCurrent,
    metaIsUploading,
    metaPreset,
    metaUpload,
    handleUploadImage,
    handleSelectPresetPicture,
  };
}

export default useImageInput;
