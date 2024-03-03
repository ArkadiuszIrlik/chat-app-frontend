import { ReactNode } from 'react';

type PrimaryButtonType = RegularButton | SubmitButton;

interface RegularButton {
  type: HTMLButtonElement['type'];
  children: ReactNode;
  onClickHandler: () => void;
}

interface SubmitButton {
  type: 'submit';
  children: ReactNode;
  onClickHandler?: never;
}

function PrimaryButton({ type, children, onClickHandler }: PrimaryButtonType) {
  return (
    <div className="w-full shadow">
      <button
        /* eslint-disable-next-line react/button-has-type */
        type={type}
        onClick={onClickHandler}
        className="w-full rounded-md bg-gradient-to-tr from-clairvoyant-900 to-cerise-600
        px-5 py-2 text-white shadow-[inset_0_2px_0_rgba(221,85,177,80%)] hover:brightness-110
         active:brightness-125"
      >
        {children}
      </button>
    </div>
  );
}
export default PrimaryButton;
