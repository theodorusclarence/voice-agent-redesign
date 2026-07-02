import type { Meta, StoryObj } from '@storybook/nextjs';

import Input from '@/components/ui/input';

import FormLabel from './index';

const meta = {
  title: 'Components/FormLabel',
  component: FormLabel,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    optional: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Email address',
  },
} satisfies Meta<typeof FormLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Optional: Story = {
  args: {
    optional: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className='flex flex-col gap-3 p-4'>
      <FormLabel>Default</FormLabel>
      <FormLabel optional>Optional</FormLabel>
      <FormLabel readOnly>Read only</FormLabel>
      <FormLabel disabled>Disabled</FormLabel>
    </div>
  ),
};

export const WithInput: Story = {
  render: () => (
    <div className='flex w-80 flex-col gap-1.5 p-4'>
      <FormLabel htmlFor='email'>Email address</FormLabel>
      <Input id='email' placeholder='you@example.com' />
    </div>
  ),
};

export const WithInputOptional: Story = {
  render: () => (
    <div className='flex w-80 flex-col gap-1.5 p-4'>
      <FormLabel htmlFor='company' optional>
        Company name
      </FormLabel>
      <Input id='company' placeholder='Acme Inc.' />
    </div>
  ),
};

export const WithInputError: Story = {
  render: () => (
    <div className='flex w-80 flex-col gap-1.5 p-4'>
      <FormLabel htmlFor='email-error'>Email address</FormLabel>
      <Input id='email-error' error defaultValue='notanemail' />
    </div>
  ),
};

export const WithInputDisabled: Story = {
  render: () => (
    <div className='flex w-80 flex-col gap-1.5 p-4'>
      <FormLabel htmlFor='email-disabled' disabled>
        Email address
      </FormLabel>
      <Input id='email-disabled' disabled defaultValue='you@example.com' />
    </div>
  ),
};

export const WithInputReadOnly: Story = {
  render: () => (
    <div className='flex w-80 flex-col gap-1.5 p-4'>
      <FormLabel htmlFor='email-readonly' readOnly>
        Email address
      </FormLabel>
      <Input id='email-readonly' readOnly defaultValue='you@example.com' />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className='flex w-80 flex-col gap-5 p-4'>
      <div className='flex flex-col gap-1.5'>
        <FormLabel htmlFor='name'>Full name</FormLabel>
        <Input id='name' placeholder='Jane Doe' />
      </div>
      <div className='flex flex-col gap-1.5'>
        <FormLabel htmlFor='company-2' optional>
          Company name
        </FormLabel>
        <Input id='company-2' placeholder='Acme Inc.' />
      </div>
      <div className='flex flex-col gap-1.5'>
        <FormLabel htmlFor='email-2'>Email address</FormLabel>
        <Input id='email-2' error defaultValue='notanemail' />
      </div>
    </div>
  ),
};
