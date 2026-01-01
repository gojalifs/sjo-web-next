import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <label className='text-zinc-500 text-sm'>{label}</label>
      <div className='relative group'>
        <fieldset className='absolute inset-0 border border-zinc-700 rounded-lg group-hover:border-zinc-500 transition-colors pointer-events-none -top-2'>
          <legend className='ml-2 px-1 text-xs text-zinc-500 invisible'>
            {label}
          </legend>
        </fieldset>
        <input
          className='w-full bg-transparent text-white px-3 py-3 outline-none rounded-lg border border-zinc-700 focus:border-blue-500 transition-colors placeholder-zinc-600'
          {...props}
        />
        {/* Floating Label Hack if prefer material style, but sticking to design screenshot which looks like standard field with border and label on top or inset */}
      </div>
    </div>
  );
}

// Redesigning to match the specific look in screenshot:
// The screenshot shows a border around the input, with the label SITTING ON THE BORDER (Legend style) or slightly above.
// Actually looking closely at "Transaction No", the label is interrupting the top border. This is a fieldset/legend pattern.

export function InputClassic({ label, ...props }: InputProps) {
  return (
    <div className='relative w-full mb-4'>
      <label className='absolute -top-2.5 left-3 bg-white px-1 text-sm text-zinc-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500'>
        {label}
      </label>
      <input
        {...props}
        className='peer w-full rounded-md border border-zinc-300 bg-transparent px-3 py-3 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none'
        placeholder=' '
      />
    </div>
  );
}
