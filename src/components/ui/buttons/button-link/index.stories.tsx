import type { Meta, StoryObj } from '@storybook/nextjs';

import { ButtonVariant } from '@/components/ui/buttons/class';

import { ButtonLink } from './index';

const meta = {
  title: 'Components/ButtonLink',
  component: ButtonLink,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ButtonVariant,
    },
  },
  args: {
    children: 'Button Link',
    href: '/',
    variant: 'primary',
  },
} satisfies Meta<typeof ButtonLink>;

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
        <ButtonLink href='/' variant='primary'>
          Primary
        </ButtonLink>
        <ButtonLink href='/' variant='secondary'>
          Secondary
        </ButtonLink>
        <ButtonLink href='/' variant='ghost'>
          Ghost
        </ButtonLink>
      </div>
      <div className='bg-dark flex w-fit flex-wrap gap-3 rounded-2xl p-4'>
        <ButtonLink href='/' variant='dark'>
          Dark
        </ButtonLink>
      </div>
    </div>
  ),
};
