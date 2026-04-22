import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { AdminLead, ReferralStatus } from '../../types/admin';
import { fetchAdminLeads, fetchReferralStatuses, updateLeadStatus } from '../../lib/fetchAdminLeads';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import { Toast, showToast } from '../ui/Toast';

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

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  submitted:            { bg: '#EEF2FF', color: '#4338CA' },
  contacted:            { bg: '#FFF7ED', color: '#C2410C' },
  pre_qual_complete:    { bg: '#EFF6FF', color: '#1D4ED8' },
  application_started:  { bg: '#F5F3FF', color: '#7C3AED' },
  application_approved: { bg: '#ECFDF5', color: '#065F46' },
  application_rejected: { bg: '#FEF2F2', color: '#991B1B' },
  closed:               { bg: '#F0FDF4', color: '#15803D' },
  paid:                 { bg: '#FEFCE8', color: '#854D0E' },
};

function getStatusStyle(slug: string | null) {
  if (!slug || !STATUS_COLORS[slug]) return {};
  return { backgroundColor: STATUS_COLORS[slug].bg, color: STATUS_COLORS[slug].color };
}

function formatDate(s: string | null): string {
  if (!s) return '—';
  const d = new Date(s);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const year = String(d.getFullYear()).slice(2);
  return `${month} ${day}, '${year}`;
}

function formatPhone(phone: number | null): string {
  if (phone === null || phone === undefined) return '—';
  const s = String(phone).replace(/\D/g, '');
  if (s.length === 10) return `(${s.slice(0, 3)}) ${s.slice(3, 6)}-${s.slice(6)}`;
  if (s.length === 11 && s[0] === '1') return `(${s.slice(1, 4)}) ${s.slice(4, 7)}-${s.slice(7)}`;
  return String(phone);
}

