'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setErrorMessage('');
    const { error } = await signInWithOtp(email.trim());
    if (error) {
      setStatus('error');
      setErrorMessage(error.message || "We couldn't send the sign-in link. Please try again.");
    } else {
      setStatus('success');
    }
  };

  const handleClose = () => {
    setEmail('');
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="rounded-2xl border border-[#e8e4df] bg-[#faf8f5] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#e8e4df] bg-[#2c2825] px-6 py-4 rounded-t-2xl">
                <h2 id="auth-modal-title" className="text-lg font-semibold text-white">
                  Sign in
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 text-[#e8e4df] hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {status === 'success' ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#e8e4df] flex items-center justify-center mb-4">
                      <CheckCircle className="w-7 h-7 text-[#2c2825]" />
                    </div>
                    <p className="text-[#2c2825] font-medium mb-1">Check your email</p>
                    <p className="text-[#6b6560] text-sm">
                      We&apos;ve sent you a sign-in link. Click the link to sign in, then you can use the chatbot and Scrapbook.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-[#6b6560] text-sm mb-4">
                      Enter your email and we&apos;ll send you a sign-in link. No password needed.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="auth-email" className="sr-only">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9c958f]" />
                          <input
                            id="auth-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (status === 'error') setStatus('idle');
                            }}
                            placeholder="your@email.com"
                            disabled={status === 'loading'}
                            autoComplete="email"
                            className={cn(
                              'w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-[#2c2825] placeholder:text-[#9c958f]',
                              'focus:outline-none focus:ring-2 focus:ring-[#2c2825] focus:border-[#2c2825]',
                              'disabled:opacity-50 disabled:cursor-not-allowed',
                              errorMessage ? 'border-red-400' : 'border-[#e8e4df]'
                            )}
                          />
                        </div>
                        {errorMessage && (
                          <p className="mt-1.5 text-sm text-red-600">{errorMessage}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={cn(
                          'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium',
                          'bg-[#2c2825] text-white hover:bg-[#4a4541]',
                          'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        )}
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending link...
                          </>
                        ) : (
                          'Send sign-in link'
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
