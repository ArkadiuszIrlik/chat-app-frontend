import { ReactNode } from 'react';

type DestructivePrimaryButtonType = RegularButton | SubmitButton;

interface RegularButton {
  type: HTMLButtonElement['type'];
  disabled?: boolean;
  children: ReactNode;
  onClickHandler: () => void;
}

interface SubmitButton {
  type: 'submit';
  disabled?: boolean;
  children: ReactNode;
  onClickHandler?: never;
}

DestructivePrimaryButton.defaultProps = {
  disabled: false,
};

function DestructivePrimaryButton({
  type,
  disabled,
  children,
  onClickHandler,
}: DestructivePrimaryButtonType) {
  return (
    <div className="w-full shadow">
      <button
        /* eslint-disable-next-line react/button-has-type */
        type={type}
        disabled={disabled}
        onClick={onClickHandler}
        className="w-full rounded-md bg-red-600
        px-5 py-2 text-white shadow-[inset_0_2px_0_rgba(209,71,71,100%)] hover:brightness-110
         active:brightness-125 disabled:brightness-75"
      >
        {children}
      </button>
    </div>
  );
}
export default DestructivePrimaryButton;
