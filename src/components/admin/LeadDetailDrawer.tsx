import { useState, useEffect } from 'react';
import type { AdminLead, ReferralStatus, StatusHistoryEntry } from '../../types/admin';
import { fetchLeadHistory, updateLeadStatus, updateLeadNotes } from '../../lib/fetchAdminLeads';
import { showToast } from '../ui/Toast';

interface Props {
  isOpen: boolean;
  lead: AdminLead | null;
  allStatuses: ReferralStatus[];
  onClose: () => void;
  onLeadUpdated: (lead: AdminLead) => void;
}

const USE_CASE_LABELS: Record<string, string> = {
  debt_payoff:     'Debt Payoff',
  renovation:      'Renovation',
  retirement:      'Retirement',
  business:        'Business',
  life_event:      'Life Event',
  cash_management: 'Cash Mgmt',
  education:       'Education',
  other:           'Other',
};

function formatDate(s: string | null): string {
  if (!s) return '—';
  const d = new Date(s);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: '2-digit',
    hour: 'numeric', minute: '2-digit',
  });
}

function formatPhone(phone: number | null): string {
  if (phone === null || phone === undefined) return '—';
  const s = String(phone).replace(/\D/g, '');
  if (s.length === 10) return `(${s.slice(0, 3)}) ${s.slice(3, 6)}-${s.slice(6)}`;
  if (s.length === 11 && s[0] === '1') return `(${s.slice(1, 4)}) ${s.slice(4, 7)}-${s.slice(7)}`;
  return String(phone);
}

const STATUS_DOT_COLORS: Record<string, string> = {
  submitted:            '#4338CA',
  contacted:            '#C2410C',
  pre_qual_complete:    '#1D4ED8',
  application_started:  '#7C3AED',
  application_approved: '#065F46',
  application_rejected: '#991B1B',
  closed:               '#15803D',
  paid:                 '#854D0E',
};

