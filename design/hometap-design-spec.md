# CLAUDE.md — Project Instructions

> This file is read automatically by Claude Code at the start of every session.
> Follow these instructions for the entire session unless explicitly overridden by the user in the prompt.

---

## 1. First Steps — Every Session

Before writing any code, do the following in order:

1. Read `SPEC.md` in full
2. Check the current phase in `SPEC.md` and confirm which backend is active
3. Review the relevant design files in `/designs/` if working on a UI step
4. Read `docs/CURRENT_STATE.md` to confirm the current working state of the app
5. Confirm your understanding of the task with a one-sentence summary before starting

---

## 2. Current Phase

> **Fill this in at the start of each project.**
>
> - State the active phase and what it covers
> - Identify the active backend/submission path
> - Note any paths or patterns that should NOT be used

---

## 3. Code Quality Standards

These are non-negotiable. Every file committed must meet these standards.

### Clarity
- Code should read like plain English where possible
- Prefer explicit over clever — no one-liners that require deciphering
- Every function should do exactly one thing
- If a comment is needed to explain *what* code does, rewrite the code. Comments explain *why*, not *what*

### Component design
- One component per file, no exceptions
- Components should be small and focused — if a component is doing more than one job, split it
- No business logic inside JSX — extract to a hook or utility function
- No inline styles — all styling via Tailwind classes, derived from the design tokens in `/designs/`

### Naming
- Be descriptive. `handleStepAdvance` not `handleClick`. `isSubmitting` not `flag`
- Booleans always prefixed: `is`, `has`, `can`, `should`
- Event handlers always prefixed: `handle`
- Custom hooks always prefixed: `use`

### No spaghetti
- No prop drilling beyond two levels — use the Zustand store
- No component should import from another component's folder
- Shared utilities live in `src/lib/`, shared types in `src/types/`, shared UI in `src/components/ui/`
- `submitLead.ts` is the only file that may reference the Supabase client for writes

---

## 4. Performance Standards

- Lazy-initialize the Supabase client — do not import it at the top level
- Use CSS transforms only for animations — never animate `height`, `width`, `top`, `left`
- No animation should exceed 300ms duration
- Do not install a new dependency to solve a problem that can be solved in under 20 lines of native code
- Before installing any new package, state its name, purpose, and approximate bundle size impact

### Dependency additions
> Before running `npm install` for any package not already in `SPEC.md`:
> 1. Stop and flag it to the user
> 2. Explain what it's for and why it's needed
> 3. State the approximate bundle size impact
> 4. Wait for approval

---

## 5. Design Implementation

### Source of truth
The `/designs/` directory is the canonical reference for all visual implementation decisions.
It contains two files:

| File | Purpose |
|------|---------|
| `DESIGN_SPEC.md` | Full design system: colors, typography, spacing, component specs, UX patterns, microcopy standards |
| `hometap-component-kit.html` | Rendered component library with copy-paste HTML/CSS for every UI primitive |

### Rules
- Do not invent colors, spacing, or typography — derive everything from `DESIGN_SPEC.md` tokens
- For any component, check `hometap-component-kit.html` first — if it exists there, use it as the implementation reference
- All Tailwind classes should map to the CSS custom properties defined in `DESIGN_SPEC.md`
- If a design detail is ambiguous: check `DESIGN_SPEC.md` → check `hometap-component-kit.html` → use best judgment and leave a `// DESIGN QUESTION:` comment

---

## 6. Environment Variables

### Required variables
All environment variables must live in `.env.local` at the project root. This file is **never committed** — confirm `.env.local` is in `.gitignore` before doing anything else.

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Rules
- Never hardcode a Supabase URL, anon key, or any credential anywhere in source code
- Never log environment variables to the console
- All `import.meta.env.*` references must be isolated in `src/lib/supabaseClient.ts` — no other file reads env vars directly
- If an expected env var is missing at runtime, throw a descriptive error immediately rather than failing silently later

### Demo partner IDs
The two demo partner UUIDs are not secrets — they are seeded constants from the migration and may be defined as named constants in `src/lib/demoPartners.ts`:

```ts
export const DEMO_PARTNERS = {
  contractor:       '11111111-1111-1111-1111-111111111111',
  realEstateAgent:  '22222222-2222-2222-2222-222222222222',
} as const;
```

---

## 7. Folder Structure

> Do not create files outside this structure without asking first.

```
src/
├── components/
│   ├── dashboard/    # Dashboard-specific components (ReferralTable, StatusBadge, etc.)
│   ├── referral/     # Referral form steps and confirmation screen
│   └── ui/           # Shared primitives: Button, Card, Input, Modal, etc.
├── hooks/            # Custom hooks, one per file
├── store/            # Zustand store(s)
├── lib/
│   ├── supabaseClient.ts  # Only file that initializes the Supabase client
│   ├── submitLead.ts      # Only file that writes leads to the database
│   ├── fetchLeads.ts      # Only file that reads leads from the database
│   ├── demoPartners.ts    # Hardcoded demo partner UUIDs and display metadata
│   └── validation.ts      # Zod schemas
├── types/            # Shared TypeScript interfaces and types
└── App.tsx

designs/
├── DESIGN_SPEC.md
└── hometap-component-kit.html

docs/
└── CURRENT_STATE.md
```

---

## 8. Before Making Any Significant Change

**Stop and ask the user before proceeding if the change involves any of the following:**

- Modifying the folder structure
- Installing a new dependency
- Changing any logic in `submitLead.ts` or `supabaseClient.ts`
- Refactoring a component that is already working
- Changing the Zustand store shape
- Modifying `vite.config.ts`
- Any change that touches more than 3 files simultaneously

**When asking, always provide:**

1. **What** — a plain-English description of the proposed change
2. **Why** — the specific reason this change is necessary or beneficial
3. **Scope** — which files will be created, modified, or deleted
4. **Risk** — anything that could break or regress as a result

Do not proceed until the user explicitly approves. "Looks good" or "go ahead" is sufficient approval.

---

## 9. Git Discipline

- Do not run `git commit` or `git push` unless explicitly asked
- Do not create new branches unless explicitly asked
- Do suggest logical commit points and propose a commit message when a discrete unit of work is complete

---

## 10. When You're Unsure

- Do not guess at business logic — ask
- Do not guess at design intent — leave a `// DESIGN QUESTION:` comment
- Do not guess at data schema — leave a `// ASSUMPTION:` comment with your reasoning
- A short clarifying question is always better than 100 lines of wrong code

---

## 11. CURRENT_STATE.md — Source of Truth

There is a `CURRENT_STATE.md` file in the `/docs/` directory. It is the single source of truth for the current state of the application. Always read it at the start of any session before doing anything else.

**When to update it** — at the end of every task, or any time you make a change that affects:
- The database schema (columns added, types changed, RLS policies updated)
- The Supabase client configuration or environment variable names
- The deployment state (Vercel URL, environment, branch)
- TypeScript types or interfaces that reflect the data model
- Any completed milestone or phase

**How to update it:**
- Edit in place — do not append a history log, do not create dated entries
- It should always reflect right now, not a timeline of changes
- Be specific: column names, types, nullability — not just "schema was updated"
- If something was removed, remove it from the doc too
- Keep it concise. It is a briefing document, not a narrative

**What does not belong in CURRENT_STATE.md:**
- Reasons why decisions were made (that lives in `SPEC.md`)
- Task lists or to-dos (keep those in the phase task file)
- Anything speculative or in-progress — only confirmed, working state