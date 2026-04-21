import type { ReferralStatus, StatusHistoryEntry } from '../../types';

// FUTURE: rejected state UI — show explanation card when status is application_rejected
// FUTURE: paid state UI — show celebration treatment with green "Payment sent" confirmation

interface StatusTimelineProps {
  allStatuses: ReferralStatus[];
  history: StatusHistoryEntry[];
  currentStatusId: number;
}

const CHECKMARK = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function StatusTimeline({ allStatuses, history, currentStatusId }: StatusTimelineProps) {
  const historyByStatusId: Record<number, StatusHistoryEntry> = {};
  for (const entry of history) {
    historyByStatusId[entry.status_id] = entry;
  }

  const visibleStatuses = allStatuses.filter(s => s.slug !== 'application_rejected');

  return (
    <div className="bg-bg-card rounded-md border-[1.5px] border-border-light shadow-card py-2">
      {visibleStatuses.map((status, idx) => {
        const historyEntry  = historyByStatusId[status.id];
        const isCompleted   = !!historyEntry;
        const isLast        = idx === visibleStatuses.length - 1;

        const dateStr = historyEntry
          ? new Date(historyEntry.changed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
            ' · ' +
            new Date(historyEntry.changed_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : null;

        return (
          <div key={status.id} className="flex items-start gap-[14px] px-4 py-3 relative">
            {!isLast && (
              <div className="absolute left-[27px] top-[38px] bottom-0 w-[1.5px] bg-border-light" />
            )}
            <div
              className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] ${
                isCompleted ? 'bg-primary' : 'bg-[#F0EDF8] border-[1.5px] border-[#D0C8E8]'
              }`}
            >
              {isCompleted && CHECKMARK}
            </div>
            <div className="flex-1">
              <span className={`text-[13px] font-semibold block mb-[1px] ${isCompleted ? 'text-text-primary' : 'text-text-disabled'}`}>
                {status.label}
              </span>
              {dateStr ? (
                <span className="text-[11px] text-text-disabled">{dateStr}</span>
              ) : isLast ? (
                <span className="text-[11px] text-[#C4C2D4] italic">Pending · $500 referral fee</span>
              ) : (
                <span className="text-[11px] text-[#C4C2D4] italic">Pending</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
