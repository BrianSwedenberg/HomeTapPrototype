# Hometap Partner Referral Platform — Database Schema
**Version 1.0 | April 2026**
*Supabase / PostgreSQL*

---

## Overview

This schema extends Hometap's existing lead capture tables (`Leads`, `Leads_Metadata`) with three new tables to support the partner referral platform:

- `partners` — the referring professionals (contractors, RE agents)
- `referral_statuses` — normalized lookup table for pipeline stages
- `referral_status_history` — append-only log of every status transition per lead

The existing `Leads` and `Leads_Metadata` tables are preserved exactly as-is, with two additive columns on `Leads`: `partner_id`, `referral_status_id`, `use_case`, and `notes`.

---

## Entity Relationship Summary

```
partners
  └── Leads (one partner → many leads)
        └── Leads_Metadata (one lead → one metadata row)
        └── referral_status_history (one lead → many history rows)

referral_statuses
  └── Leads (one status → many leads, current status)
  └── referral_status_history (one status → many history rows)
```

---

## Tables

### `partners`
Stores the two demo partner accounts. No auth — partner identity is passed via app state.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique partner ID |
| `name` | `text` | NOT NULL | Partner full name or business name |
| `email` | `text` | NOT NULL, UNIQUE | Partner contact email |
| `phone` | `text` | | Partner phone number |
| `partner_type` | `text` | NOT NULL | Enum-like: `'contractor'` or `'real_estate_agent'` |
| `company_name` | `text` | | Business/brokerage name |
| `created_at` | `timestamptz` | default `now()` | Record creation timestamp |

**Seed data (two demo partners):**
| id | name | partner_type | company_name |
|----|------|-------------|--------------|
| *(generated)* | Marcus Webb | `contractor` | Webb & Sons Home Improvement |
| *(generated)* | Sarah Okonkwo | `real_estate_agent` | Okonkwo Investment Realty |

---

### `referral_statuses`
Normalized lookup table for all pipeline stages. Decouples status labels/display from lead records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `int` | PK | Numeric ID, matches sort order |
| `slug` | `text` | NOT NULL, UNIQUE | Machine-readable key (used in app logic) |
| `label` | `text` | NOT NULL | Human-readable display label |
| `description` | `text` | | Tooltip/helper description for dashboard |
| `sort_order` | `int` | NOT NULL | Controls pipeline column order |
| `is_terminal` | `bool` | default `false` | True = no further status transitions expected |
| `color_hex` | `text` | | Dashboard badge color (hex string) |

**Seed data:**
| id | slug | label | is_terminal | color_hex |
|----|------|-------|-------------|-----------|
| 1 | `submitted` | Submitted | false | `#6B3FA0` |
| 2 | `contacted` | Contacted | false | `#00B3A4` |
| 3 | `pre_qual_complete` | Pre-Qual Complete | false | `#1565C0` |
| 4 | `application_started` | Application Started | false | `#E65100` |
| 5 | `application_approved` | Application Approved | false | `#2E7D32` |
| 6 | `application_rejected` | Application Rejected | true | `#C62828` |
| 7 | `closed` | Closed | false | `#1A237E` |
| 8 | `paid` | Paid | true | `#1B5E20` |

---

### `referral_status_history`
Append-only log of every status change for a lead. Powers the timeline view on the prospect detail screen.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique history entry ID |
| `lead_id` | `int` | NOT NULL, FK → `Leads.LeadID` | The lead this event belongs to |
| `status_id` | `int` | NOT NULL, FK → `referral_statuses.id` | The status that was set |
| `changed_at` | `timestamptz` | default `now()` | When the transition occurred |
| `changed_by` | `text` | | Free text: system, partner name, admin, etc. |
| `note` | `text` | | Optional note attached to this transition |

---

### `Leads` (extended — additive columns only)
All existing columns preserved. New columns added:

| New Column | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `partner_id` | `uuid` | FK → `partners.id`, nullable | Which partner submitted this lead |
| `referral_status_id` | `int` | FK → `referral_statuses.id`, default `1` | Current pipeline status |
| `use_case` | `text` | | Why the homeowner needs funds (e.g. `'renovation'`, `'investment_property'`) |
| `notes` | `text` | | Partner-entered notes at submission time |

---

### `Leads_Metadata` (unchanged)
No modifications. Referral-source UTM values are already captured via `utm_source`, `utm_medium`, `utm_campaign`. For partner referrals, the app will automatically set:
- `utm_source` → `'partner_referral'`
- `utm_medium` → `'partner'`
- `utm_campaign` → partner's `id` (uuid string)

---

## Status Transition Rules

| From | Allowed Next Statuses |
|------|-----------------------|
| `submitted` | `contacted` |
| `contacted` | `pre_qual_complete`, `application_rejected` |
| `pre_qual_complete` | `application_started`, `application_rejected` |
| `application_started` | `application_approved`, `application_rejected` |
| `application_approved` | `closed` |
| `closed` | `paid` |
| `application_rejected` | *(terminal)* |
| `paid` | *(terminal)* |

---

## Notes for Implementation

1. **No RLS needed** — this is a demo app with no real auth. All tables are publicly readable/writable for demo purposes.
2. **UUID vs int PKs** — `partners` and `referral_status_history` use UUIDs. `Leads` retains its existing `int` PK. `referral_statuses` uses `int` to double as sort order.
3. **Timezone** — all timestamps stored as `timestamptz` (UTC). Display layer converts to local time.
4. **Soft deletes** — not implemented for demo simplicity. In production, add `deleted_at timestamptz` to `Leads` and `partners`.
