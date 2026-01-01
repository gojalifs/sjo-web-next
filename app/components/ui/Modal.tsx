import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function Modal({ isOpen, onClose, title, message }: ModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl animate-in fade-in zoom-in duration-200'>
        <div className='flex justify-center mb-4'>
          {/* Success Icon */}
          <div className='rounded-full bg-green-100 p-3'>
            <div className='rounded-full bg-green-200/50 p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={3}
                stroke='currentColor'
                className='w-8 h-8 text-green-600'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m4.5 12.75 6 6 9-13.5'
                />
              </svg>
            </div>
          </div>
        </div>

        <h2 className='mb-2 text-xl font-bold text-zinc-900'>{title}</h2>
        <p className='mb-6 text-sm text-zinc-500'>{message}</p>

        <Button onClick={onClose}>OK</Button>
      </div>
    </div>
  );
}
