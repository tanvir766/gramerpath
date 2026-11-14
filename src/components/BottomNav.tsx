import React from 'react';
import {
  PremiumHomeIcon,
  PremiumLearnIcon,
  PremiumPracticeIcon,
  PremiumProgressIcon,
  PremiumProfileIcon,
} from './PremiumIcons.tsx';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  const items = [
    { id: 'home', label: 'Home', icon: PremiumHomeIcon },
    { id: 'courses', label: 'Learn', icon: PremiumLearnIcon },
    { id: 'practice', label: 'Practice', icon: PremiumPracticeIcon },
    { id: 'dashboard', label: 'Progress', icon: PremiumProgressIcon },
    { id: 'profile', label: 'Profile', icon: PremiumProfileIcon },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="shrink-0 sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 pt-1.5 pb-safe shadow-[0_-4px_20px_rgba(15,23,42,0.06)]"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-5 items-center">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              onClick={() => onNavigate(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer group ${
                isActive
                  ? 'text-[#1E82E6] font-bold bg-sky-50/90'
                  : 'text-slate-500 hover:text-[#1E82E6] font-medium'
              }`}
            >
              <Icon
                active={isActive}
                className={`w-[22px] h-[22px] transition-transform duration-150 ${
                  isActive ? 'scale-105' : 'group-hover:scale-105'
                }`}
              />
              <span className="text-[11px] leading-none tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
