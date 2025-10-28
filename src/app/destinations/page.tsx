import { Metadata } from 'next';
import { Suspense } from 'react';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { FilterSidebar } from '@/components/destinations/FilterSidebar';
import { SearchHeader } from '@/components/destinations/SearchHeader';
import { MBARecommendations } from '@/components/mba/MBARecommendations';
import { AnimatedGradientText, FadeInText } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Travel Destinations - Discover Amazing Places',
  description: 'Explore our curated collection of travel destinations with AI-powered recommendations and market basket analysis.',
};

interface DestinationsPageProps {
  searchParams: {
    category?: string;
    price?: string;
    duration?: string;
    search?: string;
  };
}

export default function DestinationsPage({ searchParams }: DestinationsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4">
          <FadeInText className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Discover Your Next
              <AnimatedGradientText className="text-5xl md:text-7xl">
                Adventure
              </AnimatedGradientText>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Explore amazing destinations with AI-powered recommendations and personalized travel insights
            </p>
          </FadeInText>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-1/4">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <SearchHeader searchParams={searchParams} />
            
            {/* MBA Recommendations */}
            <Suspense fallback={<div className="animate-pulse h-32 bg-gray-200 rounded-lg mb-8"></div>}>
              <MBARecommendations 
                type="destinations" 
                context={searchParams}
                title="Recommended for You"
                subtitle="Based on your preferences and popular combinations"
              />
            </Suspense>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                {
                  id: 'mauritius',
                  name: 'Mauritius',
                  image: '/images/mauritius.jpg',
                  description: 'Tropical paradise with pristine beaches and crystal-clear waters',
                  price: '$1,200',
                  duration: '7 days',
                  rating: 4.8,
                  category: 'beach',
                  tags: ['Beach', 'Luxury', 'Romantic'],
                  mbaScore: 0.89,
                  relatedItems: ['Snorkeling', 'Spa Resort', 'Catamaran Cruise']
                },
                {
                  id: 'paris',
                  name: 'Paris',
                  image: '/images/paris.jpg',
                  description: 'City of lights with iconic landmarks and world-class cuisine',
                  price: '$800',
                  duration: '5 days',
                  rating: 4.9,
                  category: 'city',
                  tags: ['Culture', 'Romantic', 'Food'],
                  mbaScore: 0.92,
                  relatedItems: ['Eiffel Tower Tour', 'Louvre Museum', 'Seine Cruise']
                },
                {
                  id: 'tokyo',
                  name: 'Tokyo',
                  image: '/images/tokyo.jpg',
                  description: 'Modern metropolis blending tradition with cutting-edge technology',
                  price: '$1,100',
                  duration: '6 days',
                  rating: 4.7,
                  category: 'city',
                  tags: ['Culture', 'Technology', 'Food'],
                  mbaScore: 0.85,
                  relatedItems: ['Temple Tour', 'Sushi Class', 'Bullet Train Pass']
                },
                {
                  id: 'bali',
                  name: 'Bali',
                  image: '/images/bali.jpg',
                  description: 'Island of gods with spiritual retreats and stunning landscapes',
                  price: '$600',
                  duration: '8 days',
                  rating: 4.8,
                  category: 'beach',
                  tags: ['Spiritual', 'Adventure', 'Wellness'],
                  mbaScore: 0.91,
                  relatedItems: ['Temple Tour', 'Volcano Hike', 'Spa Retreat']
                },
                {
                  id: 'dubai',
                  name: 'Dubai',
                  image: '/images/dubai.jpg',
                  description: 'Luxury destination with modern architecture and desert adventures',
                  price: '$1,500',
                  duration: '5 days',
                  rating: 4.6,
                  category: 'luxury',
                  tags: ['Luxury', 'Modern', 'Adventure'],
                  mbaScore: 0.87,
                  relatedItems: ['Desert Safari', 'Burj Khalifa', 'Shopping Tour']
                },
                {
                  id: 'london',
                  name: 'London',
                  image: '/images/london.jpg',
                  description: 'Historic city with royal heritage and world-class attractions',
                  price: '$900',
                  duration: '6 days',
                  rating: 4.8,
                  category: 'city',
                  tags: ['History', 'Culture', 'Royal'],
                  mbaScore: 0.88,
                  relatedItems: ['West End Show', 'Thames Cruise', 'Royal Palace Tour']
                }
              ].map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
