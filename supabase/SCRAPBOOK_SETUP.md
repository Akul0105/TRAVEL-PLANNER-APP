# Scrapbook & Auth setup

## 1. Run the migration

In your Supabase project:

1. Go to **SQL Editor**.
2. Paste and run the contents of `migrations/20250224000000_user_profiles_and_scrapbook.sql`.

This creates:

- `profiles` – user profile (name, address, etc.) linked to Supabase Auth
- `visited_destinations` – destinations the user has visited (Scrapbook)
- `user_bundles` – MBA-generated personalized bundles per user

## 2. Auth (email sign-in)

1. In Supabase: **Authentication** → **Providers** → ensure **Email** is enabled.
2. **Authentication** → **URL Configuration** → set **Site URL** to your app URL (e.g. `http://localhost:3000` for dev).

Users sign in by entering their email in the chat; Supabase sends a magic link. After they click it, they’re signed in and can complete profile and trip planning.

## 3. Env vars

Ensure `.env.local` has:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `MISTRAL_API_KEY` – for the chatbot (get from [Mistral Console](https://console.mistral.ai/))

Then restart the dev server.
