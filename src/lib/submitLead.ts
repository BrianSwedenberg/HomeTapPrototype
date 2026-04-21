import { supabase } from './supabaseClient';
import type { ReferralFormData } from '../types';

export async function submitLead(
  formData: ReferralFormData,
  partnerId: string,
): Promise<{ leadId: number }> {
  const { data: leadRow, error: leadError } = await supabase
    .from('Leads')
    .insert({
      first_name:         formData.firstName,
      last_name:          formData.lastName,
      email:              formData.email,
      phone:              formData.phone,
      address1:           formData.address1,
      city:               formData.city,
      state:              formData.state,
      zip:                formData.zip,
      partner_id:         partnerId,
      referral_status_id: 1,
      use_case:           formData.useCase,
      notes:              formData.notes || null,
      submitted_at:       new Date().toISOString(),
    })
    .select('LeadID')
    .single();

  if (leadError) throw new Error(`Failed to create lead: ${leadError.message}`);

  const leadId = leadRow.LeadID as number;

  const { error: metaError } = await supabase
    .from('Leads_Metadata')
    .insert({
      LeadID:               leadId,
      utm_source:           'partner_referral',
      utm_medium:           'partner',
      utm_campaign:         partnerId,
      lead_submission_page: 'partner_portal_refer',
    });

  if (metaError) throw new Error(`Failed to create lead metadata: ${metaError.message}`);

  const { error: historyError } = await supabase
    .from('referral_status_history')
    .insert({
      lead_id:    leadId,
      status_id:  1,
      changed_by: 'partner_portal',
    });

  if (historyError) throw new Error(`Failed to create status history: ${historyError.message}`);

  return { leadId };
}
