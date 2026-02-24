'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile as UserProfileType } from '@/types';
import { CheckCircle } from 'lucide-react';

const NATIONALITIES = [
  { value: '', label: 'Select nationality' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'JP', label: 'Japan' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'IN', label: 'India' },
  { value: 'other', label: 'Other' },
];

const TRAVEL_STYLES: { value: UserProfileType['travelStyle']; label: string }[] = [
  { value: undefined, label: 'Not specified' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'relaxation', label: 'Relaxation' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'business', label: 'Business' },
  { value: 'family', label: 'Family' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'budget', label: 'Budget' },
];

const BUDGET_OPTIONS: { value: UserProfileType['budgetRange']; label: string }[] = [
  { value: undefined, label: 'Not specified' },
  { value: 'budget', label: 'Budget' },
  { value: 'mid-range', label: 'Mid-range' },
  { value: 'luxury', label: 'Luxury' },
];

const POPULAR_DESTINATIONS = ['Mauritius', 'Paris', 'Bali', 'Tokyo', 'London', 'Dubai', 'Rome', 'Barcelona'];

export function UserDetailsForm() {
  const { profile, setProfile, isHydrated } = useUserProfile();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<UserProfileType>({
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
  });

  useEffect(() => {
    if (!isHydrated) return;
    setForm(profile);
  }, [isHydrated, profile]);

  const update = (updates: Partial<UserProfileType>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const toggleDestination = (dest: string) => {
    setForm((prev) => {
      const list = prev.preferredDestinations ?? [];
      const next = list.includes(dest) ? list.filter((d) => d !== dest) : [...list, dest];
      return { ...prev, preferredDestinations: next };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isHydrated) return null;

  return (
    <section id="contact" className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-black mb-3 tracking-tight">
            Your details
          </h2>
          <p className="text-neutral-600">
            Share your details so we can suggest the best bundles and experiences. Stored only on this device.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update({ firstName: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30"
                placeholder="e.g. John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-1.5">Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update({ lastName: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30"
                placeholder="e.g. Doe"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-900 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update({ phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30"
                placeholder="+230 5 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-1.5">Nationality</label>
              <select
                value={form.nationality}
                onChange={(e) => update({ nationality: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30"
              >
                {NATIONALITIES.map((opt) => (
                  <option key={opt.value || 'none'} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-black">Preferred destinations</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => toggleDestination(dest)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    form.preferredDestinations?.includes(dest)
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Typical travelers</label>
              <select
                value={form.typicalTravelers ?? ''}
                onChange={(e) => update({ typicalTravelers: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                <option value="">Not specified</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Budget range</label>
              <select
                value={form.budgetRange ?? ''}
                onChange={(e) => update({ budgetRange: (e.target.value || undefined) as UserProfileType['budgetRange'] })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value ?? 'none'} value={opt.value ?? ''}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1.5">Travel style</label>
            <select
              value={form.travelStyle ?? ''}
              onChange={(e) => update({ travelStyle: (e.target.value || undefined) as UserProfileType['travelStyle'] })}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              {TRAVEL_STYLES.map((opt) => (
                <option key={opt.value ?? 'none'} value={opt.value ?? ''}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">We use this to personalize your travel suggestions.</p>
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2"
            >
              {saved ? <><CheckCircle className="w-4 h-4" /> Saved</> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
