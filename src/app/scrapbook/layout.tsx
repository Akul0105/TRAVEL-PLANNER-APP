import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Scrapbook - Planify',
  description: 'Your visited destinations and personalized travel bundles from market basket analysis.',
};

export default function ScrapbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
