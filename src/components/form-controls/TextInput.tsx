/* eslint-disable react/jsx-props-no-spreading */
import { useField, FieldHookConfig } from 'formik';
import { InputHTMLAttributes, ClassAttributes } from 'react';
import FieldError from '@components/form-controls/FieldError';

interface TextInputInterface {
  label: string;
}

function TextInput({
  label,
  ...props
}: TextInputInterface &
  InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement> &
  FieldHookConfig<string>) {
  const [field, meta] = useField(props);
  return (
    <>
      <label className="mb-1 block" htmlFor={props.id ?? props.name}>
        {label}
      </label>
      <input
        className={`mb-1 w-full rounded-lg border-solid ${
          meta.touched && meta.error
            ? 'border-2 border-red-400'
            : 'border-b-2 border-[hsla(0,_0%,_70%,_.15)]'
        } bg-gray-800 p-2 shadow-inner`}
        {...field}
        {...props}
        // name={props.name}
        // type={props.type}
        // placeholder={props.placeholder}
        // id={props.id}
      />
      {meta.touched && meta.error ? (
        <FieldError errorMessage={meta.error} />
      ) : null}
    </>
  );
}
export default TextInput;
