import { Metadata } from 'next';
import { Suspense } from 'react';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { MBABundleGenerator } from '@/components/mba/MBABundleGenerator';
import { MBARecommendations } from '@/components/mba/MBARecommendations';
import { AnimatedGradientText, FadeInText } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Book Your Trip - Complete Travel Booking',
  description: 'Book your perfect trip with our AI-powered booking system and market basket analysis for personalized recommendations.',
};

interface BookingPageProps {
  searchParams: {
    destination?: string;
    type?: string;
    duration?: string;
    travelers?: string;
  };
}

export default function BookingPage({ searchParams }: BookingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4">
          <FadeInText className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Book Your
              <AnimatedGradientText className="text-5xl md:text-7xl">
                Dream Trip
              </AnimatedGradientText>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Complete your travel booking with AI-powered recommendations and exclusive bundle deals
            </p>
          </FadeInText>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>
              <BookingForm searchParams={searchParams} />
            </div>

            {/* MBA Bundle Generator */}
            <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-2xl"></div>}>
              <MBABundleGenerator 
                context={searchParams}
                title="Smart Bundle Generator"
                subtitle="AI-powered package combinations based on popular traveler choices"
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 sticky top-8">
              <BookingSummary searchParams={searchParams} />
            </div>

            {/* MBA Recommendations */}
            <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-2xl"></div>}>
              <MBARecommendations 
                type="booking" 
                context={searchParams}
                title="People Also Booked"
                subtitle="Based on similar traveler preferences"
                showConfidence={true}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
