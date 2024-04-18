import { CSSProperties } from 'react';

type ExtendedCSSProperties = CSSProperties &
  Record<`--${string}`, number | string>;

export default ExtendedCSSProperties;
