'use client';

import { useState, useCallback, useEffect } from 'react';
import { UserProfile } from '@/types';

const STORAGE_KEY = 'travel_planner_user';

const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  nationality: '',
  preferredDestinations: [],
  travelStyle: undefined,
  typicalTravelers: undefined,
  budgetRange: undefined,
  interests: [],
};

function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultProfile;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return { ...defaultProfile, ...parsed };
  } catch {
    return defaultProfile;
  }
}

function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function useUserProfile() {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setProfileState(loadProfile());
    setIsHydrated(true);
  }, []);

  const setProfile = useCallback((next: UserProfile | ((prev: UserProfile) => UserProfile)) => {
    setProfileState((prev) => {
      const nextProfile = typeof next === 'function' ? next(prev) : next;
      saveProfile(nextProfile);
      return nextProfile;
    });
  }, []);

  const hasProfile = isHydrated && (profile.firstName?.trim() || profile.email?.trim());

  return { profile, setProfile, hasProfile, isHydrated };
}
