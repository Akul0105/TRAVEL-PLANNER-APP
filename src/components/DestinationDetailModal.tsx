'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, Utensils, Mountain, Landmark } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CatalogItem } from '@/components/DestinationCatalog';
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
  onRecordFeedback: (itemId: string, itemType: string, action: 'like' | 'dislike') => void;
  isSignedIn: boolean;
}

export function DestinationDetailModal({
  destination,
  onClose,
  feedbackMap,
  onRecordFeedback,
  isSignedIn,
}: DestinationDetailModalProps) {
  if (!destination) return null;

  const highlights = getHighlightsForDestination(destination.id);

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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#e8e4df] bg-[#faf8f5] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e8e4df] bg-[#2c2825] px-6 py-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">{destination.name}</h2>
              {destination.region && (
                <p className="text-sm text-[#e8e4df]">{destination.region}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#e8e4df] hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-6">
            <p className="text-[#6b6560]">{destination.description}</p>

            <div>
              <h3 className="text-lg font-semibold text-[#2c2825] mb-3">
                Best of {destination.name} — activities, food & attractions
              </h3>
              <Carousel
                opts={{ align: 'start', loop: false }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {highlights.map((h) => (
                    <CarouselItem key={h.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <HighlightCard
                        highlight={h}
                        feedback={feedbackMap[h.id] ?? null}
                        onLike={() => onRecordFeedback(h.id, 'highlight', 'like')}
                        onDislike={() => onRecordFeedback(h.id, 'highlight', 'dislike')}
                        isSignedIn={isSignedIn}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-2 border-[#e8e4df] bg-[#faf8f5] hover:bg-[#e8e4df]" />
                <CarouselNext className="right-0 translate-x-2 border-[#e8e4df] bg-[#faf8f5] hover:bg-[#e8e4df]" />
              </Carousel>
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
}: {
  highlight: DestinationHighlight;
  feedback: { action: string } | null;
  onLike: () => void;
  onDislike: () => void;
  isSignedIn: boolean;
}) {
  const { label, icon: Icon } = typeConfig[highlight.type];
  const like = feedback?.action === 'like';
  const dislike = feedback?.action === 'dislike';

  return (
    <Card className="overflow-hidden border-[#e8e4df] bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={highlight.image}
          alt={highlight.title}
          fill
          className="object-cover"
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
                like ? 'bg-green-600 text-white' : 'bg-white/90 text-neutral-600 hover:bg-green-100'
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
        <p className="font-medium text-[#2c2825] text-sm">{highlight.title}</p>
      </CardContent>
    </Card>
  );
}
