import Seo from '@/components/seo';
import Form from '@/components/ui/forms/form';

import AgentCallPreview from '@/pages/_components/agent-call-preview';
import CreateAgentForm, {
  useCreateAgentForm,
} from '@/pages/_components/create-agent-form';

export default function HomePage() {
  const form = useCreateAgentForm();

  return (
    <main className='bg-stone-200 h-svh p-8 py-12 flex flex-col  bg-grid'>
      <Seo />

      <Form
        form={form}
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('create agent', values);
        }}
        className='grid grid-cols-2 gap-6 grow min-h-0 max-w-[1200px] mx-auto w-full'
      >
        <div className='bg-stone-25 h-full min-h-0 rounded-4xl shadow-soft'>
          <CreateAgentForm />
        </div>
        <div className='bg-dark text-stone-25 h-full min-h-0 rounded-4xl p-10 shadow-soft'>
          <AgentCallPreview />
        </div>
      </Form>
    </main>
  );
}
