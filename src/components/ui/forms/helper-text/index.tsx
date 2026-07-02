import { cn } from 'cnfast';
import * as React from 'react';

type FormHelperTextProps = React.ComponentPropsWithoutRef<'p'>;

const FormHelperText = ({ className, ...rest }: FormHelperTextProps) => {
  return (
    <p className={cn(['text-xs text-neutral-400', className])} {...rest} />
  );
};

export default FormHelperText;
