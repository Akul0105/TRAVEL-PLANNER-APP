/**
 * Mystral AI API Service for Travel Agent Chatbot
 * This service handles all communication with the Mystral AI API
 * Configured specifically for travel agency context and market basket analysis simulation
 */

import { ChatMessage, MystralChatResponse } from '@/types';

// API Configuration
const MYSTRAL_API_KEY = 'aKRU8CQiTLFfPeKHam4WAEPteYRZ7mkG';
const MYSTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

/**
 * System prompt to ensure the AI acts as a travel agent
 * This prompt constrains the AI to travel-related conversations and market basket analysis
 */
const TRAVEL_AGENT_SYSTEM_PROMPT = `You are a friendly, conversational travel agent assistant. Keep responses SHORT and NATURAL - like chatting with a friend.

IMPORTANT: 
- Keep responses under 2-3 sentences maximum
- Be conversational, not formal
- Ask ONE question at a time
- Don't overwhelm with long lists
- Build conversation gradually
- Remember what we've discussed before
- ALWAYS suggest related services (market basket analysis)

MARKET BASKET ANALYSIS - Always suggest complementary services:
- If they mention a destination → suggest related activities, restaurants, nearby places
- If they mention hotels → suggest restaurants, tours, activities
- If they mention activities → suggest related experiences, dining, transportation
- If they mention budget → suggest money-saving tips, package deals

Examples of good responses with market basket:
- "Nice! I love Paris. What's your budget like? I can also suggest some amazing restaurants and day trips!"
- "Perfect! Since you're into museums, I can bundle in some great food tours and Seine cruises too!"
- "Great choice! I can also arrange airport transfers and suggest some hidden gems nearby!"

Keep it simple, friendly, and conversational while suggesting related services!`;

/**
 * Build dynamic conversation context based on conversation history
 * @param messages - Array of chat messages
 * @returns Dynamic system prompt with conversation context
 */
function buildConversationContext(messages: ChatMessage[]): string {
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
  
  return contextPrompt;
}

/**
 * Send a chat message to the Mystral AI API
 * @param messages - Array of chat messages including conversation history
 * @returns Promise with the AI response
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    // Build dynamic conversation context
    const conversationContext = buildConversationContext(messages);
    
    // Convert our message format to Mystral API format
    const apiMessages = [
      {
        role: 'system',
        content: conversationContext
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch(MYSTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MYSTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: apiMessages,
        max_tokens: 200,
        temperature: 0.8,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Mystral API error: ${response.status} ${response.statusText}`);
    }

    const data: MystralChatResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Mystral API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Mystral API:', error);
    
    // Fallback response for when API is unavailable
    return "I apologize, but I'm having trouble connecting to our travel planning system right now. Please try again in a moment, or feel free to ask me about popular destinations, travel packages, or any travel-related questions!";
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
