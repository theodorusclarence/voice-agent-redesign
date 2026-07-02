import { Button } from '@/components/buttons/button';
import Seo from '@/components/seo';

export default function HomePage() {
  return (
    <main>
      <Seo />
      <p>Home</p>
      <div className='flex gap-3 p-4'>
        <Button variant='primary'>Primary</Button>
        <Button variant='secondary'>Secondary</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button variant='primary' disabled>
          Disabled
        </Button>
      </div>
    </main>
  );
}
