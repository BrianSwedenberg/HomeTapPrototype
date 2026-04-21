# Claude Code — Kickoff Prompt
# Hometap Partner Referral Platform

---

Paste this entire prompt into Claude Code to begin the build session.

---

## PROMPT

You are building the Hometap Partner Referral Platform — a mobile-first React web app that allows contractors and real estate agents to refer homeowners into Hometap's Home Equity Investment product.

Before doing anything else, complete the following steps in order:

---

### Step 1 — Read all project files

Read these files in full before writing a single line of code:

1. `CLAUDE.md` — your session-level coding rules. These are non-negotiable.
2. `docs/SPEC.md` — the full product specification. This is your source of truth.
3. `docs/SCHEMA.md` — the database schema and table definitions.
4. `docs/CURRENT_STATE.md` — the current state of the application.
5. `design/hometap-design-spec.md` — the design system (colors, typography, spacing, components).

Then read all six screen design files in `design/`:
- `screen-01-login.html`
- `screen-02-pipeline.html`
- `screen-03-refer.html` — pay close attention to the accordion JS and its inline comments
- `screen-04-confirmation.html`
- `screen-05-prospect-detail.html` — pay close attention to the timeline data source comments
- `screen-06-account.html`

Do not skip any of these. Do not begin coding until all files are read.

---

### Step 2 — Confirm your understanding

After reading, respond with a single paragraph confirming:
- What you are building
- The active phase
- The two hard architectural rules (single write function, single read function)
- Which design files you will reference for each screen

Do not proceed to Step 3 until you have written this confirmation.

---

### Step 3 — Environment setup

**3a. Check for .env.local**

Check whether `.env.local` exists at the project root. If it does not exist, create it with the following contents and instruct the user to fill in their values before continuing:

```
VITE_SUPABASE_URL=REPLACE_WITH_YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=REPLACE_WITH_YOUR_SUPABASE_ANON_KEY
```

Tell the user: "Please fill in your Supabase project URL and anon key in `.env.local` before we continue. You can find both in your Supabase dashboard under Project Settings → API. Let me know when it's done."

Wait for the user to confirm before proceeding.

**3b. Confirm .gitignore**

Check that `.env.local` is in `.gitignore`. If it is not, add it. Never commit environment variables.

**3c. Run the database migration**

The migration file is at `docs/001_initial_migration.sql`. Run it against the Supabase project using the Supabase CLI:

```bash
supabase db push --db-url $SUPABASE_DB_URL
```

If the Supabase CLI is not installed, install it first:

```bash
npm install -g supabase
```

If `SUPABASE_DB_URL` is not available as an environment variable, construct it from the project ref and instruct the user to confirm their database password:

```
postgresql://postgres:[YOUR-DB-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

After the migration runs successfully, confirm to the user that tables have been created and seed data has been loaded.

---

### Step 4 — Initialize the React project

**4a. Scaffold the project**

Create a new Vite + React + TypeScript project in the current directory:

```bash
npm create vite@latest . -- --template react-ts
```

Accept any prompts to overwrite existing files (your markdown and design files are in subdirectories and will not be affected).

**4b. Install dependencies**

Install only these packages — no others without explicit user approval:

```bash
npm install @supabase/supabase-js zustand zod
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**4c. Configure Tailwind**

Set up `tailwind.config.ts` with the design tokens from `design/hometap-design-spec.md`. Map every CSS custom property to a named Tailwind token. The token mapping must include at minimum:

Colors: `primary`, `primary-dark`, `primary-light`, `teal`, `teal-light`, `text-primary`, `text-secondary`, `text-disabled`, `border`, `border-light`, `bg-page`, `bg-card`, `bg-selected`, `error`, `error-bg`, `success`, `success-bg`, `warning`, `rating`

Font family: `sans` → DM Sans

Border radius: `sm` (6px), `md` (10px), `lg` (16px), `xl` (24px), `full` (9999px)

Box shadow: `card`, `focus`

**4d. Add Google Fonts**

Add the DM Sans font import to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

**4e. Configure the viewport**

Add to `index.html` `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
```

---

### Step 5 — Build the folder structure

Create the complete folder structure as defined in `docs/SPEC.md` Section 3 before writing any component code. Create empty placeholder files (with a one-line comment noting what goes there) for every file in the structure. This ensures the structure is correct before any implementation begins.

Confirm the structure is in place before moving to Step 6.

---

### Step 6 — Build in this exact order

Build the application in the following sequence. Complete each item fully before starting the next. After completing each item, propose a logical commit message and ask the user if they'd like to commit before continuing.

