'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { DestinationDetailModal } from '@/components/DestinationDetailModal';

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  region?: string;
};

const DESTINATIONS: CatalogItem[] = [
  { id: 'mauritius', name: 'Mauritius', description: 'Tropical paradise with pristine beaches', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', region: 'Indian Ocean' },
  { id: 'london', name: 'London', description: 'Historic city with royal heritage', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80', region: 'Europe' },
  { id: 'paris', name: 'Paris', description: 'City of lights and romance', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', region: 'Europe' },
  { id: 'tokyo', name: 'Tokyo', description: 'Modern metropolis with ancient traditions', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', region: 'Asia' },
  { id: 'bali', name: 'Bali', description: 'Island of gods and spiritual retreats', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', region: 'Asia' },
  { id: 'dubai', name: 'Dubai', description: 'Luxury destination in the desert', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', region: 'Middle East' },
  { id: 'rome', name: 'Rome', description: 'Eternal city of art and history', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', region: 'Europe' },
  { id: 'barcelona', name: 'Barcelona', description: 'Gaudí, beaches and vibrant culture', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80', region: 'Europe' },
  { id: 'santorini', name: 'Santorini', description: 'White villages and blue-domed churches', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80', region: 'Europe' },
  { id: 'amsterdam', name: 'Amsterdam', description: 'Canals, museums and cycling culture', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80', region: 'Europe' },
  { id: 'lisbon', name: 'Lisbon', description: 'Seven hills, trams and pastéis de nata', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&q=80', region: 'Europe' },
  { id: 'istanbul', name: 'Istanbul', description: 'Where East meets West', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80', region: 'Europe' },
  { id: 'singapore', name: 'Singapore', description: 'Gardens, food and skyline', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80', region: 'Asia' },
  { id: 'bangkok', name: 'Bangkok', description: 'Temples, street food and nightlife', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80', region: 'Asia' },
  { id: 'sydney', name: 'Sydney', description: 'Harbour, Opera House and beaches', image: 'https://images.unsplash.com/photo-1523482580670-f32f29bd4c0d?w=600&q=80', region: 'Oceania' },
  { id: 'new-york', name: 'New York', description: 'The city that never sleeps', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', region: 'Americas' },
  { id: 'los-angeles', name: 'Los Angeles', description: 'Sun, surf and Hollywood', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&q=80', region: 'Americas' },
  { id: 'miami', name: 'Miami', description: 'Art deco, beaches and Latin flair', image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=600&q=80', region: 'Americas' },
  { id: 'cape-town', name: 'Cape Town', description: 'Table Mountain and coastal beauty', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80', region: 'Africa' },
  { id: 'marrakech', name: 'Marrakech', description: 'Souks, riads and desert gates', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80', region: 'Africa' },
  { id: 'reykjavik', name: 'Reykjavik', description: 'Northern lights and geothermal pools', image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=600&q=80', region: 'Europe' },
  { id: 'prague', name: 'Prague', description: 'Castles, beer and cobbled streets', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80', region: 'Europe' },
  { id: 'vienna', name: 'Vienna', description: 'Coffee houses and imperial palaces', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80', region: 'Europe' },
  { id: 'seoul', name: 'Seoul', description: 'K-pop, palaces and street food', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&q=80', region: 'Asia' },
  { id: 'hong-kong', name: 'Hong Kong', description: 'Skyline, dim sum and harbour', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&q=80', region: 'Asia' },
  { id: 'maldives', name: 'Maldives', description: 'Overwater bungalows and coral reefs', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', region: 'Indian Ocean' },
  { id: 'zanzibar', name: 'Zanzibar', description: 'Spice islands and white sands', image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=600&q=80', region: 'Africa' },
  { id: 'queenstown', name: 'Queenstown', description: 'Adventure capital of the world', image: 'https://images.unsplash.com/photo-1507699629798-6875474293c8?w=600&q=80', region: 'Oceania' },
  { id: 'rio', name: 'Rio de Janeiro', description: 'Christ the Redeemer and Copacabana', image: 'https://images.unsplash.com/photo-1483729558449-99ef43a52516?w=600&q=80', region: 'Americas' },
  { id: 'cancun', name: 'Cancún', description: 'Caribbean coast and Mayan ruins', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80', region: 'Americas' },
];

function FeaturedCard({
  item,
  feedback,
  onLike,
  onDislike,
  onClick,
}: {
  item: CatalogItem;
  feedback: { action: string } | null;
  onLike: () => void;
  onDislike: () => void;
  onClick: () => void;
}) {
  const like = feedback?.action === 'like';
  const dislike = feedback?.action === 'dislike';

  return (
    <article
      onClick={onClick}
      className="group relative w-full aspect-[21/9] min-h-[280px] md:min-h-[320px] rounded-2xl overflow-hidden border border-[#e8e4df] bg-[#2c2825] cursor-pointer shadow-xl"
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, 1280px"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        {item.region && (
          <span className="inline-flex items-center gap-1 text-white/90 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            {item.region}
          </span>
        )}
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">{item.name}</h3>
        <p className="text-white/90 text-lg max-w-2xl">{item.description}</p>
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onLike(); }}
          className={cn(
            'p-2.5 rounded-xl transition-colors shadow-lg',
            like ? 'bg-green-600 text-white' : 'bg-white/90 text-[#2c2825] hover:bg-green-100'
          )}
          aria-label="Like"
        >
          <ThumbsUp className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDislike(); }}
          className={cn(
            'p-2.5 rounded-xl transition-colors shadow-lg',
            dislike ? 'bg-red-600 text-white' : 'bg-white/90 text-[#2c2825] hover:bg-red-100'
          )}
          aria-label="Dislike"
        >
          <ThumbsDown className="w-5 h-5" />
        </button>
      </div>
    </article>
  );
}

function SmallCard({
  item,
  feedback,
  onLike,
  onDislike,
  onClick,
}: {
  item: CatalogItem;
  feedback: { action: string } | null;
  onLike: () => void;
  onDislike: () => void;
  onClick: () => void;
}) {
  const like = feedback?.action === 'like';
  const dislike = feedback?.action === 'dislike';

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden border-[#e8e4df] bg-white hover:shadow-lg hover:border-[#2c2825]/20 transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 280px"
        />
        {item.region && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-xs">
            {item.region}
          </span>
        )}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              like ? 'bg-green-600 text-white' : 'bg-white/90 text-neutral-600 hover:bg-green-100 hover:text-green-700'
            )}
            aria-label="Like"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDislike(); }}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              dislike ? 'bg-red-600 text-white' : 'bg-white/90 text-neutral-600 hover:bg-red-100 hover:text-red-700'
            )}
            aria-label="Dislike"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-[#2c2825]">{item.name}</h3>
        <p className="text-sm text-[#6b6560] line-clamp-2">{item.description}</p>
      </CardContent>
    </Card>
  );
}

export function DestinationCatalog() {
  const { user, session, isAnonymous } = useAuth();
  const [feedbackMap, setFeedbackMap] = useState<Record<string, { action: string }>>({});
  const [selectedDestination, setSelectedDestination] = useState<CatalogItem | null>(null);

  const fetchFeedback = useCallback(async () => {
    if (!session?.access_token) return;
    const res = await fetch('/api/catalog/feedback', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return;
    const { feedback } = await res.json();
    const map: Record<string, { action: string }> = {};
    (feedback || []).forEach((f: { item_id: string; action: string }) => {
      if (f.action === 'like' || f.action === 'dislike') map[f.item_id] = { action: f.action };
    });
    setFeedbackMap(map);
  }, [session?.access_token]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const record = useCallback(
    async (itemId: string, action: 'like' | 'dislike' | 'click', itemType: string = 'destination') => {
      if (!session?.access_token) return;
      const res = await fetch('/api/catalog/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ itemId, itemType, action }),
      });
      if (!res.ok) return;
      if (action === 'like' || action === 'dislike') {
        setFeedbackMap((prev) => ({ ...prev, [itemId]: { action } }));
      }
    },
    [session?.access_token]
  );

  const recordHighlightFeedback = useCallback(
    (itemId: string, itemType: string, action: 'like' | 'dislike') => {
      record(itemId, action, itemType);
    },
    [record]
  );

  const handleOpenDetail = useCallback((item: CatalogItem) => {
    record(item.id, 'click');
    setSelectedDestination(item);
  }, [record]);

  const featured = DESTINATIONS[0];
  const carouselItems = DESTINATIONS.slice(1);

  return (
    <section className="py-16 md:py-24 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#2c2825] mb-3 tracking-tight">
          Browse destinations
        </h2>
        <p className="text-[#6b6560] max-w-2xl mb-2">
          Explore places like an art gallery. Use <strong>like</strong> / <strong>dislike</strong> to shape your bundles. Click any card to see activities, food and attractions — and like those too.
        </p>
        {isAnonymous && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
            Sign in with email to save your likes across devices and get better bundle suggestions.
          </p>
        )}
        {!user && !isAnonymous && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
            Sign in to save your likes — they improve your Scrapbook bundle suggestions.
          </p>
        )}
      </div>

      {/* Featured — one large hero card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <p className="text-sm font-medium text-[#6b6560] uppercase tracking-wider mb-4">Featured</p>
        <FeaturedCard
          item={featured}
          feedback={feedbackMap[featured.id] ?? null}
          onLike={() => record(featured.id, 'like')}
          onDislike={() => record(featured.id, 'dislike')}
          onClick={() => handleOpenDetail(featured)}
        />
      </div>

      {/* Carousel — explore more */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-[#6b6560] uppercase tracking-wider mb-4">Explore more</p>
        <Carousel opts={{ align: 'start', loop: false }} className="w-full">
          <CarouselContent className="-ml-4">
            {carouselItems.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-[85%] sm:basis-[45%] lg:basis-[30%]">
                <SmallCard
                  item={item}
                  feedback={feedbackMap[item.id] ?? null}
                  onLike={() => record(item.id, 'like')}
                  onDislike={() => record(item.id, 'dislike')}
                  onClick={() => handleOpenDetail(item)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-2 border-[#e8e4df] bg-[#faf8f5] hover:bg-[#e8e4df] text-[#2c2825]" />
          <CarouselNext className="right-0 translate-x-2 border-[#e8e4df] bg-[#faf8f5] hover:bg-[#e8e4df] text-[#2c2825]" />
        </Carousel>
      </div>

      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        feedbackMap={feedbackMap}
        onRecordFeedback={recordHighlightFeedback}
        isSignedIn={!!user}
      />
    </section>
  );
}
