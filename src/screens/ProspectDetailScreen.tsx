import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/ui/TopBar';
import { BottomNav } from '../components/ui/BottomNav';
import { FAB } from '../components/ui/FAB';
import { StatusHero } from '../components/detail/StatusHero';
import { LeadSummaryCard } from '../components/detail/LeadSummaryCard';
import { StatusTimeline } from '../components/detail/StatusTimeline';
import { DEMO_PARTNERS } from '../lib/demoPartners';

export function ProspectDetailScreen() {
  const { leads, allStatuses, selectedLeadId, statusHistoryMap, activePartnerId, navigateTo } = useAppStore(s => ({
    leads:            s.leads,
    allStatuses:      s.allStatuses,
    selectedLeadId:   s.selectedLeadId,
    statusHistoryMap: s.statusHistoryMap,
    activePartnerId:  s.activePartnerId,
    navigateTo:       s.navigateTo,
  }));

  const lead    = leads.find(l => l.LeadID === selectedLeadId);
  const history = lead ? (statusHistoryMap[lead.LeadID] ?? []) : [];

  const demoPartner = activePartnerId === DEMO_PARTNERS.realEstateAgent.id
    ? DEMO_PARTNERS.realEstateAgent
    : DEMO_PARTNERS.contractor;

  if (!lead) {
    return (
      <div className="w-full max-w-[390px] mx-auto min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Lead not found.</p>
      </div>
    );
  }

  const backButton = (
    <button
      type="button"
      onClick={() => navigateTo('pipeline')}
      className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-text-secondary font-semibold text-[13px] py-2 transition-colors hover:text-primary flex-shrink-0"
    >
      ‹ Pipeline
    </button>
  );

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen flex flex-col bg-bg-page">
      <TopBar
        label=""
        name={`${lead.first_name} ${lead.last_name}`}
        initials={demoPartner.initials}
        avatarColor={demoPartner.avatarColor}
        backButton={backButton}
      />

      <div className="flex-1 px-4 pt-4 pb-[100px] overflow-y-auto">
        <StatusHero lead={lead} history={history} />

        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-[10px] mt-5">Lead Summary</div>
        <LeadSummaryCard lead={lead} />

        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-[10px] mt-5">Status Timeline</div>
        <StatusTimeline
          allStatuses={allStatuses}
          history={history}
          currentStatusId={lead.referral_status_id}
        />
      </div>

      <FAB />
      <BottomNav activeTab="pipeline" />
    </div>
  );
}
