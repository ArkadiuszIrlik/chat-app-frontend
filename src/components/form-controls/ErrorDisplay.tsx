import ExclamationIcon from '@assets/exclamation-point-128.png';
import { ExtendedCSSProperties } from '@src/types';

const exclamationStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ExclamationIcon})`,
};

function ErrorDisplay({ errorMessage }: { errorMessage: string }) {
  return (
    <div
      className="mb-2 flex
             items-center gap-3 rounded-lg border-[1px] border-red-300
             bg-red-900 px-3 py-2 text-red-300"
    >
      <div
        style={exclamationStyles}
        className="alpha-mask aspect-square h-5 w-5 min-w-0 shrink-0 grow-0
         bg-red-300"
      />
      <div className="min-w-0 break-words">{errorMessage}</div>
    </div>
  );
}
export default ErrorDisplay;
