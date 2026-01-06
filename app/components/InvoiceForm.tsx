'use client';

import React, { useEffect, useState } from 'react';
import { InputClassic } from './ui/Input';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { numberToWords } from '../lib/numberToWords';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function InvoiceForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    transactionNo: '',
    receivedFrom: '',
    patientName: '',
    optometrist: 'Kholidin, A.Md.RO',
    paidFor: '',
    frameType: '',
    framePrice: '',
    lensType: '',
    lensPrice: '',
    total: '',
    inWords: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format number with dots as thousands separators
  const formatNumber = (value: string) => {
    if (!value) return '';
    const cleanValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseNumber = (value: string) => {
    const cleanValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
    return parseInt(cleanValue, 10) || 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Auto-formatting for price fields
    if (['framePrice', 'lensPrice'].includes(name)) {
      const formatted = formatNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [loading, setLoading] = useState(false);

  // Calculate Total and Update "In Words"
  useEffect(() => {
    const framePrice = parseNumber(formData.framePrice);
    const lensPrice = parseNumber(formData.lensPrice);
    const total = framePrice + lensPrice;

    const totalFormatted = formatNumber(total.toString());
    const words = numberToWords(total);

    setFormData((prev) => {
      // Only update if changed to avoid loops (though check here is safe)
      if (prev.total === totalFormatted && prev.inWords === words) return prev;
      return { ...prev, total: totalFormatted, inWords: words };
    });
  }, [formData.framePrice, formData.lensPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        framePrice: parseNumber(formData.framePrice),
        lensPrice: parseNumber(formData.lensPrice),
        totalAmount: parseNumber(formData.total),
        amountInWords: formData.inWords,
      };

      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save invoice');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a link element, hide it, direct it towards the blob, and then 'click' it intentionally
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Extract filename from content-disposition if possible, otherwise default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `invoice-${formData.transactionNo}.pdf`;
      if (contentDisposition) {
        const matches = /filename="([^"]*)"/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white text-zinc-900 p-4 font-sans'>
      {/* Header */}
      <div className='flex items-center mb-8'>
        <button
          className='p-2 -ml-2 text-zinc-500 hover:cursor-pointer hover:bg-zinc-100 rounded-full'
          onClick={() => router.back()}
        >
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
        </button>
        <h1 className='text-xl font-normal ml-2'>Buat Faktur</h1>
        <div className='ml-auto bg-white p-1 rounded border border-zinc-100'>
          {/* Logo Placeholder - assuming logo is small */}
          <div className='w-6 h-6 rounded-full flex items-center justify-center overflow-hidden'>
            <Image src='/logo.png' alt='Logo' width={24} height={24} />
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center mb-6'>
        <h2 className='text-zinc-500 text-lg'>Bukti Pembayaran</h2>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4 max-w-lg mx-auto'>
        <InputClassic
          label='No Transaksi'
          name='transactionNo'
          value={formData.transactionNo}
          onChange={handleChange}
          autoFocus={true}
          required
        />
        <InputClassic
          label='Diterima Dari'
          name='receivedFrom'
          value={formData.receivedFrom}
          onChange={handleChange}
          required
        />
        <InputClassic
          label='Nama Pasien'
          name='patientName'
          value={formData.patientName}
          onChange={handleChange}
          required
        />
        <InputClassic
          label='Pemeriksa (Optometris)'
          name='optometrist'
          value={formData.optometrist}
          onChange={handleChange}
          required
        />
        <InputClassic
          label='Untuk Pembayaran'
          name='paidFor'
          value={formData.paidFor}
          onChange={handleChange}
        />

        <div className='grid grid-cols-2 gap-4'>
          <InputClassic
            label='Jenis Frame'
            name='frameType'
            value={formData.frameType}
            onChange={handleChange}
            required
          />
          <InputClassic
            label='Harga Frame'
            name='framePrice'
            value={formData.framePrice}
            onChange={handleChange}
            inputMode='numeric'
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <InputClassic
            label='Jenis Lensa'
            name='lensType'
            value={formData.lensType}
            onChange={handleChange}
            required
          />
          <InputClassic
            label='Harga Lensa'
            name='lensPrice'
            value={formData.lensPrice}
            onChange={handleChange}
            inputMode='numeric'
            required
          />
        </div>

        <InputClassic
          label='Total'
          name='total'
          value={formData.total}
          readOnly
          className='pointer-events-none' // Make it look read-only
        />

        {/* Text Area for In Words */}
        <div className='relative w-full mb-4'>
          <label className='absolute -top-2.5 left-3 bg-white px-1 text-sm text-zinc-500'>
            Terbilang
          </label>
          <textarea
            name='inWords'
            value={formData.inWords}
            readOnly
            rows={3}
            className='w-full rounded-md border border-zinc-300 bg-transparent px-3 py-3 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none resize-none'
          />
        </div>

        <div className='pt-4'>
          <Button type='submit' variant='primary' disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Berhasil'
        message='Berhasil mengunduh'
      />
    </div>
  );
}
