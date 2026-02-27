/**
 * Mistral API Service for Travel Chatbot
 * Gathers user preferences for market basket analysis and personalized bundle recommendations.
 */

import { ChatMessage, TripInfo } from '@/types';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || '';
const MISTRAL_CHAT_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-small-latest';

/**
 * System prompt: we gather preferences to build MBA-based personalized bundles, not to book trips.
 */
const TRAVEL_AGENT_SYSTEM_PROMPT = `You are a friendly travel preference assistant. Your goal is to LEARN the user's preferences and past travel so we can suggest PERSONALIZED BUNDLES (using market basket analysis), not to book trips.

IMPORTANT:
- Keep responses SHORT (1–3 sentences). One question at a time.
- Be conversational and warm. You are learning about them to personalize suggestions.
- Do NOT offer to book flights, hotels, or reservations. You only collect preferences.
- After they share something, acknowledge it and ask the next preference question when relevant.

WHAT TO GATHER (we use this for personalized bundles):
- Destinations they're interested in or have visited before
- Type of restaurants they enjoy (e.g. local, fine dining, street food, casual)
- Activities they like (e.g. beaches, museums, hiking, food tours, nightlife)
- Places or attractions they've loved
- Budget style (budget / mid-range / luxury) and travel style (adventure, relaxation, cultural, etc.)

When they share preferences, briefly confirm and suggest related ideas or ask one more short question. Never write long lists or act as a booking agent.`;

export type ProfileContext = {
  activities_liked?: string[];
  food_preferences?: string[];
  bucket_list?: string[];
};

/**
 * Build dynamic conversation context based on conversation history, trip info, and profile/scrapbook
 * @param messages - Array of chat messages
 * @param tripInfo - Collected trip information
 * @param profileContext - Optional profile/scrapbook (activities, food, bucket list) for richer replies
 * @returns Dynamic system prompt with conversation context
 */