**6a. Foundation layer**
1. `src/lib/supabaseClient.ts` — Supabase client initialization with env var validation
2. `src/lib/demoPartners.ts` — hardcoded demo partner constants (UUIDs and display data)
3. `src/types/index.ts` — all TypeScript interfaces from SPEC.md Section 8
4. `src/lib/validation.ts` — Zod schema for ReferralFormData (presence check only, with FUTURE comment for field-level validation)
5. `src/lib/fetchPartnerData.ts` — single read function with all four queries from SPEC.md
6. `src/lib/submitLead.ts` — single write function with all three INSERT operations from SPEC.md
7. `src/store/useAppStore.ts` — Zustand store with full shape from SPEC.md Section 9

**6b. Shared UI primitives** (reference `design/hometap-component-kit.html` for each)
1. `src/components/ui/Button.tsx` — primary and secondary variants
2. `src/components/ui/StatusBadge.tsx` — color-coded status pill
3. `src/components/ui/TopBar.tsx` — screen header with label, name, avatar
4. `src/components/ui/BottomNav.tsx` — 3-tab nav bar with active state prop
5. `src/components/ui/FAB.tsx` — floating action button with no-op on Refer screen

**6c. Screen: Login** (reference `design/screen-01-login.html`)
- Partner selector buttons with avatar initials
- Hometap logo as inline SVG (paths from screen-01-login.html)
- Loading state during `fetchPartnerData`
- Trust pills and demo mode note

**6d. Screen: Pipeline** (reference `design/screen-02-pipeline.html`)
- `MetricTiles.tsx` — 2×2 grid with derived calculations from SPEC.md
- `LeadCard.tsx` — single lead card with all fields
- `LeadList.tsx` — scrollable list with section header and count
- Pipeline screen assembly

**6e. Screen: Refer** (reference `design/screen-03-refer.html`)
- `UseCaseAccordion.tsx` — full expand/collapse behavior from the JS in screen-03-refer.html
- `ReferralForm.tsx` — complete single-page form with sticky submit bar
- Form state management using local React state (not Zustand — form data is transient)
- On submit: call `submitLead`, navigate to Confirmation on success

**6f. Screen: Confirmation** (reference `design/screen-04-confirmation.html`)
- Success circle with pop animation (CSS keyframe)
- Referral summary card using `pendingReferral` from store
- 4-step "what happens next" timeline
- Both CTAs wired to navigation

**6g. Screen: Prospect Detail** (reference `design/screen-05-prospect-detail.html`)
- `StatusHero.tsx` — current status badge, last updated, next step pill
- `LeadSummaryCard.tsx` — info rows
- `StatusTimeline.tsx` — completed vs pending states, connector lines, $500 fee on final row
- Back button wired to Pipeline

**6h. Screen: Account** (reference `design/screen-06-account.html`)
- Profile hero with partner data from store
- Contact and payout info cards
- Earnings summary grid (same derived calculations as MetricTiles)
- Sign out wired to `clearPartner()` and navigate to Login

**6i. App shell and wiring**
- `App.tsx` — reads `currentScreen` from store, renders the correct screen
- Verify all navigation transitions work end to end
- Verify FAB behavior on every screen

---

### Step 7 — Vercel deployment

**7a. Install Vercel CLI if not present:**
```bash
npm install -g vercel
```

**7b. Deploy:**
```bash
vercel
```

Follow prompts. When asked about framework preset, select Vite.

**7c. Set environment variables in Vercel:**

After the initial deploy, add the environment variables to Vercel so the production build works:

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

Then redeploy:
```bash
vercel --prod
```

**7d. Confirm the deployed URL works end to end:**
- Login screen loads
- Both partner logins work
- Pipeline shows seeded data
- Referral form submits and creates a row in Supabase
- Confirmation screen shows
- Pipeline refreshes to show the new lead

---

### Step 8 — Update CURRENT_STATE.md

After a successful deployment, update `docs/CURRENT_STATE.md` to reflect the current state of the application. Include:
- All tables created and their column names
- Environment variables in use
- Vercel deployment URL
- Current phase and what is working
- Any known issues or deviations from the spec

---

### Important reminders before you begin

- Read CLAUDE.md first. Its rules govern this entire session.
- Never hardcode Supabase credentials. Always use `import.meta.env`.
- `submitLead.ts` is the ONLY file that writes to the database.
- `fetchPartnerData.ts` is the ONLY file that reads from the database.
- No other file may import `supabaseClient.ts`.
- Reference the design HTML files for every screen — do not invent layout or styling.
- Ask before installing any package not listed in Step 4b.
- Ask before modifying the folder structure.
- Ask before any change that touches more than 3 files simultaneously.
- Propose a commit after each discrete unit of work in Step 6.

---

Begin with Step 1 now.
