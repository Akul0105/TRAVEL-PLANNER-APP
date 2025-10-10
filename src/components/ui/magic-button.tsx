/**
 * Magic UI Button Components
 * Beautiful animated buttons with special effects
 * Perfect for travel agency call-to-action elements
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagicButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'travel' | 'magic';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

/**
 * Primary Magic Button with gradient and shine effect
 */
export function MagicButton({
  children,
  className,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: MagicButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl',
    travel: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl',
    magic: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold transition-all duration-300',
        'focus:outline-none focus:ring-4 focus:ring-blue-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/**
 * Floating Action Button with pulse animation
 */
export function FloatingButton({
  children,
  className,
  onClick,
  variant = 'primary',
}: Omit<MagicButtonProps, 'size'>) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl',
        'flex items-center justify-center text-white font-bold',
        'focus:outline-none focus:ring-4 focus:ring-blue-200',
        variant === 'primary' && 'bg-gradient-to-r from-blue-500 to-purple-600',
        variant === 'travel' && 'bg-gradient-to-r from-emerald-500 to-teal-600',
        className
      )}
    >
      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-400"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/**
 * Animated Text Button with underline effect
 */
export function TextButton({
  children,
  className,
  onClick,
}: Omit<MagicButtonProps, 'variant' | 'size'>) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        'relative text-blue-600 font-semibold transition-colors duration-300',
        'hover:text-blue-800 focus:outline-none',
        className
      )}
    >
      {children}
      
      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-blue-600"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}

/**
 * Travel-themed CTA Button
 */
export function TravelCTA({
  children,
  className,
  onClick,
}: Omit<MagicButtonProps, 'variant' | 'size'>) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl px-8 py-4 text-lg font-bold text-white',
        'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600',
        'shadow-xl hover:shadow-2xl transition-all duration-300',
        'focus:outline-none focus:ring-4 focus:ring-emerald-200',
        className
      )}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
