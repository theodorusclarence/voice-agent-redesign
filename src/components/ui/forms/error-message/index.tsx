import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import * as React from 'react';

import Typography from '@/components/ui/typography';

type FormErrorMessageProps = React.ComponentPropsWithoutRef<'p'>;

const FormErrorMessage = ({
  className,
  children,
  ...rest
}: FormErrorMessageProps) => {
  return (
    <Typography
      as='p'
      variant='c1'
      className={cn(['flex items-center gap-1 text-red-500', className])}
      {...rest}
    >
      <HugeiconsIcon icon={AlertCircleIcon} size={14} className='shrink-0' />
      {children}
    </Typography>
  );
};

export default FormErrorMessage;
