/**
 * Per-destination highlights: activities, food, attractions for the detail modal carousel.
 * itemId format: {destinationId}-{slug} for API feedback.
 */
export type HighlightType = 'activity' | 'food' | 'attraction';

export type DestinationHighlight = {
  id: string;
  title: string;
  type: HighlightType;
  image: string;
};

const HIGHLIGHTS: Record<string, DestinationHighlight[]> = {
  mauritius: [
    { id: 'mauritius-snorkeling', title: 'Snorkeling & Diving', type: 'activity', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
    { id: 'mauritius-beach', title: 'Beach Resorts', type: 'activity', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
    { id: 'mauritius-rougaille', title: 'Rougaille & Dholl Puri', type: 'food', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80' },
    { id: 'mauritius-seven-earth', title: 'Seven Coloured Earth', type: 'attraction', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80' },
  ],
  paris: [
    { id: 'paris-eiffel', title: 'Eiffel Tower', type: 'attraction', image: 'https://images.unsplash.com/photo-1511739001646-2d4e88e2c0e6?w=600&q=80' },
    { id: 'paris-museum', title: 'Louvre & Museums', type: 'activity', image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=600&q=80' },
    { id: 'paris-croissant', title: 'Croissants & Café', type: 'food', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80' },
    { id: 'paris-seine', title: 'Seine River Cruise', type: 'activity', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  ],
  tokyo: [
    { id: 'tokyo-sushi', title: 'Sushi & Ramen', type: 'food', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80' },
    { id: 'tokyo-temple', title: 'Senso-ji Temple', type: 'attraction', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
    { id: 'tokyo-shibuya', title: 'Shibuya & Neon', type: 'attraction', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
    { id: 'tokyo-onsen', title: 'Onsen Experience', type: 'activity', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80' },
  ],
  bali: [
    { id: 'bali-rice', title: 'Rice Terraces', type: 'attraction', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80' },
    { id: 'bali-spa', title: 'Spa & Wellness', type: 'activity', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
    { id: 'bali-nasi', title: 'Nasi Goreng & Satay', type: 'food', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80' },
    { id: 'bali-temple', title: 'Uluwatu Temple', type: 'attraction', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  ],
  london: [
    { id: 'london-bigben', title: 'Big Ben & Parliament', type: 'attraction', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
    { id: 'london-afternoon', title: 'Afternoon Tea', type: 'food', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80' },
    { id: 'london-museum', title: 'British Museum', type: 'activity', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80' },
    { id: 'london-thames', title: 'Thames Walk', type: 'activity', image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600&q=80' },
  ],
  dubai: [
    { id: 'dubai-burj', title: 'Burj Khalifa', type: 'attraction', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
    { id: 'dubai-desert', title: 'Desert Safari', type: 'activity', image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=600&q=80' },
    { id: 'dubai-mall', title: 'Dubai Mall', type: 'attraction', image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&q=80' },
    { id: 'dubai-mezze', title: 'Middle Eastern Cuisine', type: 'food', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80' },
  ],
};

const DEFAULT_HIGHLIGHTS: DestinationHighlight[] = [
  { id: 'default-activity', title: 'Local Activities', type: 'activity', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80' },
  { id: 'default-food', title: 'Local Cuisine', type: 'food', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80' },
  { id: 'default-attraction', title: 'Top Attractions', type: 'attraction', image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&q=80' },
];

export function getHighlightsForDestination(destinationId: string): DestinationHighlight[] {
  const key = destinationId.toLowerCase().replace(/\s+/g, '-');
  return HIGHLIGHTS[key] ?? DEFAULT_HIGHLIGHTS;
}
