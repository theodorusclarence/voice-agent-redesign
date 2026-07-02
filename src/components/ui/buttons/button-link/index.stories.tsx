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

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3 p-4'>
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
  ),
};
