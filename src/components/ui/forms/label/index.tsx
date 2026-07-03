import { cn } from 'cnfast';
import * as React from 'react';

import Typography from '@/components/ui/typography';

interface FormLabelProps extends React.ComponentPropsWithoutRef<'label'> {
  disabled?: boolean;
  readOnly?: boolean;
  optional?: boolean;
}
const FormLabel = ({
  className,
  disabled,
  readOnly,
  optional,
  children,
  ...rest
}: FormLabelProps) => {
  return (
    <Typography
      as='label'
      variant='s3'
      className={cn([
        'font-medium text-neutral-500 c1',
        disabled && 'cursor-not-allowed text-neutral-400',
        readOnly && 'text-neutral-500',
        className,
      ])}
      {...rest}
    >
      {children}
      {optional && <span className='text-neutral-400 ml-px'> (optional)</span>}
    </Typography>
  );
};

export default FormLabel;
