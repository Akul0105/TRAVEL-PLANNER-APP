'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  buildProfileUpdatesFromLike,
  feedbackListToPreferenceMap,
  type LikeSyncMeta,
} from '@/lib/catalogLikeSync';
import { BENTO_SLIDES, bentoTileClass, type BentoTile } from '@/data/bentoSlides';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function BentoExperiencesSection() {
  const { user, session, profile, updateProfile } = useAuth();
  const [feedbackMap, setFeedbackMap] = useState<Record<string, { action: string }>>({});
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const fetchFeedback = useCallback(async () => {
    if (!session?.access_token) return;
    const res = await fetch('/api/catalog/feedback', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return;
    const { feedback } = await res.json();
    setFeedbackMap(feedbackListToPreferenceMap(feedback ?? []));
  }, [session?.access_token]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const t = setInterval(() => api.scrollNext(), 8000);
    return () => clearInterval(t);
  }, [api]);

  const toggleTile = useCallback(
    async (tile: BentoTile) => {
      if (!session?.access_token || !user) return;
      const id = tile.feedbackItemId.toLowerCase();
      const liked = feedbackMap[id]?.action === 'like';

      if (liked) {
        const res = await fetch('/api/catalog/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            itemId: tile.feedbackItemId,
            itemType: tile.feedbackItemType,
            action: 'clear',
          }),
        });
        if (!res.ok) return;
        setFeedbackMap((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        return;
      }

      const res = await fetch('/api/catalog/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          itemId: tile.feedbackItemId,
          itemType: tile.feedbackItemType,
          action: 'like',
        }),
      });
      if (!res.ok) return;

      setFeedbackMap((prev) => ({ ...prev, [id]: { action: 'like' } }));

      if (profile) {
        const sync: LikeSyncMeta = { ...tile.sync };
        const patch = buildProfileUpdatesFromLike(profile, sync);
        if (patch && Object.keys(patch).length) {
          await updateProfile(patch);
        }
      }
    },
    [session?.access_token, user, profile, updateProfile, feedbackMap]
  );

  return (
    <section className="relative border-t border-white/[0.08] bg-[#0a0908] py-10 md:py-14 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(244,63,94,0.05) 0%, transparent 45%)',
        }}
      />
      {/* Title stays readable; grid uses almost full viewport width */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
          Experiences
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl md:leading-tight lg:text-5xl">
          Curated activities &amp; destinations
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/55 md:text-lg">
          Tap the heart to save — filled means saved. Tap again to remove. Likes sync to your Scrapbook
          (bucket list, activities, food).
        </p>
      </div>

      <div className="relative mt-8 md:mt-10 flex w-full justify-center px-4 sm:px-6 lg:px-8">
        {/* Centered column — not edge-to-edge so the bento feels balanced on wide screens */}
        <div className="relative w-full max-w-[1080px] sm:max-w-[1180px] lg:max-w-[1280px] xl:max-w-[1380px]">
          <Carousel setApi={setApi} opts={{ align: 'center', loop: true }} className="w-full">
            <CarouselContent className="-ml-2 sm:-ml-3">
              {BENTO_SLIDES.map((slide) => (
                <CarouselItem key={slide.id} className="pl-2 sm:pl-3 basis-full">
                  <div
                    className={cn(
                      'mx-auto w-full grid grid-cols-6 gap-2 sm:grid-cols-12 sm:grid-rows-4 sm:gap-2.5 md:gap-3 lg:gap-4',
                      /* Moderate height — readable, not overwhelming */
                      'min-h-[min(52dvh,440px)] max-h-[min(52dvh,440px)]',
                      'sm:min-h-[min(58dvh,520px)] sm:max-h-[min(58dvh,520px)]',
                      'md:min-h-[min(62dvh,580px)] md:max-h-[min(62dvh,580px)]',
                      'lg:min-h-[min(64dvh,640px)] lg:max-h-[min(64dvh,640px)]',
                      'xl:min-h-[min(66dvh,680px)] xl:max-h-[min(66dvh,680px)]'
                    )}
                  >
                    {slide.tiles.map((tile) => (
                      <BentoTileCard
                        key={tile.id}
                        tile={tile}
                        liked={
                          feedbackMap[tile.feedbackItemId.toLowerCase()]?.action === 'like'
                        }
                        onToggle={() => toggleTile(tile)}
                        canLike={!!user && !!session?.access_token}
                      />
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-2 sm:-left-3 md:-left-4 h-10 w-10 sm:h-11 sm:w-11 border-white/15 bg-neutral-950/90 text-white shadow-lg backdrop-blur-md hover:bg-neutral-900 hover:text-white" />
            <CarouselNext className="-right-2 sm:-right-3 md:-right-4 h-10 w-10 sm:h-11 sm:w-11 border-white/15 bg-neutral-950/90 text-white shadow-lg backdrop-blur-md hover:bg-neutral-900 hover:text-white" />
          </Carousel>

          <div className="mt-6 md:mt-8 flex justify-center gap-1.5">
            {BENTO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === current ? 'w-10 bg-rose-500' : 'w-2 bg-white/20 hover:bg-white/35'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BentoTileCard({
  tile,
  liked,
  onToggle,
  canLike,
}: {
  tile: BentoTile;
  liked: boolean;
  onToggle: () => void;
  canLike: boolean;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-900 shadow-xl ring-1 ring-white/10',
        bentoTileClass(tile.layout)
      )}
    >
      <Image
        src={tile.image}
        alt={tile.title}
        fill
        className={cn(
          'object-cover transition-transform duration-700',
          liked ? 'scale-105 brightness-[0.95]' : 'group-hover:scale-[1.03]'
        )}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20" />

      {canLike && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-pressed={liked}
          aria-label={liked ? 'Remove from saved' : 'Save to scrapbook'}
          className={cn(
            'absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-all duration-200',
            liked
              ? 'scale-100 bg-rose-600 text-white ring-2 ring-rose-300/80 shadow-rose-900/50'
              : 'bg-white/95 text-neutral-700 hover:scale-105 hover:bg-white hover:text-rose-600'
          )}
        >
          <Heart
            className={cn('h-5 w-5', liked && 'fill-current')}
            strokeWidth={liked ? 0 : 2}
          />
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 text-center sm:p-4 md:text-left">
        <h3 className="text-base font-semibold tracking-tight text-white drop-shadow-md sm:text-lg md:text-xl">
          {tile.title}
        </h3>
        <p className="mt-0.5 text-xs text-white/80 sm:text-sm">{tile.subtitle}</p>
      </div>
    </div>
  );
}
