import CloseIcon from '@assets/close-icon.png';
import { ExtendedCSSProperties } from '@src/types';

const closeIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${CloseIcon})`,
};

function CloseButton({
  ariaLabel,
  onClose,
}: {
  ariaLabel: string;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={ariaLabel}
      className="group ml-auto block rounded-md p-1 using-mouse:hover:bg-gray-600"
    >
      <div
        className="alpha-mask aspect-square h-5 w-5 shrink-0 grow-0 bg-gray-400
              using-mouse:group-hover:bg-gray-300"
        style={closeIconStyles}
      />
    </button>
  );
}

export default CloseButton;