function buildConversationContext(messages: ChatMessage[], tripInfo?: TripInfo, profileContext?: ProfileContext): string {
  let contextPrompt = TRAVEL_AGENT_SYSTEM_PROMPT;
  
  // Extract key information from conversation history
  const userPreferences: string[] = [];
  const mentionedDestinations: string[] = [];
  
  // Analyze conversation history to build context
  messages.forEach((message) => {
    if (message.role === 'user') {
      const content = message.content.toLowerCase();
      
      // Extract destinations mentioned
      const destinations = ['mauritius', 'london', 'paris', 'tokyo', 'bali', 'dubai', 'new york', 'rome', 'barcelona', 'amsterdam', 'singapore', 'thailand', 'japan', 'italy', 'spain', 'france', 'germany', 'greece', 'turkey', 'morocco', 'egypt', 'south africa', 'australia', 'new zealand', 'canada', 'mexico', 'brazil', 'argentina', 'chile', 'peru', 'colombia', 'costa rica', 'cuba', 'jamaica', 'dominican republic', 'bahamas', 'bermuda', 'iceland', 'norway', 'sweden', 'finland', 'denmark', 'switzerland', 'austria', 'czech republic', 'poland', 'hungary', 'croatia', 'portugal', 'ireland', 'scotland', 'wales', 'england', 'russia', 'china', 'india', 'sri lanka', 'nepal', 'bhutan', 'vietnam', 'cambodia', 'laos', 'myanmar', 'malaysia', 'indonesia', 'philippines', 'south korea', 'taiwan', 'hong kong', 'macau', 'mongolia', 'kazakhstan', 'uzbekistan', 'kyrgyzstan', 'tajikistan', 'turkmenistan', 'afghanistan', 'pakistan', 'bangladesh', 'iran', 'iraq', 'syria', 'lebanon', 'jordan', 'israel', 'palestine', 'saudi arabia', 'uae', 'qatar', 'kuwait', 'bahrain', 'oman', 'yemen', 'ethiopia', 'kenya', 'tanzania', 'uganda', 'rwanda', 'burundi', 'madagascar', 'comoros', 'seychelles', 'mauritius', 'reunion', 'mayotte', 'zanzibar', 'pemba', 'lamu', 'mombasa', 'nairobi', 'addis ababa', 'kampala', 'kigali', 'bujumbura', 'antananarivo', 'victoria', 'port louis', 'saint-denis', 'mamoudzou', 'stone town', 'zanzibar city', 'mwanza', 'arusha', 'moshi', 'kilimanjaro', 'serengeti', 'ngorongoro', 'manyara', 'tarangire', 'ruaha', 'selous', 'katavi', 'mikumi', 'udzungwa', 'kitulo', 'saadani', 'gombe', 'mahale', 'rubondo', 'saanane', 'uzungwa', 'kitulo', 'saadani', 'gombe', 'mahale', 'rubondo', 'saanane'];
      
      destinations.forEach(dest => {
        if (content.includes(dest) && !mentionedDestinations.includes(dest)) {
          mentionedDestinations.push(dest);
        }
      });
      
      // Extract interests and preferences
      if (content.includes('budget') || content.includes('cheap') || content.includes('affordable')) {
        userPreferences.push('budget-friendly travel');
      }
      if (content.includes('luxury') || content.includes('expensive') || content.includes('premium')) {
        userPreferences.push('luxury travel');
      }
      if (content.includes('adventure') || content.includes('hiking') || content.includes('outdoor')) {
        userPreferences.push('adventure activities');
      }
      if (content.includes('beach') || content.includes('relax') || content.includes('resort')) {
        userPreferences.push('beach and relaxation');
      }
      if (content.includes('culture') || content.includes('history') || content.includes('museum')) {
        userPreferences.push('cultural experiences');
      }
      if (content.includes('food') || content.includes('restaurant') || content.includes('cuisine')) {
        userPreferences.push('culinary experiences');
      }
      if (content.includes('family') || content.includes('kids') || content.includes('children')) {
        userPreferences.push('family-friendly travel');
      }
      if (content.includes('solo') || content.includes('alone') || content.includes('single')) {
        userPreferences.push('solo travel');
      }
      if (content.includes('couple') || content.includes('romantic') || content.includes('honeymoon')) {
        userPreferences.push('romantic travel');
      }
    }
  });
  
  // Build context-specific prompt
  if (mentionedDestinations.length > 0) {
    contextPrompt += `\n\nCONTEXT: Customer mentioned: ${mentionedDestinations.join(', ')}. Keep responses short and suggest related activities, restaurants, and nearby places for these destinations.`;
  }
  
  if (userPreferences.length > 0) {
    contextPrompt += `\nCustomer preferences: ${userPreferences.join(', ')}. Use this info to suggest complementary services while keeping responses brief.`;
  }
  
  if (messages.length > 2) {
    contextPrompt += `\nThis is an ongoing conversation. Keep it natural and conversational - suggest related services based on what they've mentioned!`;
  }

  // Add preference/trip context if available
  if (tripInfo) {
    const details: string[] = [];
    if (tripInfo.destination) details.push(`Interested destination: ${tripInfo.destination}`);
    if (tripInfo.pastDestinations?.length) details.push(`Past destinations: ${tripInfo.pastDestinations.join(', ')}`);
    if (tripInfo.restaurantPreferences) details.push(`Restaurant preferences: ${tripInfo.restaurantPreferences}`);
    if (tripInfo.activityPreferences?.length) details.push(`Activities they like: ${tripInfo.activityPreferences.join(', ')}`);
    if (tripInfo.placesVisited?.length) details.push(`Places visited/loved: ${tripInfo.placesVisited.join(', ')}`);
    if (tripInfo.budget) details.push(`Budget: ${tripInfo.budget}`);
    if (tripInfo.travelStyle) details.push(`Travel style: ${tripInfo.travelStyle}`);
    if (tripInfo.interests?.length) details.push(`Interests: ${tripInfo.interests.join(', ')}`);
    if (details.length > 0) {
      contextPrompt += `\n\nCOLLECTED PREFERENCES (use for personalized bundle suggestions):\n${details.join('\n')}`;
    }
  }

  // Add profile/scrapbook context (from Scrapbook page) for smoother, more personalized replies
  if (profileContext) {
    const scrap: string[] = [];
    if (profileContext.activities_liked?.length) scrap.push(`Activities they like (from scrapbook): ${profileContext.activities_liked.join(', ')}`);
    if (profileContext.food_preferences?.length) scrap.push(`Food they like (from scrapbook): ${profileContext.food_preferences.join(', ')}`);
    if (profileContext.bucket_list?.length) scrap.push(`Places they want to visit / bucket list: ${profileContext.bucket_list.join(', ')}`);
    if (scrap.length > 0) {
      contextPrompt += `\n\nSCRAPBOOK / PROFILE (use to tailor suggestions and ask follow-ups):\n${scrap.join('\n')}`;
    }
  }

  return contextPrompt;
}

