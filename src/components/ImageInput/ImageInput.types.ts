import { FieldHookConfig } from 'formik';
import { ClassAttributes, InputHTMLAttributes } from 'react';

interface PresetImage {
  id: string;
  altText: string;
  url: string;
}

interface ExpectedFormValues {
  selectImage: PresetImage | null;
  uploadImage: Blob | null;
  currentImage: unknown;
  isUploadingImage: boolean;
}

type SelectImageProps = InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement> &
  FieldHookConfig<ExpectedFormValues['selectImage']>;
type UploadImageProps = InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement> &
  FieldHookConfig<ExpectedFormValues['uploadImage']>;
type CurrentImageProps = InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement> &
  FieldHookConfig<ExpectedFormValues['currentImage']>;
type IsUploadingImageProps = InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement> &
  FieldHookConfig<ExpectedFormValues['isUploadingImage']>;

export {
  type PresetImage,
  type ExpectedFormValues,
  type SelectImageProps,
  type UploadImageProps,
  type CurrentImageProps,
  type IsUploadingImageProps,
};
