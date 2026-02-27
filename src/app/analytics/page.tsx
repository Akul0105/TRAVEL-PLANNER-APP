import { Metadata } from 'next';
import { Suspense } from 'react';
import { UserAnalyticsDashboard } from '@/components/analytics/UserAnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Analytics - Planify',
  description: 'Your personalised MBA and travel analytics: bundles, rules, preferences, and suggested packages.',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <section className="py-16 border-b border-[#e8e4df]">
        <div className="container mx-auto px-4">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-semibold text-[#2c2825] mb-3">
            Analytics
          </h1>
          <p className="text-[#6b6560] text-lg max-w-2xl">
            Your personalised dashboard: market basket rules applied to your bundles, preferences, and suggested packages.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<div className="animate-pulse h-96 bg-[#e8e4df] rounded-lg" />}>
          <UserAnalyticsDashboard />
        </Suspense>
      </div>
    </div>
  );
}
