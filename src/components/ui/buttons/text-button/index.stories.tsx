import type { Meta, StoryObj } from '@storybook/nextjs';

import { TextButton, TextButtonVariant } from './index';

const meta = {
  title: 'Components/TextButton',
  component: TextButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: TextButtonVariant,
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Text button',
    variant: 'primary',
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
