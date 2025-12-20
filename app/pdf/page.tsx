'use client';

import { useState } from 'react';

export default function PdfPage() {
  const [invoiceId, setInvoiceId] = useState('TR-0000122-dummy3');
  const [previewUrl, setPreviewUrl] = useState<string>(
    '/api/pdf?id=TR-0000122-dummy3'
  );

  const handleUpdate = () => {
    setPreviewUrl(`/api/pdf?id=${invoiceId}&t=${Date.now()}`);
  };

  return (
    <div className='min-h-screen p-8 bg-gray-50 flex flex-col items-center'>
      <div className='w-full max-w-4xl bg-white shadow-lg rounded-xl p-6'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>
          PDF Generation Demo
        </h1>

        <div className='flex gap-4 mb-8 items-end'>
          <div className='flex flex-col gap-2 flex-1'>
            <label className='text-sm font-semibold text-gray-600'>
              Invoice ID
            </label>
            <input
              type='text'
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className='text-black border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>
          <button
            onClick={handleUpdate}
            className='px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition'
          >
            Update Preview
          </button>

          <a
            href={previewUrl}
            download={`invoice-${invoiceId}.pdf`} // HTML5 download attribute
            className='px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center justify-center'
          >
            Download PDF
          </a>
        </div>

        <div className='w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden bg-gray-100 relative'>
          <iframe
            src={previewUrl}
            className='w-full h-full'
            title='PDF Preview'
          />
        </div>
      </div>
    </div>
  );
}
