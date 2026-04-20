# Hometap Lead Form — Design System & UX Specification
**Version 1.0 | April 2026**
*Derived from hometap.com, the live pre-qualification flow at go.hometap.com/inquiry, and the Principal PM Growth case study appendix screenshots (pages 4–5). Intended as the canonical reference for any reimagined or extended version of the Hometap lead form.*

---

## Table of Contents

1. [Brand Identity & Voice](#1-brand-identity--voice)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Layout System](#4-spacing--layout-system)
5. [Component Specifications](#5-component-specifications)
6. [Form UX Patterns & Flow Logic](#6-form-ux-patterns--flow-logic)
8. [Motion & Animation](#8-motion--animation)
9. [Accessibility Standards](#9-accessibility-standards)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [Content & Microcopy Standards](#11-content--microcopy-standards)
12. [Trust Signal Placement](#12-trust-signal-placement)
13. [Implementation Notes for Claude Code](#13-implementation-notes-for-claude-code)

---

## 1. Brand Identity & Voice

### Core Positioning
Hometap offers Home Equity Investments (HEIs) — a no-monthly-payment alternative to HELOCs and home equity loans. The lead form is the single most critical conversion surface. Every design decision should reduce perceived risk and cognitive load while reinforcing that this is a trustworthy, modern financial product.

### Voice & Tone in Forms
- **Conversational, not clinical.** Speak like a knowledgeable friend. "What's your home address?" not "Enter subject property address."
- **Progress-affirming.** Every step completion gets a small win. "Great, almost there." "You're in good shape."
- **Honest about what's happening.** When asking for a SSN for a soft pull, explain it plainly: "This won't affect your credit score."
- **Empowering language.** The homeowner is making a smart financial choice, not applying for a loan. Reinforce agency.
- **Short sentences.** No sentence in a form label or helper text should exceed 12 words.

### Logo
- Full lowercase wordmark + teal house-arrow icon
- Appears top-left in the form header, always on white
- Minimum height: 28px; minimum clear space 16px all sides
- Do not recolor, stretch, or place on purple/busy backgrounds

---

## 2. Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#6B3FA0` | CTA buttons, active step indicator, focus rings, selected card borders |
| `--color-primary-dark` | `#4E2D7A` | Button hover/pressed state |
| `--color-primary-light` | `#EDE7F6` | Selected card fill, soft highlights |
| `--color-teal` | `#00B3A4` | Icon accents, logo mark, success checkmarks, trust badges |
| `--color-teal-light` | `#E0F7F5` | Success state backgrounds, confirmation banners |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#1A1A2E` | All headings, primary labels, key content |
| `--color-text-secondary` | `#5C5C7A` | Helper text, sublabels, tooltips |
| `--color-text-disabled` | `#AAAAAA` | Disabled inputs, placeholder text |
| `--color-border` | `#D0D0E0` | Input borders (rest), card borders (unselected) |
| `--color-border-focus` | `#6B3FA0` | Input/card borders (focused or selected) |
| `--color-bg-page` | `#F7F6FC` | Full page background — very light purple tint |
| `--color-bg-card` | `#FFFFFF` | Form card surface |
| `--color-bg-selected` | `#EDE7F6` | Selected radio card background |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-error` | `#C62828` | Inline validation errors, error icons |
| `--color-error-bg` | `#FFEBEE` | Error state input background tint |
| `--color-success` | `#2E7D32` | Confirmation, "Good news!" banners |
| `--color-success-bg` | `#E8F5E9` | Success banner backgrounds |
| `--color-warning` | `#E65100` | Non-blocking advisory notices |
| `--color-rating` | `#F4B400` | Trustpilot star color |

### CSS Custom Properties (full block, paste into `:root`)
```css
:root {
  /* Primary */
  --color-primary:        #6B3FA0;
  --color-primary-dark:   #4E2D7A;
  --color-primary-light:  #EDE7F6;
  --color-teal:           #00B3A4;
  --color-teal-light:     #E0F7F5;

  /* Text */
  --color-text-primary:   #1A1A2E;
  --color-text-secondary: #5C5C7A;
  --color-text-disabled:  #AAAAAA;

  /* Borders & Backgrounds */
  --color-border:         #D0D0E0;
  --color-border-focus:   #6B3FA0;
  --color-bg-page:        #F7F6FC;
  --color-bg-card:        #FFFFFF;
  --color-bg-selected:    #EDE7F6;

  /* Semantic */
  --color-error:          #C62828;
  --color-error-bg:       #FFEBEE;
  --color-success:        #2E7D32;
  --color-success-bg:     #E8F5E9;
  --color-warning:        #E65100;
  --color-rating:         #F4B400;
}
```

---

## 3. Typography

### Font Stack

| Role | Family | Fallback | Weight(s) |
|------|--------|----------|-----------|
| **Display / Headings** | `DM Sans` | `system-ui, sans-serif` | 500, 700 |
| **Body / Labels** | `DM Sans` | `system-ui, sans-serif` | 400, 500 |
| **Monospace / Legal** | `DM Mono` | `monospace` | 400 |

> **Note:** The live Hometap site uses a geometric sans-serif consistent with DM Sans or similar. DM Sans is specified here as it closely matches the visual character: geometric, friendly, slightly rounded. If Hometap's actual brand font is licensed differently, substitute accordingly — the weight/size scale below still applies.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-xs` | 11px | 16px | 400 | Legal footnotes, fine print |
| `--text-sm` | 13px | 20px | 400 | Helper text, sublabels |
| `--text-base` | 15px | 24px | 400 | Body copy, input text |
| `--text-md` | 17px | 26px | 500 | Option labels, sub-headings |
| `--text-lg` | 20px | 28px | 500 | Step headings, card titles |
| `--text-xl` | 24px | 32px | 700 | Primary form question / page title |
| `--text-2xl` | 30px | 38px | 700 | Result screen headline ("You could get up to $173,000") |
| `--text-3xl` | 38px | 46px | 700 | Marketing hero (outside form) |

### CSS Custom Properties
```css
:root {
  --font-primary:   'DM Sans', system-ui, sans-serif;
  --font-mono:      'DM Mono', monospace;

  --text-xs:    11px;
  --text-sm:    13px;
  --text-base:  15px;
  --text-md:    17px;
  --text-lg:    20px;
  --text-xl:    24px;
  --text-2xl:   30px;
  --text-3xl:   38px;

  --leading-tight:  1.2;
  --leading-normal: 1.6;
  --leading-loose:  1.8;

  --weight-regular: 400;
  --weight-medium:  500;
  --weight-bold:    700;
}
```

---

## 4. Spacing & Layout System

### Base Unit
All spacing uses an **8px base grid**. Values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px.

### Form Card Constraints

| Property | Value |
|----------|-------|
| Max width | 520px |
| Min width | 320px |
| Padding (desktop) | 40px |
| Padding (mobile) | 24px |
| Border radius | 16px |
| Box shadow | `0 4px 24px rgba(107,63,160,0.08)` |
| Background | `#FFFFFF` |

### Form Header (logo + progress bar strip)
- Height: 64px
- Background: white
- Bottom border: `1px solid var(--color-border)`
- Logo: left-aligned, 28px height
- Progress bar: full width below logo row, 4px height

### Question Area within Card
- Question heading: `--text-xl`, bold, `var(--color-text-primary)`
- Sub-question / helper: `--text-sm`, `var(--color-text-secondary)`, 8px below heading
- Options area: 16px below heading
- Gap between radio card options: 10px
- Gap between stacked text inputs: 16px
- CTA button: 24px below last input

### Spacing Tokens
```css
:root {
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;

  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-full: 9999px;

  --shadow-card: 0 4px 24px rgba(107,63,160,0.08);
  --shadow-focus: 0 0 0 3px rgba(107,63,160,0.20);
}
```

---

## 5. Component Specifications

### 5.1 Primary CTA Button

**Purpose:** Advance to the next step. One per screen, always bottom of card.

| Property | Value |
|----------|-------|
| Height | 52px |
| Min width | 200px |
| Width (form context) | 100% of card content width |
| Background | `var(--color-primary)` = `#6B3FA0` |
| Background (hover) | `var(--color-primary-dark)` = `#4E2D7A` |
| Background (disabled) | `#C4B5D9` |
| Text | White, `--text-md`, `--weight-bold` |
| Border radius | `--radius-full` (pill shape, matching live form) |
| Cursor (disabled) | `not-allowed` |
| Transition | `background 180ms ease, transform 100ms ease` |
| Active transform | `scale(0.98)` |
| Focus ring | `var(--shadow-focus)` |

**States:** Default → Hover → Active → Loading (spinner replaces text) → Disabled

**Copy convention:** Verb-first, short. "Continue", "Get My Estimate", "Submit Application". Never "Next" or "Click Here".

---

### 5.2 Secondary / Back Button

| Property | Value |
|----------|-------|
| Appearance | Text-only or ghost (no fill) |
| Color | `var(--color-text-secondary)` |
| Hover | Underline + `var(--color-primary)` color |
| Placement | Left of or above primary CTA |
| Icon | Left-pointing chevron `‹` |

---

### 5.3 Text Input

| Property | Value |
|----------|-------|
| Height | 52px |
| Border | `1.5px solid var(--color-border)` |
| Border (focus) | `2px solid var(--color-border-focus)` |
| Border (error) | `2px solid var(--color-error)` |
| Border radius | `--radius-md` = 10px |
| Background | `#FFFFFF` |
| Background (error) | `var(--color-error-bg)` |
| Padding | `0 16px` |
| Font | `--text-base`, `--weight-regular` |
| Placeholder color | `var(--color-text-disabled)` |
| Label | Above input, `--text-sm`, `--weight-medium`, `var(--color-text-primary)`, 6px gap |
| Helper text | Below input, `--text-sm`, `var(--color-text-secondary)`, 4px gap |
| Error text | Below input, `--text-sm`, `var(--color-error)`, with ⚠ icon prefix |

**Floating label variant:** Used when vertical space is tight (address fields). Label floats to top of input on focus/fill.

---

### 5.4 Radio Card (Icon + Label)

Used for: property type, occupancy, use of funds, timeline options. This is the dominant input pattern in the pre-qual flow.

| Property | Value |
|----------|-------|
| Layout | Variable grid: 2-col for 4+ options, 1-col for 2–3 options |
| Height | Auto, min 56px |
| Padding | 14px 16px |
| Border | `1.5px solid var(--color-border)` |
| Border (selected) | `2px solid var(--color-primary)` |
| Background (default) | `#FFFFFF` |
| Background (selected) | `var(--color-bg-selected)` = `#EDE7F6` |
| Background (hover) | `#F5F0FC` |
| Border radius | `--radius-md` = 10px |
| Icon | Left-aligned, 24px, teal or purple |
| Label | `--text-md`, `--weight-medium`, `var(--color-text-primary)` |
| Sub-label | Optional, `--text-sm`, `var(--color-text-secondary)` |
| Selection indicator | Right-side radio dot (hidden when unselected, purple fill when selected) |
| Transition | `border-color 150ms, background 150ms` |
| Cursor | `pointer` |

**Accessibility:** Each card is a `<label>` wrapping a visually hidden `<input type="radio">`. The card gets `role="radio"` and `aria-checked`.

---

### 5.5 Checkbox

Used for: consent screens, multi-select options, terms acceptance.

| Property | Value |
|----------|-------|
| Size | 20px × 20px |
| Border | `1.5px solid var(--color-border)` |
| Border (checked) | `2px solid var(--color-primary)` |
| Background (checked) | `var(--color-primary)` |
| Checkmark | White SVG path |
| Border radius | `--radius-sm` = 6px |
| Label gap | 10px from checkbox |
| Label font | `--text-base`, `var(--color-text-primary)` |
| Required indicator | Red asterisk suffix on label |

---

### 5.6 Progress Indicator

**Design:** Thin continuous bar at top of the viewport (below header logo), not a segmented stepper. Simpler, less intimidating, works on mobile.

| Property | Value |
|----------|-------|
| Height | 4px |
| Background (track) | `var(--color-border)` |
| Fill color | `var(--color-primary)` |
| Transition | `width 400ms cubic-bezier(0.4, 0, 0.2, 1)` |
| Border radius | `--radius-full` |
| Step label | Optional, `--text-xs`, `var(--color-text-secondary)`, right-aligned above bar |

**Rationale for continuous bar over step pills:** The existing flow uses numbered steps which can signal a long process. A smooth progress bar feels faster and is less discouraging at the start.

---

### 5.7 Tooltip / Info Icon

Used alongside sensitive fields (SSN, debt balance, credit check consent).

| Property | Value |
|----------|-------|
| Trigger | `ⓘ` icon, `var(--color-text-secondary)`, 16px |
| Trigger hover color | `var(--color-primary)` |
| Panel max width | 260px |
| Panel background | `#1A1A2E` (dark) |
| Panel text | White, `--text-sm` |
| Panel radius | `--radius-md` |
| Padding | `10px 14px` |
| Shadow | `0 4px 12px rgba(0,0,0,0.2)` |
| Animation | Fade + 4px upward translate, 150ms |

---

### 5.8 Inline Validation

| State | Behavior |
|-------|----------|
| Pristine | No validation shown |
| Focused | No validation (don't interrupt) |
| Blurred (invalid) | Show error message below field with ⚠ icon |
| Blurred (valid) | Subtle green border only — no text if not needed |
| Submit attempted (invalid) | Scroll to first error, focus it, red border + message |

**Error messages** should be specific. "Please enter a valid ZIP code" not "Invalid input".

---

### 5.9 Estimate Result Card

Displayed at the end of the pre-qual flow. High-value, trust-building screen.

| Property | Value |
|----------|-------|
| Headline | `--text-2xl`, bold, e.g. "Jane, you could get up to **$173,000**" |
| Highlight amount | `var(--color-primary)`, `--text-2xl` or `--text-3xl` |
| Card background | Subtle gradient: `linear-gradient(145deg, #FFFFFF 60%, #EDE7F6 100%)` |
| Trust icons row | 3 icons: No monthly payments · No restrictions on use · Fast process |
| Icon size | 24px teal |
| Icon label | `--text-sm`, `var(--color-text-secondary)` |
| CTA | "Get Started" button (primary) + "Save my estimate" link (secondary) |
| Disclaimer | `--text-xs`, `var(--color-text-secondary)`, bottom of card |

---

### 5.10 "Good News!" Affirming Banner

Shown when property pre-qualifies (before identity collection).

| Property | Value |
|----------|-------|
| Background | `var(--color-success-bg)` = `#E8F5E9` |
| Border | `1px solid #A5D6A7` |
| Border radius | `--radius-md` |
| Icon | `✓` or house icon in `var(--color-success)` |
| Headline | `--text-md`, bold, `var(--color-success)` |
| Body | `--text-base`, `var(--color-text-primary)` |
| Padding | `16px 20px` |

---

## 6. Form UX Patterns & Flow Logic

### One Question Per Screen
Each screen presents **one primary question or closely-related question group**. Never mix unrelated questions on the same screen. Rationale: reduces cognitive load, increases completion rates, and allows progressive disclosure.

### Auto-Advance on Single Selection
For radio card screens with a single required selection (property type, occupancy, timeline), **auto-advance after 300ms delay** on selection. This creates a sense of momentum. Do NOT auto-advance on multi-select or any screen where the user might want to review before continuing.

### Progress Framing
- Show progress bar from step 1.
- Consider showing estimated time remaining ("About 90 seconds left") early in the flow.
- Never show total step count on the first screen — it can discourage entry.

### Exit Intent Handling
If a user starts to navigate away mid-flow, show a lightweight retention modal: "You're almost there — your estimate is ready in just a few more steps." Do not show on step 1.

### Field Pre-fill
Where possible (e.g., address autocomplete via Google Places API), pre-fill fields to reduce typing friction. Auto-populate city/state from ZIP.

### Conditional Step Logic
The flow should branch based on earlier answers:

| Condition | Modification |
|-----------|-------------|
| "I rent it out" (occupancy) | Show ineligibility notice; offer Home Equity Dashboard as fallback |
| "I own my home outright" (no mortgage) | Skip debt balance screen |
| "Not sure yet, still learning" (timeline) | Soften urgency in CTAs; offer email-capture variant |
| Use case = "Retirement" or "Other" | Surface the 16% HEI "Other" category; add retirement-specific messaging |
| Debt balance entered | On result screen, show estimated debt payoff impact |

### Error Recovery
If property is ineligible (wrong state, property type, etc.):
- Do not dead-end the user.
- Offer: Home Equity Dashboard signup, email notification when available in their state.

### Mobile Keyboard Behavior
- Numeric inputs (debt balance, SSN): trigger numeric keyboard (`inputmode="numeric"`)
- Phone number: trigger tel keyboard (`inputmode="tel"`)
- Email: trigger email keyboard (`type="email"`)
- Address: trigger autocomplete with `autocomplete="street-address"`

---

## 8. Motion & Animation

### Principles
- Motion should feel **purposeful**, not decorative.
- All transitions should complete in under **400ms**.
- Respect `prefers-reduced-motion` — disable all non-essential animations.

### Specific Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Screen transition (forward) | Slide in from right (32px) + fade | 280ms | `ease-out` |
| Screen transition (back) | Slide in from left (32px) + fade | 280ms | `ease-out` |
| Progress bar fill | Width transition | 400ms | `cubic-bezier(0.4,0,0.2,1)` |
| Radio card selection | Background + border color change | 150ms | `ease` |
| Button press | `scale(0.97)` | 100ms | `ease` |
| Error message appear | Fade + 4px downward translate | 200ms | `ease-out` |
| Tooltip appear | Fade + 4px upward | 150ms | `ease-out` |
| Estimate reveal | Count-up animation on dollar amount | 800ms | `ease-out` |
| Auto-advance delay | Visual pulse on selected card before advance | 300ms | N/A |

### CSS Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Accessibility Standards

### Target: WCAG 2.1 AA

| Requirement | Implementation |
|-------------|---------------|
| Color contrast (text) | All text ≥ 4.5:1 against background |
| Color contrast (large text) | ≥ 3:1 for 18px+ bold or 24px+ regular |
| Focus visible | `var(--shadow-focus)` ring on all interactive elements |
| Keyboard navigation | All interactive elements reachable by Tab; radio cards navigable with arrow keys |
| Screen reader labels | Every input has associated `<label>`; icon-only buttons have `aria-label` |
| Error announcements | Errors added to an `aria-live="polite"` region |
| Form groups | Related fields (`<fieldset>` + `<legend>`) for radio groups |
| Auto-advance | Must be cancellable / overridable; announce screen change to screen reader |
| Tooltip | Triggered by hover AND focus; dismissed with Escape |
| Color alone | Never use color as the only error indicator — always pair with icon + text |

### Semantic HTML Checklist
- `<form>` wrapper with `novalidate` (JS validation handles errors)
- Each step is a `<fieldset>` with `<legend>` matching the visual question heading
- Radio cards use `<input type="radio">` inside `<label>`, not `div` click handlers
- Progress bar uses `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Error messages use `role="alert"` or `aria-describedby` linking to field

---

## 10. Responsive Breakpoints

| Breakpoint | Token | Width | Behavior |
|------------|-------|-------|----------|
| Mobile S | `--bp-xs` | < 360px | Single column; reduce padding to 16px |
| Mobile | `--bp-sm` | 360–599px | Single column; card fills viewport width with 16px margins |
| Tablet | `--bp-md` | 600–899px | Card centered, max 520px; padding 32px |
| Desktop | `--bp-lg` | 900–1199px | Card centered, max 520px; padding 40px; optional right-side trust panel visible |
| Wide | `--bp-xl` | ≥ 1200px | Two-column option: form card left, contextual imagery/copy right |

### Mobile-Specific Adjustments
- Radio card grid collapses from 2-col to 1-col
- Sticky CTA button at bottom of viewport on small screens (not inside card scroll)
- Touch targets minimum 44×44px on all interactive elements
- No hover-dependent interactions — tooltip triggers on tap

### Two-Column Layout (Desktop ≥ 1200px)
The right panel can surface contextual content based on the current step:
- Step 1–5 (property): Photo of a nice home + Trustpilot rating
- Step 6 (use case): Use-case-specific photography (e.g., kitchen renovation, debt freedom)
- Step 13 (SSN): Security badge + explanation of soft pull
- Step 14 (result): Customer testimonial matching their use case

---

## 11. Content & Microcopy Standards

### Question Headlines
- Written as direct questions: "What type of property is it?" not "Property Type"
- Title case, no trailing punctuation except `?`
- Maximum 8 words

### Option Labels
- Noun phrases, sentence case: "Single-family home" not "SINGLE FAMILY HOME"
- Sub-labels in parentheses for clarification: "Co-op (shared ownership building)"

### Helper Text
- Use sparingly — only when the field has a non-obvious requirement
- Positive framing: "We only need a rough estimate" not "Don't leave this blank"
- Never repeat what the label already says

### CTA Copy by Step

| Step Type | CTA Text |
|-----------|----------|
| First step | "Get My Estimate" |
| Middle steps | "Continue" |
| Before result reveal | "Show My Estimate" |
| Full application start | "Start My Application" |
| Final application submit | "Submit Application" |

### Error Messages

| Field | Error | Message |
|-------|-------|---------|
| Address | Not found | "We couldn't find that address. Try entering it manually." |
| Address | Ineligible state | "We're not in [State] yet. Join our waitlist to be notified." |
| Debt balance | Non-numeric | "Please enter numbers only, no commas or symbols." |
| SSN | Invalid format | "Please enter your 9-digit Social Security Number." |
| Email | Invalid | "Please enter a valid email address (e.g., you@example.com)." |
| Phone | Invalid | "Please enter a 10-digit US phone number." |

### Consent Copy (Soft Credit Pull)
```
By checking this box, I authorize Hometap to obtain information
from credit bureaus, including a full credit inquiry ("hard pull")
solely for the purpose of processing my Investment application.
I understand this is not an application for credit and will not
impact my credit score.
```
> Always link "Privacy Policy" and "Terms of Use" inline.

---

## 12. Trust Signal Placement

Trust signals are critical for a financial product. Place them contextually — not just on the result screen.

| Location | Trust Signal |
|----------|-------------|
| Form header (all steps) | Trustpilot rating pill: ★★★★★ 4.8 / 5 · 2,000+ reviews |
| Step 1 | "Takes less than 2 minutes" |
| Step 12 (consent) | "Soft pull only — no impact to your credit score" + lock icon |
| Step 13 (SSN) | "256-bit SSL encrypted" + "We never sell your information" |
| Result screen | 3 trust icons: No monthly payments · No restrictions on use · No prepayment penalty |
| Result screen | Customer testimonial (name, city, use case) |
| All screens | Security lock icon in footer |

### Trustpilot Pill Component
```
[ ★★★★★  4.8 / 5  ·  Trustpilot ]
```
- Background: `#F9F9F9`
- Border: `1px solid var(--color-border)`
- Star color: `var(--color-rating)` = `#F4B400`
- Font: `--text-sm`, `--weight-medium`
- Border radius: `--radius-full`
- Padding: `6px 12px`

---

## 13. Implementation Notes for Claude Code

These notes are specifically for the implementing developer (or AI agent).

### Technology Assumptions
- React (functional components with hooks)
- CSS Modules or Tailwind CSS utility classes (token values above map to both)
- Google Places API for address autocomplete
- No external component library — build from primitives per spec

### Component File Structure (Recommended)
```
/src
  /components
    /form
      FormShell.jsx          # Header, progress bar, card wrapper
      StepRouter.jsx         # Manages current step, direction, history
      FormCard.jsx           # White card container with shadow
      ProgressBar.jsx        # Thin top bar with animated fill
    /inputs
      RadioCardGroup.jsx     # Grid of radio cards
      RadioCard.jsx          # Individual card with icon + label
      TextInput.jsx          # Label + input + helper/error
      AddressInput.jsx       # Address with Places autocomplete
      CheckboxConsent.jsx    # Checkbox with rich label/links
      MaskedInput.jsx        # SSN / phone masking
    /ui
      Button.jsx             # Primary + secondary variants
      Tooltip.jsx            # ⓘ icon with popover
      TrustPill.jsx          # Trustpilot / trust signal badges
      EstimateCard.jsx       # Result screen card
      AffirmingBanner.jsx    # "Good news!" green banner
      InlineError.jsx        # Error message component
  /hooks
    useFormFlow.js           # Step navigation, state, validation
    useAddressLookup.js      # Google Places wrapper
  /styles
    tokens.css               # All CSS custom properties from this spec
  /data
    steps.js                 # Step config: id, component, validation rules
```

### State Management
Use a single form state object at the top level, passed via Context or prop drilling. Recommended shape:
```js
{
  address: { street, city, state, zip },
  propertyType: '',
  occupancy: '',
  hasMortgage: null,
  debtBalance: '',
  useCase: '',
  timeline: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  howHeard: '',
  ssnLast4: '',
  creditCheckConsent: false,
  currentStep: 1,
  stepHistory: [],
  estimate: null
}
```

### Validation Library
Use `zod` for schema validation per step, or simple inline validators if keeping dependencies minimal.

### Animation
Use CSS transitions (specified in Section 8) rather than a JS animation library. For the estimate count-up, a simple `requestAnimationFrame` loop is sufficient.

### Key Accessibility Implementation Points
1. On step change: move focus to the `<legend>` or `<h1>` of the new step
2. On error: move focus to the first invalid field
3. Auto-advance: set a `setTimeout` of 300ms, cancelable if user begins interacting with another element
4. All `<input>` elements must have explicit `id` attributes matching `<label htmlFor=...>`

---

*End of Specification — Version 1.0*
*Reference companion: `hometap-component-kit.html` for rendered components and copy-paste code snippets.*
