import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/ui/TopBar';
import { BottomNav } from '../components/ui/BottomNav';
import { FAB } from '../components/ui/FAB';
import { ReferralForm } from '../components/referral/ReferralForm';
import { DEMO_PARTNERS } from '../lib/demoPartners';

export function ReferScreen() {
  const { partner, activePartnerId } = useAppStore(s => ({
    partner:         s.partner,
    activePartnerId: s.activePartnerId,
  }));

  const demoPartner = activePartnerId === DEMO_PARTNERS.realEstateAgent.id
    ? DEMO_PARTNERS.realEstateAgent
    : DEMO_PARTNERS.contractor;

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen flex flex-col bg-bg-page">
      <TopBar
        label="New Referral"
        name="Refer a Homeowner"
        initials={demoPartner.initials}
        avatarColor={demoPartner.avatarColor}
      />
      <ReferralForm />
      <FAB />
      <BottomNav activeTab="refer" />
    </div>
  );
}
