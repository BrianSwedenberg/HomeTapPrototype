import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../ui/TopBar';
import { BottomNav } from '../ui/BottomNav';
import { FAB } from '../ui/FAB';
import { DEMO_PARTNERS } from '../../lib/demoPartners';

// FUTURE: earnings tab — detailed earnings history breakdown
// FUTURE: payout connection — bank account setup flow

export function AccountScreen() {
  const partner         = useAppStore(s => s.partner);
  const leads           = useAppStore(s => s.leads);
  const activePartnerId = useAppStore(s => s.activePartnerId);
  const clearPartner    = useAppStore(s => s.clearPartner);
  const navigateTo      = useAppStore(s => s.navigateTo);

  const demoPartner = activePartnerId === DEMO_PARTNERS.realEstateAgent.id
    ? DEMO_PARTNERS.realEstateAgent
    : DEMO_PARTNERS.contractor;

  const displayName    = partner?.name         ?? demoPartner.name;
  const displayType    = partner?.partner_type  === 'real_estate_agent' ? 'Real Estate Agent' : 'Contractor';
  const displayCompany = partner?.company_name  ?? demoPartner.company;
  const displayEmail   = partner?.email         ?? '';
  const displayPhone   = partner?.phone         ?? '';

  // Earnings derived from lead data — same logic as MetricTiles
  const totalEarned = leads.filter(l => l.status_slug === 'paid').length * 500;
  const closedCount = leads.filter(l => l.status_slug === 'closed' || l.status_slug === 'paid').length;
  const activeCount = leads.filter(l => !l.status_is_terminal && l.status_slug !== 'submitted').length;
  const pendingEarnings = activeCount * 500;
  const closeRate   = leads.length > 0
    ? Math.round((closedCount / leads.length) * 100)
    : 0;

  const avatarClass = demoPartner.avatarColor === 'teal'
    ? 'bg-teal-light text-[#00897B]'
    : 'bg-primary-light text-primary';

  function handleSignOut() {
    clearPartner();
    navigateTo('login');
  }

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen flex flex-col bg-bg-page">
      <TopBar
        label="Partner Portal"
        name="My Account"
        initials={demoPartner.initials}
        avatarColor={demoPartner.avatarColor}
      />

      <div className="flex-1 px-4 pt-5 pb-[100px] overflow-y-auto">

        {/* Profile Hero */}
        <div className="bg-bg-card rounded-md border-[1.5px] border-border-light shadow-card px-5 py-6 flex flex-col items-center text-center mb-1">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-bold mb-3 ${avatarClass}`}>
            {demoPartner.initials}
          </div>
          <div className="text-[20px] font-bold text-text-primary tracking-[-0.3px] mb-[2px]">{displayName}</div>
          <div className="text-[13px] text-text-secondary mb-[2px]">{displayType}</div>
          <div className="text-[13px] text-text-secondary">{displayCompany}</div>
          <div className="inline-flex items-center gap-[5px] bg-success-bg rounded-full py-1 px-3 text-[11px] font-semibold text-success mt-3">
            <span className="w-[6px] h-[6px] rounded-full bg-success" />
            Active Partner
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-[10px] mt-5">Contact Info</div>
        <div className="bg-bg-card rounded-md border-[1.5px] border-border-light shadow-card overflow-hidden">
          <InfoRow icon="✉️" label="Email" value={displayEmail} />
          <InfoRow icon="📞" label="Phone" value={displayPhone} isLast />
        </div>

        {/* Payout Info */}
        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-[10px] mt-5">Payout Info</div>
        <div className="bg-bg-card rounded-md border-[1.5px] border-border-light shadow-card overflow-hidden">
          <InfoRow icon="🏦" label="Bank account" value="Not connected" isMuted action="Add" />
          <InfoRow icon="💸" label="Referral fee per closed deal" value="$500" />
          <InfoRow icon="📄" label="Partner agreement" value="View agreement" isLink isLast />
        </div>

        {/* Earnings Summary */}
        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-[10px] mt-5">Earnings Summary</div>
        <div className="grid grid-cols-2 gap-[10px]">
          {[
            { label: 'Total Earned',  value: `$${totalEarned.toLocaleString()}`, color: 'text-success',  sub: 'All time' },
            { label: 'Pending',       value: `$${pendingEarnings.toLocaleString()}`, color: 'text-primary', sub: `${activeCount} active leads` },
            { label: 'Deals Closed',  value: String(closedCount), color: 'text-text-primary', sub: `Of ${leads.length} referred` },
            { label: 'Close Rate',    value: `${closeRate}%`,    color: 'text-text-primary', sub: 'All time' },
          ].map(tile => (
            <div key={tile.label} className="bg-bg-card rounded-md border-[1.5px] border-border-light shadow-card p-[14px] px-4">
              <div className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.6px] mb-[6px]">{tile.label}</div>
              <div className={`text-[22px] font-bold leading-none tracking-[-0.3px] ${tile.color}`}>{tile.value}</div>
              <div className="text-[11px] text-text-disabled mt-1">{tile.sub}</div>
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          type="button"
          className="w-full h-12 bg-transparent text-error font-semibold text-[14px] border-[1.5px] border-[#FFCDD2] rounded-full cursor-pointer mt-6 transition-[background_150ms] hover:bg-error-bg"
        >
          Sign out
        </button>

      </div>

      <FAB />
      <BottomNav activeTab="account" />
    </div>
  );
}

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
  isMuted?: boolean;
  isLink?: boolean;
  action?: string;
}

function InfoRow({ icon, label, value, isLast, isMuted, isLink, action }: InfoRowProps) {
  return (
    <div className={`flex items-center gap-3 px-4 py-[13px] ${isLast ? '' : 'border-b border-[#F5F4FA]'}`}>
      <div className="w-8 h-8 rounded-lg bg-bg-page flex items-center justify-center text-[14px] flex-shrink-0">{icon}</div>
      <div className="flex-1 flex flex-col gap-[1px]">
        <span className="text-[11px] text-text-disabled font-medium">{label}</span>
        <span className={`text-[13px] font-medium ${isMuted ? 'text-text-disabled italic' : isLink ? 'text-primary' : 'text-text-primary'}`}>
          {value}
        </span>
      </div>
      {action && (
        <span className="text-xs text-primary font-semibold cursor-pointer flex-shrink-0">{action}</span>
      )}
    </div>
  );
}
