import { Metadata } from 'next';
import { Suspense } from 'react';
import { MBAAnalyticsDashboard } from '@/components/analytics/MBAAnalyticsDashboard';
import { CustomerSegmentAnalysis } from '@/components/analytics/CustomerSegmentAnalysis';
import { SeasonalInsights } from '@/components/analytics/SeasonalInsights';
import { TopRulesDashboard } from '@/components/analytics/TopRulesDashboard';
import { BusinessIntelligence } from '@/components/analytics/BusinessIntelligence';
import { AnimatedGradientText, FadeInText } from '@/components/ui';

export const metadata: Metadata = {
  title: 'MBA Analytics Dashboard - Travel Intelligence',
  description: 'Advanced market basket analysis insights and travel pattern analytics for data-driven decision making.',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4">
          <FadeInText className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              MBA Analytics
              <AnimatedGradientText className="text-5xl md:text-7xl">
                Dashboard
              </AnimatedGradientText>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Advanced market basket analysis insights and travel pattern analytics for data-driven decision making
            </p>
          </FadeInText>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Overview Cards - Now rendered dynamically in MBAAnalyticsDashboard */}

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* MBA Analytics Dashboard */}
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-2xl"></div>}>
            <MBAAnalyticsDashboard />
          </Suspense>

          {/* Top Rules Dashboard */}
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-2xl"></div>}>
            <TopRulesDashboard />
          </Suspense>
        </div>

        {/* Customer Segment Analysis */}
        <div className="mb-8">
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-2xl"></div>}>
            <CustomerSegmentAnalysis />
          </Suspense>
        </div>

        {/* Seasonal Insights */}
        <div className="mb-8">
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-2xl"></div>}>
            <SeasonalInsights />
          </Suspense>
        </div>

        {/* Business Intelligence Section */}
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-2xl"></div>}>
          <BusinessIntelligence />
        </Suspense>
      </div>
    </div>
  );
}
