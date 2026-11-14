import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { MascotAvatar, StudentAvatar } from './MascotAvatar.tsx';
import { LogOut, ShieldAlert } from 'lucide-react';
import {
  PremiumHomeIcon,
  PremiumTutorIcon,
  PremiumLearnIcon,
  PremiumPracticeIcon,
  PremiumGamepadIcon,
  PremiumTrophyIcon,
  PremiumProgressIcon,
  PremiumRulebookIcon,
  PremiumCrownIcon,
} from './PremiumIcons.tsx';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export function Sidebar({ currentView, onNavigate, onOpenAuthModal }: SidebarProps) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: PremiumHomeIcon, bnLabel: 'হোম' },
    { id: 'ai-tutor', label: 'Personal Tutor', icon: PremiumTutorIcon, bnLabel: 'ব্যক্তিগত শিক্ষক' },
    { id: 'courses', label: 'Curriculum', icon: PremiumLearnIcon, bnLabel: 'পাঠ্যক্রম' },
    { id: 'practice', label: 'Practice', icon: PremiumPracticeIcon, bnLabel: 'অনুশীলন' },
    { id: 'activities', label: 'Grammar Labs', icon: PremiumGamepadIcon, bnLabel: 'বাক্য ও পদ ল্যাব' },
    { id: 'quizzes', label: 'Assessments', icon: PremiumTrophyIcon, bnLabel: 'মূল্যায়ন কুইজ' },
    { id: 'dashboard', label: 'Progress', icon: PremiumProgressIcon, bnLabel: 'অগ্রগতি' },
    { id: 'library', label: 'Rulebook', icon: PremiumRulebookIcon, bnLabel: 'ব্যাকরণ সূত্র' },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 bg-white border-r border-slate-200/80 p-5 shrink-0 h-full overflow-y-auto">
      {/* Brand Header with Catnivo */}
      <div className="space-y-6">
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <MascotAvatar size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-classical text-xl font-bold tracking-tight text-slate-800 group-hover:text-[#1570CD] transition-colors">
                GrammarPath
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wide">
              Learn Smart · Grow Every Day
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation" className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
                className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 cursor-pointer active:scale-[0.99] ${
                  isActive
                    ? 'bg-[#1E82E6] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1570CD] hover:bg-sky-50/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon active={isActive} className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                <span className={`text-[11px] font-bn whitespace-nowrap ${isActive ? 'text-sky-100 font-medium' : 'text-slate-400'}`}>
                  {item.bnLabel}
                </span>
              </button>
            );
          })}

          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-[#1E82E6] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#1570CD] hover:bg-sky-50/80'
              }`}
            >
              <ShieldAlert className={`w-5 h-5 ${currentView === 'admin' ? 'text-white' : 'text-[#1E82E6]'}`} />
              <span>Admin Console</span>
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        {/* Academy Open Access Card */}
        <div className="p-4 rounded-2xl bg-sky-50/75 border border-sky-200/80 text-left space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-white border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
              <PremiumCrownIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-800">
              Open Access Academy
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-bn leading-relaxed">
            সম্পূর্ণ বিনামূল্যে ধারাবাহিক পাঠ্যক্রম ও মূল্যায়ন কুইজের সুবিধা।
          </p>
          <button
            onClick={() => onNavigate('courses')}
            className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-all shadow-2xs cursor-pointer font-bn"
          >
            পাঠ্যক্রম দেখুন
          </button>
        </div>

        {/* User Profile Pill */}
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50/60 border border-sky-200/70">
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer text-left hover:opacity-85 transition-opacity"
            >
              <StudentAvatar name={user.fullName} className="w-8 h-8 text-xs shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user.fullName.split(' ')[0]}
                </p>
                <p className="text-[10px] text-[#1570CD] font-medium">
                  Profile · শিক্ষার্থী প্রোফাইল
                </p>
              </div>
            </button>

            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 text-slate-400 hover:text-rose-700 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="flex-1 py-2 text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200/70 rounded-xl transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => onOpenAuthModal('register')}
              className="flex-1 py-2 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
