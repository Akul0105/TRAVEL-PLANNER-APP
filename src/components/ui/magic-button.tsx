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
  const baseClasses = 'relative overflow-hidden rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    travel: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white shadow-lg hover:shadow-xl'
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
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
}