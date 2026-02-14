/**
 * Google Gemini API Service for Travel Agent Chatbot
 * This service handles all communication with the Google Gemini API
 * Configured specifically for travel agency context and market basket analysis simulation
 */

import { ChatMessage, TripInfo } from '@/types';

// API Configuration
const GEMINI_API_KEY = 'AIzaSyDoV_jtsMKA5iuboFYPc_lCPp--3APIULA';

/**
 * List available models for this API key
 */
async function listAvailableModels(): Promise<string[]> {
  try {
    // Try both v1 and v1beta
    for (const version of ['v1', 'v1beta']) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models`,
          {
            headers: {
              'x-goog-api-key': GEMINI_API_KEY,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json() as { models?: Array<{ name?: string }> };
          const models = data.models?.map((m) => m.name?.replace('models/', '') || '').filter(Boolean) || [];
          if (models.length > 0) {
            return models;
          }
        }
      } catch {
        // Try next version
        continue;
      }
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
  return [];
}

// Try different models in order of preference
// Updated with latest model names based on current Gemini API
const GEMINI_MODELS = [
  { model: 'gemini-2.0-flash-exp', version: 'v1beta' },
  { model: 'gemini-1.5-flash-8b', version: 'v1beta' },
  { model: 'gemini-1.5-flash', version: 'v1beta' },
  { model: 'gemini-1.5-pro', version: 'v1beta' },
  { model: 'gemini-pro', version: 'v1beta' },
  { model: 'gemini-2.0-flash-exp', version: 'v1' },
  { model: 'gemini-1.5-flash-8b', version: 'v1' },
  { model: 'gemini-1.5-flash', version: 'v1' },
  { model: 'gemini-1.5-pro', version: 'v1' },
  { model: 'gemini-pro', version: 'v1' },
];

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
- Use the trip information provided to give personalized recommendations

TRIP PLANNING:
- When trip information is provided, use it to create personalized recommendations
- Reference specific details like destination, dates, budget, and travel style
- Suggest packages, activities, and services that match their preferences
- Provide specific recommendations based on their collected information

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
 * Build dynamic conversation context based on conversation history and trip info
 * @param messages - Array of chat messages
 * @param tripInfo - Collected trip information
 * @returns Dynamic system prompt with conversation context
 */
function buildConversationContext(messages: ChatMessage[], tripInfo?: TripInfo): string {
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

  // Add trip information if available
  if (tripInfo) {
    const tripDetails: string[] = [];
    if (tripInfo.destination) tripDetails.push(`Destination: ${tripInfo.destination}`);
    if (tripInfo.startDate) tripDetails.push(`Travel Dates: ${tripInfo.startDate}${tripInfo.endDate ? ` to ${tripInfo.endDate}` : ''}`);
    if (tripInfo.numberOfTravelers) tripDetails.push(`Travelers: ${tripInfo.numberOfTravelers}`);
    if (tripInfo.budget) tripDetails.push(`Budget: ${tripInfo.budget}`);
    if (tripInfo.travelStyle) tripDetails.push(`Travel Style: ${tripInfo.travelStyle}`);
    if (tripInfo.accommodationPreference) tripDetails.push(`Accommodation: ${tripInfo.accommodationPreference}`);
    if (tripInfo.interests && tripInfo.interests.length > 0) tripDetails.push(`Interests: ${tripInfo.interests.join(', ')}`);

    if (tripDetails.length > 0) {
      contextPrompt += `\n\nTRIP INFORMATION (Use this to provide personalized recommendations):\n${tripDetails.join('\n')}`;
    }
  }
  
  return contextPrompt;
}

/**
 * Send a chat message to the Google Gemini API
 * @param messages - Array of chat messages including conversation history
 * @param tripInfo - Optional trip information collected from user
 * @returns Promise with the AI response
 */
export async function sendChatMessage(messages: ChatMessage[], tripInfo?: TripInfo): Promise<string> {
  // Build dynamic conversation context with trip info
  const conversationContext = buildConversationContext(messages, tripInfo);
  
  // Convert our message format to Gemini API format
  // Gemini uses a different format: contents array with parts containing text
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
  
  // Add system instructions as the first user message (Gemini doesn't have system role)
  contents.push({
    role: 'user',
    parts: [{ text: conversationContext }]
  });
  
  // Add model acknowledgment to establish the context
  contents.push({
    role: 'model',
    parts: [{ text: 'Understood. I will act as a friendly travel agent assistant, keeping responses short and conversational while suggesting complementary travel services.' }]
  });
  
  // Add conversation history (skip if empty)
  if (messages.length > 0) {
    messages.forEach(msg => {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    });
  }

  // First, try to get available models (but don't wait if it fails)
  let availableModels: string[] = [];
  try {
    availableModels = await listAvailableModels();
    if (availableModels.length > 0) {
      console.log('Available models:', availableModels);
    }
  } catch {
    console.log('Could not list models, will try default list');
  }

  // Try each model/version combination until one works
  let lastError: Error | null = null;
  
  // If we got available models, prioritize those
  const modelsToTry = availableModels.length > 0 
    ? availableModels.map(name => {
        // Extract model name and determine version
        const parts = name.split('/');
        const modelName = parts[parts.length - 1];
        // Try v1beta first, then v1
        return [
          { model: modelName, version: 'v1beta' },
          { model: modelName, version: 'v1' }
        ];
      }).flat()
    : GEMINI_MODELS;
  
  for (const { model, version } of modelsToTry) {
    // Try both header and query parameter authentication
    for (const authMethod of ['header', 'query']) {
      try {
        const apiUrl = authMethod === 'query'
          ? `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${GEMINI_API_KEY}`
          : `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (authMethod === 'header') {
          headers['x-goog-api-key'] = GEMINI_API_KEY;
        }
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 200,
              topP: 0.8,
              topK: 40,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (authMethod === 'query') {
            // If query param also fails, try next model
            console.error(`Gemini API error with ${model} (${version}) [${authMethod}]:`, response.status, response.statusText, errorText);
            lastError = new Error(`Gemini API error: ${response.status} - ${errorText}`);
            break; // Try next auth method or model
          }
          // If header fails, try query param
          continue;
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
          if (authMethod === 'query') {
            lastError = new Error('No response from Gemini API');
            break; // Try next model
          }
          continue; // Try query param
        }

        const content = data.candidates[0].content;
        if (!content || !content.parts || content.parts.length === 0) {
          if (authMethod === 'query') {
            lastError = new Error('Invalid response format from Gemini API');
            break; // Try next model
          }
          continue; // Try query param
        }

        // Success! Return the response
        console.log(`✅ Successfully used model: ${model} (${version}) with ${authMethod} auth`);
        return content.parts[0].text;
      } catch (error) {
        if (authMethod === 'query') {
          // Both auth methods failed for this model
          console.error(`Error trying ${model} (${version}):`, error);
          lastError = error instanceof Error ? error : new Error(String(error));
          break; // Try next model
        }
        // Header failed, try query param
        continue;
      }
    }
  }

  // If all models failed, return fallback message with helpful info
  console.error('❌ All Gemini models failed. Last error:', lastError);
  console.error('💡 Tip: Check if your API key has Gemini API enabled in Google Cloud Console');
  return "I apologize, but I'm having trouble connecting to our travel planning system right now. Please try again in a moment, or feel free to ask me about popular destinations, travel packages, or any travel-related questions!";
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
