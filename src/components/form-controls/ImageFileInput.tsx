/* eslint-disable react/jsx-props-no-spreading */
import { ExtendedCSSProperties } from '@src/types';
import { useField, FieldHookConfig, useFormikContext } from 'formik';
import {
  InputHTMLAttributes,
  ClassAttributes,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import ImageIcon from '@assets/image-icon.png';
import { ServerImage } from '@components/ServerImage';
import FieldError from '@components/form-controls/FieldError';

interface ImageInputInterface {
  textLabel: string;
  buttonLabel: string;
  initialImageUrl?: string;
}

ImageFileInput.defaultProps = {
  initialImageUrl: '',
};

const addImageStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ImageIcon})`,
};

const fileReader = new FileReader();
function ImageFileInput({
  textLabel,
  buttonLabel,
  initialImageUrl,
  ...props
}: ImageInputInterface &
  InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement> &
  FieldHookConfig<string>) {
  const [field, meta] = useField(props);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const [imgUrl, setImgUrl] = useState(initialImageUrl ?? '');

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const imgFile = e.currentTarget.files?.[0];
    if (imgFile) {
      await setFieldValue(field.name, imgFile);
      void setFieldTouched(field.name, true);
    }
  }

  useEffect(() => {
    function setFileAsImgUrl() {
      if (typeof fileReader.result === 'string') {
        setImgUrl(fileReader.result);
      }
    }
    fileReader.addEventListener('load', setFileAsImgUrl);
    return () => {
      fileReader.removeEventListener('load', setFileAsImgUrl);
    };
  }, []);

  useEffect(() => {
    // useful when resetting settings form
    if (typeof field.value === 'string') {
      setImgUrl(initialImageUrl ?? '');
    }
    if (
      (field.value as unknown) instanceof Blob &&
      meta.touched &&
      !meta.error
    ) {
      try {
        fileReader.readAsDataURL(field.value as unknown as Blob);
      } catch {
        /* empty */
      }
    }
  }, [field.value, meta.touched, meta.error, initialImageUrl]);

  return (
    <>
      <div className="flex">
        <label
          className="mb-1 flex flex-col items-start"
          htmlFor={props.id ?? props.name}
        >
          {textLabel}
          <div
            className="inline-block cursor-pointer flex-col items-start
           rounded-lg focus-within:outline"
          >
            {imgUrl === '' ? (
              <div
                className={`flex aspect-square h-20 w-20 shrink-0 grow-0 
                items-center justify-center rounded-full border-solid ${
                  meta.touched && meta.error
                    ? 'border-2 border-red-400'
                    : 'border-b-2 border-[hsla(0,_0%,_70%,_.15)]'
                } bg-gray-800 p-2 shadow-inner`}
              >
                <div
                  className="alpha-mask aspect-square h-11 w-11 shrink-0
                   grow-0 bg-gray-200"
                  style={addImageStyles}
                />
              </div>
            ) : (
              <div className="aspect-square h-20 w-20 shrink-0 grow-0">
                <ServerImage image={imgUrl} />
              </div>
            )}
            <input
              className="sr-only"
              {...props}
              aria-label={buttonLabel}
              name={field.name}
              type="file"
              accept="image/*"
              onChange={(e) => {
                void handleImageChange(e);
              }}
            />
          </div>
        </label>
      </div>
      {meta.touched && meta.error ? (
        <FieldError errorMessage={meta.error} />
      ) : null}
    </>
  );
}
export default ImageFileInput;
