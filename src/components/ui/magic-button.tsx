'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface MagicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'travel' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MagicButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}: MagicButtonProps) {
  const baseClasses = 'relative overflow-hidden rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-950/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-md shadow-black/10',
    secondary: 'bg-neutral-100 text-neutral-950 border border-neutral-200 hover:bg-neutral-200',
    travel: 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-md',
    gradient: 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-md'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}