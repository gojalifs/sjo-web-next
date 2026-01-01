import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center';
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
