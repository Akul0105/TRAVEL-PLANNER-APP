/**
 * Floating Chat Icon Component
 * A floating action button that opens the chatbot interface
 * Positioned fixed at bottom-right corner with smooth animations
 */

'use client';

import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingChatIconProps } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Floating chat icon component with smooth animations
 * @param onClick - Function to call when icon is clicked
 * @param isOpen - Whether the chatbot is currently open
 */
export function FloatingChatIcon({ onClick, isOpen }: FloatingChatIconProps) {
  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-14 h-14 rounded-full shadow-lg",
          "flex items-center justify-center",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-xl",
          // Dynamic styling based on chatbot state
          isOpen 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </motion.div>
        
        {/* Pulse animation when chatbot is closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </AnimatePresence>
  );
}
