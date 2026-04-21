import type { LeadWithStatus } from '../../types';

interface LeadSummaryCardProps {
  lead: LeadWithStatus;
}

export function LeadSummaryCard({ lead }: LeadSummaryCardProps) {
  const referredOn = new Date(lead.submitted_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const rows = [
    { icon: '👤', label: 'Homeowner',        content: `${lead.first_name} ${lead.last_name}` },
    { icon: '📍', label: 'Property address',  content: `${lead.address1}, ${lead.city}, ${lead.state} ${lead.zip}` },
    { icon: '💰', label: 'Use of funds',      content: lead.use_case, isPill: true },
    { icon: '📝', label: 'Notes',             content: lead.notes || 'No notes' },
    { icon: '📅', label: 'Referred on',       content: referredOn },
  ];

  return (
    <div className="bg-bg-card rounded-md border-[1.5px] border-border-light shadow-card overflow-hidden">
      {rows.map((row, idx) => (
        <div
          key={row.label}
          className={`flex items-start gap-[10px] px-4 py-3 ${idx < rows.length - 1 ? 'border-b border-[#F5F4FA]' : ''}`}
        >
          <span className="text-[14px] flex-shrink-0 mt-[1px] w-[18px] text-center">{row.icon}</span>
          <div className="flex flex-col gap-[1px] flex-1">
            <span className="text-[11px] text-text-disabled font-medium">{row.label}</span>
            {row.isPill ? (
              <span className="inline-flex text-[11px] text-primary bg-primary-light rounded-full py-[2px] px-2 font-semibold mt-[2px] w-fit">
                {row.content}
              </span>
            ) : (
              <span className="text-[13px] text-text-primary font-medium leading-[1.4]">{row.content}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
