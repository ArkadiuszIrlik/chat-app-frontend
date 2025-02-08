/* eslint-disable react/jsx-props-no-spreading */
import styleConsts from '@constants/styleConsts';
import { useField, FieldHookConfig } from 'formik';
import { ClassAttributes, OutputHTMLAttributes } from 'react';
import { SyncLoader } from 'react-spinners';

interface TextOutputInterface {
  label: string;
  isLoading: boolean;
}

function TextOutput({
  label,
  isLoading,
  ...props
}: TextOutputInterface &
  OutputHTMLAttributes<HTMLOutputElement> &
  ClassAttributes<HTMLOutputElement> &
  FieldHookConfig<string>) {
  const [field, meta] = useField(props);
  return (
    <>
      <label className="mb-1 block" htmlFor={props.id ?? props.name}>
        {label}
      </label>
      <output
        className={`mb-1 block w-full rounded-lg border-solid ${
          meta.touched && meta.error
            ? 'border-2 border-red-400'
            : 'border-b-2 border-[hsla(0,_0%,_70%,_.15)]'
        } overflow-x-auto bg-gray-800 p-2 shadow-inner`}
        {...field}
        {...props}
        // name={props.name}
        // type={props.type}
        // placeholder={props.placeholder}
        // id={props.id}
      >
        {isLoading ? (
          <div className="relative w-full">
            <div aria-hidden="true" className="invisible">
              Generating invite
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <SyncLoader
                size={10}
                color={styleConsts.colors.gray[300]}
                speedMultiplier={0.8}
              />
            </div>
          </div>
        ) : (
          props.value
        )}
      </output>
      {meta.touched && meta.error ? (
        <div className="flex items-center gap-2">
          <div className="exclamation-mask aspect-square h-5 w-5 bg-red-300" />
          <p className="text-red-300">{meta.error}</p>
        </div>
      ) : null}
    </>
  );
}
export default TextOutput;