/**
 * Send a chat message to the Mistral API
 * @param messages - Array of chat messages including conversation history
 * @param tripInfo - Optional trip information collected from user
 * @param profileContext - Optional profile/scrapbook (activities, food, bucket list)
 * @returns Promise with the AI response
 */
export async function sendChatMessage(messages: ChatMessage[], tripInfo?: TripInfo, profileContext?: ProfileContext): Promise<string> {
  const apiKey = MISTRAL_API_KEY;
  if (!apiKey) {
    console.error('Missing MISTRAL_API_KEY in environment');
    return "I'm not configured yet. Please add MISTRAL_API_KEY to your .env.local and try again.";
  }

  const systemContent = buildConversationContext(messages, tripInfo, profileContext);
  const mistralMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemContent },
  ];
  messages.forEach((msg) => {
    mistralMessages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    });
  });

  try {
    const response = await fetch(MISTRAL_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: mistralMessages,
        max_tokens: 256,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mistral API error:', response.status, errText);
      return "I'm having a small hiccup. Please try again in a moment.";
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text || "I didn't get a clear reply. Want to try again?";
  } catch (err) {
    console.error('Mistral request failed:', err);
    return "I couldn't reach the server. Please try again in a moment.";
  }
}

/** User context for LLM-generated travel package */
export type PackageUserContext = {
  destination?: string;
  activities_liked?: string[];
  food_preferences?: string[];
  bucket_list?: string[];
  visited_destinations?: string[];
  budget?: string;
  travel_style?: string;
  duration_days?: number;
};

/** Structured output from LLM for a suggested travel package */
export type SuggestedPackageOutput = {
  destination: string;
  hotel: string;
  activities: string[];
  whyRecommended: string;
};

/** Optional MBA rule metrics to cite in "Why recommended" (support/confidence as percentages). */
export type MBARuleMetrics = { support: number; confidence: number; lift: number };

/**
 * Generate one suggested travel package using LLM from user context + optional MBA summary and rule metrics.
 * Used to produce specific, readable packages (destination, hotel name, activities, why recommended).
 */
