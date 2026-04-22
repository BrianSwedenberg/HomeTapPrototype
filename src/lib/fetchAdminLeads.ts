import { supabase } from './supabaseClient';
import type { AdminLead, ReferralStatus, StatusHistoryEntry } from '../types/admin';

export async function fetchAdminLeads(): Promise<AdminLead[]> {
  const { data, error } = await supabase
    .from('Leads')
    .select(`
      *,
      referral_statuses!Leads_referral_status_id_fkey (
        id,
        slug,
        label,
        sort_order
      ),
      partners!Leads_partner_id_fkey (
        id,
        name,
        partner_type,
        company_name
      )
    `)
    .order('submitted_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch leads: ${error.message}`);

  return (data ?? []).map((row: Record<string, unknown>) => {
    const rs = row.referral_statuses as Record<string, unknown> | null;
    const p  = row.partners as Record<string, unknown> | null;
    return {
      LeadID:             row.LeadID as number,
      first_name:         row.first_name as string | null,
      last_name:          row.last_name as string | null,
      email:              row.email as string | null,
      phone:              row.phone as number | null,
      address1:           row.address1 as string | null,
      address2:           row.address2 as string | null,
      city:               row.city as string | null,
      state:              row.state as string | null,
      zip:                row.zip as string | null,
      submitted_at:       row.submitted_at as string | null,
      use_case:           row.use_case as string | null,
      notes:              row.notes as string | null,
      partner_id:         row.partner_id as string | null,
      referral_status_id: row.referral_status_id as number | null,
      status_slug:        (rs?.slug as string) ?? null,
      status_label:       (rs?.label as string) ?? null,
      status_sort_order:  (rs?.sort_order as number) ?? null,
      partner_name:       (p?.name as string) ?? null,
      partner_type:       (p?.partner_type as string) ?? null,
      partner_company:    (p?.company_name as string) ?? null,
    };
  });
}

export async function fetchReferralStatuses(): Promise<ReferralStatus[]> {
  const { data, error } = await supabase
    .from('referral_statuses')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to fetch statuses: ${error.message}`);
  return (data ?? []) as ReferralStatus[];
}

export async function updateLeadStatus(leadId: number, statusId: number): Promise<void> {
  const { error: updateError } = await supabase
    .from('Leads')
    .update({ referral_status_id: statusId })
    .eq('LeadID', leadId);

  if (updateError) throw new Error(`Failed to update lead status: ${updateError.message}`);

  const { error: insertError } = await supabase
    .from('referral_status_history')
    .insert({
      lead_id:    leadId,
      status_id:  statusId,
      changed_at: new Date().toISOString(),
      changed_by: 'admin',
    });

  if (insertError) throw new Error(`Failed to insert status history: ${insertError.message}`);
}

export async function updateLeadNotes(leadId: number, notes: string): Promise<void> {
  const { error } = await supabase
    .from('Leads')
    .update({ notes })
    .eq('LeadID', leadId);

  if (error) throw new Error(`Failed to update notes: ${error.message}`);
}

export async function fetchLeadHistory(leadId: number): Promise<StatusHistoryEntry[]> {
  const { data, error } = await supabase
    .from('referral_status_history')
    .select(`
      *,
      referral_statuses!referral_status_history_status_id_fkey (label)
    `)
    .eq('lead_id', leadId)
    .order('changed_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch lead history: ${error.message}`);

  return (data ?? []).map((row: Record<string, unknown>) => {
    const rs = row.referral_statuses as Record<string, unknown> | null;
    return {
      id:           row.id as number,
      lead_id:      row.lead_id as number,
      status_id:    row.status_id as number,
      changed_at:   row.changed_at as string,
      status_label: (rs?.label as string) ?? '',
    };
  });
}
