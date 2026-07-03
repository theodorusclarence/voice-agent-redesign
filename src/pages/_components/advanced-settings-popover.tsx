import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCheckbox from '@/components/ui/forms/checkbox';
import FormHelperText from '@/components/ui/forms/helper-text';
import FormSelect from '@/components/ui/forms/select';
import FormSwitch from '@/components/ui/forms/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { type CreateAgentFormValues } from '@/pages/_components/create-agent-form';

export const MEETING_PRIVACY_OPTIONS = [
  'Teammates & Anyone with Link',
  'Only Teammates & Participants',
  'Only Teammates',
  'Only Participants in the Team',
  'Only agent owner',
].map((value) => ({ value, label: value }));

export const SEND_RECAP_EMAIL_OPTIONS = [
  'Owner and participants',
  'Only agent owner and participants from my Fireflies team',
  'Only agent owner',
].map((value) => ({ value, label: value }));

function SettingHeading({
  title,
  description,
  htmlFor,
}: {
  title: string;
  description: string;
  htmlFor?: string;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className='block text-sm font-medium text-neutral-800'
      >
        {title}
      </label>
      <FormHelperText className='mt-0.5'>{description}</FormHelperText>
    </div>
  );
}

interface AdvancedSettingsPopoverProps
  extends React.ComponentPropsWithRef<typeof PopoverTrigger> {
  className?: string;
}

const AdvancedSettingsPopover = React.forwardRef<
  React.ComponentRef<typeof PopoverTrigger>,
  AdvancedSettingsPopoverProps
>(function AdvancedSettingsPopover({ ...rest }, ref) {
  const form = useFormContext<CreateAgentFormValues>();

  const id = React.useId();
  const visibilityId = `${id}-visibility`;
  const meetingPrivacyId = `${id}-meetingPrivacy`;
  const sendRecapEmailId = `${id}-sendRecapEmail`;

  return (
    <Popover>
      <PopoverTrigger asChild ref={ref} {...rest} />
      <PopoverContent
        collisionPadding={16}
        className='w-[420px] max-w-[90vw] p-0'
      >
        <div className='divide-y-[0.5px] divide-black/[0.06]'>
          <div className='flex items-start justify-between gap-6 py-4 px-6 pt-6'>
            <SettingHeading
              title='Visibility'
              description='Allow members of your workspace to discover and edit this Voice Agent.'
              htmlFor={visibilityId}
            />
            <FormSwitch
              label={null}
              id={visibilityId}
              size='sm'
              className='mt-0.5'
              {...form.register('visibility')}
            />
          </div>

          <div className='py-4 px-6'>
            <SettingHeading
              title='Meeting Privacy'
              description='Choose who can view session notes and transcript.'
              htmlFor={meetingPrivacyId}
            />
            <FormSelect
              label={null}
              id={meetingPrivacyId}
              className='mt-2.5'
              {...form.register('meetingPrivacy')}
              options={MEETING_PRIVACY_OPTIONS}
            />
          </div>

          <div className='py-4 px-6'>
            <SettingHeading
              title='Send Recap Email'
              description="Choose who'll receive session recap email."
              htmlFor={sendRecapEmailId}
            />
            <FormSelect
              label={null}
              id={sendRecapEmailId}
              className='mt-2.5'
              {...form.register('sendRecapEmail')}
              options={SEND_RECAP_EMAIL_OPTIONS}
            />
          </div>

          <div className='py-4 px-6 pb-6'>
            <SettingHeading
              title='Participant Info Required Before Talking To Agent'
              description='If email is selected, users will need to verify with an OTP.'
            />
            <div className='mt-3 flex items-center gap-6'>
              <FormCheckbox
                label='Name'
                {...form.register('participantName')}
              />
              <FormCheckbox
                label='Email'
                {...form.register('participantEmail')}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
AdvancedSettingsPopover.displayName = 'AdvancedSettingsPopover';

export default AdvancedSettingsPopover;
