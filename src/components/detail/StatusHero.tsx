import { StatusBadge } from '../ui/StatusBadge';
import type { LeadWithStatus } from '../../types';
import type { StatusHistoryEntry } from '../../types';

const NEXT_STEP: Record<string, string> = {
  submitted:            'Awaiting confirmation',
  contacted:            'Pre-qual underway',
  pre_qual_complete:    'App in progress',
  application_started:  'Review in progress',
  application_approved: 'Closing soon',
  closed:               'Payment pending',
};

interface StatusHeroProps {
  lead: LeadWithStatus;
  history: StatusHistoryEntry[];
}

export function StatusHero({ lead, history }: StatusHeroProps) {
  const latestEntry = history.length > 0 ? history[history.length - 1] : null;

  const updatedAt = latestEntry
    ? new Date(latestEntry.changed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' · ' +
      new Date(latestEntry.changed_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '';

  const nextStep = NEXT_STEP[lead.status_slug];

  return (
    <div className="bg-bg-card rounded-md px-[18px] py-4 mb-3 shadow-card border-[1.5px] border-border-light flex items-center justify-between gap-3">
      <div>
        <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.6px] block mb-1">Current status</span>
        <StatusBadge label={lead.status_label} colorHex={lead.status_color} size="md" />
        {updatedAt && (
          <span className="text-[11px] text-text-disabled mt-1 block">Updated {updatedAt}</span>
        )}
      </div>
      {nextStep && (
        <div className="flex items-center gap-[6px] bg-bg-page border border-border-light rounded-full py-[6px] px-3 text-[11px] font-semibold text-text-secondary whitespace-nowrap max-w-[160px] flex-shrink-0">
          <span className="w-[6px] h-[6px] rounded-full bg-primary flex-shrink-0" style={{ animation: 'pulse 1.5s infinite' }} />
          {nextStep}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </div>
      )}
    </div>
  );
}
