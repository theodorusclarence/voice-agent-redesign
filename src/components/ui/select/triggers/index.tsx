import * as React from 'react';

import { type SelectPrimitiveTrigger } from '@/components/ui/select';

import FormButtonTrigger from './form-button-trigger';

export const SELECT_TRIGGER_TYPES = ['form-button'] as const;
export type SelectTriggerType = (typeof SELECT_TRIGGER_TYPES)[number];

export interface BaseSelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitiveTrigger> {
  error?: boolean;
}
export interface FormSelectTriggerProps extends BaseSelectTriggerProps {
  triggerType: SelectTriggerType;
}

/**
 * Trigger switch for the form select. Add new visual variants by creating a
 * sibling trigger component and wiring it into the `switch` + `SELECT_TRIGGER_TYPES`.
 */
const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitiveTrigger>,
  FormSelectTriggerProps
>(({ triggerType, ...rest }, ref) => {
  switch (triggerType) {
    case 'form-button':
    default:
      return <FormButtonTrigger {...rest} ref={ref} />;
  }
});

SelectTrigger.displayName = 'SelectTrigger';

export default SelectTrigger;
