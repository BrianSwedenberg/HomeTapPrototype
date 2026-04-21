import { useAppStore } from '../../store/useAppStore';
import { FAB } from '../ui/FAB';
import { BottomNav } from '../ui/BottomNav';
import { fetchPartnerData } from '../../lib/fetchPartnerData';

export function ConfirmationScreen() {
  const pendingReferral = useAppStore(s => s.pendingReferral);
  const activePartnerId = useAppStore(s => s.activePartnerId);
  const setPartnerData  = useAppStore(s => s.setPartnerData);
  const navigateTo      = useAppStore(s => s.navigateTo);

  const firstName = pendingReferral?.firstName ?? 'the homeowner';
  const fullName  = pendingReferral ? `${pendingReferral.firstName} ${pendingReferral.lastName}` : 'Homeowner';
  const initials  = pendingReferral
    ? `${pendingReferral.firstName[0] ?? ''}${pendingReferral.lastName[0] ?? ''}`.toUpperCase()
    : '?';
  const address   = pendingReferral
    ? `${pendingReferral.address1}, ${pendingReferral.city}, ${pendingReferral.state} ${pendingReferral.zip}`
    : '';
  const useCase   = pendingReferral?.useCase ?? '';

  async function handleViewInPipeline() {
    if (activePartnerId) {
      try {
        const data = await fetchPartnerData(activePartnerId);
        setPartnerData(data);
      } catch { /* best-effort refresh */ }
    }
    navigateTo('pipeline');
  }

  function handleReferAnother() {
    navigateTo('refer');
  }

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen flex flex-col bg-bg-page">

      {/* Top Bar */}
      <div className="bg-bg-card px-5 py-4 pb-[14px] border-b border-border-light flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary uppercase tracking-[0.6px] block">Referral Submitted</span>
          <span className="text-[18px] font-bold text-text-primary tracking-[-0.3px] block">{fullName}</span>
        </div>
        <div className="w-[38px] h-[38px] rounded-full bg-primary-light flex items-center justify-center text-[13px] font-bold text-primary flex-shrink-0">
          {initials}
        </div>
      </div>

      <div className="flex-1 px-5 pt-8 pb-[120px] flex flex-col items-center overflow-y-auto">

        {/* Success circle */}
        <div
          className="w-[72px] h-[72px] rounded-full bg-success-bg flex items-center justify-center mb-5"
          style={{ animation: 'confirmPop 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M9 16.5l4.5 4.5 9-9" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <style>{`
          @keyframes confirmPop {
            from { transform: scale(0.5); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
          }
        `}</style>

        <h1 className="text-[24px] font-bold text-text-primary tracking-[-0.3px] text-center mb-2">Referral submitted!</h1>
        <p className="text-[14px] text-text-secondary text-center leading-[1.55] mb-7 max-w-[280px]">
          {firstName} has been referred to Hometap. Here's what happens next.
        </p>

        {/* Referral summary */}
        <div className="bg-bg-card rounded-md border-[1.5px] border-border-light p-4 px-[18px] w-full mb-7 flex items-center gap-[14px] shadow-card">
          <div className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center text-[15px] font-bold text-primary flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[15px] font-bold text-text-primary block mb-[2px] truncate">{fullName}</span>
            <span className="text-xs text-text-secondary block mb-1 truncate">{address}</span>
            <span className="inline-flex text-[11px] text-primary bg-primary-light rounded-full py-[2px] px-2 font-semibold">{useCase}</span>
          </div>
          <div className="flex items-center gap-[5px] text-[11px] text-success font-semibold flex-shrink-0">
            <span className="w-[7px] h-[7px] rounded-full bg-success" />
            Submitted
          </div>
        </div>

        {/* What happens next */}
        <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.8px] mb-[14px] self-start">What happens next</div>
        <div className="bg-bg-card rounded-md border-[1.5px] border-border-light py-2 w-full mb-7 shadow-card">
          {[
            {
              n: 1,
              highlight: true,
              title: `${firstName} confirms her interest`,
              desc: `She'll receive a text with a link to confirm she's interested in learning more about Hometap. This step is required before anyone reaches out.`,
              tag: `⏳ Waiting on ${firstName}`,
            },
            {
              n: 2,
              highlight: false,
              title: 'Hometap Investment Manager calls',
              desc: `Once ${firstName} confirms, a Hometap Investment Manager will call within 24 hours to walk through her options.`,
              tag: null,
            },
            {
              n: 3,
              highlight: false,
              title: `${firstName} completes her application`,
              desc: `With her Investment Manager's guidance, ${firstName} will complete her Hometap application and receive approval.`,
              tag: null,
            },
            {
              n: 4,
              highlight: false,
              title: 'Investment closes, you get paid',
              desc: "Once the investment closes, you'll receive a $500 referral fee — tracked right here in your pipeline.",
              tag: null,
            },
          ].map((step, idx) => (
            <div key={step.n} className="flex items-start gap-[14px] px-[18px] py-[14px] relative">
              {idx < 3 && (
                <div className="absolute left-[32px] top-[46px] bottom-0 w-[1.5px] bg-border-light" />
              )}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step.highlight ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}>
                {step.n}
              </div>
              <div className="flex-1 pt-[3px]">
                <span className="text-[14px] font-semibold text-text-primary block mb-[2px]">{step.title}</span>
                <span className="text-xs text-text-secondary leading-relaxed block">{step.desc}</span>
                {step.tag && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning bg-[#FFF3E0] rounded-full py-[2px] px-2 mt-[5px]">
                    {step.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <button
          onClick={handleViewInPipeline}
          className="w-full h-[52px] bg-primary text-white font-bold text-[16px] border-none rounded-full cursor-pointer transition-[background_180ms,transform_100ms] hover:bg-primary-dark active:scale-[0.98] mb-3"
        >
          View in Pipeline
        </button>
        <button
          onClick={handleReferAnother}
          className="w-full h-[52px] bg-transparent text-primary font-semibold text-[15px] border-[1.5px] border-[#D0C8E8] rounded-full cursor-pointer transition-[background_180ms,border-color_180ms] hover:bg-[#F5F0FC] hover:border-primary"
        >
          Refer another homeowner
        </button>

      </div>

      <FAB />
      <BottomNav activeTab={null} />
    </div>
  );
}
