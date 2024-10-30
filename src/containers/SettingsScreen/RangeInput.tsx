import { ExtendedCSSProperties } from '@src/types';
import { ChangeEvent, useId } from 'react';

RangeInput.defaultProps = {
  min: 0,
  max: 100,
};

function RangeInput({
  min = 0,
  max = 100,
  value,
  label,
  onChange,
}: {
  min?: number;
  max?: number;
  value: number;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputId = useId();
  const rangePercentage = value - min / max - min * 100;

  return (
    <label aria-label={label} htmlFor={inputId} className="block w-full">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        // prevents moving the slider from triggering swipe navigation
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <input
          min={min}
          max={max}
          type="range"
          name=""
          className="gradient-slider w-full"
          id={inputId}
          value={value}
          onChange={onChange}
          style={
            {
              '--range-percentage': `${rangePercentage}%`,
            } as ExtendedCSSProperties
          }
        />
      </div>
    </label>
  );
}
export default RangeInput;
