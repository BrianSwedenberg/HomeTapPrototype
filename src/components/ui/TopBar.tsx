interface TopBarProps {
  label: string;
  name: string;
  initials: string;
  avatarColor?: 'purple' | 'teal';
  backButton?: React.ReactNode;
}

import React from 'react';

export function TopBar({ label, name, initials, avatarColor = 'purple', backButton }: TopBarProps) {
  const avatarClass =
    avatarColor === 'teal'
      ? 'bg-teal-light text-[#00897B]'
      : 'bg-primary-light text-primary';

  return (
    <div className="bg-bg-card px-5 py-4 pb-[14px] border-b border-border-light flex items-center justify-between sticky top-0 z-50">
      {backButton ? (
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {backButton}
          <span className="text-[17px] font-bold text-text-primary tracking-[-0.2px] truncate flex-1">{name}</span>
        </div>
      ) : (
        <div>
          <span className="text-xs font-medium text-text-secondary uppercase tracking-[0.6px] block">{label}</span>
          <span className="text-[18px] font-bold text-text-primary tracking-[-0.3px] block">{name}</span>
        </div>
      )}
      <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${avatarClass}`}>
        {initials}
      </div>
    </div>
  );
}
