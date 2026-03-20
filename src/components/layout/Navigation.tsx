'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Plane, LogIn, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, profile, signOut, loading: authLoading, isAnonymous } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Scrapbook', href: '/scrapbook' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const textClass = 'text-white';
  const linkInactiveClass = 'text-white/70 hover:text-white';

  // Close account menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setAccountMenuOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-neutral-950/70 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[4.25rem]">
            <Link href="/" className={`flex items-center gap-2 ${textClass} transition-colors`}>
              <Plane className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" strokeWidth={1.75} />
              <span className="text-xl md:text-2xl font-semibold tracking-tight">
                Planify
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[15px] font-medium tracking-tight transition-colors ${
                    isActive(item.href) ? textClass : linkInactiveClass
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Top right: Sign In or Account */}
            <div className="hidden md:flex items-center gap-4">
              {!authLoading && (
                user ? (
                  <div className="relative" ref={accountMenuRef}>
                    <button
                      type="button"
                      onClick={() => setAccountMenuOpen((o) => !o)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${linkInactiveClass} hover:bg-white/10`}
                      aria-expanded={accountMenuOpen}
                      aria-haspopup="true"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-semibold md:text-base">
                        {isAnonymous
                          ? 'Sign in / Sign up'
                          : (profile?.full_name || user.email?.split('@')[0] || 'Account')}
                      </span>
                    </button>
                    {accountMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 py-1 w-56 rounded-xl border border-white/10 bg-neutral-900 shadow-xl shadow-black/40">
                        {isAnonymous && (
                          <button
                            type="button"
                            onClick={() => { setAuthModalOpen(true); setAccountMenuOpen(false); }}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-white hover:bg-white/10 rounded-lg text-sm"
                          >
                            <LogIn className="w-4 h-4" />
                            Sign in to save across devices
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-white hover:bg-white/10 rounded-lg text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors bg-emerald-500 text-neutral-950 hover:bg-emerald-400"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign in
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 ${textClass}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 text-lg font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white'
                        : 'text-white/75 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!authLoading && (
                  user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-white/55">
                        {isAnonymous ? 'Sign in / Sign up' : (profile?.full_name || user.email)}
                      </div>
                      {isAnonymous && (
                        <button
                          type="button"
                          onClick={() => { setAuthModalOpen(true); setIsOpen(false); }}
                          className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-white/80 hover:bg-white/5 hover:text-white rounded-md"
                        >
                          <LogIn className="w-4 h-4" />
                          Sign in to save across devices
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          handleSignOut();
                        }}
                        className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-white/80 hover:bg-white/5 hover:text-white rounded-md"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalOpen(true);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-white/80 hover:bg-white/5 hover:text-white rounded-md"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign in
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
