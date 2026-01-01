import Link from 'next/link';
import { Button } from './components/ui/Button';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-black p-4 gap-6 font-sans'>
      <h1 className='text-3xl font-bold text-white mb-8'>Optik Perwira Jaya</h1>

      <div className='flex flex-col gap-4 w-full max-w-xs'>
        <Link href='/create' className='w-full'>
          <Button variant='primary' className='h-16 text-lg'>
            Buat Transaksi Baru
          </Button>
        </Link>

        <Link href='/history' className='w-full'>
          <Button variant='secondary' className='h-16 text-lg'>
            Riwayat Transaksi
          </Button>
        </Link>
      </div>
    </main>
  );
}
