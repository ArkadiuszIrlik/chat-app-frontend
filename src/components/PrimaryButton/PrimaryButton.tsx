import { ReactNode } from 'react';

interface BaseProps {
  label?: string;
  disabled?: boolean;
  children: ReactNode;
}

interface RegularButton {
  type: HTMLButtonElement['type'];
  onClickHandler: () => void;
}

interface SubmitButton {
  type: 'submit';
  onClickHandler?: never;
}

type PrimaryButtonType = BaseProps & (RegularButton | SubmitButton);

PrimaryButton.defaultProps = {
  label: undefined,
  disabled: false,
};

function PrimaryButton({
  type,
  label = undefined,
  disabled = false,
  children,
  onClickHandler,
}: PrimaryButtonType) {
  return (
    <div className="w-full shadow">
      <button
        /* eslint-disable-next-line react/button-has-type */
        type={type}
        aria-label={label}
        disabled={disabled}
        onClick={onClickHandler}
        className="w-full rounded-md bg-gradient-to-tr from-clairvoyant-900 to-cerise-600
        px-5 py-2 text-white shadow-[inset_0_2px_0_rgba(221,85,177,80%)] hover:brightness-110
         active:brightness-125 disabled:brightness-75"
      >
        {children}
      </button>
    </div>
  );
}
export default PrimaryButton;
