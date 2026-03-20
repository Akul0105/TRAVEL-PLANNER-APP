'use client';

import { ReactNode } from 'react';

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className = '' }: AnimatedGradientTextProps) {
  return (
    <span className={`bg-gradient-to-r from-neutral-500 via-neutral-950 to-neutral-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x font-semibold tracking-tight ${className}`}>
      {children}
    </span>
  );
}

export function TravelGradientText({ children, className = '' }: AnimatedGradientTextProps) {
  return (
    <span className={`font-semibold tracking-tight text-neutral-950 ${className}`}>
      {children}
    </span>
  );
}