-- =============================================================
-- Hometap Partner Referral Platform — Database Migration
-- Version: 001_initial
-- Description: Creates partner referral tables and extends
--              existing Leads table with referral columns.
-- Run in: Supabase SQL Editor or via Supabase CLI
-- =============================================================

-- -------------------------------------------------------------
-- 0. EXTENSIONS
-- -------------------------------------------------------------
create extension if not exists "pgcrypto";


-- -------------------------------------------------------------
-- 1. EXISTING TABLES (create if not already present)
--    Skip these blocks if your tables already exist.
-- -------------------------------------------------------------

create table if not exists "Leads" (
  "LeadID"       serial primary key,
  first_name     text,
  last_name      text,
  zip_code       text,
  phone          text,
  email          text,
  address1       text,
  address2       text,
  city           text,
  state          text,
  zip            text,
  submitted_at   timestamptz default now()
);

create table if not exists "Leads_Metadata" (
  id                      uuid primary key default gen_random_uuid(),
  "LeadID"                int references "Leads"("LeadID"),
  utm_medium              text,
  utm_source              text,
  utm_campaign            text,
  utm_term                text,
  utm_content             text,
  lead_form_survey_answers jsonb,
  referrer                text,
  full_domain             text,
  lead_submission_page    text,
  root_domain             text
);


-- -------------------------------------------------------------
-- 2. PARTNERS TABLE
-- -------------------------------------------------------------

create table if not exists partners (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null unique,
  phone        text,
  partner_type text not null check (partner_type in ('contractor', 'real_estate_agent')),
  company_name text,
  created_at   timestamptz default now()
);


-- -------------------------------------------------------------
-- 3. REFERRAL STATUSES LOOKUP TABLE
-- -------------------------------------------------------------

create table if not exists referral_statuses (
  id          int primary key,
  slug        text not null unique,
  label       text not null,
  description text,
  sort_order  int not null,
  is_terminal bool not null default false,
  color_hex   text
);

-- Seed statuses
insert into referral_statuses (id, slug, label, description, sort_order, is_terminal, color_hex)
values
  (1, 'submitted',             'Submitted',             'Lead has been submitted by the partner.',                                    1, false, '#6B3FA0'),
  (2, 'contacted',             'Contacted',             'Hometap has reached out to the homeowner.',                                  2, false, '#00B3A4'),
  (3, 'pre_qual_complete',     'Pre-Qual Complete',     'Homeowner has completed the pre-qualification estimate.',                    3, false, '#1565C0'),
  (4, 'application_started',   'Application Started',   'Homeowner has started their full Hometap application.',                     4, false, '#E65100'),
  (5, 'application_approved',  'Application Approved',  'Homeowner''s application has been approved.',                              5, false, '#2E7D32'),
  (6, 'application_rejected',  'Application Rejected',  'Application did not meet Hometap''s investment criteria.',                 6, true,  '#C62828'),
  (7, 'closed',                'Closed',                'Investment has been funded and the transaction is complete.',               7, false, '#1A237E'),
  (8, 'paid',                  'Paid',                  'Referral fee has been issued to the partner.',                              8, true,  '#1B5E20')
on conflict (id) do nothing;


-- -------------------------------------------------------------
-- 4. EXTEND LEADS TABLE (additive columns only)
-- -------------------------------------------------------------

alter table "Leads"
  add column if not exists partner_id          uuid references partners(id),
  add column if not exists referral_status_id  int references referral_statuses(id) default 1,
  add column if not exists use_case            text,
  add column if not exists notes               text;


-- -------------------------------------------------------------
-- 5. REFERRAL STATUS HISTORY TABLE
-- -------------------------------------------------------------

create table if not exists referral_status_history (
  id          uuid primary key default gen_random_uuid(),
  lead_id     int not null references "Leads"("LeadID") on delete cascade,
  status_id   int not null references referral_statuses(id),
  changed_at  timestamptz default now(),
  changed_by  text,
  note        text
);


-- -------------------------------------------------------------
-- 6. SEED DEMO PARTNERS
--    Two hardcoded UUIDs so the app can reference them as
--    constants without a login flow.
-- -------------------------------------------------------------

insert into partners (id, name, email, phone, partner_type, company_name)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Marcus Webb',
    'marcus@webbhomeimprovement.com',
    '617-555-0101',
    'contractor',
    'Webb & Sons Home Improvement'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Sarah Okonkwo',
    'sarah@okonkworealty.com',
    '617-555-0202',
    'real_estate_agent',
    'Okonkwo Investment Realty'
  )
on conflict (id) do nothing;


-- -------------------------------------------------------------
-- 7. SEED DEMO LEADS (optional — gives the dashboard something
--    to show on first load)
-- -------------------------------------------------------------

