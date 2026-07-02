import { cn } from 'cnfast';
import * as React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#6C47FF] text-white hover:bg-[#5B39E0] active:bg-[#4F30C9]',
  secondary:
    'border-black/[.14] bg-white text-[#2A2A26] hover:bg-[#F6F5F2] active:bg-[#EFEDE9]',
  ghost:
    'border-transparent bg-transparent text-[#514E5A] hover:bg-black/5 active:bg-black/[.09]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', disabled, type = 'button', ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[11px] border border-transparent px-5 py-3 font-geist text-sm font-semibold leading-none',
          'transition-[background-color_.15s,box-shadow_.15s,border-color_.15s,transform_.09s_ease]',
          'active:scale-[0.955]',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6C47FF]/[.28]',
          disabled
            ? 'cursor-not-allowed border-transparent bg-[#F1F0ED] text-[#B5B5AE]'
            : cn('cursor-pointer', variantClasses[variant]),
          className
        )}
        {...rest}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
