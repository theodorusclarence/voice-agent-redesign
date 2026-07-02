import type * as React from 'react';

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}
