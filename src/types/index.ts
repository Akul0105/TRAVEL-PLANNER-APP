/**
 * TypeScript interfaces for the Travel Agent Planner application
 * This file contains all the type definitions used throughout the application
 */

// Chat message interface for the chatbot
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Search suggestion interface for Google-like search functionality
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'destination' | 'activity' | 'hotel' | 'flight' | 'package';
  popularity?: number;
}

// Travel destination interface
export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl?: string;
  priceRange: 'budget' | 'mid-range' | 'luxury';
  bestTimeToVisit: string[];
  activities: string[];
}

// Travel package interface for market basket analysis simulation
export interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  duration: number; // in days
  price: number;
  includes: string[];
  category: 'adventure' | 'relaxation' | 'cultural' | 'business' | 'family';
  relatedPackages?: string[]; // IDs of related packages for market basket analysis
}

// API response interface for Gemini chat
export interface GeminiChatResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
  }>;
}

// Chatbot state interface
export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
}

// Search state interface
export interface SearchState {
  query: string;
  suggestions: SearchSuggestion[];
  results: TravelDestination[];
  isLoading: boolean;
  showSuggestions: boolean;
}

// Component props interfaces
export interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  marketBasketResults?: SearchSuggestion[];
  isLoading: boolean;
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
}

export interface FloatingChatIconProps {
  onClick: () => void;
  isOpen: boolean;
}

// Trip information interface for collecting user trip details
export interface TripInfo {
  destination?: string;
  startDate?: string;
  endDate?: string;
  numberOfTravelers?: number;
  budget?: string;
  travelStyle?: 'adventure' | 'relaxation' | 'cultural' | 'business' | 'family' | 'luxury' | 'budget';
  accommodationPreference?: 'hotel' | 'resort' | 'apartment' | 'hostel' | 'luxury';
  interests?: string[];
}

// Trip information collection state
export type TripInfoStep = 
  | 'welcome'
  | 'destination'
  | 'dates'
  | 'travelers'
  | 'budget'
  | 'travelStyle'
  | 'accommodation'
  | 'interests'
  | 'complete';

export interface TripInfoState {
  currentStep: TripInfoStep;
  tripInfo: TripInfo;
  isComplete: boolean;
}
