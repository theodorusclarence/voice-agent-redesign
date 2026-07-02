import { cn } from 'cnfast';
import * as React from 'react';

import {
  type ButtonVariant,
  getButtonVariant,
} from '@/components/ui/buttons/class';

export interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant: (typeof ButtonVariant)[number];
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, disabled, ...rest }, ref) => {
    return (
      <button
        type='button'
        disabled={disabled}
        className={cn([getButtonVariant(variant), className])}
        {...rest}
        ref={ref}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
