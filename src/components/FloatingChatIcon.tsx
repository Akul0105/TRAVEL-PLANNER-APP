/**
 * Floating Chat Icon Component
 * A floating action button that opens the chatbot interface
 * Positioned fixed at bottom-right corner with smooth animations
 */

'use client';

import { MessageCircle, X } from 'lucide-react';
import { FloatingChatIconProps } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Floating chat icon component with smooth animations
 * @param onClick - Function to call when icon is clicked
 * @param isOpen - Whether the chatbot is currently open
 */
export function FloatingChatIcon({ onClick, isOpen }: FloatingChatIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-14 h-14 rounded-full shadow-lg shadow-black/20 ring-1 ring-black/5",
        "flex items-center justify-center",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-xl hover:scale-105",
        "transform scale-100 opacity-100",
        isOpen
          ? "bg-neutral-950 hover:bg-neutral-800 text-white"
          : "bg-neutral-950 hover:bg-neutral-800 text-white"
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      suppressHydrationWarning
    >
      <div className="transition-transform duration-300">
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </div>
      
      {/* Pulse animation when chatbot is closed */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-neutral-950 animate-ping opacity-10" />
      )}
    </button>
  );
}
