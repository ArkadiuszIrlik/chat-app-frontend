import { ReactNode } from 'react';

interface SecondaryButtonInterface {
  type: HTMLButtonElement['type'];
  disabled?: boolean;
  children: ReactNode;
  onClickHandler: () => void;
}

SecondaryButton.defaultProps = {
  disabled: false,
};

function SecondaryButton({
  type,
  disabled,
  children,
  onClickHandler,
}: SecondaryButtonInterface) {
  return (
    <div className="w-full shadow">
      <button
        /* eslint-disable-next-line react/button-has-type */
        type={type}
        disabled={disabled}
        onClick={onClickHandler}
        className="relative z-0 w-full min-w-full rounded-md px-5 py-2
        text-white hover:brightness-110 active:brightness-125 disabled:brightness-75"
      >
        <span
          className="mask-content absolute inset-0 -z-10 rounded-md bg-gradient-to-tr from-clairvoyant-900
          to-cerise-600 p-1 shadow-[inset_0_2px_0_rgba(221,85,177,70%)]"
        />
        {children}
      </button>
    </div>
  );
}
export default SecondaryButton;
