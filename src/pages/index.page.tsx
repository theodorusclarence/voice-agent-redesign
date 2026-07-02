import Seo from '@/components/seo';

export default function HomePage() {
  return (
    <main className='bg-stone-200 min-h-svh p-8 py-12 flex flex-col  bg-grid'>
      <Seo />

      <div className='grid grid-cols-2 gap-6 grow max-w-[1200px] mx-auto w-full'>
        <div className='bg-stone-25 h-full rounded-4xl p-10 shadow-soft'>
          forms here bottle
        </div>
        <div className='bg-dark text-stone-25 h-full rounded-4xl p-10 shadow-soft'>
          preview here
        </div>
      </div>
    </main>
  );
}
