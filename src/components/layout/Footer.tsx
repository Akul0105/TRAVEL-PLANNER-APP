'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-white mb-4">Quick links</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Planify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
