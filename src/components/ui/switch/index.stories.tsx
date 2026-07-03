import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';

import { Switch } from './index';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
  },
  args: {
    size: 'md',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4 p-4'>
      <Switch />
      <Switch defaultChecked />
      <Switch size='sm' />
      <Switch size='sm' defaultChecked />
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
};
