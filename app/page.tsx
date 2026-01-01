import Link from 'next/link';
import { Button } from './components/ui/Button';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='relative flex min-h-screen flex-col items-center justify-center p-4 font-sans overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/home-bg.jpg'
          alt='Background'
          fill
          className='object-cover'
          quality={100}
          priority
        />
        {/* Dark Overlay for readability */}
        <div className='absolute inset-0 bg-black/50 backdrop-blur-[2px]' />
      </div>

      {/* Content Container */}
      <div className='relative z-10 flex flex-col items-center w-full max-w-sm'>
        {/* Logo or Brand Element could go here */}
        <div className='mb-8 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl'>
          <Image
            src='/logo.png'
            alt='Logo'
            width={100}
            height={100}
            className='w-16 h-16 rounded-full'
          />
        </div>

        <h1 className='text-4xl font-bold text-white mb-2 text-center tracking-tight drop-shadow-md'>
          Optik Perwira Jaya
        </h1>
        <p className='text-zinc-200 mb-10 text-center text-sm font-light tracking-wide opacity-80'>
          Professional Eye Care Services
        </p>

        <div className='flex flex-col gap-4 w-full bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl'>
          <Link href='/create' className='w-full group'>
            <Button
              variant='primary'
              className='h-14 text-lg font-medium bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg'
            >
              Buat Transaksi Baru
            </Button>
          </Link>

          <Link href='/history' className='w-full group'>
            <Button
              variant='secondary'
              className='h-14 text-lg font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 backdrop-blur-sm'
            >
              Riwayat Transaksi
            </Button>
          </Link>
        </div>

        <footer className='mt-12 text-xs text-zinc-400 font-light'>
          © {new Date().getFullYear()} Optik Perwira Jaya. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
