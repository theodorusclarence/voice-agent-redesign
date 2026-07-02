import { Mail01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import Input from './index';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    unstyled: {
      control: 'boolean',
    },
    withClearButton: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Enter text...',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLeftNode: Story = {
  args: {
    leftNode: <HugeiconsIcon icon={Search01Icon} size={16} />,
    placeholder: 'Search...',
  },
};

export const WithRightNode: Story = {
  args: {
    rightNode: <HugeiconsIcon icon={Mail01Icon} size={16} />,
    placeholder: 'you@example.com',
  },
};

export const WithClearButton: Story = {
  args: {
    withClearButton: true,
    defaultValue: 'Clearable value',
  },
};

export const Error: Story = {
  args: {
    error: true,
    defaultValue: 'Invalid value',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Disabled value',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Read only value',
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: 'border border-dashed border-gray-400 p-2 text-sm',
    placeholder: 'Unstyled input',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className='flex flex-col gap-3 p-4'>
      <Input placeholder='Default' />
      <Input
        leftNode={<HugeiconsIcon icon={Search01Icon} size={16} />}
        placeholder='With left node'
      />
      <Input
        rightNode={<HugeiconsIcon icon={Mail01Icon} size={16} />}
        placeholder='With right node'
      />
      <Input withClearButton defaultValue='With clear button' />
      <Input error defaultValue='Error state' />
      <Input disabled defaultValue='Disabled state' />
      <Input readOnly defaultValue='Read only state' />
    </div>
  ),
};
