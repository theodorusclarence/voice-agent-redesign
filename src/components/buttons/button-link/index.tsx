import { cn } from 'cnfast';
import Link from 'next/link';
import * as React from 'react';

import {
  type ButtonVariant,
  getButtonVariant,
} from '@/components/buttons/class';

export interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant: (typeof ButtonVariant)[number];
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, ...rest }, ref) => {
    return (
      <Link
        className={cn([getButtonVariant(variant), className])}
        {...rest}
        ref={ref}
      />
    );
  }
);

ButtonLink.displayName = 'ButtonLink';

export default ButtonLink;
