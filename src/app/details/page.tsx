'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Plane, Hotel, Package, Activity, Star, Clock, DollarSign, Calendar } from 'lucide-react';
import { AnimatedGradientText, FadeInText } from '@/components/ui';

interface DetailInfo {
  title: string;
  description: string;
  type: string;
  price?: string;
  priceRange?: string;
  duration?: string;
  rating?: number;
  highlights: string[];
  activities?: string[];
  bestTimeToVisit?: string[];
  location?: string;
  features?: string[];
  image?: string;
  video?: string;
}

export default function DetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type') || 'destination';
  const [detailInfo, setDetailInfo] = useState<DetailInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!query) {
      router.push('/');
      return;
    }

    // Reset video error when destination changes
    setVideoError(false);

    // Generate detailed information based on query and type
    const generateDetailInfo = () => {
      const lowerQuery = query.toLowerCase();
      let info: DetailInfo = {
        title: query,
        description: '',
        type: type,
        highlights: [],
        activities: [],
        features: [],
      };

      // Destination-specific information
      if (type === 'destination' || !type) {
        if (lowerQuery.includes('mauritius')) {
          info = {
            title: 'Mauritius',
            description: 'A tropical paradise in the Indian Ocean, Mauritius is renowned for its pristine white-sand beaches, crystal-clear turquoise waters, and luxury resorts. This island nation offers a perfect blend of relaxation, adventure, and cultural experiences.',
            type: 'destination',
            priceRange: 'Rs 54,000 - Rs 144,000',
            duration: '7-10 days',
            rating: 4.8,
            location: 'Indian Ocean',
            image: 'https://images.unsplash.com/photo-1686739996006-7c2cdff5d34c?w=1920&q=80&fit=crop&auto=format', // Mauritius - Aesthetic aerial view of beach with clear blue water
            video: 'https://www.youtube.com/embed/ex6LHlR8CNg?autoplay=1&loop=1&playlist=ex6LHlR8CNg&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&vq=hd1080', // Mauritius aerial view
            highlights: [
              'Pristine beaches with turquoise waters',
              'World-class luxury resorts',
              'Rich cultural heritage',
              'Water sports and diving',
              'Tropical climate year-round'
            ],
            activities: [
              'Snorkeling and diving',
              'Catamaran cruises',
              'Spa treatments',
              'Cultural village tours',
              'Seven Colored Earths',
              'Chamarel Waterfall',
              'Black River Gorges National Park'
            ],
            bestTimeToVisit: ['May to December', 'Dry season with perfect weather'],
            features: ['Beach', 'Luxury', 'Romantic', 'Family-friendly']
          };
        } else if (lowerQuery.includes('paris')) {
          info = {
            title: 'Paris',
            description: 'The City of Light, Paris is one of the world\'s most romantic and culturally rich destinations. From iconic landmarks like the Eiffel Tower to world-class museums and exquisite cuisine, Paris offers an unforgettable experience.',
            type: 'destination',
            priceRange: 'Rs 36,000 - Rs 72,000',
            duration: '5-7 days',
            rating: 4.9,
            location: 'France, Europe',
            image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=2560&q=90&fit=crop&auto=format', // Paris - Full Eiffel Tower view (fallback)
            video: 'https://www.youtube.com/embed/2X9QGY__0II?autoplay=1&loop=1&playlist=2X9QGY__0II&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&vq=hd1080', // Paris - Eiffel Tower tour video
            highlights: [
              'Iconic Eiffel Tower',
              'Louvre Museum',
              'Champs-Élysées',
              'Notre-Dame Cathedral',
              'World-class cuisine'
            ],
            activities: [
              'Eiffel Tower visit',
              'Louvre Museum tour',
              'Seine River cruise',
              'French cooking classes',
              'Wine tasting',
              'Montmartre exploration'
            ],
            bestTimeToVisit: ['Spring (April-June)', 'Fall (September-November)'],
            features: ['Culture', 'Romantic', 'Food', 'History']
          };
        } else if (lowerQuery.includes('tokyo')) {
          info = {
            title: 'Tokyo',
            description: 'A fascinating blend of traditional culture and cutting-edge technology, Tokyo is a vibrant metropolis where ancient temples stand alongside futuristic skyscrapers. Experience the best of Japanese culture, cuisine, and innovation.',
            type: 'destination',
            priceRange: 'Rs 49,500 - Rs 85,500',
            duration: '6-8 days',
            rating: 4.7,
            location: 'Japan, Asia',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80&fit=crop&auto=format', // Tokyo - Neon cityscape at night
            highlights: [
              'Traditional temples and shrines',
              'Modern technology and innovation',
              'World-class cuisine',
              'Cherry blossom season',
              'Unique pop culture'
            ],
            activities: [
              'Senso-ji Temple visit',
              'Tokyo Skytree',
              'Shibuya Crossing',
              'Sushi making class',
              'Tsukiji Fish Market',
              'Harajuku fashion district'
            ],
            bestTimeToVisit: ['Spring (March-May)', 'Fall (September-November)'],
            features: ['Culture', 'Technology', 'Food', 'Adventure']
          };
        } else if (lowerQuery.includes('bali')) {
          info = {
            title: 'Bali',
            description: 'The Island of Gods, Bali is a tropical paradise known for its stunning landscapes, ancient temples, and spiritual retreats. Experience world-class beaches, lush rice terraces, and a rich cultural heritage.',
            type: 'destination',
            priceRange: 'Rs 27,000 - Rs 54,000',
            duration: '8-12 days',
            rating: 4.8,
            location: 'Indonesia, Asia',
            image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&q=80&fit=crop&auto=format', // Bali - Rice terraces and tropical paradise
            highlights: [
              'Beautiful beaches',
              'Ancient temples',
              'Spiritual retreats',
              'Volcano hiking',
              'Rice terraces'
            ],
            activities: [
              'Temple tours',
              'Volcano sunrise hike',
              'Spa and wellness',
              'Beach activities',
              'Cultural village visits',
              'Water sports'
            ],
            bestTimeToVisit: ['April to October', 'Dry season'],
            features: ['Beach', 'Spiritual', 'Adventure', 'Wellness']
          };
        } else if (lowerQuery.includes('london')) {
          info = {
            title: 'London',
            description: 'The historic capital of England, London is a vibrant city that seamlessly blends centuries of royal heritage with modern innovation. From iconic landmarks to world-class museums and theaters, London offers an unparalleled cultural experience.',
            type: 'destination',
            priceRange: 'Rs 40,500 - Rs 81,000',
            duration: '6-8 days',
            rating: 4.8,
            location: 'United Kingdom, Europe',
            image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80&fit=crop&auto=format', // London - Big Ben and Thames
            highlights: [
              'Royal palaces and heritage',
              'World-class museums',
              'West End theater',
              'Historic landmarks',
              'Diverse cuisine'
            ],
            activities: [
              'Big Ben and Parliament',
              'Tower of London',
              'British Museum',
              'West End shows',
              'Thames River cruise',
              'Buckingham Palace',
              'Hyde Park'
            ],
            bestTimeToVisit: ['May to September', 'Spring and Summer'],
            features: ['History', 'Culture', 'Royal', 'Entertainment']
          };
        } else if (lowerQuery.includes('dubai')) {
          info = {
            title: 'Dubai',
            description: 'A futuristic metropolis in the heart of the desert, Dubai is a city of superlatives. Experience luxury shopping, world-record architecture, desert adventures, and a unique blend of traditional Arabic culture with modern innovation.',
            type: 'destination',
            priceRange: 'Rs 67,500 - Rs 135,000',
            duration: '5-7 days',
            rating: 4.6,
            location: 'United Arab Emirates, Middle East',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80&fit=crop&auto=format', // Dubai - Burj Khalifa skyline
            highlights: [
              'Luxury shopping',
              'Modern architecture',
              'Desert safaris',
              'World-class dining',
              'Year-round sunshine'
            ],
            activities: [
              'Burj Khalifa visit',
              'Desert safari',
              'Dubai Mall shopping',
              'Palm Jumeirah',
              'Dubai Marina',
              'Gold Souk',
              'Dhow cruise'
            ],
            bestTimeToVisit: ['November to March', 'Cooler weather'],
            features: ['Luxury', 'Modern', 'Adventure', 'Shopping']
          };
        } else {
          // Generic destination
          info = {
            title: query,
            description: `Discover the amazing destination of ${query}. This location offers unique experiences, beautiful landscapes, and unforgettable memories.`,
            type: 'destination',
            priceRange: 'Rs 36,000 - Rs 90,000',
            duration: '5-7 days',
            rating: 4.5,
            highlights: [
              'Unique cultural experiences',
              'Beautiful landscapes',
              'Local cuisine',
              'Historical sites',
              'Adventure activities'
            ],
            activities: [
              'City tours',
              'Local cuisine experiences',
              'Cultural activities',
              'Shopping',
              'Photography'
            ],
            bestTimeToVisit: ['Year-round', 'Check seasonal recommendations'],
            features: ['Culture', 'Adventure', 'Food'],
            image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80'
          };
        }
      } else if (type === 'hotel') {
        info = {
          title: query,
          description: `Experience luxury and comfort at ${query}. Our carefully selected accommodations offer world-class amenities, exceptional service, and prime locations.`,
          type: 'hotel',
          price: 'Rs 13,500 - Rs 27,000 per night',
          rating: 4.6,
          features: [
            'Luxury amenities',
            'Prime location',
            'World-class service',
            'Spa facilities',
            'Fine dining',
            'Swimming pool'
          ],
          highlights: [
            'Central location',
            '5-star service',
            'Modern facilities',
            'Complimentary breakfast',
            'Free WiFi'
          ]
        };
      } else if (type === 'flight') {
        info = {
          title: query,
          description: `Book your flight to ${query} with our trusted airline partners. Enjoy comfortable seating, in-flight entertainment, and excellent service.`,
          type: 'flight',
          price: 'Rs 22,500 - Rs 40,500',
          duration: 'Varies by route',
          features: [
            'Economy and Business class',
            'In-flight entertainment',
            'Meal service',
            'Comfortable seating',
            'On-time performance'
          ],
          highlights: [
            'Multiple daily flights',
            'Flexible booking',
            'Loyalty programs',
            'Baggage allowance',
            'Online check-in'
          ]
        };
      } else if (type === 'package') {
        info = {
          title: query,
          description: `Our curated ${query} package includes everything you need for an unforgettable trip. All-inclusive deals with accommodations, flights, and activities.`,
          type: 'package',
          price: 'Rs 54,000 - Rs 135,000',
          duration: '5-10 days',
          rating: 4.7,
          features: [
            'All-inclusive',
            'Accommodation included',
            'Flight included',
            'Activities included',
            'Travel insurance',
            '24/7 support'
          ],
          highlights: [
            'Best value deals',
            'No hidden costs',
            'Flexible dates',
            'Group discounts',
            'Easy booking'
          ]
        };
      } else if (type === 'activity') {
        info = {
          title: query,
          description: `Experience ${query} - an exciting activity that will make your trip memorable. Professional guides, safety equipment, and unforgettable moments guaranteed.`,
          type: 'activity',
          price: 'Rs 2,250 - Rs 6,750',
          duration: '2-6 hours',
          rating: 4.8,
          features: [
            'Professional guides',
            'Safety equipment',
            'Small group sizes',
            'Photo opportunities',
            'Flexible scheduling'
          ],
          highlights: [
            'Highly rated',
            'Popular choice',
            'Beginner friendly',
            'Family suitable',
            'Memorable experience'
          ]
        };
      }

      setDetailInfo(info);
        setLoading(false);
    };

    generateDetailInfo();
  }, [query, type, router]);

  const getTypeIcon = () => {
    switch (type) {
      case 'hotel':
        return <Hotel className="w-6 h-6 text-white" />;
      case 'flight':
        return <Plane className="w-6 h-6 text-white" />;
      case 'package':
        return <Package className="w-6 h-6 text-white" />;
      case 'activity':
        return <Activity className="w-6 h-6 text-white" />;
      default:
        return <MapPin className="w-6 h-6 text-white" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!detailInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No information found.</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* Ken Burns Animation Style */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenBurns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.15) translate(-3%, -3%);
          }
        }
        .animate-ken-burns {
          animation: kenBurns 20s ease-in-out infinite alternate;
        }
      `}} />
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm absolute top-0 left-0 right-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Hero Section with Video/Image */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, position: 'relative' }}>
        {/* Background Video or Image */}
        {detailInfo.video && !videoError ? (
          <div className="absolute inset-0 z-0" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', top: 0, left: 0 }}>
            {detailInfo.video.includes('youtube.com') || detailInfo.video.includes('youtu.be') ? (
              <iframe
                src={detailInfo.video}
                className="w-full h-full object-cover"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  minWidth: '100vw',
                  minHeight: '100vh',
                  transform: 'none',
                  pointerEvents: 'none',
                  border: 'none',
                }}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute"
                style={{
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  minWidth: '100vw',
                  minHeight: '100vh',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  backgroundColor: '#000',
                }}
                onError={(e) => {
                  console.error('Video failed to load:', detailInfo.video);
                  setVideoError(true);
                }}
                onLoadedData={() => {
                  console.log('Video loaded successfully');
                  setVideoError(false);
                }}
              >
                <source src={detailInfo.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
            {/* Subtle color tint for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
          </div>
        ) : detailInfo.image ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={detailInfo.image}
              alt={detailInfo.title}
              className={`w-full h-full object-cover ${(query.toLowerCase().includes('london') || query.toLowerCase().includes('paris')) ? 'animate-ken-burns' : ''}`}
              style={(query.toLowerCase().includes('london') || query.toLowerCase().includes('paris')) ? {
                animation: 'kenBurns 20s ease-in-out infinite alternate',
                willChange: 'transform',
              } : {}}
              onError={(e) => {
                console.error('Image failed to load:', detailInfo.image);
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
            {/* Subtle color tint for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
          </div>
        ) : (
          // Fallback gradient if no video or image
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600"></div>
        )}
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <FadeInText className="text-center">
            {/* Title - smaller and more elegant */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white drop-shadow-lg tracking-wide">
              {detailInfo.title}
            </h1>
          </FadeInText>
        </div>
        
        {/* Smooth fade transition to content - removed white background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Information */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {detailInfo.rating && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-xl font-bold text-gray-900">{detailInfo.rating}</p>
                    </div>
                  )}
                  {detailInfo.duration && (
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-xl font-bold text-gray-900">{detailInfo.duration}</p>
                    </div>
                  )}
                  {detailInfo.price && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-xl font-bold text-gray-900">{detailInfo.price}</p>
                    </div>
                  )}
                  {detailInfo.priceRange && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Price Range</p>
                      <p className="text-lg font-bold text-gray-900">{detailInfo.priceRange}</p>
                    </div>
                  )}
                  {detailInfo.location && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <MapPin className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-lg font-bold text-gray-900">{detailInfo.location}</p>
                    </div>
                  )}
                </div>

                {/* Highlights */}
                {detailInfo.highlights && detailInfo.highlights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Key Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {detailInfo.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {detailInfo.activities && detailInfo.activities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {detailInfo.activities.map((activity, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {detailInfo.features && detailInfo.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {detailInfo.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Best Time to Visit */}
              {detailInfo.bestTimeToVisit && (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Best Time to Visit</h2>
                  </div>
                  <div className="space-y-2">
                    {detailInfo.bestTimeToVisit.map((time, index) => (
                      <p key={index} className="text-gray-700">{time}</p>
            ))}
          </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
                
                <div className="space-y-4 mb-6">
                  {detailInfo.type && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Type</p>
                      <p className="font-medium text-gray-900 capitalize">{detailInfo.type}</p>
                    </div>
                  )}
                  {detailInfo.price && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <p className="font-bold text-green-600 text-lg">{detailInfo.price}</p>
                    </div>
                  )}
                  {detailInfo.priceRange && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price Range</p>
                      <p className="font-bold text-green-600 text-lg">{detailInfo.priceRange}</p>
                    </div>
                  )}
                  {detailInfo.rating && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Rating</p>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <p className="font-medium text-gray-900">{detailInfo.rating} / 5.0</p>
                      </div>
                    </div>
                  )}
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  Book Now
                </button>
                
                <button className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
