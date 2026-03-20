'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Product
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              <li>
                <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/scrapbook" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Scrapbook
                </Link>
              </li>
            </ul>
          </div>
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} Planify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
