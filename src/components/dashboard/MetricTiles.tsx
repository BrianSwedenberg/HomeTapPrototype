import { useAppStore } from '../../store/useAppStore';

export function MetricTiles() {
  const leads = useAppStore(s => s.leads);

  const totalReferred = leads.length;

  const inProgress = leads.filter(
    l => !l.status_is_terminal && l.status_slug !== 'submitted',
  ).length;

  const closed = leads.filter(
    l => l.status_slug === 'closed' || l.status_slug === 'paid',
  ).length;

  const earned = leads.filter(l => l.status_slug === 'paid').length * 500;

  const tiles = [
    { label: 'Total Referred', value: String(totalReferred), color: 'text-primary',  sub: 'All time' },
    { label: 'In Progress',    value: String(inProgress),    color: 'text-text-primary', sub: 'Active leads' },
    { label: 'Closed',         value: String(closed),        color: 'text-[#00897B]', sub: 'Investments funded' },
    { label: 'Earned',         value: `$${earned.toLocaleString()}`, color: 'text-success', sub: 'Referral fees paid' },
  ];

  return (
    <div className="grid grid-cols-2 gap-[10px] mb-5">
      {tiles.map(tile => (
        <div key={tile.label} className="bg-bg-card rounded-[12px] p-[14px] px-4 shadow-card">
          <div className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.6px] mb-[6px]">{tile.label}</div>
          <div className={`text-[26px] font-bold leading-none tracking-[-0.5px] ${tile.color}`}>{tile.value}</div>
          <div className="text-[11px] text-text-disabled mt-1">{tile.sub}</div>
        </div>
      ))}
    </div>
  );
}
