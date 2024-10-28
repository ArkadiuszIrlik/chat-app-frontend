import { ExtendedCSSProperties } from '@src/types';

ModalButtonA.defaultProps = {
  ariaLabel: undefined,
};

function ModalButtonA({
  text,
  iconStyleObj,
  ariaLabel = undefined,
  onClick,
}: {
  text: string;
  iconStyleObj: ExtendedCSSProperties;
  ariaLabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="group flex w-full items-center gap-4 rounded-md bg-gray-600
        px-2 py-2 text-gray-300 active:bg-gray-500 active:text-gray-200
        using-mouse:hover:bg-gray-500 using-mouse:hover:text-gray-200"
    >
      <div
        className="alpha-mask mx-1 aspect-square h-5 w-5 bg-gray-400 
          group-active:bg-gray-300 using-mouse:group-hover:bg-gray-300"
        style={iconStyleObj}
      />
      {text}
    </button>
  );
}

export default ModalButtonA;
