import { db } from '@/db';
import { invoices } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Button } from '../components/ui/Button';
import Link from 'next/link';

// Since it's a server component we can fetch directly
export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const history = await db
    .select()
    .from(invoices)
    .orderBy(desc(invoices.createdAt));

  return (
    <div className='min-h-screen bg-white text-zinc-900 p-4 font-sans'>
      {/* Improved Header with Link */}
      <div className='flex items-center mb-8 gap-4'>
        <Link href='/' className='text-zinc-500 hover:text-zinc-900'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
            />
          </svg>
        </Link>
        <h1 className='text-xl font-normal'>Riwayat Transaksi</h1>
      </div>

      <div className='space-y-4 max-w-2xl mx-auto'>
        {history.map((invoice) => (
          <div
            key={invoice.id}
            className='bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow'
          >
            <div>
              <h3 className='font-bold text-zinc-900'>{invoice.receiptNo}</h3>
              <p className='text-sm text-zinc-500'>
                Pasien: {invoice.patientName}
              </p>
              <p className='text-xs text-zinc-400'>{invoice.date}</p>
            </div>

            <div className='flex flex-col items-end gap-2 w-full sm:w-auto'>
              <span className='font-mono text-blue-600 font-medium'>
                Rp {invoice.totalAmount.toLocaleString('id-ID')}
              </span>
              <a
                href={`/api/pdf?id=${invoice.receiptNo}`}
                target='_blank'
                className='w-full sm:w-auto'
              >
                <Button
                  variant='secondary'
                  className='text-sm py-2 px-4 w-full h-auto'
                >
                  Unduh PDF
                </Button>
              </a>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className='text-center text-zinc-500 py-10'>
            Belum ada transaksi.
          </div>
        )}
      </div>
    </div>
  );
}
