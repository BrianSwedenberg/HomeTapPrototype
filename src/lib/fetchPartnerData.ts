import { supabase } from './supabaseClient';
import type { Partner, LeadWithStatus, ReferralStatus, PartnerData, StatusHistoryEntry } from '../types';

// FUTURE: real-time subscriptions via Supabase channels

export async function fetchPartnerData(partnerId: string): Promise<PartnerData & { statusHistoryMap: Record<number, StatusHistoryEntry[]> }> {
  const [partnerResult, leadsResult, statusesResult] = await Promise.all([
    supabase
      .from('partners')
      .select('*')
      .eq('id', partnerId)
      .single(),

    supabase
      .from('Leads')
      .select(`
        *,
        referral_statuses!Leads_referral_status_id_fkey (
          slug,
          label,
          color_hex,
          is_terminal,
          sort_order
        )
      `)
      .eq('partner_id', partnerId)
      .order('submitted_at', { ascending: false }),

    supabase
      .from('referral_statuses')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  if (partnerResult.error) throw new Error(`Failed to fetch partner: ${partnerResult.error.message}`);
  if (leadsResult.error)   throw new Error(`Failed to fetch leads: ${leadsResult.error.message}`);
  if (statusesResult.error) throw new Error(`Failed to fetch statuses: ${statusesResult.error.message}`);

  const rawLeads = leadsResult.data ?? [];
  const leads: LeadWithStatus[] = rawLeads.map((row: Record<string, unknown>) => {
    const rs = row.referral_statuses as Record<string, unknown> | null;
    return {
      LeadID:              row.LeadID as number,
      first_name:          row.first_name as string,
      last_name:           row.last_name as string,
      email:               row.email as string,
      phone:               row.phone as string,
      address1:            row.address1 as string,
      address2:            row.address2 as string | null,
      city:                row.city as string,
      state:               row.state as string,
      zip:                 row.zip as string,
      partner_id:          row.partner_id as string,
      referral_status_id:  row.referral_status_id as number,
      use_case:            row.use_case as string,
      notes:               row.notes as string | null,
      submitted_at:        row.submitted_at as string,
      status_slug:         rs?.slug as string ?? '',
      status_label:        rs?.label as string ?? '',
      status_color:        rs?.color_hex as string ?? '#6B3FA0',
      status_is_terminal:  rs?.is_terminal as boolean ?? false,
      status_sort_order:   rs?.sort_order as number ?? 0,
    };
  });

  const leadIds = leads.map(l => l.LeadID);
  const historyMap: Record<number, StatusHistoryEntry[]> = {};

  if (leadIds.length > 0) {
    const { data: historyRows, error: historyError } = await supabase
      .from('referral_status_history')
      .select(`
        *,
        referral_statuses!referral_status_history_status_id_fkey (slug, label)
      `)
      .in('lead_id', leadIds)
      .order('changed_at', { ascending: true });

    if (historyError) throw new Error(`Failed to fetch status history: ${historyError.message}`);

    for (const row of historyRows ?? []) {
      const rs = row.referral_statuses as Record<string, unknown> | null;
      const entry: StatusHistoryEntry = {
        id:         row.id,
        lead_id:    row.lead_id,
        status_id:  row.status_id,
        changed_at: row.changed_at,
        changed_by: row.changed_by,
        note:       row.note,
        slug:       rs?.slug as string ?? '',
        label:      rs?.label as string ?? '',
      };
      if (!historyMap[row.lead_id]) historyMap[row.lead_id] = [];
      historyMap[row.lead_id].push(entry);
    }
  }

  return {
    partner:          partnerResult.data as Partner,
    leads,
    allStatuses:      statusesResult.data as ReferralStatus[],
    statusHistoryMap: historyMap,
  };
}
