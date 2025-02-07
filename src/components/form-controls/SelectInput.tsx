/* eslint-disable react/jsx-props-no-spreading */
import { useField, FieldHookConfig } from 'formik';
import { ClassAttributes, SelectHTMLAttributes } from 'react';
import { ExtendedCSSProperties } from '@src/types';
import DownArrowIcon from '@assets/down-arrow-fill.png';
import FieldError from '@components/form-controls/FieldError';

interface SelectInputInterface {
  label: string;
}

const downArrowStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${DownArrowIcon})`,
};

function SelectInput({
  label,
  ...props
}: SelectInputInterface &
  SelectHTMLAttributes<HTMLSelectElement> &
  ClassAttributes<HTMLSelectElement> &
  FieldHookConfig<string>) {
  const [field, meta] = useField(props);
  return (
    <>
      <label className="mb-1 block" htmlFor={props.id ?? props.name}>
        {label}
      </label>
      <div className="relative flex w-full items-center">
        <select
          className={`mb-1 w-full appearance-none rounded-lg border-solid ${
            meta.touched && meta.error
              ? 'border-2 border-red-400'
              : 'border-b-2 border-[hsla(0,_0%,_70%,_.15)]'
          } bg-gray-800 p-2 shadow-inner`}
          {...field}
          {...props}
        />
        <div
          style={downArrowStyle}
          className="alpha-mask pointer-events-none absolute right-4 aspect-square h-5 w-5 bg-gray-400"
        />
      </div>
      {meta.touched && meta.error ? (
        <FieldError errorMessage={meta.error} />
      ) : null}
    </>
  );
}

export default SelectInput;
