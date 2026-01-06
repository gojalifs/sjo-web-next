'use client';

import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import Link from 'next/link';

interface Invoice {
  id: number;
  receiptNo: string;
  patientName: string;
  date: string;
  totalAmount: number;
  // include other fields as necessary from your schema if you use them
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/invoices');
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        } else {
          console.error('Failed to fetch history');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900'></div>
          </div>
        ) : (
          <>
            {history.map((invoice) => (
              <div
                key={invoice.id}
                className='bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow'
              >
                <div>
                  <h3 className='font-bold text-zinc-900'>
                    {invoice.receiptNo}
                  </h3>
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
          </>
        )}
      </div>
    </div>
  );
}
