export interface AdminLead {
  LeadID: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: number | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  submitted_at: string | null;
  use_case: string | null;
  notes: string | null;
  partner_id: string | null;
  referral_status_id: number | null;
  // Joined
  status_slug: string | null;
  status_label: string | null;
  status_sort_order: number | null;
  partner_name: string | null;
  partner_type: string | null;
  partner_company: string | null;
}

export interface ReferralStatus {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  sort_order: number;
  is_terminal: boolean;
}

export interface StatusHistoryEntry {
  id: number;
  lead_id: number;
  status_id: number;
  changed_at: string;
  status_label: string;
}
