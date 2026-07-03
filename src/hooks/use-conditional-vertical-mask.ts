import * as React from 'react';

interface UseConditionalVerticalMaskOptions {
  /** Fade percentage for the top edge (default: 2) */
  fadeTop?: number;
  /** Fade percentage for the bottom edge (default: 2) */
  fadeBottom?: number;
}

interface UseConditionalVerticalMaskReturn<T extends HTMLElement> {
  /** Ref to attach to the scrollable container */
  ref: React.RefObject<T | null>;
  /** The maskImage CSS value, or undefined if no overflow */
  maskImage: string | undefined;
  /** Whether there's overflow on the top */
  overflowTop: boolean;
  /** Whether there's overflow on the bottom */
  overflowBottom: boolean;
}

/**
 * Conditionally applies a vertical fade mask to a scrollable container based
 * on overflow state. The mask only appears on edges where content overflows.
 *
 * @example
 * ```tsx
 * const { ref, maskImage } = useConditionalVerticalMask({
 *   fadeTop: 5,
 *   fadeBottom: 5,
 * });
 *
 * return (
 *   <div ref={ref} className='overflow-y-auto' style={{ maskImage }}>
 *     {children}
 *   </div>
 * );
 * ```
 */
export function useConditionalVerticalMask<
  T extends HTMLElement = HTMLDivElement
>(
  options: UseConditionalVerticalMaskOptions = {}
): UseConditionalVerticalMaskReturn<T> {
  const { fadeTop = 2, fadeBottom = 2 } = options;

  const containerRef = React.useRef<T>(null);
  const [overflowTop, setOverflowTop] = React.useState(false);
  const [overflowBottom, setOverflowBottom] = React.useState(false);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkOverflow = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setOverflowTop(scrollTop > 0);
      setOverflowBottom(scrollTop + clientHeight < scrollHeight - 1);
    };

    checkOverflow();

    container.addEventListener('scroll', checkOverflow);
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', checkOverflow);
      resizeObserver.disconnect();
    };
  }, []);

  const getMaskImage = React.useCallback(() => {
    if (overflowTop && overflowBottom) {
      return `linear-gradient(to bottom, transparent 0%, white ${fadeTop}%, white ${
        100 - fadeBottom
      }%, transparent 100%)`;
    }
    if (overflowTop) {
      return `linear-gradient(to bottom, transparent 0%, white ${fadeTop}%)`;
    }
    if (overflowBottom) {
      return `linear-gradient(to bottom, white ${
        100 - fadeBottom
      }%, transparent 100%)`;
    }
    return undefined;
  }, [overflowTop, overflowBottom, fadeTop, fadeBottom]);

  return {
    ref: containerRef,
    maskImage: getMaskImage(),
    overflowTop,
    overflowBottom,
  };
}
