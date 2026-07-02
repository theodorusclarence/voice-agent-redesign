import { cn } from 'cnfast';
import * as React from 'react';

export const TypographyVariant = [
  'j1',
  'j2',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  's1',
  's2',
  's3',
  's4',
  'b1',
  'b2',
  'b3',
  'c1',
  'c2',
] as const;

type TypographyProps<T extends React.ElementType> = {
  /** @default <p> tag */
  as?: T;
  className?: string;
  /** @default b2 */
  variant?: (typeof TypographyVariant)[number];
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

/** @see https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript/ */
export type TypographyComponent = (<T extends React.ElementType = 'p'>(
  props: TypographyProps<T>
) => React.ReactNode | null) & {
  displayName?: string;
};

const Typography = React.forwardRef(function Typography<
  T extends React.ElementType = 'p'
>(
  props: Omit<TypographyProps<T>, 'ref'>,
  ref: React.ForwardedRef<React.Ref<T>>
) {
  const { as, children, className, variant = 'b2', ...rest } = props;
  const Component = (as || 'p') as React.ElementType;

  return (
    <Component ref={ref} className={cn([variant, className])} {...rest}>
      {children}
    </Component>
  );
}) as TypographyComponent;

Typography.displayName = 'Typography';

export default Typography;
