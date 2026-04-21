interface StatusBadgeProps {
  label: string;
  colorHex: string;
  size?: 'sm' | 'md';
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function StatusBadge({ label, colorHex, size = 'sm' }: StatusBadgeProps) {
  const bg   = hexToRgba(colorHex, 0.12);
  const text = colorHex;
  const fontSize = size === 'md' ? '13px' : '11px';
  const padding  = size === 'md' ? '4px 12px' : '3px 9px';

  return (
    <span
      style={{ backgroundColor: bg, color: text, fontSize, padding }}
      className="inline-flex items-center rounded-full font-semibold whitespace-nowrap flex-shrink-0"
    >
      {label}
    </span>
  );
}