const HometapLogo = () => (
  <svg width="100" height="24" viewBox="0 0 237 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M56 28C56 28.2862 56 28.5724 55.9876 28.8524L47.9796 20.8444L42.9396 15.8044C41.9191 14.784 40.2702 14.784 39.2498 15.8044L34.2098 20.8444L32.9902 22.064C32.4987 22.5556 31.6524 22.2071 31.6524 21.5102V16.6942C31.6524 15.9724 31.0676 15.3876 30.3458 15.3876H23.016C22.2942 15.3876 21.7093 15.9724 21.7093 16.6942V31.1796C21.7093 32.5609 21.1618 33.8924 20.1787 34.8693L14.6284 40.4196C13.6516 41.3965 13.0978 42.728 13.0978 44.1093V51.7004C11.1316 50.4622 9.32711 48.9876 7.73422 47.3138C2.94311 42.2924 0 35.4916 0 28C0 14.7031 9.27111 3.56533 21.7031 0.709333C23.464 0.304889 25.2809 0.0684445 27.1476 0.0124444C27.4276 0.00622222 27.7138 0 28 0C35.4916 0 42.2925 2.94311 47.32 7.73422C49.7031 10.0053 51.6818 12.6933 53.1502 15.6738C54.9796 19.3947 56.0062 23.576 56.0062 28H56Z" fill="#9470FF"/>
    <path d="M53.3245 39.9653C48.8382 49.448 39.1876 56 28 56C26.3076 56 24.6462 55.8507 23.0409 55.5582V46.8595C23.0409 46.1689 23.3147 45.5031 23.8062 45.0115L40.1707 28.6471C40.6809 28.1369 41.5085 28.1369 42.0187 28.6471L53.3307 39.9591L53.3245 39.9653Z" fill="#30167E"/>
    <g clipPath="url(#clip0_dash)">
      <path d="M83.2262 18.2812C80.2619 18.2812 77.9539 19.5609 76.5538 21.7377H76.4718V11.5049C76.4718 11.2205 76.1491 11.0564 75.9194 11.2205L71.0574 14.7262C70.9644 14.7919 70.9097 14.8958 70.9097 15.0106V40.5022C70.9097 40.6937 71.0683 40.8523 71.2597 40.8523H76.1218C76.3132 40.8523 76.4718 40.6937 76.4718 40.5022V27.5459C76.4718 24.7457 78.2821 22.6455 81.2518 22.6455C83.8879 22.6455 85.206 24.4558 85.206 26.72V40.4968C85.206 40.6882 85.3646 40.8468 85.556 40.8468H90.4181C90.6095 40.8468 90.7681 40.6882 90.7681 40.4968V25.8176C90.7681 21.2892 87.8038 18.2812 83.2316 18.2812H83.2262Z" fill="#30167E"/>
      <path d="M104.66 18.2811C97.3311 18.2811 93.2948 23.2252 93.2948 29.8155C93.2948 36.4058 97.2873 41.3007 104.66 41.3007C112.032 41.3007 116.025 36.3566 116.025 29.8155C116.025 23.2744 112.032 18.2811 104.66 18.2811ZM104.66 37.0183C100.826 37.0183 98.9335 33.89 98.9335 29.8155C98.9335 25.741 100.826 22.5689 104.66 22.5689C108.494 22.5689 110.38 25.6972 110.38 29.8155C110.38 33.9338 108.488 37.0183 104.66 37.0183Z" fill="#30167E"/>
      <path d="M144.059 18.2811C141.281 18.2811 138.973 19.2929 137.403 21.3931C137.261 21.5845 136.966 21.5735 136.84 21.3657C135.615 19.4187 133.389 18.2811 130.594 18.2811C127.8 18.2811 125.53 19.5171 124.13 21.6993H124.048L123.966 18.1006C123.96 17.8217 123.643 17.6631 123.413 17.8217L118.841 21.0485C118.748 21.1141 118.693 21.218 118.693 21.3329V40.5022C118.693 40.6936 118.852 40.8522 119.044 40.8522H123.906C124.097 40.8522 124.256 40.6936 124.256 40.5022V27.0919C124.256 24.5433 125.984 22.6455 128.702 22.6455C131.13 22.6455 132.366 24.2534 132.366 26.3098V40.4967C132.366 40.6882 132.525 40.8468 132.716 40.8468H137.578C137.77 40.8468 137.928 40.6882 137.928 40.4967V27.0864C137.928 24.5378 139.618 22.64 142.337 22.64C144.847 22.64 146.039 24.2479 146.039 26.3043V40.4913C146.039 40.6827 146.198 40.8413 146.389 40.8413H151.251C151.443 40.8413 151.601 40.6827 151.601 40.4913V25.3965C151.601 21.1087 148.599 18.2702 144.065 18.2702L144.059 18.2811Z" fill="#30167E"/>
      <path d="M175.283 29.11C175.283 23.0174 171.821 18.2811 164.946 18.2811C158.071 18.2811 154.073 23.1432 154.073 29.8155C154.073 36.4878 158.028 41.3007 165.52 41.3007C169.398 41.3007 172.127 40.0482 174.074 37.9809C174.205 37.8442 174.194 37.6254 174.063 37.4942L171.23 34.6611C171.082 34.5135 170.842 34.5299 170.71 34.694C169.381 36.291 167.659 37.0621 165.641 37.0621C162.124 37.0621 160.314 35.126 159.805 31.9813C159.772 31.7734 159.936 31.582 160.15 31.582H174.812C174.987 31.582 175.135 31.4562 175.157 31.2812C175.244 30.6632 175.272 29.81 175.272 29.11H175.283ZM160.15 27.8357C159.942 27.8357 159.772 27.6497 159.8 27.4419C160.221 24.494 161.823 22.5251 164.897 22.5251C167.97 22.5251 169.392 24.5268 169.721 27.4528C169.742 27.6607 169.578 27.8357 169.37 27.8357H160.144H160.15Z" fill="#30167E"/>
      <path d="M190.64 22.4212V19.0851C190.64 18.8937 190.481 18.7351 190.29 18.7351H185.964C185.772 18.7351 185.614 18.5764 185.614 18.385V12.4948C185.614 12.2104 185.291 12.0463 185.061 12.2104L180.238 15.6778C180.145 15.7434 180.09 15.8474 180.09 15.9622V18.3905C180.09 18.5819 179.931 18.7405 179.74 18.7405H176.283C176.092 18.7405 175.933 18.8991 175.933 19.0905V22.4267C175.933 22.6181 176.092 22.7767 176.283 22.7767H179.74C179.931 22.7767 180.09 22.9353 180.09 23.1268V34.8417C180.09 38.9599 182.234 41.3062 186.97 41.3062C188.244 41.3062 189.448 41.1694 190.372 40.9616C190.531 40.9233 190.64 40.7811 190.64 40.6225V37.2645C190.64 37.0566 190.459 36.8926 190.257 36.9199C189.88 36.9637 189.448 36.9855 188.994 36.9855C186.276 36.9855 185.614 35.8753 185.614 33.6494V23.1268C185.614 22.9353 185.772 22.7767 185.964 22.7767H190.29C190.481 22.7767 190.64 22.6181 190.64 22.4267V22.4212Z" fill="#30167E"/>
      <path d="M201.95 18.2811C198.253 18.2811 195.562 19.457 193.9 21.754C193.801 21.8907 193.817 22.0876 193.938 22.2079L197.181 25.4511L197.258 25.4894C197.914 23.7557 199.314 22.5689 201.704 22.5689C204.296 22.5689 205.696 24.051 205.696 26.0691V27.3817C205.696 27.5677 205.549 27.7263 205.357 27.7318C201.972 27.8521 198.663 28.0708 196.47 28.8311C193.588 29.821 192.27 31.8774 192.27 34.5955C192.27 38.506 195.07 41.3061 199.314 41.3061C202.317 41.3061 204.504 39.9498 205.778 37.7239H205.866L205.975 40.5186C205.981 40.7045 206.139 40.8522 206.325 40.8522H210.87C211.062 40.8522 211.22 40.6936 211.22 40.5022V26.0637C211.22 21.2071 207.922 18.2811 201.956 18.2811H201.95ZM205.696 32.4462C205.696 35.0385 203.886 37.1387 201.086 37.1387C198.986 37.1387 197.788 35.9409 197.788 34.3385C197.788 32.5282 199.27 31.9102 201.042 31.6641C202.393 31.4781 204.045 31.3578 205.325 31.2758C205.527 31.2648 205.696 31.4234 205.696 31.6258V32.4516V32.4462Z" fill="#30167E"/>
      <path d="M226.775 18.2811C223.854 18.2811 221.294 19.6812 219.61 22.0329H219.528L219.419 19.0741C219.413 18.8882 219.26 18.7405 219.069 18.7405H214.524C214.332 18.7405 214.174 18.8991 214.174 19.0905V50.188C214.174 50.4724 214.496 50.6365 214.726 50.4724L219.588 46.9722C219.681 46.9065 219.736 46.8026 219.736 46.6878V38.0137H219.818C221.464 40.1139 223.728 41.3061 226.61 41.3061C232.583 41.3061 236.291 36.1597 236.291 29.6952C236.291 23.2307 232.752 18.2866 226.78 18.2866L226.775 18.2811ZM225.041 36.9363C221.502 36.9363 219.561 33.972 219.561 29.8921C219.561 25.8121 221.415 22.6455 225.079 22.6455C228.951 22.6455 230.636 26.0254 230.636 29.7663C230.636 33.7587 228.782 36.9308 225.035 36.9308L225.041 36.9363Z" fill="#30167E"/>
    </g>
    <defs>
      <clipPath id="clip0_dash">
        <rect width="165.376" height="39.3778" fill="white" transform="translate(70.9097 11.1548)"/>
      </clipPath>
    </defs>
  </svg>
);

