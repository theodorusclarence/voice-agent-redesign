import type { Meta, StoryObj } from '@storybook/nextjs';

import { ButtonVariant } from '@/components/ui/buttons/class';

import { Button } from './index';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ButtonVariant,
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
  },
} satisfies Meta<typeof Button>;

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

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
  },
};

// The dark variant lives on the call preview panel, so it gets a matching
// backdrop — on the default light canvas it's nearly invisible.
export const Dark: Story = {
  args: {
    variant: 'dark',
  },
  decorators: [
    (StoryComponent) => (
      <div className='bg-dark w-fit rounded-2xl p-6'>
        <StoryComponent />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex flex-wrap gap-3'>
        <Button variant='primary'>Primary</Button>
        <Button variant='secondary'>Secondary</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button variant='primary' disabled>
          Disabled
        </Button>
      </div>
      <div className='bg-dark flex w-fit flex-wrap gap-3 rounded-2xl p-4'>
        <Button variant='dark'>Dark</Button>
        <Button variant='dark' disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};
