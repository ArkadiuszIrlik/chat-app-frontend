import { useFormikContext } from 'formik';
import { useCallback, useEffect, useRef } from 'react';

ImageUpload.defaultProps = {
  textLabel: undefined,
  ariaLabel: undefined,
  buttonClassName: '',
  clearFileOnNullishValue: true,
  acceptedFileFormats: undefined,
};

function ImageUpload<N extends string>({
  imageFieldName,
  imageFieldId,
  textLabel = undefined,
  ariaLabel = undefined,
  buttonClassName = '',
  clearFileOnNullishValue = true,
  acceptedFileFormats = undefined,
  onImageSelected,
}: {
  imageFieldName: N;
  imageFieldId: string;
  textLabel?: string;
  ariaLabel?: string;
  buttonClassName?: string;
  /** Specifies if input should remove the currently uploaded file when its
   * form value is set to null or undefined. Default: true.
   */
  clearFileOnNullishValue?: boolean;
  acceptedFileFormats?: string[];
  /** Callback that will be invoked when an image file is selected and
   * successfully passes validation.
   */
  onImageSelected: (imageFile: File) => void;
}) {
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null);
  const { setFieldValue, setFieldTouched, values } =
    useFormikContext<Record<N, unknown>>();

  const resetUploadInput = useCallback(async () => {
    if (uploadImageInputRef.current) {
      uploadImageInputRef.current.value = '';
    }
    await setFieldValue(imageFieldName, null, true);
  }, [imageFieldName, setFieldValue]);

  const handleImageUploadChange = useCallback(async () => {
    const chosenFile = uploadImageInputRef.current?.files?.[0];
    // if no files, reset
    if (!chosenFile) {
      await resetUploadInput();
      void setFieldTouched(imageFieldName, true, false);
      return;
    }

    const validationError = await setFieldValue(
      imageFieldName,
      chosenFile ?? null,
      true,
    );
    // validate has to be set to false to prevent Formik running
    // validation on previous value
    void setFieldTouched(imageFieldName, true, false);

    if (!validationError?.[imageFieldName]) {
      onImageSelected(chosenFile);
    }
  }, [
    imageFieldName,
    setFieldValue,
    setFieldTouched,
    onImageSelected,
    resetUploadInput,
  ]);

  useEffect(() => {
    if (
      clearFileOnNullishValue &&
      (values[imageFieldName] === null || values[imageFieldName] === undefined)
    ) {
      if (uploadImageInputRef.current) {
        uploadImageInputRef.current.value = '';
      }
    }
  }, [clearFileOnNullishValue, imageFieldName, values, resetUploadInput]);

  return (
    <label
      htmlFor={imageFieldId}
      aria-label={ariaLabel}
      className={`${buttonClassName} block cursor-pointer text-center
         outline-offset-2 has-[:focus-visible]:outline`}
    >
      {textLabel}
      <input
        ref={uploadImageInputRef}
        type="file"
        accept={
          acceptedFileFormats ? acceptedFileFormats.join(', ') : 'image/*'
        }
        className="sr-only"
        name={imageFieldName}
        id={imageFieldId}
        onChange={() => {
          void handleImageUploadChange();
        }}
        readOnly
      />
    </label>
  );
}
export default ImageUpload;