export function AdminDashboard() {
  const navigateTo = useAppStore(s => s.navigateTo);
  const [allLeads, setAllLeads] = useState<AdminLead[]>([]);
  const [allStatuses, setAllStatuses] = useState<ReferralStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatusId, setFilterStatusId] = useState('');
  const [filterPartnerId, setFilterPartnerId] = useState('');
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [flashingLeadId, setFlashingLeadId] = useState<number | null>(null);
  const [savingLeadIds, setSavingLeadIds] = useState<Set<number>>(new Set());

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [leads, statuses] = await Promise.all([
        fetchAdminLeads(),
        fetchReferralStatuses(),
      ]);
      setAllLeads(leads);
      setAllStatuses(statuses);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  const stats = useMemo(() => ({
    total:      allLeads.length,
    submitted:  allLeads.filter(l => !l.status_slug || l.status_slug === 'submitted').length,
    inProgress: allLeads.filter(l => ['contacted', 'pre_qual_complete', 'application_started'].includes(l.status_slug ?? '')).length,
    approved:   allLeads.filter(l => l.status_slug === 'application_approved').length,
    paidClosed: allLeads.filter(l => l.status_slug === 'closed' || l.status_slug === 'paid').length,
  }), [allLeads]);

  const uniquePartners = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; name: string }[] = [];
    for (const lead of allLeads) {
      if (lead.partner_id && !seen.has(lead.partner_id)) {
        seen.add(lead.partner_id);
        list.push({ id: lead.partner_id, name: lead.partner_name ?? lead.partner_id });
      }
    }
    return list;
  }, [allLeads]);

  const filteredLeads = useMemo(() => {
    return allLeads.filter(lead => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = [lead.first_name, lead.last_name, lead.email, lead.address1, lead.city]
          .some(f => (f ?? '').toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (filterStatusId && String(lead.referral_status_id) !== filterStatusId) return false;
      if (filterPartnerId === 'direct' && lead.partner_id !== null) return false;
      if (filterPartnerId && filterPartnerId !== 'direct' && lead.partner_id !== filterPartnerId) return false;
      return true;
    });
  }, [allLeads, searchQuery, filterStatusId, filterPartnerId]);

  async function handleStatusChange(lead: AdminLead, newStatusId: number) {
    if (savingLeadIds.has(lead.LeadID)) return;
    const prevStatusId = lead.referral_status_id;
    const newStatus = allStatuses.find(s => s.id === newStatusId);

    setSavingLeadIds(prev => new Set(prev).add(lead.LeadID));
    try {
      await updateLeadStatus(lead.LeadID, newStatusId);
      setAllLeads(prev => prev.map(l =>
        l.LeadID === lead.LeadID
          ? { ...l, referral_status_id: newStatusId, status_slug: newStatus?.slug ?? null, status_label: newStatus?.label ?? null, status_sort_order: newStatus?.sort_order ?? null }
          : l
      ));
      if (selectedLead?.LeadID === lead.LeadID) {
        setSelectedLead(prev => prev ? { ...prev, referral_status_id: newStatusId, status_slug: newStatus?.slug ?? null, status_label: newStatus?.label ?? null } : prev);
      }
      setFlashingLeadId(lead.LeadID);
      setTimeout(() => setFlashingLeadId(prev => prev === lead.LeadID ? null : prev), 1400);
    } catch {
      setAllLeads(prev => prev.map(l =>
        l.LeadID === lead.LeadID
          ? { ...l, referral_status_id: prevStatusId }
          : l
      ));
      showToast('Failed to update status', 'error');
    } finally {
      setSavingLeadIds(prev => {
        const next = new Set(prev);
        next.delete(lead.LeadID);
        return next;
      });
    }
  }

  function handleLeadUpdated(updated: AdminLead) {
    setAllLeads(prev => prev.map(l => l.LeadID === updated.LeadID ? updated : l));
    setSelectedLead(updated);
  }

  const TH = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <th style={{
      padding: '10px 14px',
      textAlign: 'left',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#5C5C7A',
      borderBottom: '1px solid #D0D0E0',
      whiteSpace: 'nowrap',
      background: '#F7F6FC',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      ...style,
    }}>
      {children}
    </th>
  );

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F7F6FC' }}>
      <style>{`
        @keyframes rowFlash {
          0%   { background-color: #E0F7F5; }
          100% { background-color: transparent; }
        }
        .row-flash { animation: rowFlash 1.2s ease-out forwards; }
        .admin-row { cursor: pointer; transition: background-color 120ms; }
        .admin-row:hover { background-color: #F5F0FC; }
        .status-select {
          appearance: none;
          height: 28px;
          min-width: 170px;
          padding: 0 10px;
          border-radius: 9999px;
          border: 1px solid rgba(0,0,0,0.12);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          transition: opacity 150ms;
        }
        .status-select:disabled { opacity: 0.6; pointer-events: none; }
      `}</style>

      {/* Topbar */}
      <div style={{
        flexShrink: 0,
        background: '#fff',
        borderBottom: '1px solid #D0D0E0',
        zIndex: 100,
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <HometapLogo />
          <div style={{ width: '1px', height: '24px', background: '#D0D0E0' }} />
          <span style={{ fontSize: '13px', color: '#5C5C7A', fontWeight: 500 }}>Leads Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', fontFamily: 'monospace', color: '#1A1A2E' }}>
            {isLoading ? '…' : `${allLeads.length} leads`}
          </span>
          <button
            onClick={() => navigateTo('admin-login')}
            style={{
              background: 'none',
              border: '1.5px solid #D0D0E0',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#5C5C7A',
              cursor: 'pointer',
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C62828'; e.currentTarget.style.color = '#C62828'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#D0D0E0'; e.currentTarget.style.color = '#5C5C7A'; }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        flexShrink: 0,
        background: '#fff',
        borderBottom: '1px solid #D0D0E0',
        display: 'flex',
        height: '72px',
      }}>
        {[
          { label: 'Total Leads',      value: stats.total,      color: '#6B3FA0' },
          { label: 'New / Submitted',  value: stats.submitted,  color: '#1A1A2E' },
          { label: 'In Progress',      value: stats.inProgress, color: '#00B3A4' },
          { label: 'Approved',         value: stats.approved,   color: '#2E7D32' },
          { label: 'Paid / Closed',    value: stats.paidClosed, color: '#E65100' },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 20px',
            borderLeft: i > 0 ? '1px solid #D0D0E0' : 'none',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5C7A', marginBottom: '4px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: stat.color, lineHeight: 1 }}>
              {isLoading ? '…' : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        flexShrink: 0,
        background: '#F7F6FC',
        borderBottom: '1px solid #D0D0E0',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '320px', flex: '0 0 320px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#AAAAAA', fontSize: '14px' }}>⌕</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search name, email, address…"
            style={{
              width: '100%',
              height: '34px',
              borderRadius: '9999px',
              border: '1.5px solid #D0D0E0',
              paddingLeft: '32px',
              paddingRight: '12px',
              fontSize: '13px',
              color: '#1A1A2E',
              background: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Status filter */}
        <select
          value={filterStatusId}
          onChange={e => setFilterStatusId(e.target.value)}
          style={{
            height: '34px',
            border: '1.5px solid #D0D0E0',
            borderRadius: '8px',
            padding: '0 10px',
            fontSize: '13px',
            color: '#1A1A2E',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="">All Statuses</option>
          {allStatuses.map(s => (
            <option key={s.id} value={String(s.id)}>{s.label}</option>
          ))}
        </select>

        {/* Partner filter */}
        <select
          value={filterPartnerId}
          onChange={e => setFilterPartnerId(e.target.value)}
          style={{
            height: '34px',
            border: '1.5px solid #D0D0E0',
            borderRadius: '8px',
            padding: '0 10px',
            fontSize: '13px',
            color: '#1A1A2E',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="">All Partners</option>
          <option value="direct">Direct (no partner)</option>
          {uniquePartners.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <div style={{ flex: 1 }} />

        {/* Refresh */}
        <button
          onClick={loadLeads}
          disabled={isLoading}
          style={{
            height: '34px',
            padding: '0 14px',
            border: '1.5px solid #D0D0E0',
            borderRadius: '8px',
            background: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            color: '#5C5C7A',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'border-color 150ms',
          }}
          onMouseEnter={e => !isLoading && (e.currentTarget.style.borderColor = '#6B3FA0')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#D0D0E0')}
        >
          <span style={{ display: 'inline-block', transform: isLoading ? 'none' : undefined }}>↻</span>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #EDE7F6', borderTop: '3px solid #6B3FA0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#5C5C7A', fontSize: '14px' }}>Loading leads…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : loadError ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#C62828' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Failed to load leads</div>
            <div style={{ fontSize: '13px', color: '#5C5C7A' }}>{loadError}</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr>
                <TH style={{ width: '60px' }}>ID</TH>
                <TH>Name</TH>
                <TH>Contact</TH>
                <TH>Address</TH>
                <TH>Use Case</TH>
                <TH>Partner</TH>
                <TH>Submitted</TH>
                <TH style={{ minWidth: '180px' }}>Status</TH>
                <TH style={{ width: '40px' }}></TH>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div style={{ padding: '60px 0', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A2E', marginBottom: '6px' }}>No leads found</div>
                      <div style={{ fontSize: '13px', color: '#5C5C7A' }}>No leads match your current filters.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => {
                  const isSaving = savingLeadIds.has(lead.LeadID);
                  const isFlashing = flashingLeadId === lead.LeadID;
                  return (
                    <tr
                      key={lead.LeadID}
                      className={`admin-row${isFlashing ? ' row-flash' : ''}`}
                      onClick={() => setSelectedLead(lead)}
                      style={{ borderBottom: '1px solid #EEECF6' }}
                    >
                      {/* ID */}
                      <td style={{ padding: '10px 14px', fontSize: '12px', fontFamily: 'monospace', color: '#AAAAAA', whiteSpace: 'nowrap' }}>
                        #{lead.LeadID}
                      </td>

                      {/* Name */}
                      <td style={{ padding: '10px 14px', fontWeight: 600, fontSize: '13px', color: '#1A1A2E', whiteSpace: 'nowrap' }}>
                        {`${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim() || '—'}
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontSize: '12px', color: '#1A1A2E' }}>{lead.email ?? '—'}</div>
                        <div style={{ fontSize: '11px', color: '#AAAAAA' }}>{formatPhone(lead.phone)}</div>
                      </td>

                      {/* Address */}
                      <td style={{ padding: '10px 14px', maxWidth: '180px' }}>
                        <div
                          title={`${lead.address1 ?? ''}, ${lead.city ?? ''}, ${lead.state ?? ''} ${lead.zip ?? ''}`}
                          style={{ fontSize: '12px', color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}
                        >
                          {[lead.address1, lead.city].filter(Boolean).join(', ') || '—'}
                        </div>
                      </td>

                      {/* Use Case */}
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5C5C7A', whiteSpace: 'nowrap' }}>
                        {USE_CASE_LABELS[lead.use_case ?? ''] ?? lead.use_case ?? '—'}
                      </td>

                      {/* Partner */}
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#1A1A2E', whiteSpace: 'nowrap' }}>
                        {lead.partner_name ? (
                          <span>
                            {lead.partner_type === 'contractor' ? '🔨' : lead.partner_type === 'real_estate_agent' ? '🏠' : ''}{' '}
                            {lead.partner_name}
                          </span>
                        ) : '—'}
                      </td>

                      {/* Submitted */}
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5C5C7A', whiteSpace: 'nowrap' }}>
                        {formatDate(lead.submitted_at)}
                      </td>

                      {/* Status select */}
                      <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                        <select
                          className="status-select"
                          style={getStatusStyle(lead.status_slug)}
                          value={lead.referral_status_id ?? ''}
                          disabled={isSaving}
                          onChange={e => handleStatusChange(lead, Number(e.target.value))}
                        >
                          {allStatuses.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>

                      {/* Detail button */}
                      <td style={{ padding: '10px 8px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#AAAAAA',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            transition: 'color 120ms',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#6B3FA0')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#AAAAAA')}
                        >
                          ›
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      <LeadDetailDrawer
        isOpen={selectedLead !== null}
        lead={selectedLead}
        allStatuses={allStatuses}
        onClose={() => setSelectedLead(null)}
        onLeadUpdated={handleLeadUpdated}
      />

      <Toast />
    </div>
  );
}
