'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Plane } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Scrapbook', href: '/scrapbook' },
    { name: 'Analytics', href: '/analytics' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isOverHero = pathname === '/';
  const textClass = isOverHero ? 'text-white' : 'text-black';
  const linkInactiveClass = isOverHero ? 'text-white/80 hover:text-white' : 'text-neutral-500 hover:text-black';

  return (
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
