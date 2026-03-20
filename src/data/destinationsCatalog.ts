/**
 * Curated catalog: high-res Unsplash imagery (w=1400, quality, crop).
 * IDs match keys in destinationHighlights where possible.
 */
export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  region?: string;
};

export const DESTINATIONS: CatalogItem[] = [
  { id: 'mauritius', name: 'Mauritius', description: 'Turquoise lagoons, reefs, and luxury coast', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&w=1400&q=80', region: 'Indian Ocean' },
  { id: 'london', name: 'London', description: 'Royal parks, West End, and Thames skyline', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'paris', name: 'Paris', description: 'Haussmann boulevards, cafés, and river light', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'tokyo', name: 'Tokyo', description: 'Neon districts meet quiet shrines', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&w=1400&q=80', region: 'Asia' },
  { id: 'bali', name: 'Bali', description: 'Rice terraces, temples, and Indian Ocean surf', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&w=1400&q=80', region: 'Asia' },
  { id: 'dubai', name: 'Dubai', description: 'Desert horizons and futuristic skyline', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&w=1400&q=80', region: 'Middle East' },
  { id: 'rome', name: 'Rome', description: 'Ancient forums, fountains, and trattorias', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'barcelona', name: 'Barcelona', description: 'Gaudí, Mediterranean beaches, tapas nights', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'santorini', name: 'Santorini', description: 'Caldera sunsets and Cycladic villages', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'amsterdam', name: 'Amsterdam', description: 'Canal rings, museums, and bike culture', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'lisbon', name: 'Lisbon', description: 'Trams, miradouros, and Atlantic light', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'istanbul', name: 'Istanbul', description: 'Bosphorus bridges, bazaars, minarets', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'singapore', name: 'Singapore', description: 'Gardens, hawker gems, Marina skyline', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&w=1400&q=80', region: 'Asia' },
  { id: 'bangkok', name: 'Bangkok', description: 'Temples, floating markets, rooftop bars', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&w=1400&q=80', region: 'Asia' },
  { id: 'sydney', name: 'Sydney', description: 'Harbour icons, coastal walks, surf', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&w=1400&q=80', region: 'Oceania' },
  { id: 'new-york', name: 'New York', description: 'Broadway, museums, endless energy', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&w=1400&q=80', region: 'Americas' },
  { id: 'los-angeles', name: 'Los Angeles', description: 'Pacific coast, studios, canyon hikes', image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&w=1400&q=80', region: 'Americas' },
  { id: 'miami', name: 'Miami', description: 'Art deco, turquoise water, Latin rhythm', image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&w=1400&q=80', region: 'Americas' },
  { id: 'cape-town', name: 'Cape Town', description: 'Table Mountain, vineyards, Cape Peninsula', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&w=1400&q=80', region: 'Africa' },
  { id: 'marrakech', name: 'Marrakech', description: 'Medina souks, riads, Atlas views', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&w=1400&q=80', region: 'Africa' },
  { id: 'reykjavik', name: 'Reykjavik', description: 'Geothermal pools, northern lights, lava fields', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'prague', name: 'Prague', description: 'Castle spires, Charles Bridge, beer halls', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'vienna', name: 'Vienna', description: 'Palaces, coffee houses, classical arts', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'seoul', name: 'Seoul', description: 'K-culture, palaces, night markets', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&w=1400&q=80', region: 'Asia' },
  { id: 'hong-kong', name: 'Hong Kong', description: 'Victoria Peak, dim sum, neon harbours', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&w=1400&q=80', region: 'Asia' },
  { id: 'maldives', name: 'Maldives', description: 'Overwater villas, blue holes, diving', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&w=1400&q=80', region: 'Indian Ocean' },
  { id: 'zanzibar', name: 'Zanzibar', description: 'Spice farms, Stone Town, powder beaches', image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&w=1400&q=80', region: 'Africa' },
  { id: 'queenstown', name: 'Queenstown', description: 'Alps, fjords, adventure capital', image: 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=1400', region: 'Oceania' },
  { id: 'rio', name: 'Rio de Janeiro', description: 'Sugarloaf, samba, Atlantic beaches', image: 'https://images.pexels.com/photos/1486576/pexels-photo-1486576.jpeg?auto=compress&cs=tinysrgb&w=1400', region: 'Americas' },
  { id: 'cancun', name: 'Cancún', description: 'Caribbean blues, cenotes, Mayan coast', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&w=1400&q=80', region: 'Americas' },
  { id: 'kyoto', name: 'Kyoto', description: 'Bamboo groves, geiko districts, zen gardens', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&w=1400&q=80', region: 'Asia' },
  { id: 'dubrovnik', name: 'Dubrovnik', description: 'Adriatic walls, island day trips', image: 'https://images.pexels.com/photos/3568441/pexels-photo-3568441.jpeg?auto=compress&cs=tinysrgb&w=1400', region: 'Europe' },
  { id: 'edinburgh', name: 'Edinburgh', description: 'Castle rock, festivals, whisky culture', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'florence', name: 'Florence', description: 'Renaissance art, Duomo, Tuscan tables', image: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'athens', name: 'Athens', description: 'Acropolis light, tavernas, Aegean hops', image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'copenhagen', name: 'Copenhagen', description: 'Nyhavn colour, design, Baltic breeze', image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&w=1400&q=80', region: 'Europe' },
  { id: 'vancouver', name: 'Vancouver', description: 'Mountains meet Pacific, trails and sushi', image: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&w=1400&q=80', region: 'Americas' },
  { id: 'bora-bora', name: 'Bora Bora', description: 'Lagoon blues, peak views, snorkel paradise', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&w=1400&q=80', region: 'Oceania' },
];
