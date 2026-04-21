import { useAppStore } from '../../store/useAppStore';
import { LeadCard } from './LeadCard';

// FUTURE: pipeline filters (by status, date, use case)

export function LeadList() {
  const leads = useAppStore(s => s.leads);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px] font-bold text-text-primary">Your Referrals</span>
        <span className="text-xs text-primary bg-primary-light rounded-full py-[2px] px-2 font-semibold">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        </span>
      </div>
      {leads.map(lead => (
        <LeadCard key={lead.LeadID} lead={lead} />
      ))}
      {leads.length === 0 && (
        <p className="text-[13px] text-text-secondary text-center py-8">No referrals yet. Tap + to refer your first homeowner.</p>
      )}
    </div>
  );
}
