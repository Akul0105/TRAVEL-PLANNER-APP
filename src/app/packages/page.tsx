import { Metadata } from 'next';
import { Suspense } from 'react';
import { PackageCard } from '@/components/packages/PackageCard';
import { PackageFilter } from '@/components/packages/PackageFilter';
import { MBASequentialAnalysis } from '@/components/mba/MBASequentialAnalysis';
import { MBARecommendations } from '@/components/mba/MBARecommendations';
import { AnimatedGradientText, FadeInText } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Travel Packages - Curated Travel Experiences',
  description: 'Discover our AI-curated travel packages with market basket analysis for the perfect combination of experiences.',
};

interface PackagesPageProps {
  searchParams: {
    category?: string;
    price?: string;
    duration?: string;
    search?: string;
  };
}

export default function PackagesPage({ searchParams }: PackagesPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4">
          <FadeInText className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Curated Travel
              <AnimatedGradientText className="text-5xl md:text-7xl">
                Packages
              </AnimatedGradientText>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              AI-powered package combinations based on successful traveler patterns and market basket analysis
            </p>
          </FadeInText>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Package Filter */}
        <div className="mb-8">
          <PackageFilter searchParams={searchParams} />
        </div>

        {/* MBA Sequential Analysis */}
        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-200 rounded-2xl mb-8"></div>}>
          <MBASequentialAnalysis 
            title="Travel Pattern Analysis"
            subtitle="Discover the most popular travel sequences and optimize your journey"
          />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* MBA Recommendations */}
            <Suspense fallback={<div className="animate-pulse h-32 bg-gray-200 rounded-2xl mb-8"></div>}>
              <MBARecommendations 
                type="packages" 
                context={searchParams}
                title="Recommended Packages"
                subtitle="Based on your preferences and popular combinations"
                showLift={true}
              />
            </Suspense>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: 'mauritius-luxury',
                  name: 'Mauritius Luxury Escape',
                  image: '/images/mauritius-luxury.jpg',
                  description: '7-day luxury beach retreat with spa treatments and water activities',
                  price: 'Rs 112,455',
                  originalPrice: 'Rs 144,000',
                  duration: '7 days',
                  rating: 4.9,
                  travelers: '2-4 people',
                  category: 'luxury',
                  tags: ['Luxury', 'Beach', 'Spa'],
                  mbaScore: 0.94,
                  confidence: 0.89,
                  lift: 2.3,
                  includes: [
                    '5-star beachfront resort',
                    'Daily spa treatments',
                    'Snorkeling & diving',
                    'Catamaran sunset cruise',
                    'Private island picnic',
                    'Airport transfers',
                    'Travel insurance'
                  ],
                  relatedPackages: ['Bali Wellness Retreat', 'Maldives Honeymoon'],
                  seasonalRules: {
                    'December': 'High demand - Book early',
                    'June': 'Perfect weather - Best value'
                  }
                },
                {
                  id: 'paris-romantic',
                  name: 'Paris Romantic Getaway',
                  image: '/images/paris-romantic.jpg',
                  description: '5-day romantic Parisian experience with fine dining and cultural tours',
                  price: 'Rs 58,455',
                  originalPrice: 'Rs 72,000',
                  duration: '5 days',
                  rating: 4.8,
                  travelers: '2 people',
                  category: 'romantic',
                  tags: ['Romantic', 'Culture', 'Food'],
                  mbaScore: 0.91,
                  confidence: 0.85,
                  lift: 1.8,
                  includes: [
                    'Boutique hotel in Marais',
                    'Eiffel Tower dinner',
                    'Louvre private tour',
                    'Seine river cruise',
                    'Cooking class',
                    'Wine tasting',
                    'Airport transfers'
                  ],
                  relatedPackages: ['Rome Cultural Tour', 'Venice Gondola Romance'],
                  seasonalRules: {
                    'Spring': 'Cherry blossoms - Most romantic',
                    'Fall': 'Wine season - Best dining'
                  }
                },
                {
                  id: 'tokyo-adventure',
                  name: 'Tokyo Adventure Explorer',
                  image: '/images/tokyo-adventure.jpg',
                  description: '6-day Tokyo adventure with modern attractions and traditional experiences',
                  price: 'Rs 71,955',
                  originalPrice: 'Rs 85,500',
                  duration: '6 days',
                  rating: 4.7,
                  travelers: '1-4 people',
                  category: 'adventure',
                  tags: ['Adventure', 'Culture', 'Technology'],
                  mbaScore: 0.88,
                  confidence: 0.82,
                  lift: 2.1,
                  includes: [
                    'Modern hotel in Shibuya',
                    'Tokyo Skytree access',
                    'Traditional temple tour',
                    'Sushi making class',
                    'Bullet train to Kyoto',
                    'Robot restaurant show',
                    'JR Pass included'
                  ],
                  relatedPackages: ['Seoul K-Pop Experience', 'Singapore Tech Tour'],
                  seasonalRules: {
                    'Spring': 'Cherry blossoms - Peak season',
                    'Winter': 'Skiing add-ons available'
                  }
                },
                {
                  id: 'bali-wellness',
                  name: 'Bali Wellness Retreat',
                  image: '/images/bali-wellness.jpg',
                  description: '8-day spiritual and wellness journey in the heart of Bali',
                  price: 'Rs 40,455',
                  originalPrice: 'Rs 54,000',
                  duration: '8 days',
                  rating: 4.9,
                  travelers: '1-2 people',
                  category: 'wellness',
                  tags: ['Wellness', 'Spiritual', 'Nature'],
                  mbaScore: 0.93,
                  confidence: 0.87,
                  lift: 2.5,
                  includes: [
                    'Eco-luxury resort',
                    'Daily yoga sessions',
                    'Meditation retreat',
                    'Traditional healing',
                    'Volcano sunrise hike',
                    'Organic farm tour',
                    'Spa treatments'
                  ],
                  relatedPackages: ['Thailand Meditation', 'India Yoga Retreat'],
                  seasonalRules: {
                    'Dry Season': 'Best weather - April to October',
                    'Wet Season': 'Lush landscapes - Lower prices'
                  }
                }
              ].map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* MBA Insights */}
            <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-2xl"></div>}>
              <MBARecommendations 
                type="insights" 
                context={searchParams}
                title="Travel Insights"
                subtitle="Data-driven recommendations based on successful patterns"
                showAnalytics={true}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
