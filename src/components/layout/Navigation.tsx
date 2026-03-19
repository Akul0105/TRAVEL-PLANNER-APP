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

  const isOverHero = pathname === '/';
  const textClass = isOverHero ? 'text-white' : 'text-black';
  const linkInactiveClass = isOverHero ? 'text-white/80 hover:text-white' : 'text-neutral-500 hover:text-black';

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
      <nav className="relative z-50 bg-transparent transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link href="/" className={`flex items-center gap-2.5 ${textClass} transition-colors`}>
              <Plane className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0" strokeWidth={2} />
              <span className="text-3xl md:text-4xl font-semibold tracking-tight">
                Planify
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-lg font-medium transition-colors ${
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${linkInactiveClass} hover:bg-black/5`}
                      aria-expanded={accountMenuOpen}
                      aria-haspopup="true"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-lg font-medium">
                        {isAnonymous ? 'Guest' : (profile?.full_name || user.email?.split('@')[0] || 'Account')}
                      </span>
                    </button>
                    {accountMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 py-1 w-48 rounded-xl border border-[#e8e4df] bg-[#faf8f5] shadow-lg">
                        {isAnonymous && (
                          <button
                            type="button"
                            onClick={() => { setAuthModalOpen(true); setAccountMenuOpen(false); }}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[#2c2825] hover:bg-[#e8e4df] rounded-lg"
                          >
                            <LogIn className="w-4 h-4" />
                            Sign in to save across devices
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[#2c2825] hover:bg-[#e8e4df] rounded-lg"
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                      isOverHero
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-[#2c2825] text-white hover:bg-[#4a4541]'
                    }`}
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
            <div className="md:hidden py-4 border-t border-black/10">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 text-lg font-medium rounded-md ${
                      isActive(item.href) ? 'bg-neutral-100 text-black' : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!authLoading && (
                  user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-neutral-500">
                        {isAnonymous ? 'Guest' : (profile?.full_name || user.email)}
                      </div>
                      {isAnonymous && (
                        <button
                          type="button"
                          onClick={() => { setAuthModalOpen(true); setIsOpen(false); }}
                          className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-neutral-600 hover:bg-neutral-50 hover:text-black rounded-md"
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
                        className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-neutral-600 hover:bg-neutral-50 hover:text-black rounded-md"
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
                      className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-neutral-600 hover:bg-neutral-50 hover:text-black rounded-md"
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