insert into "Leads" (first_name, last_name, email, phone, address1, city, state, zip, partner_id, referral_status_id, use_case, notes, submitted_at)
values
  ('James',   'Thornton',  'james.thornton@email.com',   '617-555-1001', '14 Maple Ave',       'Boston',     'MA', '02101', '11111111-1111-1111-1111-111111111111', 3, 'renovation',          'Kitchen + bath remodel, $85k project scope.',       now() - interval '12 days'),
  ('Linda',   'Castillo',  'linda.castillo@email.com',   '617-555-1002', '88 Birchwood Dr',    'Cambridge',  'MA', '02139', '11111111-1111-1111-1111-111111111111', 2, 'renovation',          'Full basement finish. Estimate $60k.',               now() - interval '8 days'),
  ('Omar',    'Hassan',    'omar.hassan@email.com',       '617-555-1003', '3 Clearwater Rd',    'Somerville', 'MA', '02143', '11111111-1111-1111-1111-111111111111', 5, 'renovation',          'Roof + siding replacement.',                        now() - interval '22 days'),
  ('Priya',   'Nair',      'priya.nair@email.com',        '617-555-1004', '201 Elm Street',     'Newton',     'MA', '02458', '11111111-1111-1111-1111-111111111111', 1, 'renovation',          'Sunroom addition, early stage planning.',           now() - interval '1 day'),
  ('David',   'Kim',       'david.kim@email.com',         '617-555-2001', '55 Harbor View Ln',  'Boston',     'MA', '02110', '22222222-2222-2222-2222-222222222222', 7, 'investment_property', 'Using equity to fund down payment on 3-unit.',      now() - interval '30 days'),
  ('Rachel',  'Nguyen',    'rachel.nguyen@email.com',     '617-555-2002', '420 Tremont St',     'Boston',     'MA', '02116', '22222222-2222-2222-2222-222222222222', 4, 'investment_property', 'Expanding portfolio, targeting multi-family.',      now() - interval '15 days'),
  ('Anthony', 'Russo',     'anthony.russo@email.com',     '617-555-2003', '77 Lakeview Terr',   'Brookline',  'MA', '02445', '22222222-2222-2222-2222-222222222222', 6, 'investment_property', 'Application did not meet LTV requirements.',        now() - interval '18 days'),
  ('Mei',     'Chen',      'mei.chen@email.com',          '617-555-2004', '9 Fenwick Place',    'Cambridge',  'MA', '02138', '22222222-2222-2222-2222-222222222222', 2, 'investment_property', 'Client exploring options, early conversation.',     now() - interval '4 days');

-- Seed corresponding metadata rows
insert into "Leads_Metadata" ("LeadID", utm_source, utm_medium, utm_campaign)
select "LeadID", 'partner_referral', 'partner', partner_id::text
from "Leads"
where partner_id is not null
on conflict do nothing;

-- Seed status history for leads that have progressed
-- Lead: James Thornton (pre_qual_complete)
insert into referral_status_history (lead_id, status_id, changed_at, changed_by)
select l."LeadID", 1, l.submitted_at,                        'system'
from "Leads" l where l.email = 'james.thornton@email.com'
union all
select l."LeadID", 2, l.submitted_at + interval '1 day',     'system'
from "Leads" l where l.email = 'james.thornton@email.com'
union all
select l."LeadID", 3, l.submitted_at + interval '4 days',    'system'
from "Leads" l where l.email = 'james.thornton@email.com';

-- Lead: Omar Hassan (application_approved)
insert into referral_status_history (lead_id, status_id, changed_at, changed_by)
select l."LeadID", 1, l.submitted_at,                        'system'
from "Leads" l where l.email = 'omar.hassan@email.com'
union all
select l."LeadID", 2, l.submitted_at + interval '1 day',     'system'
from "Leads" l where l.email = 'omar.hassan@email.com'
union all
select l."LeadID", 3, l.submitted_at + interval '3 days',    'system'
from "Leads" l where l.email = 'omar.hassan@email.com'
union all
select l."LeadID", 4, l.submitted_at + interval '7 days',    'system'
from "Leads" l where l.email = 'omar.hassan@email.com'
union all
select l."LeadID", 5, l.submitted_at + interval '12 days',   'system'
from "Leads" l where l.email = 'omar.hassan@email.com';

-- Lead: David Kim (closed)
insert into referral_status_history (lead_id, status_id, changed_at, changed_by)
select l."LeadID", 1, l.submitted_at,                        'system'
from "Leads" l where l.email = 'david.kim@email.com'
union all
select l."LeadID", 2, l.submitted_at + interval '1 day',     'system'
from "Leads" l where l.email = 'david.kim@email.com'
union all
select l."LeadID", 3, l.submitted_at + interval '3 days',    'system'
from "Leads" l where l.email = 'david.kim@email.com'
union all
select l."LeadID", 4, l.submitted_at + interval '8 days',    'system'
from "Leads" l where l.email = 'david.kim@email.com'
union all
select l."LeadID", 5, l.submitted_at + interval '14 days',   'system'
from "Leads" l where l.email = 'david.kim@email.com'
union all
select l."LeadID", 7, l.submitted_at + interval '20 days',   'system'
from "Leads" l where l.email = 'david.kim@email.com';


-- -------------------------------------------------------------
-- 8. INDEXES
-- -------------------------------------------------------------

create index if not exists idx_leads_partner_id         on "Leads"(partner_id);
create index if not exists idx_leads_referral_status    on "Leads"(referral_status_id);
create index if not exists idx_status_history_lead_id   on referral_status_history(lead_id);
create index if not exists idx_status_history_changed   on referral_status_history(changed_at);


-- -------------------------------------------------------------
-- DONE
-- -------------------------------------------------------------
-- Tables created:  partners, referral_statuses, referral_status_history
-- Tables extended: Leads (partner_id, referral_status_id, use_case, notes)
-- Tables unchanged: Leads_Metadata
-- Seed data:       2 demo partners, 8 demo leads, status history for 3 leads
-- =============================================================
