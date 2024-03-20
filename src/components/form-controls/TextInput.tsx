/* eslint-disable react/jsx-props-no-spreading */
import { useField, FieldHookConfig } from 'formik';
import { InputHTMLAttributes, ClassAttributes } from 'react';

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
        <div className="flex items-center gap-2">
          <div className="exclamation-mask aspect-square h-5 w-5 bg-red-300" />
          <p className="text-red-300">{meta.error}</p>
        </div>
      ) : null}
    </>
  );
}
export default TextInput;
