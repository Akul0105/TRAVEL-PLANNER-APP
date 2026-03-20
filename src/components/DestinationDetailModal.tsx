'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, Utensils, Mountain, Landmark } from 'lucide-react';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CatalogItem } from '@/data/destinationsCatalog';
import type { LikeSyncMeta } from '@/lib/catalogLikeSync';
import { getHighlightsForDestination, type DestinationHighlight, type HighlightType } from '@/data/destinationHighlights';

const typeConfig: Record<HighlightType, { label: string; icon: typeof Utensils }> = {
  activity: { label: 'Activity', icon: Mountain },
  food: { label: 'Food', icon: Utensils },
  attraction: { label: 'Attraction', icon: Landmark },
};

interface DestinationDetailModalProps {
  destination: CatalogItem | null;
  onClose: () => void;
  feedbackMap: Record<string, { action: string }>;
  onRecordFeedback: (
    itemId: string,
    itemType: string,
    action: 'like' | 'dislike' | 'clear',
    meta?: LikeSyncMeta
  ) => void | Promise<void>;
  isSignedIn: boolean;
}

export function DestinationDetailModal({
  destination,
  onClose,
  feedbackMap,
  onRecordFeedback,
  isSignedIn,
}: DestinationDetailModalProps) {
  const highlights = destination ? getHighlightsForDestination(destination.id) : [];
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (!api || highlights.length <= 1) return;
    const interval = setInterval(() => api.scrollNext(), 4200);
    return () => clearInterval(interval);
  }, [api, highlights.length]);

  useEffect(() => {
    if (!destination || !api) return;
    api.scrollTo(0);
    setCurrentIndex(0);
  }, [destination, api]);

  if (!destination) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-neutral-950 px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">{destination.name}</h2>
              {destination.region && (
                <p className="text-sm text-neutral-400">{destination.region}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-6 bg-neutral-900">
            <p className="text-white/70 text-base md:text-lg">{destination.description}</p>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Highlights
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-white mb-3">
                Best of {destination.name} — activities, food & attractions
              </h3>
              <Carousel
                setApi={setApi}
                opts={{ align: 'center', loop: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {highlights.map((h, index) => (
                    <CarouselItem key={h.id} className="pl-4 basis-[88%] sm:basis-[65%] lg:basis-[55%]">
                      <HighlightCard
                        highlight={h}
                        feedback={feedbackMap[h.id.toLowerCase()] ?? null}
                        onLike={() => {
                          if (feedbackMap[h.id.toLowerCase()]?.action === 'like') {
                            onRecordFeedback(h.id, 'highlight', 'clear');
                          } else {
                            onRecordFeedback(h.id, 'highlight', 'like', {
                              highlightTitle: h.title,
                              highlightType: h.type,
                            });
                          }
                        }}
                        onDislike={() => onRecordFeedback(h.id, 'highlight', 'dislike')}
                        isSignedIn={isSignedIn}
                        isCurrent={index === currentIndex}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 md:left-2 border-white/15 bg-neutral-800 text-white hover:bg-neutral-700" />
                <CarouselNext className="right-1 md:right-2 border-white/15 bg-neutral-800 text-white hover:bg-neutral-700" />
              </Carousel>
              <div className="mt-4 flex justify-center gap-2">
                {highlights.map((h, index) => (
                  <button
                    key={`${h.id}-dot`}
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      index === currentIndex ? 'w-7 bg-emerald-500' : 'w-2 bg-white/25 hover:bg-white/40'
                    )}
                    aria-label={`Go to ${h.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function HighlightCard({
  highlight,
  feedback,
  onLike,
  onDislike,
  isSignedIn,
  isCurrent,
}: {
  highlight: DestinationHighlight;
  feedback: { action: string } | null;
  onLike: () => void;
  onDislike: () => void;
  isSignedIn: boolean;
  isCurrent: boolean;
}) {
  const { label, icon: Icon } = typeConfig[highlight.type];
  const like = feedback?.action === 'like';
  const dislike = feedback?.action === 'dislike';

  return (
    <Card className={cn(
      'overflow-hidden border-white/10 bg-neutral-800/80 transition-all duration-500',
      isCurrent ? 'scale-100 shadow-xl shadow-black/40 ring-1 ring-white/10' : 'scale-[0.92] opacity-90 shadow-lg'
    )}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={highlight.image}
          alt={highlight.title}
          fill
          className={cn('object-cover transition-transform duration-700', isCurrent ? 'scale-100' : 'scale-95')}
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs">
          <Icon className="w-3 h-3" />
          {label}
        </span>
        {isSignedIn && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onLike(); }}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                like
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/70 shadow-md'
                  : 'bg-white/95 text-neutral-800 hover:bg-white'
              )}
              aria-pressed={like}
              aria-label={like ? 'Remove like' : 'Like'}
            >
              <ThumbsUp className={cn('w-4 h-4', like && 'fill-current')} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDislike(); }}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                dislike ? 'bg-red-600 text-white' : 'bg-white/90 text-neutral-600 hover:bg-red-100'
              )}
              aria-label="Dislike"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <p className="font-medium text-white text-sm">{highlight.title}</p>
      </CardContent>
    </Card>
  );
}