export async function generateTravelPackage(
  userContext: PackageUserContext,
  mbaSummary?: string | null,
  mbaRuleMetrics?: MBARuleMetrics | null
): Promise<SuggestedPackageOutput | null> {
  const apiKey = MISTRAL_API_KEY;
  if (!apiKey) {
    console.error('Missing MISTRAL_API_KEY');
    return null;
  }

  const parts: string[] = [];
  if (userContext.destination) {
    parts.push(`TARGET DESTINATION (required): You MUST suggest a package for this destination only: "${userContext.destination}". The "destination" field in your JSON must be this city/region (e.g. "Paris, France" or "Tokyo, Japan" depending on the target). Do not suggest any other destination.`);
  }
  if (userContext.activities_liked?.length) parts.push(`Activities they like: ${userContext.activities_liked.join(', ')}`);
  if (userContext.food_preferences?.length) parts.push(`Food they like: ${userContext.food_preferences.join(', ')}`);
  if (userContext.bucket_list?.length) parts.push(`Places they want to visit (bucket list): ${userContext.bucket_list.join(', ')}`);
  if (userContext.visited_destinations?.length) parts.push(`Destinations they have visited: ${userContext.visited_destinations.join(', ')}`);
  if (userContext.budget) parts.push(`Budget: ${userContext.budget}`);
  if (userContext.travel_style) parts.push(`Travel style: ${userContext.travel_style}`);
  if (userContext.duration_days) parts.push(`Trip duration: ${userContext.duration_days} days`);
  if (mbaSummary) parts.push(`Market basket analysis suggests these items are often chosen together: ${mbaSummary}. Use this to ground your package (same destination/activity types).`);
  if (mbaRuleMetrics) parts.push(`Use these real MBA metrics in whyRecommended: support ${(mbaRuleMetrics.support * 100).toFixed(1)}%, confidence ${(mbaRuleMetrics.confidence * 100).toFixed(0)}%, lift ${mbaRuleMetrics.lift.toFixed(2)}. E.g. "X% of travellers who chose similar items also selected..." with the actual support/confidence numbers.`);

  const userContextBlock = parts.length > 0 ? parts.join('\n') : 'No specific preferences provided; suggest a popular, well-rounded package.';

  const systemPrompt = `You are a travel package designer. Given the user's preferences and optional market basket analysis (MBA) insight, output exactly ONE suggested travel package as valid JSON only, no other text.

Required JSON shape (use these exact keys):
{
  "destination": "Specific city or region name",
  "hotel": "A realistic or well-known hotel/resort name suitable for that destination",
  "activities": ["Activity 1", "Activity 2", "Activity 3"],
  "whyRecommended": "One short paragraph (1-3 sentences) explaining why this package fits the user, e.g. 'X% of travellers who chose this destination and your activities also selected this type of hotel and these experiences.' Keep it specific and personal."
}

Rules:
- destination: You MUST use the TARGET DESTINATION stated in the user context. Do not substitute another city (e.g. do not suggest Tokyo if the TARGET DESTINATION is Paris).
- hotel: use a plausible, specific hotel or resort name for the TARGET DESTINATION (can be real or realistic).
- activities: 3-5 specific activities for the TARGET DESTINATION (e.g. for Paris: "Louvre visit", "Seine cruise"; for Tokyo: "Tokyo Skytree Visit").
- whyRecommended: reference their preferences and, if MBA was provided, mention that similar travellers often book these together. If MBA metrics (support %, confidence %, lift) were provided in the user context, use those exact numbers in whyRecommended (e.g. "Based on market basket analysis, X% of transactions support this combination, with Y% confidence.").
Output only the JSON object, no markdown code fence.`;

  const userPrompt = `User preferences and context:\n${userContextBlock}\n\nGenerate one suggested travel package as JSON.`;

  try {
    const response = await fetch(MISTRAL_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 512,
        temperature: 0.6,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mistral package API error:', response.status, errText);
      return null;
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const destination = typeof parsed.destination === 'string' ? parsed.destination : 'Unknown';
    const hotel = typeof parsed.hotel === 'string' ? parsed.hotel : 'Recommended accommodation';
    const activities = Array.isArray(parsed.activities)
      ? (parsed.activities as unknown[]).map((a) => (typeof a === 'string' ? a : String(a)))
      : [];
    const whyRecommended = typeof parsed.whyRecommended === 'string' ? parsed.whyRecommended : 'Personalized based on your preferences and travel patterns.';

    return { destination, hotel, activities, whyRecommended };
  } catch (err) {
    console.error('generateTravelPackage failed:', err);
    return null;
  }
}

/**
 * Generate travel-related search suggestions with market basket analysis
 * This simulates what would come from a search API
 * @param query - The search query
 * @returns Promise with search suggestions
 */
export async function getSearchSuggestions(query: string): Promise<{suggestions: string[], marketBasket: string[]}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Enhanced travel database with market basket analysis
  const travelDatabase = {
    'mauritius': {
      suggestions: [
        'Mauritius beach resorts',
        'Mauritius water sports',
        'Mauritius cultural tours',
        'Mauritius hiking trails',
        'Mauritius luxury hotels'
      ],
      marketBasket: [
        'Seychelles islands',
        'Maldives resorts',
        'Reunion Island',
        'Madagascar tours',
        'Zanzibar beaches'
      ],
      activities: [
        'Seven Colored Earths',
        'Chamarel Waterfall',
        'Black River Gorges National Park',
        'Port Louis markets',
        'Trou aux Cerfs volcano'
      ],
      restaurants: [
        'Le Château de Bel Ombre',
        'La Table du Château',
        'Le Pescatore',
        'Domaine de l\'Etoile',
        'Le Capitaine'
      ]
    },
    'london': {
      suggestions: [
        'London city tours',
        'London museums',
        'London shopping',
        'London restaurants',
        'London attractions'
      ],
      marketBasket: [
        'Paris city break',
        'Edinburgh tours',
        'Dublin pubs',
        'Amsterdam canals',
        'Brussels chocolate'
      ],
      activities: [
        'Big Ben and Parliament',
        'Tower of London',
        'British Museum',
        'London Eye',
        'West End shows'
      ],
      restaurants: [
        'The Shard restaurants',
        'Borough Market',
        'Covent Garden dining',
        'Camden food markets',
        'Traditional British pubs'
      ]
    },
    'paris': {
      suggestions: [
        'Paris romantic tours',
        'Paris museums',
        'Paris food tours',
        'Paris shopping',
        'Paris attractions'
      ],
      marketBasket: [
        'London city break',
        'Rome historical tours',
        'Barcelona architecture',
        'Amsterdam canals',
        'Prague old town'
      ],
      activities: [
        'Eiffel Tower',
        'Louvre Museum',
        'Notre-Dame Cathedral',
        'Champs-Élysées',
        'Seine River cruise'
      ],
      restaurants: [
        'Traditional bistros',
        'Michelin star restaurants',
        'Café de Flore',
        'Le Marais dining',
        'Montmartre cafés'
      ]
    },
    'tokyo': {
      suggestions: [
        'Tokyo city tours',
        'Tokyo temples',
        'Tokyo food tours',
        'Tokyo shopping',
        'Tokyo attractions'
      ],
      marketBasket: [
        'Kyoto temples',
        'Osaka food scene',
        'Seoul K-pop tours',
        'Bangkok street food',
        'Singapore gardens'
      ],
      activities: [
        'Senso-ji Temple',
        'Tokyo Skytree',
        'Shibuya Crossing',
        'Tsukiji Fish Market',
        'Harajuku fashion'
      ],
      restaurants: [
        'Sushi restaurants',
        'Ramen shops',
        'Izakaya bars',
        'Traditional kaiseki',
        'Street food stalls'
      ]
    }
  };

  const lowerQuery = query.toLowerCase();
  
  // Find matching destination
  for (const [destination, data] of Object.entries(travelDatabase)) {
    if (lowerQuery.includes(destination)) {
      return {
        suggestions: data.suggestions,
        marketBasket: data.marketBasket
      };
    }
  }

  // Default suggestions for other queries
  const defaultSuggestions = [
    'Travel packages',
    'Hotel bookings',
    'Flight deals',
    'Tourist attractions',
    'Local restaurants'
  ];

  const defaultMarketBasket = [
    'Travel insurance',
    'Airport transfers',
    'Local SIM cards',
    'Travel guides',
    'Currency exchange'
  ];

  return {
    suggestions: defaultSuggestions,
    marketBasket: defaultMarketBasket
  };
}