export function LeadDetailDrawer({ isOpen, lead, allStatuses, onClose, onLeadUpdated }: Props) {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (!lead) return;
    setSelectedStatusId(lead.referral_status_id);
    setNotes(lead.notes ?? '');
    loadHistory(lead.LeadID);
  }, [lead?.LeadID]);

  async function loadHistory(leadId: number) {
    setHistoryLoading(true);
    try {
      const h = await fetchLeadHistory(leadId);
      setHistory(h);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleSaveStatus() {
    if (!lead || selectedStatusId === null) return;
    setSavingStatus(true);
    try {
      await updateLeadStatus(lead.LeadID, selectedStatusId);
      const newStatus = allStatuses.find(s => s.id === selectedStatusId);
      const updated: AdminLead = {
        ...lead,
        referral_status_id: selectedStatusId,
        status_slug:        newStatus?.slug ?? null,
        status_label:       newStatus?.label ?? null,
        status_sort_order:  newStatus?.sort_order ?? null,
      };
      onLeadUpdated(updated);
      showToast('Status saved ✓', 'success');
      await loadHistory(lead.LeadID);
    } catch {
      showToast('Failed to save status', 'error');
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleSaveNotes() {
    if (!lead) return;
    setSavingNotes(true);
    try {
      await updateLeadNotes(lead.LeadID, notes);
      onLeadUpdated({ ...lead, notes });
      showToast('Notes saved ✓', 'success');
    } catch {
      showToast('Failed to save notes', 'error');
    } finally {
      setSavingNotes(false);
    }
  }

  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: isOpen ? 0 : -480,
    width: 480,
    height: '100vh',
    background: '#fff',
    zIndex: 201,
    boxShadow: '-4px 0 32px rgba(26,26,46,0.12)',
    transition: 'right 280ms cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(26,26,46,0.4)',
    backdropFilter: 'blur(2px)',
    zIndex: 200,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#5C5C7A',
      marginBottom: '10px',
    }}>
      {children}
    </div>
  );

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <div style={{ fontSize: '11px', color: '#AAAAAA', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: '#1A1A2E' }}>{value || '—'}</div>
    </div>
  );

  const currentStatus = allStatuses.find(s => s.id === selectedStatusId);

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={drawerStyle}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #D0D0E0',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A2E' }}>
                {lead ? `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim() || '—' : '—'}
              </div>
              <div style={{ fontSize: '12px', color: '#AAAAAA', fontFamily: 'monospace', marginTop: '2px' }}>
                #{lead?.LeadID}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#5C5C7A',
                lineHeight: 1,
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {lead && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* 1. Referral Status */}
              <div>
                <SectionLabel>Referral Status</SectionLabel>
                <div style={{
                  background: '#F7F6FC',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid #EEECF6',
                }}>
                  <select
                    value={selectedStatusId ?? ''}
                    onChange={e => setSelectedStatusId(Number(e.target.value))}
                    disabled={savingStatus}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #D0D0E0',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#1A1A2E',
                      background: '#fff',
                      cursor: 'pointer',
                      marginBottom: '10px',
                    }}
                  >
                    {allStatuses.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveStatus}
                    disabled={savingStatus || selectedStatusId === lead.referral_status_id}
                    style={{
                      width: '100%',
                      background: savingStatus ? '#9470FF' : '#6B3FA0',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: '9px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: savingStatus || selectedStatusId === lead.referral_status_id ? 'not-allowed' : 'pointer',
                      opacity: savingStatus || selectedStatusId === lead.referral_status_id ? 0.6 : 1,
                      transition: 'opacity 150ms',
                    }}
                  >
                    {savingStatus ? 'Saving…' : 'Save Status'}
                  </button>
                  {currentStatus && (
                    <div style={{ fontSize: '11px', color: '#5C5C7A', marginTop: '8px', textAlign: 'center' }}>
                      {currentStatus.description ?? ''}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Contact Information */}
              <div>
                <SectionLabel>Contact Information</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="First Name" value={lead.first_name} />
                  <Field label="Last Name" value={lead.last_name} />
                  <Field label="Email" value={
                    lead.email
                      ? <a href={`mailto:${lead.email}`} style={{ color: '#6B3FA0' }}>{lead.email}</a>
                      : null
                  } />
                  <Field label="Phone" value={formatPhone(lead.phone)} />
                </div>
              </div>

              {/* 3. Property */}
              <div>
                <SectionLabel>Property</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Address" value={`${lead.address1 ?? ''}${lead.address2 ? `, ${lead.address2}` : ''}`} />
                  </div>
                  <Field label="City" value={lead.city} />
                  <Field label="State / ZIP" value={`${lead.state ?? ''} ${lead.zip ?? ''}`.trim() || '—'} />
                </div>
              </div>

              {/* 4. Lead Details */}
              <div>
                <SectionLabel>Lead Details</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="Use Case" value={USE_CASE_LABELS[lead.use_case ?? ''] ?? lead.use_case} />
                  <Field label="Partner" value={lead.partner_name ?? 'Direct'} />
                  <Field label="Submitted" value={lead.submitted_at ? new Date(lead.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} />
                  <Field label="Lead ID" value={<span style={{ fontFamily: 'monospace' }}>#{lead.LeadID}</span>} />
                </div>
              </div>

              {/* 5. Notes */}
              <div>
                <SectionLabel>Notes</SectionLabel>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Internal notes…"
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    border: '1.5px solid #D0D0E0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    color: '#1A1A2E',
                    background: '#fff',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    marginBottom: '10px',
                  }}
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  style={{
                    width: '100%',
                    background: savingNotes ? '#333' : '#1A1A2E',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '9px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: savingNotes ? 'not-allowed' : 'pointer',
                    opacity: savingNotes ? 0.7 : 1,
                    transition: 'opacity 150ms',
                  }}
                >
                  {savingNotes ? 'Saving…' : 'Save Notes'}
                </button>
              </div>

              {/* 6. Status History */}
              <div>
                <SectionLabel>Status History</SectionLabel>
                {historyLoading ? (
                  <div style={{ color: '#AAAAAA', fontSize: '13px' }}>Loading…</div>
                ) : history.length === 0 ? (
                  <div style={{ color: '#AAAAAA', fontSize: '13px', fontStyle: 'italic' }}>
                    No history recorded yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {history.map(entry => {
                      const slug = allStatuses.find(s => s.id === entry.status_id)?.slug ?? '';
                      const dotColor = STATUS_DOT_COLORS[slug] ?? '#6B3FA0';
                      return (
                        <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: dotColor,
                            flexShrink: 0,
                          }} />
                          <span style={{ fontSize: '13px', color: '#1A1A2E', flex: 1 }}>
                            {entry.status_label}
                          </span>
                          <span style={{ fontSize: '11px', color: '#AAAAAA', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                            {formatDate(entry.changed_at)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
