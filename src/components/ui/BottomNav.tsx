import { useAppStore } from '../../store/useAppStore';
import type { Screen } from '../../types';

type ActiveTab = 'refer' | 'pipeline' | 'account' | null;

interface BottomNavProps {
  activeTab: ActiveTab;
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const navigateTo = useAppStore(s => s.navigateTo);

  const activeColor = '#6B3FA0';
  const inactiveColor = '#AAAAAA';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-bg-card border-t border-border-light flex items-center justify-around py-2 pb-4 z-[100] h-16">
      <NavItem
        label="Refer"
        isActive={activeTab === 'refer'}
        onClick={() => navigateTo('refer')}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke={activeTab === 'refer' ? activeColor : inactiveColor} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        }
        activeColor={activeColor}
        inactiveColor={inactiveColor}
      />
      <NavItem
        label="Pipeline"
        isActive={activeTab === 'pipeline'}
        onClick={() => navigateTo('pipeline')}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill={activeTab === 'pipeline' ? activeColor : inactiveColor}/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill={activeTab === 'pipeline' ? activeColor : inactiveColor}/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill={activeTab === 'pipeline' ? activeColor : inactiveColor}/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill={activeTab === 'pipeline' ? activeColor : inactiveColor}/>
          </svg>
        }
        activeColor={activeColor}
        inactiveColor={inactiveColor}
      />
      <NavItem
        label="Account"
        isActive={activeTab === 'account'}
        onClick={() => navigateTo('account')}
        icon={
          activeTab === 'account' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill={activeColor}/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={activeColor}/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke={inactiveColor} strokeWidth="1.8"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={inactiveColor} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )
        }
        activeColor={activeColor}
        inactiveColor={inactiveColor}
      />
    </nav>
  );
}

interface NavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  activeColor: string;
  inactiveColor: string;
}

function NavItem({ label, isActive, onClick, icon, activeColor, inactiveColor }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-[3px] cursor-pointer flex-1 py-1 bg-transparent border-none"
    >
      {icon}
      <span className="text-[10px] font-medium" style={{ color: isActive ? activeColor : inactiveColor }}>
        {label}
      </span>
    </button>
  );
}

import React from 'react';