/**
 * Simulate market basket analysis for travel recommendations
 * This would typically be powered by a trained ML model
 * @param currentInterest - The current travel interest/package
 * @returns Array of related travel recommendations
 */
export function getMarketBasketRecommendations(currentInterest: string): string[] {
  // Simulate market basket analysis logic
  // In a real implementation, this would use a trained model
  const recommendations: { [key: string]: string[] } = {
    'paris': ['Eiffel Tower tickets', 'Louvre Museum tours', 'Seine River cruise', 'French cooking classes'],
    'tokyo': ['Tokyo Skytree tickets', 'Sushi making classes', 'Temple tours', 'Bullet train passes'],
    'bali': ['Volcano hiking tours', 'Spa treatments', 'Beach activities', 'Cultural village visits'],
    'new york': ['Broadway show tickets', 'Statue of Liberty tours', 'Central Park activities', 'Food tours'],
    'london': ['Big Ben tours', 'Thames River cruise', 'West End shows', 'Royal palace visits'],
    'rome': ['Colosseum tickets', 'Vatican tours', 'Italian cooking classes', 'Gelato tours'],
    'dubai': ['Burj Khalifa tickets', 'Desert safari', 'Shopping tours', 'Dhow cruise'],
    'thailand': ['Elephant sanctuary visits', 'Floating market tours', 'Thai massage', 'Island hopping'],
    'greece': ['Santorini sunset tours', 'Acropolis visits', 'Greek cooking classes', 'Island cruises'],
    'spain': ['Flamenco shows', 'Tapas tours', 'Sagrada Familia visits', 'Beach activities']
  };

  const interest = currentInterest.toLowerCase();
  for (const [key, values] of Object.entries(recommendations)) {
    if (interest.includes(key)) {
      return values;
    }
  }

  // Default recommendations
  return ['Travel insurance', 'Airport transfers', 'Local SIM cards', 'Travel guides'];
}
