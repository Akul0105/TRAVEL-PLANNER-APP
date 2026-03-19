'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  /** True when the user is signed in anonymously (guest). They can use Scrapbook and likes; prompt to sign in with email to save across devices. */
  isAnonymous: boolean;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Profile, 'full_name' | 'address' | 'travel_style' | 'budget_preference' | 'activities_liked' | 'food_preferences' | 'bucket_list'>>) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) setProfile(data as Profile);
    else setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id);
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const { data: { session: s } } = await supabase.auth.getSession();

      if (cancelled) return;
      if (s?.user) {
        setSession(s);
        setUser(s.user);
        if (s.user.id) await fetchProfile(s.user.id).finally(() => { if (!cancelled) setLoading(false); });
        else setLoading(false);
        return;
      }

      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();

      if (cancelled) return;
      if (anonError) {
        console.error('[Auth] Anonymous sign-in failed:', anonError.message, anonError);
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      if (anonData?.session?.user) {
        setSession(anonData.session);
        setUser(anonData.session.user);
        if (anonData.session.user.id) {
          await fetchProfile(anonData.session.user.id).finally(() => { if (!cancelled) setLoading(false); });
        } else {
          setLoading(false);
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (cancelled) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user?.id) fetchProfile(s.user.id);
      else setProfile(null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithOtp = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined },
    });
    return { error: error ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<Profile, 'full_name' | 'address' | 'travel_style' | 'budget_preference' | 'activities_liked' | 'food_preferences' | 'bucket_list'>>) => {
    if (!user?.id) return { error: new Error('Not signed in') as Error };
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (!error) await fetchProfile(user.id);
    return { error: error ?? null };
  }, [user?.id, fetchProfile]);

  const isAnonymous = !!(user && (user as { is_anonymous?: boolean }).is_anonymous);

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isAnonymous,
    signInWithOtp,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
