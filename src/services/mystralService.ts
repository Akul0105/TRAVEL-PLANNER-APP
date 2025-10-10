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
const TRAVEL_AGENT_SYSTEM_PROMPT = `You are a professional travel agent assistant. Your role is to:

1. Help customers plan their travel experiences
2. Provide recommendations for destinations, hotels, activities, and travel packages
3. Simulate market basket analysis by suggesting related travel products and services
4. Maintain a friendly, professional, and knowledgeable tone
5. Focus exclusively on travel-related topics

When customers ask about travel, always consider:
- Their budget and preferences
- Best time to visit destinations
- Related activities and services they might enjoy
- Package deals and bundled offerings
- Seasonal considerations and travel tips

If asked about non-travel topics, politely redirect the conversation back to travel planning.

Remember: You are simulating market basket analysis by suggesting complementary travel products and services based on customer preferences.`;

/**
 * Send a chat message to the Mystral AI API
 * @param messages - Array of chat messages including conversation history
 * @returns Promise with the AI response
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    // Convert our message format to Mystral API format
    const apiMessages = [
      {
        role: 'system',
        content: TRAVEL_AGENT_SYSTEM_PROMPT
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
        max_tokens: 1000,
        temperature: 0.7,
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
