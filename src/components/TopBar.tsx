import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { MascotAvatar, StudentAvatar } from './MascotAvatar.tsx';
import { Search, Menu, X } from 'lucide-react';
import {
  PremiumFlameIcon,
  PremiumDiamondIcon,
  PremiumBellIcon,
  PremiumHomeIcon,
  PremiumTutorIcon,
  PremiumLearnIcon,
  PremiumPracticeIcon,
  PremiumGamepadIcon,
  PremiumTrophyIcon,
  PremiumProgressIcon,
  PremiumRulebookIcon,
} from './PremiumIcons.tsx';

interface TopBarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export function TopBar({ currentView, onNavigate, onOpenAuthModal }: TopBarProps) {
  const { user } = useAuth();
  const [searchVal, setSearchVal] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onNavigate('courses');
    }
  };

  return (
    <header className="shrink-0 relative z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile / Tablet Menu Toggle & Brand */}
        <div className="flex items-center gap-1.5 sm:gap-3 lg:hidden min-w-0">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-slate-900 rounded-xl hover:bg-sky-50/70 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer min-w-0 text-left py-1"
          >
            <MascotAvatar size="xs" className="hidden sm:inline-flex" />
            <span className="font-classical font-bold text-slate-800 text-[16px] sm:text-base whitespace-nowrap truncate">
              GrammarPath
            </span>
          </button>
        </div>

        {/* Search Bar (Desktop & Tablet) */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            aria-label="Search grammar topics, rules, or lessons"
            placeholder="Search grammar topics, rules, lessons..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="w-full min-h-[42px] pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F7FAFE] border border-slate-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          />
        </form>

        {/* Right Gamification Metrics (Fire + Diamond visible on top across all screens) */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Flame Streak */}
          <div
            title="Study Streak · নিয়মিত পড়ার ধারাবাহিকতা"
            className="flex items-center gap-1 sm:gap-1.5 text-slate-800 text-xs sm:text-sm font-bold cursor-default"
          >
            <PremiumFlameIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="tabular-nums">4</span>
          </div>

          {/* Diamond / XP Points */}
          <div
            title="Experience Points (XP)"
            className="flex items-center gap-1 sm:gap-1.5 text-slate-800 text-xs sm:text-sm font-bold cursor-default"
          >
            <PremiumDiamondIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="tabular-nums">850</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => setShowNotifications(!showNotifications)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-[#1E82E6] rounded-2xl hover:bg-sky-50/80 active:scale-95 transition-all relative cursor-pointer"
            >
              <PremiumBellIcon className="w-5 h-5" />
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  aria-hidden="true"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 text-xs space-y-2 gp-page-enter">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-800 font-bn">
                    <span>বিজ্ঞপ্তি ও নোটিফিকেশন</span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] text-[#1570CD] hover:text-[#1E82E6] hover:underline cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('ai-tutor');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-sky-50/75 hover:bg-sky-50 border border-sky-100 text-slate-800 font-bn transition-colors cursor-pointer flex items-start gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#1E82E6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <PremiumTutorIcon active className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">ব্যক্তিগত টিউটর প্রস্তুত</p>
                      <p className="text-[11px] text-slate-600">প্রাথমিক থেকে উচ্চতর ধাপের বাংলা গাইডেড পাঠ শুরু করুন।</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('courses');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200/80 text-slate-700 font-bn transition-colors cursor-pointer flex items-start gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#3898F0] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <PremiumLearnIcon active className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">নতুন পাঠ ও মূল্যায়ন কুইজ</p>
                      <p className="text-[11px] text-slate-500">Tense অধ্যায়ে নতুন অনুশীলন যুক্ত করা হয়েছে।</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Avatar / Compact Sign-in on Tablet (Mobile uses BottomNav Profile or Drawer) */}
          <div className="hidden sm:block lg:hidden">
            {user ? (
              <button
                type="button"
                aria-label="Open Profile"
                onClick={() => onNavigate('profile')}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full cursor-pointer"
              >
                <StudentAvatar
                  name={user.fullName}
                  className="w-8 h-8 text-xs"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <nav aria-label="Mobile Drawer Menu" className="lg:hidden mt-2.5 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs gp-page-enter max-h-[calc(100dvh-9rem)] overflow-y-auto pb-1">
          {/* Mobile Search Input inside Drawer */}
          <form
            onSubmit={e => {
              handleSearchSubmit(e);
              setIsMobileMenuOpen(false);
            }}
            className="sm:hidden relative mb-2"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              aria-label="Search grammar topics"
              placeholder="টপিক বা লেসন খুঁজুন (যেমন: Tense)..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full min-h-[42px] pl-10 pr-4 py-2 text-xs bg-[#F7FAFE] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:bg-white text-slate-800 placeholder:text-slate-400 font-bn"
            />
          </form>

          {[
            { id: 'home', label: 'Home (হোম)', icon: PremiumHomeIcon },
            { id: 'ai-tutor', label: 'Personal Tutor (ব্যক্তিগত শিক্ষক)', icon: PremiumTutorIcon },
            { id: 'courses', label: 'Curriculum (পাঠ্যক্রম)', icon: PremiumLearnIcon },
            { id: 'practice', label: 'Practice (অনুশীলন)', icon: PremiumPracticeIcon },
            { id: 'activities', label: 'Grammar Labs (বাক্য ও পদ ল্যাব)', icon: PremiumGamepadIcon },
            { id: 'quizzes', label: 'Assessments (মূল্যায়ন কুইজ)', icon: PremiumTrophyIcon },
            { id: 'dashboard', label: 'Progress (অগ্রগতি)', icon: PremiumProgressIcon },
            { id: 'library', label: 'Rulebook (ব্যাকরণ সূত্র)', icon: PremiumRulebookIcon },
          ].map(m => {
            const Icon = m.icon;
            const isActive = currentView === m.id;
            return (
              <button
                key={m.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  onNavigate(m.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  isActive ? 'bg-[#1E82E6] text-white' : 'text-slate-700 hover:bg-sky-50 hover:text-[#1570CD]'
                }`}
              >
                <Icon active={isActive} className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{m.label}</span>
              </button>
            );
          })}
          {!user && (
            <div className="sm:hidden pt-2 mt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuthModal('login');
                }}
                className="flex-1 min-h-[42px] py-2 text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-xl transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuthModal('register');
                }}
                className="flex-1 min-h-[42px] py-2 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
