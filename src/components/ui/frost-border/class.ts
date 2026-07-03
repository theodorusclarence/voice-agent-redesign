import { type ClassValue, cn } from 'cnfast';
import type * as React from 'react';

/**
 * Gradient "frosted glass" border. Spread the class names and style onto the
 * same element; the ring itself is painted by `.frost-border::before` in
 * globals.css.
 */
export function getFrostBorder() {
  return {
    getClassName: getFrostBorderClassNames,
    getStyle: getFrostBorderStyle,
  };
}

function getFrostBorderClassNames(customClassName?: ClassValue[]) {
  return cn([
    'frost-border',
    'relative', // the ::before ring is absolutely positioned
    'transition duration-200',
    'backdrop-blur-sm',
    'border-transparent',
    customClassName,
  ]);
}

function getFrostBorderStyle({
  borderWidth = 0.5,
  variant = 'default',
}: {
  borderWidth?: number;
  variant?: 'default' | 'white';
} = {}): React.CSSProperties {
  const background =
    variant === 'white'
      ? `linear-gradient(
      to bottom right,
      rgba(255 255 255 / 0.4) 0%,
      rgba(255 255 255 / 0.1) 42%,
      rgba(255 255 255 / 0.1) 62%,
      rgba(255 255 255 / 0.4) 100%
    )`
      : `linear-gradient(
      to bottom right,
      rgba(255 255 255 / 1) 0%,
      rgba(255 255 255 / 0.35) 42%,
      rgba(255 255 255 / 0.35) 62%,
      rgba(255 255 255 / 1) 100%
    )`;

  return {
    '--borderWidth': borderWidth,
    '--background': background,

    /**
     * fix bug where if we use a gradient background, the background will be
     * cut off at the border
     * @see https://stackoverflow.com/a/51785787
     */
    backgroundOrigin: 'border-box',

    // we use a transparent border which will be filled with the gradient border
    borderWidth: borderWidth,
  } as React.CSSProperties;
}
