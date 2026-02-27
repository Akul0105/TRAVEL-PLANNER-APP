# Test Scenarios & Inputs

Use these scenarios and **exact inputs** to test Scrapbook, MBA bundles, and LLM suggested packages.  
MBA items that the engine recognises are listed so your inputs can match and produce bundles.

---

## Pre-requisites

- [ ] Migration `20250226120000_suggested_packages.sql` has been run (Supabase).
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_*` and `MISTRAL_API_KEY`.
- [ ] App running: `npm run dev` → `http://localhost:3000`.
- [ ] You are **signed in** (magic link or password test user).

---

## MBA items the system knows (use these for best bundle results)

| Category       | Valid names (examples) |
|----------------|-------------------------|
| **Destinations** | Paris, Tokyo, Bali, London, Dubai, Mauritius |
| **Activities**   | Hiking, Museum, Spa, Snorkeling, Cooking, Cruise (Boat Cruise) |
| **Accommodation**| Luxury Hotel, Beach Resort, Boutique Hotel, Hostel |
| **Food**         | Free text (e.g. local cuisine, Indian, fine dining) – used for LLM context |

---

## Scenario 1: Scrapbook only → Suggest package + Suggest bundles

**Goal:** Check that Scrapbook data is saved and that both “Suggest package” (LLM) and “Suggest bundles” (MBA) work.

### Step 1 – Destinations visited

| Field           | Input        | Notes        |
|----------------|--------------|-------------|
| Destination    | `Paris`      | MBA destination |
| Country (opt)  | `France`     | Optional    |
| Notes (opt)    | *(leave empty)* | |

Click **Add**. Add a second: Destination `Bali`, Country `Indonesia`.  
**Check:** Both appear in the list; refresh page – they persist.

### Step 2 – Activities I like (3–5 items)

Add these one by one (click Add after each):

1. `Hiking`  
2. `Museum`  
3. `Spa`  
4. `Snorkeling`  

**Check:** All 4 appear; hint says “Add 3–5 items…”. Refresh – they persist.

### Step 3 – Food I like (3–5 items)

Add:

1. `local cuisine`  
2. `fine dining`  
3. `street food`  
4. `Indian food`  

**Check:** All 4 appear and persist after refresh.

### Step 4 – Places to visit / bucket list (3–5 items)

Add:

1. `Tokyo`  
2. `Mauritius`  
3. `Dubai`  

**Check:** All 3 appear and persist.

### Step 5 – Suggest package (LLM)

Click **“Suggest package”** in the **“Suggested travel packages”** section.

**Check:**

- Button shows loading then finishes.
- A new **Suggested travel package** card appears with:
  - **Destination** (e.g. Tokyo, Mauritius, or Dubai – should align with your bucket list/activities).
  - **Hotel** (specific or realistic name, e.g. “Park Hyatt Tokyo”, “Ocean Resort”).
  - **Activities** (3–5 specific items, e.g. “Tokyo Skytree Visit”, “Shibuya Food Tour”).
  - **Why recommended** (short paragraph referring to your preferences).
  - Optional **“Based on: …”** (MBA summary, e.g. “Tokyo, Hiking, Beach Resort (market basket analysis)”).

### Step 6 – Suggest bundles (MBA)

Click **“Suggest bundles”** in the **“Personalized bundles (MBA)”** section.

**Check:**

- Button shows loading then finishes.
- At least one **MBA bundle** appears (e.g. “Flight + Beach Resort + Hiking + Spa + Travel Insurance” or “Paris + Cooking Class”).
- Each bundle lists item names and categories (destination, activity, accommodation, etc.).

---

## Scenario 2: Chat flow → completion → Scrapbook

**Goal:** Check that the chat preference flow saves MBA bundles and one LLM suggested package to Scrapbook.

### Step 1 – Open chat and start

1. Open the **chat** (floating button).
2. If you see “Would you like to share your preferences…”, type: **`yes`** and send.

**Check:** Bot asks for **destination**.

### Step 2 – Answer preference steps (use these exact inputs)

Reply with **exactly** the following when each question appears:

| Step / question | What to type |
|------------------|--------------|
| Which **destination** are you interested in? | `Tokyo` |
| Which **destinations** have you already visited? | `Paris, London` |
| What **type of restaurants** do you enjoy? | `Indian and local street food` |
| What **activities** do you like? | `hiking, museums, food tours` |
| Any **places or attractions** you've loved? | `temples, beaches` |
| What's your usual **budget style**? | `mid-range` |
| What's your **travel style**? | `cultural` |

**Check:** After each answer you get “Got it! 👍” and the next question. After the last one you get: “Thanks! I have enough to suggest personalized bundles…” and a message like “I've added **X bundle(s)**…” and “I've also created a **suggested travel package**… Check the **Scrapbook** page.”

### Step 3 – Verify on Scrapbook

