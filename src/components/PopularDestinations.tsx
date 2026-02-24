'use client';

import Image from 'next/image';

const DESTINATIONS = [
  { name: 'Mauritius', description: 'Tropical paradise with pristine beaches', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
  { name: 'London', description: 'Historic city with royal heritage', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80' },
  { name: 'Paris', description: 'City of lights and romance', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { name: 'Tokyo', description: 'Modern metropolis with ancient traditions', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { name: 'Bali', description: 'Island of gods and spiritual retreats', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { name: 'Dubai', description: 'Luxury destination in the desert', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
];

function DestinationCard({ dest }: { dest: (typeof DESTINATIONS)[0] }) {
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[380px] bg-white rounded-lg overflow-hidden border border-black/10">
      <div className="relative aspect-[4/3]">
        <Image src={dest.image} alt={dest.name} fill className="object-cover" sizes="380px" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-black mb-1">{dest.name}</h3>
        <p className="text-sm text-neutral-500">{dest.description}</p>
      </div>
    </div>
  );
}

export function PopularDestinations() {
  const duplicated = [...DESTINATIONS, ...DESTINATIONS];

  return (
    <section className="py-16 md:py-20 bg-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-black mb-3 tracking-tight">
          Popular destinations
        </h2>
        <p className="text-neutral-500 max-w-2xl">
          Discover amazing places around the world with our AI-powered recommendations.
        </p>
      </div>

      <div className="relative">
        <div className="flex animate-destinations-scroll gap-6 px-4 sm:px-6 lg:px-8">
          {duplicated.map((dest, i) => (
            <DestinationCard key={`${dest.name}-${i}`} dest={dest} />
          ))}
        </div>
      </div>
    </section>
  );
}
