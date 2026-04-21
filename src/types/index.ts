export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  partner_type: 'contractor' | 'real_estate_agent';
  company_name: string;
  created_at: string;
}

export interface ReferralStatus {
  id: number;
  slug: string;
  label: string;
  description: string;
  sort_order: number;
  is_terminal: boolean;
  color_hex: string;
}

export interface Lead {
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

export interface LeadWithStatus extends Lead {
  status_slug: string;
  status_label: string;
  status_color: string;
  status_is_terminal: boolean;
  status_sort_order: number;
}

export interface StatusHistoryEntry {
  id: string;
  lead_id: number;
  status_id: number;
  changed_at: string;
  changed_by: string | null;
  note: string | null;
  slug: string;
  label: string;
}

export interface PartnerData {
  partner: Partner;
  leads: LeadWithStatus[];
  allStatuses: ReferralStatus[];
}

export interface ReferralFormData {
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

export type Screen = 'login' | 'pipeline' | 'refer' | 'confirmation' | 'detail' | 'account';