1. Go to **My Scrapbook**.
2. **Check:**
   - **Personalized bundles (MBA):** At least one bundle (e.g. Tokyo or related items).
   - **Suggested travel packages:** One new package with **Destination**, **Hotel**, **Activities**, **Why recommended**, and optionally “Based on: …” (MBA).

---

## Scenario 3: Combined (Scrapbook first, then chat)

**Goal:** Scrapbook is pre-filled; chat adds more context; both MBA and LLM use full context.

### Step 1 – Fill Scrapbook (minimal)

- **Destinations visited:** Add `Bali` only.
- **Activities I like:** Add `Snorkeling`, `Spa`, `Hiking`.
- **Food I like:** Add `local cuisine`, `seafood`.
- **Bucket list:** Add `Mauritius`, `Tokyo`.

Do **not** click Suggest package or Suggest bundles yet.

### Step 2 – Chat flow

1. Open chat. Type **`yes`** to start.
2. Use these answers:

| Step | Input |
|------|--------|
| Destination | `Mauritius` |
| Past destinations | `Bali` |
| Restaurants | `seafood and fine dining` |
| Activities | `beaches, snorkeling, spa` |
| Places loved | `beach resorts` |
| Budget | `luxury` |
| Travel style | `relaxation` |

**Check:** Completion message mentions bundles and a suggested travel package.

### Step 3 – Scrapbook after chat

1. Open **My Scrapbook**.
2. **Check:**
   - **Suggested travel packages:** At least one package; destination should be **Mauritius** (or strongly related); hotel and activities should fit “luxury”, “beach”, “snorkeling”, “spa”.
   - **Personalized bundles (MBA):** At least one bundle containing MBA items (e.g. Mauritius, Beach Resort, Snorkeling, Spa).

### Step 4 – Suggest package again (from Scrapbook)

1. Still on Scrapbook, click **“Suggest package”** once more.
2. **Check:** A **second** suggested package appears (may be different destination/activities due to LLM variation).

---

## Scenario 4: Edge cases & quick checks

### 4.1 – No destination in chat

- In chat, for “Which destination are you interested in?” type: **`I'm not sure`**.
- Complete the rest (e.g. past destinations: `Paris`, restaurants: `local`, activities: `museum`, budget: `mid-range`, travel style: `cultural`).
- **Check:** System still completes; Scrapbook may get bundles from bucket list / profile (e.g. Paris, Museum) and one LLM package (destination may be Paris or from bucket list).

### 4.2 – MBA-only names in Scrapbook

On Scrapbook, use **only** MBA-known names:

- **Visited:** `Paris`, `Tokyo`.
- **Activities:** `Hiking`, `Museum`, `Cooking`.
- **Bucket list:** `Bali`, `London`.

Click **Suggest bundles** then **Suggest package**.

**Check:** MBA section shows bundles with Paris, Tokyo, Bali, London, Hiking, Museum, Cooking. Suggested package aligns with those destinations/activities.

### 4.3 – Chat persistence

1. In chat, complete at least 2–3 messages (e.g. “yes” → destination → past destinations).
2. Navigate to **Home** or **Scrapbook**, then back to the app and open chat again.
3. **Check:** Same conversation is still there (messages restored from DB).
4. Click **Clear chat** (trash icon).
5. **Check:** Messages reset to the single welcome line; next “yes” starts a new thread.

---

## Checklist summary

| # | What to test | Pass? |
|---|----------------|------|
| 1 | Scrapbook: all 4 sections save and persist after refresh | |
| 2 | Suggest package: one LLM package with destination, hotel, activities, why recommended | |
| 3 | Suggest bundles: at least one MBA bundle with item names/categories | |
| 4 | Chat: full preference flow → completion message mentions bundles + suggested package | |
| 5 | Scrapbook after chat: MBA bundles + 1 suggested travel package present | |
| 6 | Suggested package reflects destination/preferences (e.g. Tokyo, Mauritius, activities) | |
| 7 | Chat persistence: conversation survives navigation; Clear starts new thread | |
| 8 | Second “Suggest package” adds another package row | |

---

## If something fails

- **Suggest package returns error / no package:** Check browser Network tab for `POST /api/packages/suggest` (status 200 vs 4xx/5xx). Confirm `MISTRAL_API_KEY` is set. Check Supabase Table Editor for `suggested_packages` and RLS.
- **Suggest bundles empty:** Use **exact** MBA names (e.g. Paris, Tokyo, Hiking, Museum) in Scrapbook or in chat destination/activities.
- **Chat completion doesn’t add package:** Ensure you’re signed in and the completion message appears; then open Scrapbook and refresh. Check Network for both `suggest-bundles` and `packages/suggest` calls.
- **“Why recommended” or “Based on” missing:** Optional fields; LLM or API may omit them sometimes. As long as destination, hotel, and activities appear, the flow is working.
