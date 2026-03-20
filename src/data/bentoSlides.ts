/**
 * Roavio-style bento grids for the home page slideshow.
 * Each tile syncs likes to catalog_feedback + Scrapbook profile fields.
 */
import type { LikeSyncMeta } from '@/lib/catalogLikeSync';

export type BentoTileLayout = 'tall' | 'small-tl' | 'small-bl' | 'hero' | 'small-tr' | 'small-br';

export type BentoTile = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  layout: BentoTileLayout;
  feedbackItemId: string;
  /** catalog_feedback.item_type */
  feedbackItemType: 'destination' | 'highlight';
  sync: LikeSyncMeta;
};

export type BentoSlide = { id: string; tiles: BentoTile[] };

/** Stable query params — avoid fit=crop on some Unsplash IDs (Next image proxy 404s). */
const hq = (u: string) =>
  u.includes('?') ? u : `${u}?auto=format&w=1200&q=80`;

/** 6 tiles: column1 tall | col2 two stacked | col3 hero | col4 two stacked */
function slide(
  id: string,
  tiles: [BentoTile, BentoTile, BentoTile, BentoTile, BentoTile, BentoTile]
): BentoSlide {
  return { id, tiles: [...tiles] };
}

export const BENTO_SLIDES: BentoSlide[] = [
  slide('s1', [
    {
      id: 't1',
      title: 'Adriatic cliffs',
      subtitle: 'Dubrovnik, Croatia',
      image:
        'https://images.pexels.com/photos/3568441/pexels-photo-3568441.jpeg?auto=compress&cs=tinysrgb&w=1200',
      layout: 'tall',
      feedbackItemId: 'dubrovnik',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Dubrovnik' },
    },
    {
      id: 't2',
      title: 'Climbing waterfalls',
      subtitle: 'La Fortuna, Costa Rica',
      image: hq('https://images.unsplash.com/photo-1522163182402-834f871fd851'),
      layout: 'small-tl',
      feedbackItemId: 'bento-s1-waterfall-climb',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Climbing waterfalls', highlightType: 'activity' },
    },
    {
      id: 't3',
      title: 'Whitewater rafting',
      subtitle: 'Zambezi River',
      image:
        'https://images.pexels.com/photos/31957573/pexels-photo-31957573.jpeg?auto=compress&cs=tinysrgb&w=1200',
      layout: 'small-bl',
      feedbackItemId: 'bento-s1-rafting',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Whitewater rafting', highlightType: 'activity' },
    },
    {
      id: 't4',
      title: 'Island blues',
      subtitle: 'Santorini, Greece',
      image: hq('https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e'),
      layout: 'hero',
      feedbackItemId: 'santorini',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Santorini' },
    },
    {
      id: 't5',
      title: 'Skyline nights',
      subtitle: 'Bangkok, Thailand',
      image: hq('https://images.unsplash.com/photo-1508009603885-50cf7c579365'),
      layout: 'small-tr',
      feedbackItemId: 'bangkok',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Bangkok' },
    },
    {
      id: 't6',
      title: 'Coastal viewpoint',
      subtitle: 'Cape Town, South Africa',
      image: hq('https://images.unsplash.com/photo-1580060839134-75a5edca2e99'),
      layout: 'small-br',
      feedbackItemId: 'cape-town',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Cape Town' },
    },
  ]),
  slide('s2', [
    {
      id: 't1',
      title: 'Kyoto bamboo',
      subtitle: 'Arashiyama, Japan',
      image: hq('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'),
      layout: 'tall',
      feedbackItemId: 'kyoto',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Kyoto' },
    },
    {
      id: 't2',
      title: 'Street food tour',
      subtitle: 'Night markets',
      image: hq('https://images.unsplash.com/photo-1559314809-0d155014e29e'),
      layout: 'small-tl',
      feedbackItemId: 'bento-s2-street-food',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Street food tour', highlightType: 'food' },
    },
    {
      id: 't3',
      title: 'Scuba & reef',
      subtitle: 'Indian Ocean',
      image: hq('https://images.unsplash.com/photo-1544551763-46a013bb70d5'),
      layout: 'small-bl',
      feedbackItemId: 'bento-s2-scuba',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Scuba & reef diving', highlightType: 'activity' },
    },
    {
      id: 't4',
      title: 'Maldives lagoon',
      subtitle: 'North Malé Atoll',
      image: hq('https://images.unsplash.com/photo-1514282401047-d79a71a590e8'),
      layout: 'hero',
      feedbackItemId: 'maldives',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Maldives' },
    },
    {
      id: 't5',
      title: 'Alpine hike',
      subtitle: 'Queenstown, NZ',
      image:
        'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=1200',
      layout: 'small-tr',
      feedbackItemId: 'queenstown',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Queenstown' },
    },
    {
      id: 't6',
      title: 'Wine & vineyard',
      subtitle: 'Tuscany tasting',
      image: hq('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3'),
      layout: 'small-br',
      feedbackItemId: 'bento-s2-wine',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Wine & vineyard tasting', highlightType: 'food' },
    },
  ]),
  slide('s3', [
    {
      id: 't1',
      title: 'Northern lights',
      subtitle: 'Reykjavik, Iceland',
      image: hq('https://images.unsplash.com/photo-1504893524553-b855bce32c67'),
      layout: 'tall',
      feedbackItemId: 'reykjavik',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Reykjavik' },
    },
    {
      id: 't2',
      title: 'Sushi omakase',
      subtitle: 'Tokyo craft',
      image: hq('https://images.unsplash.com/photo-1579871494447-9811cf80d66c'),
      layout: 'small-tl',
      feedbackItemId: 'tokyo-sushi',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Sushi omakase', highlightType: 'food' },
    },
    {
      id: 't3',
      title: 'Desert camp',
      subtitle: 'Sahara dunes',
      image: hq('https://images.unsplash.com/photo-1473580044384-7ba9967e16a0'),
      layout: 'small-bl',
      feedbackItemId: 'bento-s3-desert',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Desert camp experience', highlightType: 'activity' },
    },
    {
      id: 't4',
      title: 'Paris rooftops',
      subtitle: 'France',
      image: hq('https://images.unsplash.com/photo-1502602898657-3e91760cbb34'),
      layout: 'hero',
      feedbackItemId: 'paris',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Paris' },
    },
    {
      id: 't5',
      title: 'Fjord cruise',
      subtitle: 'Norwegian coast',
      image: hq('https://images.unsplash.com/photo-1527004013197-933c4bb611b3'),
      layout: 'small-tr',
      feedbackItemId: 'bento-s3-fjord',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Fjord cruise', highlightType: 'activity' },
    },
    {
      id: 't6',
      title: 'Moroccan tagine',
      subtitle: 'Marrakech medina',
      image: hq('https://images.unsplash.com/photo-1547592166-23ac45744acd'),
      layout: 'small-br',
      feedbackItemId: 'marrakech-tagine',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Moroccan tagine', highlightType: 'food' },
    },
  ]),
  slide('s4', [
    {
      id: 't1',
      title: 'Bora Bora peaks',
      subtitle: 'French Polynesia',
      image: hq('https://images.unsplash.com/photo-1436491865332-7a61a109cc05'),
      layout: 'tall',
      feedbackItemId: 'bora-bora',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Bora Bora' },
    },
    {
      id: 't2',
      title: 'Surf session',
      subtitle: 'Bali breaks',
      image: hq('https://images.unsplash.com/photo-1502680390469-be75c86b636f'),
      layout: 'small-tl',
      feedbackItemId: 'bento-s4-surf',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Surf session', highlightType: 'activity' },
    },
    {
      id: 't3',
      title: 'Rooftop bar',
      subtitle: 'Singapore',
      image: hq('https://images.unsplash.com/photo-1525625293386-3f8f99389edd'),
      layout: 'small-bl',
      feedbackItemId: 'singapore-gardens',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Rooftop skyline drinks', highlightType: 'food' },
    },
    {
      id: 't4',
      title: 'New York pulse',
      subtitle: 'Manhattan',
      image: hq('https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9'),
      layout: 'hero',
      feedbackItemId: 'new-york',
      feedbackItemType: 'destination',
      sync: { bucketName: 'New York' },
    },
    {
      id: 't5',
      title: 'Vienna coffee',
      subtitle: 'Historic cafés',
      image: hq('https://images.unsplash.com/photo-1516550893923-42d28e5677af'),
      layout: 'small-tr',
      feedbackItemId: 'vienna-sachertorte',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Vienna coffee house', highlightType: 'food' },
    },
    {
      id: 't6',
      title: 'Temple sunrise',
      subtitle: 'Bangkok',
      image:
        'https://images.pexels.com/photos/4157087/pexels-photo-4157087.jpeg?auto=compress&cs=tinysrgb&w=1200',
      layout: 'small-br',
      feedbackItemId: 'bangkok-temple',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Temple sunrise visit', highlightType: 'attraction' },
    },
  ]),
  slide('s5', [
    {
      id: 't1',
      title: 'Vancouver peaks',
      subtitle: 'Sea to sky',
      image: hq('https://images.unsplash.com/photo-1559511260-66a654ae982a'),
      layout: 'tall',
      feedbackItemId: 'vancouver',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Vancouver' },
    },
    {
      id: 't2',
      title: 'Cooking class',
      subtitle: 'Local recipes',
      image: hq('https://images.unsplash.com/photo-1556910103-1c02745aae4d'),
      layout: 'small-tl',
      feedbackItemId: 'bento-s5-cooking',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Local cooking class', highlightType: 'activity' },
    },
    {
      id: 't3',
      title: 'Tapas crawl',
      subtitle: 'Barcelona',
      image: hq('https://images.unsplash.com/photo-1555396273-367ea4eb4db5'),
      layout: 'small-bl',
      feedbackItemId: 'barcelona-tapas',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Tapas crawl', highlightType: 'food' },
    },
    {
      id: 't4',
      title: 'Rio from above',
      subtitle: 'Brazil',
      image:
        'https://images.pexels.com/photos/1486576/pexels-photo-1486576.jpeg?auto=compress&cs=tinysrgb&w=1200',
      layout: 'hero',
      feedbackItemId: 'rio',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Rio de Janeiro' },
    },
    {
      id: 't5',
      title: 'Athens ancient',
      subtitle: 'Acropolis',
      image: hq('https://images.unsplash.com/photo-1555993539-1732b0258235'),
      layout: 'small-tr',
      feedbackItemId: 'athens',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Athens' },
    },
    {
      id: 't6',
      title: 'Canal cruise',
      subtitle: 'Amsterdam',
      image: hq('https://images.unsplash.com/photo-1534351590666-13e3e96b5017'),
      layout: 'small-br',
      feedbackItemId: 'amsterdam',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Amsterdam' },
    },
  ]),
  slide('s6', [
    {
      id: 't1',
      title: 'Florence art',
      subtitle: 'Tuscany, Italy',
      image: hq('https://images.unsplash.com/photo-1541370976299-4d24ebbc9077'),
      layout: 'tall',
      feedbackItemId: 'florence',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Florence' },
    },
    {
      id: 't2',
      title: 'Safari sunrise',
      subtitle: 'Serengeti vibe',
      image: hq('https://images.unsplash.com/photo-1516426122078-c23e76319801'),
      layout: 'small-tl',
      feedbackItemId: 'bento-s6-safari',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Safari sunrise', highlightType: 'activity' },
    },
    {
      id: 't3',
      title: 'Pastéis de nata',
      subtitle: 'Lisbon',
      image: hq('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445'),
      layout: 'small-bl',
      feedbackItemId: 'lisbon-pasteis',
      feedbackItemType: 'highlight',
      sync: { highlightTitle: 'Pastéis de nata', highlightType: 'food' },
    },
    {
      id: 't4',
      title: 'Dubai skyline',
      subtitle: 'UAE',
      image: hq('https://images.unsplash.com/photo-1512453979798-5ea266f8880c'),
      layout: 'hero',
      feedbackItemId: 'dubai',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Dubai' },
    },
    {
      id: 't5',
      title: 'Seoul neon',
      subtitle: 'South Korea',
      image: hq('https://images.unsplash.com/photo-1538485399081-7191377e8241'),
      layout: 'small-tr',
      feedbackItemId: 'seoul',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Seoul' },
    },
    {
      id: 't6',
      title: 'Zanzibar spice',
      subtitle: 'Tanzania coast',
      image: hq('https://images.unsplash.com/photo-1589553416260-f586c8f1514f'),
      layout: 'small-br',
      feedbackItemId: 'zanzibar',
      feedbackItemType: 'destination',
      sync: { bucketName: 'Zanzibar' },
    },
  ]),
];

