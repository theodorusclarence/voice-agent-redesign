import Seo from '@/components/seo';
import Form from '@/components/ui/forms/form';

import AgentCallPreview from '@/pages/_components/agent-call-preview';
import { useAgentPreview } from '@/pages/_components/agent-call-preview/_utils/use-agent-preview';
import CreateAgentForm, {
  useCreateAgentForm,
} from '@/pages/_components/create-agent-form';
import MobilePreviewDrawer from '@/pages/_components/mobile-preview-drawer';

export default function HomePage() {
  const form = useCreateAgentForm();

  return (
    <main className='bg-stone-200 h-svh flex flex-col bg-grid lg:p-8 lg:py-12'>
      <Seo />

      <Form
        form={form}
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('create agent', values);
        }}
        className='grid grid-cols-1 lg:grid-cols-2 gap-6 grow min-h-0 max-w-[1200px] mx-auto w-full'
      >
        <BuilderPanels />
      </Form>
    </main>
  );
}

/**
 * Split off the page so `useAgentPreview` can read the form context that
 * `<Form>` provides. Desktop shows the form and the call preview side by
 * side; on mobile the form owns the screen and the preview docks into a
 * bottom drawer — both render off the same preview state, so play state
 * survives crossing the breakpoint.
 */
function BuilderPanels() {
  const preview = useAgentPreview();

  return (
    <>
      <div className='bg-stone-25 h-full min-h-0 lg:rounded-4xl lg:shadow-soft'>
        <CreateAgentForm />
      </div>
      <div className='hidden lg:block bg-dark text-stone-25 h-full min-h-0 rounded-4xl p-10 shadow-soft'>
        <AgentCallPreview preview={preview} />
      </div>
      <MobilePreviewDrawer preview={preview} />
    </>
  );
}
