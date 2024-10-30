import { ExtendedCSSProperties } from '@src/types';
import { ChangeEvent, useId } from 'react';

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputId = useId();
  const containerHeight = '1.6rem';
  const containerWidth = '3.5rem';
  const toggleWidth = '1.2rem';
  const toggleWallDistance = '0.3rem';

  const transitionDistance = `${
    parseFloat(containerWidth) -
    2 * parseFloat(toggleWallDistance) -
    parseFloat(toggleWidth)
  }rem`;
  return (
    <label
      aria-label={label}
      htmlFor={inputId}
      className="inline-block has-[:focus-visible]:outline"
    >
      <input
        type="checkbox"
        name=""
        className="sr-only"
        id={inputId}
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`checkbox-toggle-container relative flex cursor-pointer
          items-center rounded-full transition-colors ${
            checked ? 'bg-cerise-600' : 'bg-gray-400'
          }`}
        style={{ width: containerWidth, height: containerHeight }}
      >
        <div
          className={`${
            checked ? 'move-checkbox-toggle' : ''
          } absolute aspect-square rounded-full bg-white transition-[translate]
          duration-300`}
          style={
            {
              '--toggle-distance': transitionDistance,
              left: toggleWallDistance,
              width: toggleWidth,
            } as ExtendedCSSProperties
          }
        />
      </div>
    </label>
  );
}
export default Checkbox;
