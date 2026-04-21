# Current State — Hometap Partner Referral Platform

**Last updated:** April 21, 2026
**Phase:** Phase 1 Core MVP — fully scaffolded and running

---

## Application Status

**All 6 screens implemented and wired.** The app builds cleanly (no TypeScript errors), the dev server runs, and all Tailwind design tokens are applied.

---

## Database (Supabase)

**Project URL:** `https://eovyrgapbjxxurgmdrwk.supabase.co`
**Migration:** `docs/001_initial_migration.sql` — applied

### Tables

| Table | Key Columns | Notes |
|-------|-------------|-------|
| `partners` | `id` (uuid PK), `name`, `email`, `phone`, `partner_type`, `company_name`, `created_at` | 2 demo partners seeded |
| `referral_statuses` | `id` (int PK), `slug`, `label`, `description`, `sort_order`, `is_terminal`, `color_hex` | 8 statuses seeded |
| `Leads` | `LeadID` (serial PK), `first_name`, `last_name`, `email`, `phone`, `address1`, `address2`, `city`, `state`, `zip`, `partner_id` (FK), `referral_status_id` (FK, default 1), `use_case`, `notes`, `submitted_at` | 8 demo leads seeded |
| `Leads_Metadata` | `id` (uuid PK), `LeadID` (FK), `utm_source`, `utm_medium`, `utm_campaign`, `lead_submission_page`, + other UTM/referrer fields | Metadata rows seeded for demo leads |
| `referral_status_history` | `id` (uuid PK), `lead_id` (FK), `status_id` (FK), `changed_at`, `changed_by`, `note` | Status history seeded for 3 demo leads |

### Demo Partners (hardcoded UUIDs)

| Partner | UUID |
|---------|------|
| Marcus Webb (Contractor) | `11111111-1111-1111-1111-111111111111` |
| Sarah Okonkwo (Real Estate Agent) | `22222222-2222-2222-2222-222222222222` |

---

## Environment Variables

Stored in `.env.local` (not committed). Both values are set.

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key |

---

## Tech Stack

| Layer | Version |
|-------|---------|
| React | 19.x |
| TypeScript | ~6.0 |
| Vite | 8.x |
| Tailwind CSS | 4.x (via `@tailwindcss/postcss`) |
| Zustand | 5.x |
| Zod | 4.x |
| @supabase/supabase-js | 2.x |

---

## What Is Working

- Login screen with both demo partner selectors and loading state
- Pipeline screen with metric tiles (Total Referred, In Progress, Closed, Earned) and lead cards
- Refer screen with full referral form and use-case accordion
- Confirmation screen with animated success circle and "what happens next" timeline
- Prospect Detail screen with status hero, lead summary, and status timeline
- Account screen with profile, contact info, payout info, earnings summary, and sign-out
- Zustand routing (no React Router) between all 6 screens
- FAB visible on all screens except Login; no-op on Refer tab
- BottomNav active state per spec
- `fetchPartnerData` — single read function, queries partner + leads + statuses + history
- `submitLead` — single write function, inserts Lead + Leads_Metadata + initial status history row
- Tailwind design tokens mapped from design spec (colors, typography, spacing, radii, shadows)

---

## Deployment

**Vercel:** Not yet deployed.

---

## Known Issues / Deviations

- The Supabase anon key is the new `sb_publishable_*` format (Supabase v2 keys), not the older JWT format. This works correctly with `@supabase/supabase-js` v2.
- `@config` in `index.css` produces an editor CSS lint warning (unknown at-rule); this is a linter limitation and does not affect the build.
- No RLS policies — all tables are publicly readable/writable per demo spec.
