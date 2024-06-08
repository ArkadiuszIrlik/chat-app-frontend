import ExclamationIcon from '@assets/exclamation-point-128.png';
import { ExtendedCSSProperties } from '@src/types';

const exclamationStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ExclamationIcon})`,
};

function FieldError({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={exclamationStyles}
        className="alpha-mask aspect-square h-5 w-5 shrink-0 grow-0 bg-red-300"
      />
      <p className="min-w-0 break-words text-red-300">{errorMessage}</p>
    </div>
  );
}
export default FieldError;
