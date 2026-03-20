'use client';

import { useState, useEffect, useCallback, useMemo, type RefObject } from 'react';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { DestinationDetailModal } from '@/components/DestinationDetailModal';
import { SearchBar } from '@/components/SearchBar';
import { SearchSuggestion } from '@/types';
import type { CatalogItem } from '@/data/destinationsCatalog';
import { DESTINATIONS } from '@/data/destinationsCatalog';
import {
  buildProfileUpdatesFromLike,
  feedbackListToPreferenceMap,
  type LikeSyncMeta,
} from '@/lib/catalogLikeSync';

export type { CatalogItem };

/** Shortest signed distance on a circular index (for cover-flow left/right). */
function carouselOffset(index: number, current: number, length: number): number {
  let d = index - current;
  const half = length / 2;
  if (d > half) d -= length;
  if (d < -half) d += length;
  return d;
}

function DestinationCard({
  item,
  feedback,
  onLike,
  onDislike,
  onClick,
  isCurrent,
  slideOffset,
}: {
  item: CatalogItem;
  feedback: { action: string } | null;
  onLike: () => void;
  onDislike: () => void;
  onClick: () => void;
  isCurrent: boolean;
  slideOffset: number;
}) {
  const like = feedback?.action === 'like';
  const dislike = feedback?.action === 'dislike';
  const rotateY = Math.max(-16, Math.min(16, -slideOffset * 11));
  const scale = isCurrent ? 1 : 0.78;
  const translateZ = isCurrent ? 0 : -90;
  const opacity = isCurrent ? 1 : 0.72 + Math.min(0.15, 0.05 * (2 - Math.abs(slideOffset)));

  return (
    <article
      onClick={onClick}
      style={{
        transform: `perspective(1400px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        opacity,
        zIndex: isCurrent ? 30 : 20 - Math.abs(slideOffset) * 2,
      }}
      className={cn(
        // Explicit size (aspect + max-h) — avoids h-full collapse with flex + Next/Image fill
        'group relative w-full max-w-[min(98vw,1120px)] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#1a1816] cursor-pointer shadow-2xl transition-[transform,opacity,box-shadow] duration-500 ease-out will-change-transform',
        'aspect-[3/4] max-h-[min(calc(100dvh-10.5rem),760px)] sm:aspect-[16/10] sm:max-h-[min(calc(100dvh-8.5rem),780px)]',
        isCurrent && 'ring-2 ring-white/25 ring-offset-2 ring-offset-neutral-950'
      )}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        className={cn(
          'object-cover transition-transform duration-700',
          isCurrent ? 'opacity-95 group-hover:scale-105' : 'opacity-85 group-hover:scale-[1.02]'
        )}
        sizes="(max-width: 768px) 98vw, 72vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
      <div className={cn('absolute bottom-0 left-0 right-0', isCurrent ? 'p-6 md:p-8' : 'p-4 md:p-6')}>
        {item.region && (
          <span className={cn('inline-flex items-center gap-1 text-white/90 mb-2', isCurrent ? 'text-sm' : 'text-xs')}>
            <MapPin className={cn(isCurrent ? 'w-4 h-4' : 'w-3.5 h-3.5')} />
            {item.region}
          </span>
        )}
        <h3 className={cn('font-bold text-white mb-1', isCurrent ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl')}>
          {item.name}
        </h3>
        <p className={cn('text-white/90 max-w-2xl', isCurrent ? 'text-lg' : 'text-sm md:text-base')}>
          {item.description}
        </p>
      </div>
      <div className={cn('absolute top-4 right-4 flex gap-2', !isCurrent && 'scale-90 origin-top-right')}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onLike(); }}
          className={cn(
            'p-2.5 rounded-xl transition-colors shadow-lg',
            like
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/70 shadow-emerald-900/40'
              : 'bg-white/90 text-neutral-950 hover:bg-green-100'
          )}
          aria-pressed={like}
          aria-label={like ? 'Remove like' : 'Like'}
        >
          <ThumbsUp className={cn('w-5 h-5', like && 'fill-current')} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDislike(); }}
          className={cn(
            'p-2.5 rounded-xl transition-colors shadow-lg',
            dislike ? 'bg-red-600 text-white' : 'bg-white/90 text-neutral-950 hover:bg-red-100'
          )}
          aria-label="Dislike"
        >
          <ThumbsDown className="w-5 h-5" />
        </button>
      </div>
    </article>
  );
}

interface DestinationCatalogProps {
  sectionRef?: RefObject<HTMLElement | null>;
  /** When set, carousel scrolls to this catalog id once (e.g. after search pick). */
  catalogFocusId?: string | null;
  onCatalogFocusConsumed?: () => void;
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  marketBasketResults?: SearchSuggestion[];
  isLoading: boolean;
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
}

export function DestinationCatalog({
  sectionRef,
  catalogFocusId,
  onCatalogFocusConsumed,
  onSearch,
  suggestions,
  marketBasketResults,
  isLoading,
  showSuggestions,
  onSuggestionClick,
}: DestinationCatalogProps) {
  const { user, session, profile, updateProfile } = useAuth();
  const [feedbackMap, setFeedbackMap] = useState<Record<string, { action: string }>>({});
  const [selectedDestination, setSelectedDestination] = useState<CatalogItem | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchFeedback = useCallback(async () => {
    if (!session?.access_token) return;
    const res = await fetch('/api/catalog/feedback', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return;
    const { feedback } = await res.json();
    setFeedbackMap(
      feedbackListToPreferenceMap(feedback ?? [])
    );
  }, [session?.access_token]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const record = useCallback(
    async (
      itemId: string,
      action: 'like' | 'dislike' | 'click' | 'clear',
      itemType: string = 'destination',
      meta?: LikeSyncMeta
    ) => {
      if (!session?.access_token) return;
      const key = itemId.toLowerCase();
      const res = await fetch('/api/catalog/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ itemId, itemType, action }),
      });
      if (!res.ok) return;
      if (action === 'clear') {
        setFeedbackMap((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        return;
      }
      if (action === 'like' || action === 'dislike') {
        setFeedbackMap((prev) => ({ ...prev, [key]: { action } }));
      }
      if (action === 'like' && profile && user) {
        const patch = buildProfileUpdatesFromLike(profile, {
          bucketName: meta?.bucketName,
          highlightTitle: meta?.highlightTitle,
          highlightType: meta?.highlightType,
        });
        if (patch && Object.keys(patch).length) await updateProfile(patch);
      }
    },
    [session?.access_token, profile, user, updateProfile]
  );

  const recordHighlightFeedback = useCallback(
    (
      itemId: string,
      itemType: string,
      action: 'like' | 'dislike' | 'clear',
      meta?: LikeSyncMeta
    ) => {
      return record(itemId, action, itemType, meta);
    },
    [record]
  );

  const handleOpenDetail = useCallback((item: CatalogItem) => {
    record(item.id, 'click');
    setSelectedDestination(item);
  }, [record]);

  useEffect(() => {
    if (!api) return;
    const updateIndex = () => setCurrentIndex(api.selectedScrollSnap());
    updateIndex();
    api.on('select', updateIndex);
    api.on('reInit', updateIndex);

    return () => {
      api.off('select', updateIndex);
      api.off('reInit', updateIndex);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4800);
    return () => clearInterval(interval);
  }, [api]);

  /** Search picked a catalog destination — jump carousel there (no /details page). */
  useEffect(() => {
    if (!catalogFocusId || !api) return;
    const idx = DESTINATIONS.findIndex((d) => d.id === catalogFocusId);
    if (idx >= 0) {
      api.scrollTo(idx);
    }
    onCatalogFocusConsumed?.();
  }, [catalogFocusId, api, onCatalogFocusConsumed]);

  const destinationItems = useMemo(() => DESTINATIONS, []);
  const nDest = destinationItems.length;

  return (
    <section
      ref={sectionRef}
      className="h-[100dvh] max-h-[100dvh] min-h-0 flex flex-col overflow-hidden bg-[#0c0a09] text-white"
    >
      {/* Compact chrome — leaves maximum height for carousel inside one screen */}
      <header className="shrink-0 w-full pt-3 pb-2 md:pt-4 md:pb-3 px-4 sm:px-6 text-center">
        <p className="text-[0.58rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-white/45 mb-1.5">
          Discover
        </p>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-[-0.02em] leading-tight max-w-3xl mx-auto text-balance">
          Popular{' '}
          <span className="font-normal text-white/55">destinations</span>
        </h2>
        <div className="mt-2.5 md:mt-3 max-w-lg w-full mx-auto">
          <SearchBar
            onSearch={onSearch}
            suggestions={suggestions}
            marketBasketResults={marketBasketResults}
            isLoading={isLoading}
            showSuggestions={showSuggestions}
            onSuggestionClick={onSuggestionClick}
            variant="dark"
            showPopularPills={false}
            dense
            className="max-w-none mx-0 w-full"
          />
        </div>
      </header>

      {/* Fills all remaining viewport height */}
      <div className="flex-1 min-h-0 w-full flex flex-col px-0 pb-2 md:pb-3">
        <div className="relative flex-1 min-h-0 w-full sm:mx-auto sm:max-w-[min(100%,1920px)] rounded-t-xl sm:rounded-t-2xl lg:rounded-[1.75rem] bg-neutral-950 shadow-[0_-8px_60px_-16px_rgba(0,0,0,0.12),0_32px_80px_-36px_rgba(0,0,0,0.35)] border-t sm:border border-white/[0.08] overflow-hidden flex flex-col">
          {/* Subtle cool halo — enterprise product feel */}
          <div
            className="pointer-events-none absolute inset-0 opacity-95"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 42%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(ellipse 85% 55% at 50% 100%, rgba(0,0,0,0.85) 0%, transparent 50%)',
            }}
          />

          <div className="relative z-10 flex flex-1 min-h-0 flex-col justify-center [perspective:1800px] py-2">
            <Carousel
              setApi={setApi}
              opts={{ align: 'center', loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4 items-center py-1 md:py-2">
                {destinationItems.map((item, index) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-2 sm:pl-3 md:pl-4 basis-[94%] sm:basis-[72%] lg:basis-[60%] xl:basis-[52%] 2xl:basis-[48%] flex items-center justify-center"
                  >
                    <DestinationCard
                      item={item}
                      feedback={feedbackMap[item.id] ?? null}
                      onLike={() => {
                        if (feedbackMap[item.id]?.action === 'like') {
                          void record(item.id, 'clear', 'destination');
                        } else {
                          void record(item.id, 'like', 'destination', {
                            bucketName: item.name,
                          });
                        }
                      }}
                      onDislike={() => record(item.id, 'dislike', 'destination')}
                      onClick={() => handleOpenDetail(item)}
                      isCurrent={index === currentIndex}
                      slideOffset={carouselOffset(index, currentIndex, nDest)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1.5 sm:left-3 md:left-5 h-10 w-10 sm:h-11 sm:w-11 border-white/25 bg-black/40 text-white hover:bg-white/15 hover:text-white backdrop-blur-md shadow-lg" />
              <CarouselNext className="right-1.5 sm:right-3 md:right-5 h-10 w-10 sm:h-11 sm:w-11 border-white/25 bg-black/40 text-white hover:bg-white/15 hover:text-white backdrop-blur-md shadow-lg" />
            </Carousel>

            <div className="shrink-0 flex justify-center gap-1.5 px-3 py-2">
              {destinationItems.map((item, index) => (
                <button
                  key={`${item.id}-dot`}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    index === currentIndex
                      ? 'w-9 bg-white'
                      : 'w-2 bg-white/25 hover:bg-white/45'
                  )}
                  aria-label={`Go to ${item.name}`}
                />
              ))}
            </div>
          </div>
        </div>
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
