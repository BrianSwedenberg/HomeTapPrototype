import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/ui/TopBar';
import { BottomNav } from '../components/ui/BottomNav';
import { FAB } from '../components/ui/FAB';
import { MetricTiles } from '../components/dashboard/MetricTiles';
import { LeadList } from '../components/dashboard/LeadList';
import { DEMO_PARTNERS } from '../lib/demoPartners';

export function PipelineScreen() {
  const partner         = useAppStore(s => s.partner);
  const activePartnerId = useAppStore(s => s.activePartnerId);

  const demoPartner = activePartnerId === DEMO_PARTNERS.realEstateAgent.id
    ? DEMO_PARTNERS.realEstateAgent
    : DEMO_PARTNERS.contractor;

  const initials    = demoPartner.initials;
  const avatarColor = demoPartner.avatarColor;
  const displayName = partner?.name ?? demoPartner.name;

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen flex flex-col bg-bg-page">
      <TopBar
        label="Partner Portal"
        name={displayName}
        initials={initials}
        avatarColor={avatarColor}
      />
      <div className="flex-1 px-4 pt-4 pb-[100px] overflow-y-auto">
        <MetricTiles />
        <LeadList />
      </div>
      <FAB />
      <BottomNav activeTab="pipeline" />
    </div>
  );
}