const layoutClass: Record<BentoTileLayout, string> = {
  tall: 'col-span-6 row-span-2 sm:col-span-3 sm:row-span-4 sm:col-start-1 sm:row-start-1 min-h-[200px] sm:min-h-0',
  'small-tl':
    'col-span-6 row-span-1 sm:col-span-2 sm:row-span-2 sm:col-start-4 sm:row-start-1 min-h-[180px] sm:min-h-0',
  'small-bl':
    'col-span-6 row-span-1 sm:col-span-2 sm:row-span-2 sm:col-start-4 sm:row-start-3 min-h-[180px] sm:min-h-0',
  hero: 'col-span-6 row-span-2 sm:col-span-4 sm:row-span-4 sm:col-start-6 sm:row-start-1 min-h-[220px] sm:min-h-0',
  'small-tr':
    'col-span-6 row-span-1 sm:col-span-2 sm:row-span-2 sm:col-start-10 sm:row-start-1 min-h-[180px] sm:min-h-0',
  'small-br':
    'col-span-6 row-span-1 sm:col-span-2 sm:row-span-2 sm:col-start-10 sm:row-start-3 min-h-[180px] sm:min-h-0',
};

export function bentoTileClass(layout: BentoTileLayout): string {
  return layoutClass[layout];
}
