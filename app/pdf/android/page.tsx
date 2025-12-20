'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PdfViewer component with no SSR to avoid build errors with 'canvas' dependencies
const PdfViewerComponent = dynamic(() => import('./PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center h-screen'>
      Loading Viewer...
    </div>
  ),
});

export default function Page() {
  return <PdfViewerComponent />;
}
