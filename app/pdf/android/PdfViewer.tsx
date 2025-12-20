'use client';

import { useEffect, useState } from 'react';
import { Document, Page as PDFPage, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Important: Configure the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer() {
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Get ID from URL query params manually since useSearchParams might need Suspense boundary
    const params = new URLSearchParams(window.location.search);
    setInvoiceId(params.get('id') || 'TR-0000122-dummy3');

    // Set initial width
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!invoiceId)
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    );

  return (
    <div className='w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center'>
      <Document
        file={`/api/pdf?id=${invoiceId}`}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className='text-gray-500'>Loading PDF...</div>}
        error={
          <div className='text-red-500'>
            Failed to load PDF using React-PDF.
          </div>
        }
        className='shadow-lg'
      >
        {Array.from(new Array(numPages), (el, index) => (
          <PDFPage
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={width} // Responsive width
            renderTextLayer={false} // Disable text selection for better performance on mobile
            renderAnnotationLayer={false}
            className='mb-4'
          />
        ))}
      </Document>

      {/* Floating Download Button */}
      <a
        href={`/api/pdf?id=${invoiceId}`}
        download={`invoice-${invoiceId}.pdf`}
        className='fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all z-50 flex items-center justify-center'
        aria-label='Download PDF'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l-3 3m3-3v12'
          />
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 3v13.5' />
          {/* Simple download arrow */}
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 15l-3-3m0 0l3-3m-3 3h12'
            style={{ display: 'none' }}
          />{' '}
          {/* hide unused */}
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3'
          />
        </svg>
      </a>
    </div>
  );
}
