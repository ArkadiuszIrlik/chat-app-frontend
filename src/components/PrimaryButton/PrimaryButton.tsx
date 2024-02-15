import { ReactNode } from 'react';

interface PrimaryButtonInterface {
  type: HTMLButtonElement['type'];
  children: ReactNode;
  onClickHandler: () => void;
}

function PrimaryButton({
  type,
  children,
  onClickHandler,
}: PrimaryButtonInterface) {
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
