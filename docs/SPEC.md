# SPEC.md — Hometap Partner Referral Platform
**Version 1.0 | April 2026**
*Read this file in full before writing any code. See CLAUDE.md for session-level coding rules.*

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Current Phase](#4-current-phase)
5. [Screen Inventory](#5-screen-inventory)
6. [Navigation & Routing](#6-navigation--routing)
7. [Screen Specifications](#7-screen-specifications)
8. [Data Layer](#8-data-layer)
9. [State Management](#9-state-management)
10. [Design Implementation](#10-design-implementation)
11. [Out of Scope](#11-out-of-scope)
12. [Future Features](#12-future-features)
13. [Assumptions & Decisions Log](#13-assumptions--decisions-log)

---

## 1. Product Overview

### What This Is
A partner referral portal for Hometap — a mobile-first web app that allows trusted professionals (contractors and real estate agents) to refer homeowners into Hometap's Home Equity Investment (HEI) product.

Partners log in, submit referrals on behalf of homeowners, and track the status of their referred leads through a pipeline dashboard. When a referred investment closes, the partner earns a referral fee.

### Why It Exists
Hometap's existing customer acquisition is entirely direct-to-consumer through paid and organic channels. This platform creates a new referral channel by embedding Hometap into high-intent moments — a contractor quoting an $80k renovation, or a real estate agent helping a client raise capital for an investment property — through professionals the homeowner already trusts.

### Two Partner Personas
This is a demo product. Two hardcoded partner accounts represent the two target personas:

| Partner | Type | Company |
|---------|------|---------|
| Marcus Webb | Contractor | Webb & Sons Home Improvement |
| Sarah Okonkwo | Real Estate Agent | Okonkwo Investment Realty |

Both partners use identical UI. No persona-specific branching in the interface.

### Demo Scope
This is a prototype built for a hiring panel presentation. It is not a production application. The goals are:
- Demonstrate the partner-side UX end to end
- Show real data flowing into and out of Supabase
- Look and feel like a polished, native mobile app

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 18 (Vite) | |
| Language | TypeScript | Strict mode on |
| Styling | Tailwind CSS | Token values from `designs/DESIGN_SPEC.md` |
| State | Zustand | Single store, handles routing + app data |
| Validation | Zod | Form validation schemas |
| Database | Supabase (PostgreSQL) | DB only — no Supabase Auth |
| Hosting | Vercel | Auto-deploy from main branch |

### Dependency Approval
Per CLAUDE.md — do not install any package not listed above without flagging it to the user first with name, purpose, and bundle size impact.

---

## 3. Architecture

### Hard Rules

**Rule 1 — Single write function.**
`src/lib/submitLead.ts` is the only file in the codebase that may write to the database. No component, hook, store, or utility may import the Supabase client directly for writes. All lead submission flows through `submitLead`.

**Rule 2 — Single read function.**
`src/lib/fetchPartnerData.ts` is the only file that may query the database for reads. It fetches all data the app needs on load: the active partner record, their leads, and the referral statuses lookup table.

**Rule 3 — No other file touches Supabase.**
`src/lib/supabaseClient.ts` initializes the Supabase client. Only `submitLead.ts` and `fetchPartnerData.ts` import from it. No exceptions.

### Data Flow

```
App loads
  → fetchPartnerData(partnerId)
      → Supabase: SELECT leads + statuses for this partner
  → Zustand store hydrated with partner, leads, statuses
  → All screens read from store

Partner submits referral
  → ReferralForm collects input
  → submitLead(formData, partnerId)
      → Supabase: INSERT into Leads + Leads_Metadata
  → On success: navigate to confirmation screen
  → On success: re-fetch via fetchPartnerData to refresh store
```

### Folder Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── MetricTiles.tsx       # 2×2 grid of pipeline summary stats
│   │   ├── LeadCard.tsx          # Individual lead card in the pipeline list
│   │   └── LeadList.tsx          # Scrollable list of LeadCards
│   ├── referral/
│   │   ├── ReferralForm.tsx      # Full single-page referral form
│   │   ├── UseCaseAccordion.tsx  # Expandable parent/child use case selector
│   │   └── ConfirmationScreen.tsx
│   ├── detail/
│   │   ├── StatusHero.tsx        # Current status + next step pill
│   │   ├── LeadSummaryCard.tsx   # Lead info summary rows
│   │   └── StatusTimeline.tsx    # Full status history timeline
│   ├── account/
│   │   └── AccountScreen.tsx
│   └── ui/
│       ├── BottomNav.tsx         # 3-tab nav bar
│       ├── FAB.tsx               # Floating action button
│       ├── TopBar.tsx            # Screen header (label + name + avatar)
│       ├── StatusBadge.tsx       # Colored status pill
│       └── Button.tsx            # Primary + secondary variants
├── hooks/
│   └── usePartnerData.ts         # Calls fetchPartnerData, populates store
├── store/
│   └── useAppStore.ts            # Zustand store — routing + all app data
├── lib/
│   ├── supabaseClient.ts         # Supabase client init — only place env vars are read
│   ├── submitLead.ts             # ONLY file that writes to DB
│   ├── fetchPartnerData.ts       # ONLY file that reads from DB
│   ├── demoPartners.ts           # Hardcoded demo partner UUIDs + display data
│   └── validation.ts             # Zod schemas for referral form
├── types/
│   └── index.ts                  # All shared TypeScript interfaces
└── App.tsx                       # Root — reads store for active screen, renders it

designs/
├── DESIGN_SPEC.md
├── hometap-component-kit.html
├── screen-01-login.html
├── screen-02-pipeline.html
├── screen-03-refer.html
├── screen-04-confirmation.html
├── screen-05-prospect-detail.html
└── screen-06-account.html

docs/
└── CURRENT_STATE.md
```

---

## 4. Current Phase

**Phase 1 — Core MVP**

Covers the complete partner-side flow:
- Demo login (partner selector, no auth)
- Pipeline dashboard with metric tiles and lead cards
- New referral form with use case accordion
- Post-submission confirmation screen
- Prospect detail with status timeline
- Account screen

Active backend: Supabase. All reads via `fetchPartnerData`. All writes via `submitLead`.

Do NOT implement: authentication, SMS/email triggers, real-time subscriptions, admin views, or any Hometap-side workflow tooling.

---

## 5. Screen Inventory

| ID | Screen | Tab | Design File |
|----|--------|-----|-------------|
| S1 | Login | — | screen-01-login.html |
| S2 | Pipeline | Pipeline tab | screen-02-pipeline.html |
| S3 | Refer | Refer tab | screen-03-refer.html |
| S4 | Confirmation | — (post-submit) | screen-04-confirmation.html |
| S5 | Prospect Detail | — (from Pipeline) | screen-05-prospect-detail.html |
| S6 | Account | Account tab | screen-06-account.html |

---

## 6. Navigation & Routing

### Approach
Zustand-based in-app navigation. No React Router. No URL changes. The store holds a `currentScreen` value and an optional `selectedLeadId` for the detail view.

### Store Shape (navigation slice)
```ts
type Screen = 'login' | 'pipeline' | 'refer' | 'confirmation' | 'detail' | 'account';

interface NavigationState {
  currentScreen: Screen;
  selectedLeadId: number | null;
  navigateTo: (screen: Screen, leadId?: number) => void;
}
```

### Navigation Rules

| From | Action | To |
|------|--------|----|
| Login | Select partner | Pipeline |
| Any tab | Tap Refer tab | Refer |
| Any tab | Tap Pipeline tab | Pipeline |
| Any tab | Tap Account tab | Account |
| Any tab | Tap FAB | Refer (no-op if already on Refer) |
| Refer | Submit referral (success) | Confirmation |
| Confirmation | Tap "View in Pipeline" | Pipeline |
| Confirmation | Tap "Refer another homeowner" | Refer (reset form) |
| Pipeline | Tap lead card | Detail (selectedLeadId = lead.LeadID) |
| Detail | Tap "‹ Pipeline" back button | Pipeline |

### Bottom Nav Active States

| Screen | Active Tab |
|--------|-----------|
| login | none |
| pipeline | Pipeline |
| refer | Refer |
| confirmation | none |
| detail | Pipeline |
| account | Account |

### FAB Behavior
- Visible on all screens except Login
- Tapping from Pipeline, Detail, or Account → navigate to Refer
- Tapping while on Refer → no-op
- Tapping while on Confirmation → navigate to Refer (starts new referral)

---

## 7. Screen Specifications

### S1 — Login

**Purpose:** Demo partner selector. No real authentication.

**Behavior:**
- Displays two partner buttons (Marcus Webb, Sarah Okonkwo)
- Tapping a button sets `activePartnerId` in the store and calls `fetchPartnerData(partnerId)`
- On successful data load, navigates to Pipeline
- Shows loading state while fetch is in progress

**Key components:** partner buttons with avatar initials, Hometap logo (SVG, embedded inline), trust pills, demo mode note

**Design file:** `screen-01-login.html`

---

### S2 — Pipeline

**Purpose:** Partner's home screen. Shows pipeline metrics and all referred leads.

**Metric Tiles (2×2 grid):**

| Tile | Calculation |
|------|-------------|
| Total Referred | `leads.length` |
| In Progress | `leads.filter(l => !status.is_terminal && status.slug !== 'submitted').length` |
| Closed | `leads.filter(l => status.slug === 'closed' \|\| status.slug === 'paid').length` |
| Earned | `leads.filter(l => status.slug === 'paid').length * 500` formatted as currency |

**Lead Cards:** sorted by `submitted_at` descending (most recent first). Each card shows:
- Homeowner name
- Property address (street, city, state)
- Status badge (color-coded, from `referral_statuses.color_hex`)
- Use case pill
- Submission date (formatted as "Apr 8")
- Chevron `›`

Tapping a card sets `selectedLeadId` and navigates to Detail.

**Design file:** `screen-02-pipeline.html`

**Future feature:** Filter/sort controls (by status, date, use case). Flag as `// FUTURE: pipeline filters` in the component.

---

### S3 — Refer (New Referral Form)

**Purpose:** Partner submits a new homeowner referral.

**Form layout:** Single scrollable page, sticky submit bar at bottom.

**Sections and fields:**

*Homeowner Info*
- First name (required)
- Last name (required)
- Email (required)
- Phone (required)

*Property Address*
- Street address (required)
- City (required)
- State (required, 2-char)
- ZIP (required, 5-digit numeric)

*Use of Funds (required) — accordion selector*
See Use Case Accordion section below.

*Additional Notes*
- Notes textarea (optional)

**Validation:**
Basic presence check only — all required fields must be non-empty before submit button activates. No format validation in this phase.

**Future feature:** Full inline validation (email format, phone format, ZIP format). Flag as `// FUTURE: field-level validation` in `validation.ts`.

**Submit behavior:**
1. Disable submit button, show loading spinner
2. Call `submitLead(formData, activePartnerId)`
3. On success: navigate to Confirmation
4. On error: show inline error message below submit button, re-enable button

**Design file:** `screen-03-refer.html` (includes full interactive accordion JS — reference this for React implementation)

#### Use Case Accordion

Two parent radio cards that expand to reveal child options.

**Parent categories:**

| Category | Icon | Sublabel |
|----------|------|----------|
| Home Repair / Renovation | 🔨 | Improvements, repairs, or additions |
| Investment Capital | 💼 | Funding a property purchase or business goal |

**Child options — Home Repair / Renovation:**
- Roof replacement
- Kitchen remodel
- Bathroom remodel
- Addition / expansion
- Basement finish
- Patio / deck
- Siding / exterior
- HVAC / systems
- Other repair or renovation → reveals inline text input

**Child options — Investment Capital:**
- Down payment on investment property
- Portfolio expansion (multi-family)
- Fix & flip funding
- Debt payoff / refinance
- Business funding
- Other investment use → reveals inline text input

**Interaction rules:**
- Tapping a parent card toggles its expanded state
- A parent with an active selection cannot be collapsed by tapping — only by selecting from the other parent
- Selecting a child option: collapses the parent, shows a truncated selection indicator pill in the parent header, clears any selection in the other parent
- Selecting "Other" in either category: reveals an inline text input immediately below that option
- Only one child option can be selected across both parents at any time

**Value stored:** The selected child label string (e.g., `"Kitchen remodel"`, `"Down payment on investment property"`). If "Other" is selected, store the contents of the inline text input instead, prefixed by the parent category (e.g., `"Renovation: [user text]"`)

---

### S4 — Confirmation

**Purpose:** Post-submission success screen. Reinforces what just happened and sets partner expectations.

**Content:**
- Animated success circle (pop animation on mount — `scale(0.5) opacity(0)` → `scale(1) opacity(1)`, 400ms, cubic-bezier spring)
- "Referral submitted!" headline
- Referral summary card (name, address, use case, "Submitted" status)
- "What happens next" 4-step timeline:
  1. **Jane confirms her interest** (highlighted — active step) — she receives a text with a link to confirm interest; tagged "⏳ Waiting on [firstName]"
  2. **Hometap Investment Manager calls** — within 24 hours of confirmation
  3. **Jane completes her application** — with Investment Manager guidance
  4. **Investment closes, you get paid** — $500 referral fee tracked in pipeline
- "View in Pipeline" primary CTA
- "Refer another homeowner" secondary CTA

**Note:** The homeowner's first name from the submitted form is used in step 1 copy and the "Waiting on" tag.

**Design file:** `screen-04-confirmation.html`

---

### S5 — Prospect Detail

**Purpose:** Full detail view for a single referred lead. Shows current status, lead info, and complete status timeline.

**Accessed from:** Pipeline screen, by tapping a lead card.

**Top bar:** Back button ("‹ Pipeline") + lead full name + partner avatar

**Status hero:**
- "Current status" label
- Status badge (large, 13px, matches `referral_statuses.color_hex`)
- "Updated [date] · [time]" — from the most recent `referral_status_history` entry
- "Next step" pill with pulsing dot — derived from the next status in `sort_order` sequence

**Next step pill copy by current status:**

| Current Status | Next Step Pill |
|---------------|----------------|
| submitted | Awaiting confirmation |
| contacted | Pre-qual underway |
| pre_qual_complete | App in progress |
| application_started | Review in progress |
| application_approved | Closing soon |
| closed | Payment pending |
| application_rejected | (hide pill) |
| paid | (hide pill) |

**Lead summary card:** Name, address, use case, notes, referred-on date

**Status timeline:**
- All statuses from `referral_statuses` table shown in `sort_order` order
- Completed statuses (those with a `referral_status_history` entry for this lead): filled purple dot with white checkmark, timestamp from history
- Current status: filled purple dot, timestamp
- Pending statuses: hollow dot, muted text, italic "Pending"
- Final row ("Paid"): always shows "$500 referral fee" in the pending date field regardless of status

**Design file:** `screen-05-prospect-detail.html`

**Future features:**
- `application_rejected` state: show a gentle explanation card ("This property didn't meet Hometap's investment criteria at this time"). Flag as `// FUTURE: rejected state UI`
- `paid` state: show celebration treatment with green "Payment sent" confirmation. Flag as `// FUTURE: paid state UI`

---

### S6 — Account

**Purpose:** Partner profile, payout info, and earnings summary. Mostly static for demo.

**Sections:**
- Profile hero: large avatar initials, name, partner type, company, "Active Partner" green badge
- Contact info: email, phone (read-only, from partner record)
- Payout info: bank account (shows "Not connected" with "Add" action — non-functional), referral fee ($500, static), partner agreement link (non-functional)
- Earnings summary: Total Earned, Pending, Deals Closed, Close Rate (all derived from lead data — same logic as Pipeline metric tiles)
- Sign out button → navigates back to Login, clears store

**Design file:** `screen-06-account.html`

---

## 8. Data Layer

### Environment Variables

All in `.env.local` — never committed, never hardcoded.

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Both are read exclusively in `src/lib/supabaseClient.ts`. If either is missing at runtime, throw a descriptive error immediately.

### Demo Partner Constants

```ts
// src/lib/demoPartners.ts
export const DEMO_PARTNERS = {
  contractor: {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Marcus Webb',
    type: 'Contractor',
    company: 'Webb & Sons Home Improvement',
    initials: 'MW',
    avatarColor: 'purple', // maps to #EDE7F6 bg / #6B3FA0 text
  },
  realEstateAgent: {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Sarah Okonkwo',
    type: 'Real Estate Agent',
    company: 'Okonkwo Investment Realty',
    initials: 'SO',
    avatarColor: 'teal', // maps to #E0F7F5 bg / #00897B text
  },
} as const;
```

### `fetchPartnerData.ts`

**Signature:**
```ts
async function fetchPartnerData(partnerId: string): Promise<PartnerData>
```

**Queries:**

1. Fetch partner record:
```sql
SELECT * FROM partners WHERE id = $partnerId
```

2. Fetch partner's leads with current status:
```sql
SELECT
  l.*,
  rs.slug        AS status_slug,
  rs.label       AS status_label,
  rs.color_hex   AS status_color,
  rs.is_terminal AS status_is_terminal,
  rs.sort_order  AS status_sort_order
FROM "Leads" l
JOIN referral_statuses rs ON l.referral_status_id = rs.id
WHERE l.partner_id = $partnerId
ORDER BY l.submitted_at DESC
```

3. Fetch full referral_statuses lookup (for timeline rendering):
```sql
SELECT * FROM referral_statuses ORDER BY sort_order ASC
```

4. For each lead, fetch its status history:
```sql
SELECT rsh.*, rs.slug, rs.label
FROM referral_status_history rsh
JOIN referral_statuses rs ON rsh.status_id = rs.id
WHERE rsh.lead_id = $leadId
ORDER BY rsh.changed_at ASC
```

**Return type:**
```ts
interface PartnerData {
  partner: Partner;
  leads: LeadWithStatus[];
  allStatuses: ReferralStatus[];
}
```

### `submitLead.ts`

**Signature:**
```ts
async function submitLead(
  formData: ReferralFormData,
  partnerId: string
): Promise<{ leadId: number }>
```

**Operations (in order, in a single async function):**

1. INSERT into `Leads`:
```sql
INSERT INTO "Leads" (
  first_name, last_name, email, phone,
  address1, city, state, zip,
  partner_id, referral_status_id, use_case, notes,
  submitted_at
) VALUES (...)
RETURNING "LeadID"
```

2. INSERT into `Leads_Metadata` using the returned `LeadID`:
```sql
INSERT INTO "Leads_Metadata" (
  "LeadID",
  utm_source, utm_medium, utm_campaign,
  lead_submission_page
) VALUES (
  $leadId,
  'partner_referral',
  'partner',
  $partnerId,
  'partner_portal_refer'
)
```

3. INSERT initial status history entry:
```sql
INSERT INTO referral_status_history (lead_id, status_id, changed_by)
VALUES ($leadId, 1, 'partner_portal')
```

4. Return `{ leadId }` on success. Throw a descriptive error on any failure.

### TypeScript Interfaces

```ts
// src/types/index.ts

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  partner_type: 'contractor' | 'real_estate_agent';
  company_name: string;
  created_at: string;
}

interface ReferralStatus {
  id: number;
  slug: string;
  label: string;
  description: string;
  sort_order: number;
  is_terminal: boolean;
  color_hex: string;
}

interface Lead {
  LeadID: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  partner_id: string;
  referral_status_id: number;
  use_case: string;
  notes: string | null;
  submitted_at: string;
}

interface LeadWithStatus extends Lead {
  status_slug: string;
  status_label: string;
  status_color: string;
  status_is_terminal: boolean;
  status_sort_order: number;
}

interface StatusHistoryEntry {
  id: string;
  lead_id: number;
  status_id: number;
  changed_at: string;
  changed_by: string | null;
  note: string | null;
  slug: string;
  label: string;
}

interface PartnerData {
  partner: Partner;
  leads: LeadWithStatus[];
  allStatuses: ReferralStatus[];
}

interface ReferralFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  useCase: string;
  notes: string;
}
```

---

## 9. State Management

### Zustand Store Shape

```ts
// src/store/useAppStore.ts

interface AppStore {
  // ── Navigation ──
  currentScreen: Screen;
  selectedLeadId: number | null;
  navigateTo: (screen: Screen, leadId?: number) => void;

  // ── Auth / Partner ──
  activePartnerId: string | null;
  partner: Partner | null;
  setActivePartner: (partnerId: string) => void;
  clearPartner: () => void;

  // ── Data ──
  leads: LeadWithStatus[];
  allStatuses: ReferralStatus[];
  isLoading: boolean;
  error: string | null;
  setPartnerData: (data: PartnerData) => void;

  // ── Referral Form ──
  pendingReferral: ReferralFormData | null;
  setPendingReferral: (data: ReferralFormData) => void;
  clearPendingReferral: () => void;

  // ── Derived (computed, not stored) ──
  // Use selectors in components — don't add derived values to the store
}
```

### Key Store Rules
- `navigateTo('detail', leadId)` sets both `currentScreen` and `selectedLeadId`
- `clearPartner()` resets the entire store to initial state and navigates to Login
- `pendingReferral` holds the last submitted form data so the Confirmation screen can display it without re-fetching
- Never store derived values (metric tile calculations, timeline completion state) in the store — compute them in the component or a selector

---

## 10. Design Implementation

### Source of Truth
Reference the `/designs/` directory before implementing any component. Never invent colors, spacing, or typography.

| Need | Reference |
|------|-----------|
| Token values (colors, spacing, radii, shadows) | `DESIGN_SPEC.md` → Section 2, 3, 4 |
| Component HTML structure + CSS | `hometap-component-kit.html` |
| Per-screen layout, content, and behavior | `screen-0N-[name].html` |
| Interaction behavior (accordion, timeline logic) | Comments in `screen-03-refer.html` and `screen-05-prospect-detail.html` |

### Tailwind Config
Map all design tokens to Tailwind custom values in `tailwind.config.ts`. Do not use hardcoded hex values in component classes — always use the named token.

### Logo
The Hometap logo SVG paths are embedded in `screen-01-login.html`. Use the same inline SVG in the React app. Do not use an `<img>` tag for the logo — the SVG must be inline for color fidelity.

### Animation Rules
- Success circle pop: CSS keyframe, 400ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Progress transitions: 150ms ease for borders/backgrounds, 180ms ease for buttons
- FAB hover: `scale(1.05)`, FAB active: `scale(0.96)`
- Timeline pulse dot: CSS keyframe, 1.5s infinite, opacity 1→0.3→1
- All animations must respect `prefers-reduced-motion` — disable all non-essential animations when set

---

## 11. Out of Scope

The following are explicitly not part of this build. Do not implement or stub these.

- Authentication (real login, sessions, JWT, cookies)
- SMS or email triggered on lead submission
- Hometap-side admin dashboard or status update UI
- Payment processing or real payout logic
- Address autocomplete (Google Places API)
- Push notifications
- Multi-language support
- Any mobile native app wrapper (this is a PWA-style web app only)
- Hometap's existing pre-qualification or application flow

---

## 12. Future Features

The following are intentionally deferred. Flag each with a `// FUTURE:` comment at the relevant location in the code.

| Feature | Flag | Location |
|---------|------|----------|
| Pipeline filter/sort by status, date, use case | `// FUTURE: pipeline filters` | `LeadList.tsx` |
| Field-level validation (email, phone, ZIP format) | `// FUTURE: field-level validation` | `validation.ts` |
| Real-time lead status updates via Supabase subscriptions | `// FUTURE: real-time subscriptions` | `fetchPartnerData.ts` |
| Rejected lead explanation card | `// FUTURE: rejected state UI` | `ProspectDetail` or `StatusTimeline.tsx` |
| Paid lead celebration treatment | `// FUTURE: paid state UI` | `ProspectDetail` or `StatusTimeline.tsx` |
| Earnings history tab / breakdown | `// FUTURE: earnings tab` | `AccountScreen.tsx` |
| Bank account payout connection | `// FUTURE: payout connection` | `AccountScreen.tsx` |

---

## 13. Assumptions & Decisions Log

| Decision | Rationale |
|----------|-----------|
| Zustand-based routing instead of React Router | Simpler for a demo SPA with a small number of screens; no URL-based navigation needed; avoids Vercel SPA redirect config |
| No Supabase Auth | This is a demo — fake login is sufficient and avoids auth setup complexity |
| Single `submitLead` write function | Keeps all DB write logic in one place, makes it easy to audit, extend, or replace the backend later |
| Single `fetchPartnerData` read function | Same rationale — one place to update if schema or query logic changes |
| Fetch on mount, not real-time | Sufficient for a demo; real-time subscriptions are a future feature |
| $500 flat referral fee hardcoded | Placeholder for demo; in production this would come from the partner record |
| Basic presence validation only | Sufficient for demo; full validation is a future feature |
| No address autocomplete | Removes Google Maps API dependency; not needed for demo fidelity |
| All status history shown in timeline | Gives the most useful view for partners; no need to paginate at demo data volumes |
| `use_case` stored as a string label | Simpler than a FK to a use_case table; sufficient for demo; can be normalized later |
