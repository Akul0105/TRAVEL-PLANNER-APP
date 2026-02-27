import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export interface Product {
  id: string;
  product_id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
  description?: string;
  image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  customer_segment?: string;
  date_of_birth?: string;
  address?: string;
  preferences?: any;
  total_spent: number;
  total_bookings: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  customer_id?: string;
  transaction_date: string;
  total_amount: number;
  status: string;
  payment_method?: string;
  booking_reference?: string;
  season?: string;
  month?: number;
  year?: number;
  region?: string;
  destination_country?: string;
  created_at: string;
}

export interface MBAAssociationRule {
  id: string;
  antecedent_ids: string[];
  consequent_ids: string[];
  support: number;
  confidence: number;
  lift: number;
  conviction?: number;
  rule_strength?: string;
  created_at: string;
  updated_at: string;
}

export interface MBACustomerSegment {
  id: string;
  segment_id: string;
  name: string;
  characteristics: string[];
  avg_spend: number;
  size: number;
  growth_rate?: number;
  satisfaction_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface MBASeasonalRule {
  id: string;
  season: string;
  month: number;
  rule_id: string;
  demand_multiplier: number;
  created_at: string;
}

export interface MBAAnalyticsSnapshot {
  id: string;
  snapshot_date: string;
  total_rules: number;
  total_sequences: number;
  total_segments: number;
  avg_confidence: number;
  avg_lift: number;
  top_categories: any;
  seasonal_insights: any;
  created_at: string;
}

// User profile (public.profiles) - extends Supabase Auth
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  address: string | null;
  avatar_url: string | null;
  travel_style: string | null;
  budget_preference: string | null;
  activities_liked?: string[];
  food_preferences?: string[];
  bucket_list?: string[];
  created_at: string;
  updated_at: string;
}

// Chat persistence
export interface ChatSession {
  id: string;
  user_id: string;
  created_at: string;
}

export interface ChatMessageRow {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Visited destination (scrapbook)
export interface VisitedDestination {
  id: string;
  user_id: string;
  destination_name: string;
  country: string | null;
  notes: string | null;
  visited_at: string | null;
  created_at: string;
}

// MBA-generated bundle stored per user
export interface UserBundle {
  id: string;
  user_id: string;
  bundle_data: {
    items: Array<{ id: string; name: string; category: string; price: number }>;
    confidence?: number;
    support?: number;
    lift?: number;
    ruleSummary?: string;
  };
  source: string;
  created_at: string;
}

// LLM-generated suggested travel package
export interface SuggestedPackage {
  id: string;
  user_id: string;
  destination: string;
  hotel: string;
  activities: string[];
  why_recommended: string | null;
  mba_summary: string | null;
  created_at: string;
}

