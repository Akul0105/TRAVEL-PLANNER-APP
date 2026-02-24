import { Metadata } from 'next';
import { Suspense } from 'react';
import { MBAAnalyticsDashboard } from '@/components/analytics/MBAAnalyticsDashboard';
import { TopRulesDashboard } from '@/components/analytics/TopRulesDashboard';

export const metadata: Metadata = {
  title: 'Analytics - Planify',
  description: 'Market basket analysis and personalized bundle insights for travel planning.',
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
            Market basket analysis and personalized bundle insights for data-driven travel planning.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Suspense fallback={<div className="animate-pulse h-96 bg-[#e8e4df] rounded-lg" />}>
            <MBAAnalyticsDashboard />
          </Suspense>
          <Suspense fallback={<div className="animate-pulse h-96 bg-[#e8e4df] rounded-lg" />}>
            <TopRulesDashboard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
