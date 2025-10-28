'use client';

import { ReactNode } from 'react';

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className = '' }: AnimatedGradientTextProps) {
  return (
    <span className={`bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x font-bold ${className}`}>
      {children}
    </span>
  );
}

export function TravelGradientText({ children, className = '' }: AnimatedGradientTextProps) {
  return (
    <span className={`bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x font-bold ${className}`}>
      {children}
    </span>
  );
}