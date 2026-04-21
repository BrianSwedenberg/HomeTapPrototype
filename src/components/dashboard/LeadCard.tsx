import { useAppStore } from '../../store/useAppStore';
import { StatusBadge } from '../ui/StatusBadge';
import type { LeadWithStatus } from '../../types';

interface LeadCardProps {
  lead: LeadWithStatus;
}

export function LeadCard({ lead }: LeadCardProps) {
  const navigateTo = useAppStore(s => s.navigateTo);

  const submittedDate = new Date(lead.submitted_at).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  });

  const useCaseDisplay = lead.use_case
    ? lead.use_case.charAt(0).toUpperCase() + lead.use_case.slice(1).replace(/_/g, ' ')
    : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigateTo('detail', lead.LeadID)}
      onKeyDown={e => e.key === 'Enter' && navigateTo('detail', lead.LeadID)}
      className="bg-bg-card rounded-[12px] p-[14px] px-4 mb-[10px] shadow-[0_2px_12px_rgba(107,63,160,0.05)] flex flex-col gap-[10px] cursor-pointer transition-[box-shadow_150ms] border-[1.5px] border-transparent hover:shadow-[0_4px_20px_rgba(107,63,160,0.12)] hover:border-[rgba(107,63,160,0.15)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[15px] font-bold text-text-primary">{lead.first_name} {lead.last_name}</div>
          <div className="text-xs text-text-secondary mt-[2px] leading-[1.4]">
            {lead.address1}, {lead.city}, {lead.state}
          </div>
        </div>
        <StatusBadge label={lead.status_label} colorHex={lead.status_color} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-secondary bg-bg-page rounded-full py-[3px] px-2 font-medium border border-border-light">
            {useCaseDisplay}
          </span>
          <span className="text-[11px] text-text-disabled">{submittedDate}</span>
        </div>
        <span className="text-border text-[18px] leading-none flex-shrink-0">›</span>
      </div>
    </div>
  );
}
