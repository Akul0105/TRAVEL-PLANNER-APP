/**
 * Per-destination highlights: activities, food, attractions — each with a dedicated image.
 * IDs: `{destinationId}-{slug}` for catalog_feedback (item_type: highlight).
 */
export type HighlightType = 'activity' | 'food' | 'attraction';

export type DestinationHighlight = {
  id: string;
  title: string;
  type: HighlightType;
  image: string;
};

const IMG = (id: string) => `https://images.unsplash.com/${id}?auto=format&w=900&q=80`;

const HIGHLIGHTS: Record<string, DestinationHighlight[]> = {
  mauritius: [
    { id: 'mauritius-snorkeling', title: 'Snorkeling & diving', type: 'activity', image: IMG('photo-1544551763-46a013bb70d5') },
    { id: 'mauritius-lagoon', title: 'Lagoon catamaran', type: 'activity', image: IMG('photo-1583470790878-853f5c5838ec') },
    { id: 'mauritius-fish', title: 'Creole fish curry', type: 'food', image: IMG('photo-1546069901-ba9599a7e63c') },
    { id: 'mauritius-earth', title: 'Seven Coloured Earth', type: 'attraction', image: IMG('photo-1469854523086-cc02fe5d8800') },
  ],
  london: [
    { id: 'london-bigben', title: 'Westminster & Thames', type: 'attraction', image: IMG('photo-1513635269975-59663e0ac1ad') },
    { id: 'london-tea', title: 'Afternoon tea', type: 'food', image: IMG('photo-1551024506-0bccd828d307') },
    { id: 'london-museum', title: 'British Museum', type: 'activity', image: IMG('photo-1533929736458-ca588d08c8be') },
    { id: 'london-market', title: 'Borough Market bites', type: 'food', image: IMG('photo-1540189549336-e6e99c3679fe') },
  ],
  paris: [
    { id: 'paris-eiffel', title: 'Eiffel & Trocadéro', type: 'attraction', image: IMG('photo-1511739001646-2d4e88e2c0e6') },
    { id: 'paris-louvre', title: 'Louvre evenings', type: 'activity', image: IMG('photo-1499856871958-5b9627475d01') },
    { id: 'paris-bistro', title: 'Bistro & wine', type: 'food', image: IMG('photo-1414235077428-338989a2e8c0') },
    { id: 'paris-seine', title: 'Seine cruise', type: 'activity', image: IMG('photo-1502602898657-3e91760cbb34') },
  ],
  tokyo: [
    { id: 'tokyo-sushi', title: 'Omakase & sushi', type: 'food', image: IMG('photo-1579871494447-9811cf80d66c') },
    { id: 'tokyo-sensoji', title: 'Senso-ji at dawn', type: 'attraction', image: IMG('photo-1540959733332-eab4deabeeaf') },
    { id: 'tokyo-shibuya', title: 'Shibuya crossing', type: 'attraction', image: IMG('photo-1542051841857-5f90071e7989') },
    { id: 'tokyo-ramen', title: 'Late-night ramen', type: 'food', image: IMG('photo-1569718212165-3a8278d5f624') },
  ],
  bali: [
    { id: 'bali-rice', title: 'Tegallalang terraces', type: 'attraction', image: IMG('photo-1518548419970-58e3b4079ab2') },
    { id: 'bali-spa', title: 'Riverside spa', type: 'activity', image: IMG('photo-1544161515-4ab6ce6db874') },
    { id: 'bali-babi', title: 'Babi guling feast', type: 'food', image: IMG('photo-1582878826629-29b7ad1cdc43') },
    { id: 'bali-uluwatu', title: 'Uluwatu cliff temple', type: 'attraction', image: IMG('photo-1537996194471-e657df975ab4') },
  ],
  dubai: [
    { id: 'dubai-burj', title: 'Burj Khalifa SKY', type: 'attraction', image: IMG('photo-1512453979798-5ea266f8880c') },
    { id: 'dubai-safari', title: 'Desert dunes', type: 'activity', image: IMG('photo-1473580044384-7ba9967e16a0') },
    { id: 'dubai-brunch', title: 'Emirati & Levant brunch', type: 'food', image: IMG('photo-1599487488170-d11ec9c172f0') },
    { id: 'dubai-marina', title: 'Marina promenade', type: 'activity', image: IMG('photo-1569336415962-a4bd9f69cd83') },
  ],
  rome: [
    { id: 'rome-colosseum', title: 'Colosseum & Forum', type: 'attraction', image: IMG('photo-1552832230-c0197dd311b5') },
    { id: 'rome-pasta', title: 'Cacio e pepe', type: 'food', image: IMG('photo-1473093295043-cdd812d0e601') },
    { id: 'rome-vatican', title: 'Vatican museums', type: 'activity', image: IMG('photo-1529156069898-49953e39b3ac') },
    { id: 'rome-trastevere', title: 'Trastevere aperitivo', type: 'food', image: IMG('photo-1551218808-94e220e084d2') },
  ],
  barcelona: [
    { id: 'barcelona-sagrada', title: 'Sagrada Família', type: 'attraction', image: IMG('photo-1583422409516-2895a77efded') },
    { id: 'barcelona-tapas', title: 'Pintxos & vermut', type: 'food', image: IMG('photo-1555396273-367ea4eb4db5') },
    { id: 'barcelona-beach', title: 'Barceloneta cycle', type: 'activity', image: IMG('photo-1562883676-8c7feb83f09b') },
    { id: 'barcelona-gothic', title: 'Gothic Quarter walk', type: 'activity', image: IMG('photo-1589709410427-084f3a0c6e7e') },
  ],
  santorini: [
    { id: 'santorini-caldera', title: 'Caldera sunset', type: 'attraction', image: IMG('photo-1613395877344-13d4a8e0d49e') },
    { id: 'santorini-wine', title: 'Assyrtiko wine tasting', type: 'food', image: IMG('photo-1510812431401-41d2bd2722f3') },
    { id: 'santorini-sail', title: 'Volcano & hot springs sail', type: 'activity', image: IMG('photo-1533105075210-7cb6ba3345f3') },
    { id: 'santorini-fava', title: 'Fava & tomato keftedes', type: 'food', image: IMG('photo-1540189549336-e6e99c3679fe') },
  ],
  amsterdam: [
    { id: 'amsterdam-canal', title: 'Canal cruise', type: 'activity', image: IMG('photo-1534351590666-13e3e96b5017') },
    { id: 'amsterdam-rijks', title: 'Rijksmuseum', type: 'activity', image: IMG('photo-1584003564919-3a4b0a5a0b0b') },
    { id: 'amsterdam-stroop', title: 'Stroopwafel & cheese', type: 'food', image: IMG('photo-1486297678162-eb2a19b0a32d') },
    { id: 'amsterdam-vondel', title: 'Vondelpark picnic', type: 'activity', image: IMG('photo-1464822759023-fed622ff2c3b') },
  ],
  lisbon: [
    { id: 'lisbon-tram', title: 'Tram 28 hills', type: 'activity', image: IMG('photo-1585208798174-6cedd86e019a') },
    { id: 'lisbon-pasteis', title: 'Pastéis de Belém', type: 'food', image: IMG('photo-1567620905732-2d1ec7ab7445') },
    { id: 'lisbon-alfama', title: 'Alfama Fado night', type: 'attraction', image: IMG('photo-1555881400-74d7acaacd8b') },
    { id: 'lisbon-seafood', title: 'Grilled sardines', type: 'food', image: IMG('photo-1559339352-11d035aa65de') },
  ],
  istanbul: [
    { id: 'istanbul-hagia', title: 'Hagia Sophia & Blue Mosque', type: 'attraction', image: IMG('photo-1524231757912-21f4fe3a7200') },
    { id: 'istanbul-bosphorus', title: 'Bosphorus ferry', type: 'activity', image: IMG('photo-1541432901042-2d8bd64b4a9b') },
    { id: 'istanbul-kebab', title: 'Adana & meze', type: 'food', image: IMG('photo-1599487488170-d11ec9c172f0') },
    { id: 'istanbul-bazaar', title: 'Grand Bazaar spices', type: 'activity', image: IMG('photo-1528825871115-3581a5387919') },
  ],
  singapore: [
    { id: 'singapore-gardens', title: 'Gardens by the Bay', type: 'attraction', image: IMG('photo-1525625293386-3f8f99389edd') },
    { id: 'singapore-hawker', title: 'Hawker centres', type: 'food', image: IMG('photo-1555939594-58d7cb561ad1') },
    { id: 'singapore-marina', title: 'Marina Bay night', type: 'attraction', image: IMG('photo-1525625293386-3f8f99389edd') },
    { id: 'singapore-laksa', title: 'Laksa & chili crab', type: 'food', image: IMG('photo-1563379926898-05f4575a45d8') },
  ],
  bangkok: [
    { id: 'bangkok-temple', title: 'Wat Arun sunrise', type: 'attraction', image: IMG('photo-1563496665-5b0b3575f0bb') },
    { id: 'bangkok-boat', title: 'Khlong boat ride', type: 'activity', image: IMG('photo-1508009603885-50cf7c579365') },
    { id: 'bangkok-street', title: 'Yaowarat street food', type: 'food', image: IMG('photo-1559314809-0d155014e29e') },
    { id: 'bangkok-massage', title: 'Thai massage & spa', type: 'activity', image: IMG('photo-1544161515-4ab6ce6db874') },
  ],
  sydney: [
    { id: 'sydney-opera', title: 'Opera House walk', type: 'attraction', image: IMG('photo-1506905925346-21bda4d32df4') },
    { id: 'sydney-bondi', title: 'Bondi to Coogee', type: 'activity', image: IMG('photo-1531366936337-7c912a4589a7') },
    { id: 'sydney-brunch', title: 'Harbour brunch', type: 'food', image: IMG('photo-1504674900247-0877df9cc836') },
    { id: 'sydney-harbour', title: 'Harbour kayak', type: 'activity', image: IMG('photo-1523482580670-f32f29bd4c0d') },
  ],
  'new-york': [
    { id: 'new-york-skyline', title: 'Brooklyn Bridge views', type: 'attraction', image: IMG('photo-1496442226666-8d4d0e62e6e9') },
    { id: 'new-york-bagel', title: 'Bagels & deli', type: 'food', image: IMG('photo-1558961363-fa8fdf82db35') },
    { id: 'new-york-broadway', title: 'Broadway show', type: 'activity', image: IMG('photo-1503095396549-807759245b35') },
    { id: 'new-york-met', title: 'The Met & Central Park', type: 'activity', image: IMG('photo-1568515387631-8b650bbcdb90') },
  ],
  'los-angeles': [
    { id: 'la-griffith', title: 'Griffith Observatory', type: 'attraction', image: IMG('photo-1444723121867-7a241cacace9') },
    { id: 'la-tacos', title: 'East LA tacos', type: 'food', image: IMG('photo-1565299585323-38d6b0865b47') },
    { id: 'la-santa-monica', title: 'Santa Monica pier', type: 'activity', image: IMG('photo-1534190760961-74e8c1c5c3da') },
    { id: 'la-hike', title: 'Runyon Canyon hike', type: 'activity', image: IMG('photo-1469474968028-56623f02e42e') },
  ],
  miami: [
    { id: 'miami-art-deco', title: 'Ocean Drive art deco', type: 'attraction', image: IMG('photo-1506966953602-c20cc11f75e3') },
    { id: 'miami-cuban', title: 'Cuban sandwich & cafecito', type: 'food', image: IMG('photo-1555939594-58d7cb561ad1') },
    { id: 'miami-keys', title: 'Keys day trip', type: 'activity', image: IMG('photo-1507525428034-b723cf961d3e') },
    { id: 'miami-wynwood', title: 'Wynwood murals', type: 'activity', image: IMG('photo-1499781350541-7783eae6a10c') },
  ],
  'cape-town': [
    { id: 'cape-town-table', title: 'Table Mountain cableway', type: 'attraction', image: IMG('photo-1580060839134-75a5edca2e99') },
    { id: 'cape-town-wine', title: 'Stellenbosch wine', type: 'food', image: IMG('photo-1510812431401-41d2bd2722f3') },
    { id: 'cape-town-penguins', title: 'Boulders Beach penguins', type: 'activity', image: IMG('photo-1544986581-efac024faf62') },
    { id: 'cape-town-braai', title: 'Braai & bobotie', type: 'food', image: IMG('photo-1544025162-d76694265947') },
  ],
  marrakech: [
    { id: 'marrakech-medina', title: 'Medina souks', type: 'activity', image: IMG('photo-1597212618440-806262de4f6b') },
    { id: 'marrakech-tagine', title: 'Tagine & mint tea', type: 'food', image: IMG('photo-1547592166-23ac45744acd') },
    { id: 'marrakech-majorelle', title: 'Jardin Majorelle', type: 'attraction', image: IMG('photo-1489749798305-4fea3ae63d43') },
    { id: 'marrakech-hammam', title: 'Traditional hammam', type: 'activity', image: IMG('photo-1540555700478-4be289fbecef') },
  ],
  reykjavik: [
    { id: 'reykjavik-blue', title: 'Blue Lagoon soak', type: 'activity', image: IMG('photo-1504893524553-b855bce32c67') },
    { id: 'reykjavik-lamb', title: 'Icelandic lamb soup', type: 'food', image: IMG('photo-1547592166-23ac45744acd') },
    { id: 'reykjavik-golden', title: 'Golden Circle drive', type: 'activity', image: IMG('photo-1520769945061-0a448c463865') },
    { id: 'reykjavik-northern', title: 'Northern lights hunt', type: 'attraction', image: IMG('photo-1531366936337-7c912a4589a7') },
  ],
  prague: [
    { id: 'prague-bridge', title: 'Charles Bridge dawn', type: 'attraction', image: IMG('photo-1541849546-216549ae216d') },
    { id: 'prague-beer', title: 'Pilsner hall crawl', type: 'food', image: IMG('photo-1532634922-8fe0b757fb13') },
    { id: 'prague-castle', title: 'Prague Castle', type: 'activity', image: IMG('photo-1551882547-ff40c63fe5fa') },
    { id: 'prague-trdelnik', title: 'Trdelník & chimney cake', type: 'food', image: IMG('photo-1567620905732-2d1ec7ab7445') },
  ],
  vienna: [
    { id: 'vienna-schonbrunn', title: 'Schönbrunn Palace', type: 'attraction', image: IMG('photo-1516550893923-42d28e5677af') },
    { id: 'vienna-sachertorte', title: 'Sachertorte & coffee', type: 'food', image: IMG('photo-1551024506-0bccd828d307') },
    { id: 'vienna-opera', title: 'State Opera', type: 'activity', image: IMG('photo-1578662996442-48f60103fc96') },
    { id: 'vienna-wine', title: 'Heuriger wine tavern', type: 'food', image: IMG('photo-1510812431401-41d2bd2722f3') },
  ],
  seoul: [
    { id: 'seoul-palace', title: 'Gyeongbokgung palace', type: 'attraction', image: IMG('photo-1538485399081-7191377e8241') },
    { id: 'seoul-bbq', title: 'Korean BBQ night', type: 'food', image: IMG('photo-1590301157890-4810ed352733') },
    { id: 'seoul-han', title: 'Han River picnic', type: 'activity', image: IMG('photo-1517154421773-0529f29ea451') },
    { id: 'seoul-market', title: 'Gwangjang market bites', type: 'food', image: IMG('photo-1555939594-58d7cb561ad1') },
  ],
  'hong-kong': [
    { id: 'hong-kong-peak', title: 'Victoria Peak tram', type: 'attraction', image: IMG('photo-1536599018102-9f803c140fc1') },
    { id: 'hong-kong-dimsum', title: 'Dim sum trolley', type: 'food', image: IMG('photo-1563379926898-05f4575a45d8') },
    { id: 'hong-kong-star', title: 'Star Ferry crossing', type: 'activity', image: IMG('photo-1536599018102-9f803c140fc1') },
    { id: 'hong-kong-roast', title: 'Roast goose & wonton', type: 'food', image: IMG('photo-1551218808-94e220e084d2') },
  ],
  maldives: [
    { id: 'maldives-snorkel', title: 'House reef snorkel', type: 'activity', image: IMG('photo-1514282401047-d79a71a590e8') },
    { id: 'maldives-tuna', title: 'Tuna curry & roshi', type: 'food', image: IMG('photo-1546069901-ba9599a7e63c') },
    { id: 'maldives-sunset', title: 'Sunset dhoni cruise', type: 'activity', image: IMG('photo-1589979481226-c96e7d87b7fc') },
    { id: 'maldives-spa', title: 'Overwater spa', type: 'activity', image: IMG('photo-1544161515-4ab6ce6db874') },
  ],
  zanzibar: [
    { id: 'zanzibar-stone', title: 'Stone Town spice tour', type: 'activity', image: IMG('photo-1589553416260-f586c8f1514f') },
    { id: 'zanzibar-seafood', title: 'Lobster on the beach', type: 'food', image: IMG('photo-1559339352-11d035aa65de') },
    { id: 'zanzibar-prison', title: 'Prison Island turtles', type: 'attraction', image: IMG('photo-1507525428034-b723cf961d3e') },
    { id: 'zanzibar-spice', title: 'Clove & vanilla farm', type: 'activity', image: IMG('photo-1469474968028-338989a2e8c0') },
  ],
  queenstown: [
    { id: 'queenstown-bungee', title: 'Kawarau bungee', type: 'activity', image: IMG('photo-1507699629798-6875474293c8') },
    { id: 'queenstown-fjord', title: 'Milford Sound day', type: 'attraction', image: IMG('photo-1469521669194-babb45599def') },
    { id: 'queenstown-burger', title: 'Fergburger queue', type: 'food', image: IMG('photo-1568901346375-23c9450c58cd') },
    { id: 'queenstown-jet', title: 'Shotover Jet', type: 'activity', image: IMG('photo-1506905925346-21bda4d32df4') },
  ],
  rio: [
    { id: 'rio-christ', title: 'Christ the Redeemer', type: 'attraction', image: IMG('photo-1483729558449-99ef43a52516') },
    { id: 'rio-feijoada', title: 'Feijoada Saturday', type: 'food', image: IMG('photo-1544025162-d76694265947') },
    { id: 'rio-copacabana', title: 'Copacabana beach', type: 'activity', image: IMG('photo-1483729558449-99ef43a52516') },
    { id: 'rio-samba', title: 'Samba night Lapa', type: 'activity', image: IMG('photo-1514525253161-7a46d19cd819') },
  ],
  cancun: [
    { id: 'cancun-cenote', title: 'Cenote swim', type: 'activity', image: IMG('photo-1506973035872-a4ec16b8e8d9') },
    { id: 'cancun-ceviche', title: 'Yucatecan ceviche', type: 'food', image: IMG('photo-1551218808-94e220e084d2') },
    { id: 'cancun-ruins', title: 'Chichén Itzá day', type: 'attraction', image: IMG('photo-1518638153370-7065ad1bbb6a') },
    { id: 'cancun-snorkel', title: 'Reef snorkel', type: 'activity', image: IMG('photo-1544551763-46a013bb70d5') },
  ],
  kyoto: [
    { id: 'kyoto-bamboo', title: 'Arashiyama bamboo grove', type: 'attraction', image: IMG('photo-1493976040374-85c8e12f0c0e') },
    { id: 'kyoto-kaiseki', title: 'Kaiseki dinner', type: 'food', image: IMG('photo-1579871494447-9811cf80d66c') },
    { id: 'kyoto-fushimi', title: 'Fushimi Inari gates', type: 'attraction', image: IMG('photo-1478436122737-95093c0c1d5d') },
    { id: 'kyoto-matcha', title: 'Uji matcha sweets', type: 'food', image: IMG('photo-1515825838458-f2a751b65064') },
  ],
  dubrovnik: [
    { id: 'dubrovnik-walls', title: 'City walls walk', type: 'activity', image: IMG('photo-1555990538-f2e87506d1e5') },
    { id: 'dubrovnik-seafood', title: 'Adriatic seafood', type: 'food', image: IMG('photo-1559339352-11d035aa65de') },
    { id: 'dubrovnik-lokrum', title: 'Lokrum island', type: 'attraction', image: IMG('photo-1555990538-f2e87506d1e5') },
    { id: 'dubrovnik-wine', title: 'Pelješac wine road', type: 'food', image: IMG('photo-1510812431401-41d2bd2722f3') },
  ],
  edinburgh: [
    { id: 'edinburgh-castle', title: 'Edinburgh Castle', type: 'attraction', image: IMG('photo-1578662996442-48f60103fc96') },
    { id: 'edinburgh-whisky', title: 'Whisky tasting', type: 'food', image: IMG('photo-1528825871115-3581a5387919') },
    { id: 'edinburgh-arthur', title: 'Arthur’s Seat hike', type: 'activity', image: IMG('photo-1464822759023-fed622ff2c3b') },
    { id: 'edinburgh-haggis', title: 'Haggis & neeps', type: 'food', image: IMG('photo-1544025162-d76694265947') },
  ],
  florence: [
    { id: 'florence-duomo', title: 'Duomo climb', type: 'attraction', image: IMG('photo-1541370976299-4d24ebbc9077') },
    { id: 'florence-bistecca', title: 'Bistecca alla Fiorentina', type: 'food', image: IMG('photo-1544025162-d76694265947') },
    { id: 'florence-uffizi', title: 'Uffizi Gallery', type: 'activity', image: IMG('photo-1549880334-1e929196028e') },
    { id: 'florence-gelato', title: 'Artisan gelato', type: 'food', image: IMG('photo-1563805042-7684c019e1cb') },
  ],
  athens: [
    { id: 'athens-acropolis', title: 'Acropolis & Parthenon', type: 'attraction', image: IMG('photo-1555993539-1732b0258235') },
    { id: 'athens-gyro', title: 'Souvlaki & gyro', type: 'food', image: IMG('photo-1555939594-58d7cb561ad1') },
    { id: 'athens-plaka', title: 'Plaka stroll', type: 'activity', image: IMG('photo-1606159068539-43f36b99e004') },
    { id: 'athens-islands', title: 'Saronic day cruise', type: 'activity', image: IMG('photo-1533105075210-7cb6ba3345f3') },
  ],
  copenhagen: [
    { id: 'copenhagen-nyhavn', title: 'Nyhavn harbour', type: 'attraction', image: IMG('photo-1513622470522-26c3c8a854bc') },
    { id: 'copenhagen-smorrebrod', title: 'Smørrebrød lunch', type: 'food', image: IMG('photo-1544025162-d76694265947') },
    { id: 'copenhagen-bike', title: 'Bike the lakes', type: 'activity', image: IMG('photo-1558618666-fcd25c85cd64') },
    { id: 'copenhagen-tivoli', title: 'Tivoli Gardens', type: 'attraction', image: IMG('photo-1529156069898-49953e39b3ac') },
  ],
  vancouver: [
    { id: 'vancouver-stanley', title: 'Stanley Park seawall', type: 'activity', image: IMG('photo-1559511260-66a654ae982a') },
    { id: 'vancouver-sushi', title: 'Omakase sushi', type: 'food', image: IMG('photo-1579871494447-9811cf80d66c') },
    { id: 'vancouver-grouse', title: 'Grouse Mountain gondola', type: 'attraction', image: IMG('photo-1464822759023-fed622ff2c3b') },
    { id: 'vancouver-salmon', title: 'Pacific salmon poke', type: 'food', image: IMG('photo-1546069901-ba9599a7e63c') },
  ],
  'bora-bora': [
    { id: 'bora-snorkel', title: 'Coral garden snorkel', type: 'activity', image: IMG('photo-1589979481226-c96e7d87b7fc') },
    { id: 'bora-poisson', title: 'Poisson cru', type: 'food', image: IMG('photo-1546069901-ba9599a7e63c') },
    { id: 'bora-peak', title: 'Mount Otemanu view', type: 'attraction', image: IMG('photo-1589979481226-c96e7d87b7fc') },
    { id: 'bora-jet', title: 'Jet ski lagoon', type: 'activity', image: IMG('photo-1507525428034-b723cf961d3e') },
  ],
};

function buildGenericHighlights(destinationId: string): DestinationHighlight[] {
  const d = destinationId.toLowerCase().replace(/\s+/g, '-');
  const label = d
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return [
    { id: `${d}-gen-act`, title: `Outdoor adventures in ${label}`, type: 'activity', image: IMG('photo-1469474968028-338989a2e8c0') },
    { id: `${d}-gen-food`, title: `Local flavours in ${label}`, type: 'food', image: IMG('photo-1546069901-ba9599a7e63c') },
    { id: `${d}-gen-att`, title: `Iconic sights in ${label}`, type: 'attraction', image: IMG('photo-1488646953014-85cb44e25828') },
    { id: `${d}-gen-walk`, title: `Neighbourhood walk — ${label}`, type: 'activity', image: IMG('photo-1501785888041-af3ef285b470') },
  ];
}

export function getHighlightsForDestination(destinationId: string): DestinationHighlight[] {
  const key = destinationId.toLowerCase().replace(/\s+/g, '-');
  return HIGHLIGHTS[key] ?? buildGenericHighlights(key);
}
