import CloseIcon from '@assets/close-icon.png';
import { ExtendedCSSProperties } from '@src/types';

const closeIconStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${CloseIcon})`,
};

ModalHeaderA.defaultProps = {
  closeButtonAriaLabel: 'Close modal',
};

function ModalHeaderA({
  text,
  closeButtonAriaLabel = 'Close modal',
  onCloseModal,
}: {
  text: string;
  closeButtonAriaLabel?: string;
  onCloseModal: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h1 className="text-xl text-gray-200">{text}</h1>
      <button
        type="button"
        onClick={onCloseModal}
        aria-label={closeButtonAriaLabel}
        className="group ml-auto block rounded-md p-1 using-mouse:hover:bg-gray-600"
      >
        <div
          className="alpha-mask aspect-square h-5 w-5 shrink-0 grow-0 bg-gray-400
              using-mouse:group-hover:bg-gray-300"
          style={closeIconStyles}
        />
      </button>
    </div>
  );
}

export default ModalHeaderA;
