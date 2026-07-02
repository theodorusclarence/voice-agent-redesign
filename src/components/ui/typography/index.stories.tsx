import type { Meta, StoryObj } from '@storybook/nextjs';

import Typography, { TypographyVariant } from './index';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: TypographyVariant,
    },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    variant: 'b2',
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'b2',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-3 p-4'>
      {TypographyVariant.map((variant) => (
        <Typography key={variant} variant={variant}>
          {variant}: The quick brown fox jumps over the lazy dog
        </Typography>
      ))}
    </div>
  ),
};
