import * as React from 'react';

import { type ComboboxOption } from '@/components/ui/combobox/type';

import ButtonTrigger from './button-trigger';

export const SINGLE_COMBOBOX_TRIGGER_TYPE = ['button'] as const;
export type SingleComboboxTriggerType =
  (typeof SINGLE_COMBOBOX_TRIGGER_TYPE)[number];

export interface SingleComboboxTriggerProps
  extends React.ComponentPropsWithoutRef<'button'> {
  triggerType: SingleComboboxTriggerType;
  className?: string;

  placeholder?: {
    icon?: React.ReactNode;
    label?: string;
  };

  option: ComboboxOption | undefined;
}

/**
 * Trigger switch for the single combobox. Add new visual variants by creating a
 * sibling trigger component and wiring it into the `switch` + `SINGLE_COMBOBOX_TRIGGER_TYPE`.
 */
const SingleComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  SingleComboboxTriggerProps
>((props, ref) => {
  switch (props.triggerType) {
    case 'button':
    default:
      return <ButtonTrigger {...props} ref={ref} />;
  }
});
SingleComboboxTrigger.displayName = 'SingleComboboxTrigger';

export default SingleComboboxTrigger;
