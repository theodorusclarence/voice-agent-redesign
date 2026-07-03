import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';

import { Checkbox } from './index';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  // `indeterminate` only exists as a controlled value, so this story drives
  // the classic tri-state "select all" pattern instead of using args.
  render: function IndeterminateExample() {
    const [items, setItems] = React.useState([true, false]);
    const all = items.every(Boolean);
    const some = items.some(Boolean);

    return (
      <div className='flex flex-col gap-2.5 p-4'>
        <label className='flex items-center gap-2 text-sm text-neutral-800'>
          <Checkbox
            checked={all ? true : some ? 'indeterminate' : false}
            onCheckedChange={(checked) =>
              setItems(items.map(() => checked === true))
            }
          />
          Select all
        </label>
        {items.map((checked, i) => (
          <label
            key={i}
            className='ml-6 flex items-center gap-2 text-sm text-neutral-800'
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(next) =>
                setItems(items.map((c, j) => (j === i ? next === true : c)))
              }
            />
            Item {i + 1}
          </label>
        ))}
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4 p-4'>
      <Checkbox />
      <Checkbox defaultChecked />
      <Checkbox checked='indeterminate' />
      <Checkbox disabled />
      <Checkbox disabled defaultChecked />
    </div>
  ),
};
