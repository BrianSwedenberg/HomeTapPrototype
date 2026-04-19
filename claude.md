# CLAUDE.md — Project Instructions

> This file is read automatically by Claude Code at the start of every session.
> Follow these instructions for the entire session unless explicitly overridden by the user in the prompt.

---

## 1. First Steps — Every Session

Before writing any code, do the following in order:

1. Read `SPEC.md` in full
2. Check the current phase in `SPEC.md` and confirm which backend is active
3. Review the relevant Stitch export in `/designs/` if working on a UI step
4. Confirm your understanding of the task with a one-sentence summary before starting

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
- No inline styles — all styling via Tailwind classes from the Stitch export

### Naming
- Be descriptive. `handleStepAdvance` not `handleClick`. `isSubmitting` not `flag`
- Booleans always prefixed: `is`, `has`, `can`, `should`
- Event handlers always prefixed: `handle`
- Custom hooks always prefixed: `use`

### No spaghetti
- No prop drilling beyond two levels — use the Zustand store
- No component should import from another component's folder
- Shared utilities live in `src/lib/`, shared types in `src/types/`, shared UI in `src/components/ui/`
- `submitLead.ts` is the only file that may reference the backend endpoint

---

## 4. Performance Standards

- **Bundle target:** under 80KB gzipped for the embed build
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

- Design source of truth is the Stitch export in `/designs/`
- For each step, reference `code.html` for Tailwind classes and `DESIGN.md` for rationale
- Do not invent colors, spacing, or typography — derive everything from the export
- If a design detail is ambiguous: check `DESIGN.md` → check `screen.png` → use best judgment and leave a `// DESIGN QUESTION:` comment

---

## 6. Folder Structure

> Do not create files outside this structure without asking first.

```
src/
├── components/
│   ├── steps/        # One file per form step, named Step01___.tsx etc.
│   └── ui/           # Shared primitives: Button, Card, ProgressBar, Input, etc.
├── hooks/            # Custom hooks, one per file
├── store/            # Zustand store(s)
├── lib/
│   ├── submitLead.ts # Only file that touches the backend
│   └── validation.ts # Zod schemas
├── types/            # Shared TypeScript interfaces and types
└── App.tsx
```

---

## 7. Before Making Any Significant Change

**Stop and ask the user before proceeding if the change involves any of the following:**

- Modifying the folder structure
- Installing a new dependency
- Changing the submission logic in `submitLead.ts`
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

## 8. Git Discipline

- Do not run `git commit` or `git push` unless explicitly asked
- Do not create new branches unless explicitly asked
- Do suggest logical commit points and propose a commit message when a discrete unit of work is complete

---

## 9. When You're Unsure

- Do not guess at business logic — ask
- Do not guess at design intent — leave a `// DESIGN QUESTION:` comment
- Do not guess at data schema — leave a `// ASSUMPTION:` comment with your reasoning
- A short clarifying question is always better than 100 lines of wrong code

---

## 10. Documentation Workflow

### Notion
When completing a feature, module, or significant code change, create or update the corresponding Notion page. Include: what was built, key decisions made, and any known limitations. Use the structure: Summary → Technical Details → Open Questions.

> Add your project's Notion workspace URLs here before starting.

### CURRENT_STATE.md — Source of Truth
There is a `CURRENT_STATE.md` file in the `/docs/` directory. It is the single source of truth for the current state of the application. Always read it at the start of any session before doing anything else.

**When to update it** — at the end of every task, or any time you make a change that affects:
- The database schema (columns added, types changed, RLS policies updated)
- The API or submission endpoint
- Environment variables or configuration
- The deployment state
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