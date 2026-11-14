import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { DashboardSummary } from '../types/index.ts';
import { StudentAvatar } from '../components/MascotAvatar.tsx';
import { Badges, StudentMilestones } from '../components/Badges.tsx';
import {
  LogOut,
  LogIn,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import {
  PremiumFlameIcon,
  PremiumAwardMedalIcon,
  PremiumTutorIcon,
  PremiumGamepadIcon,
  PremiumRulebookIcon,
} from '../components/PremiumIcons.tsx';

interface ProfilePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export function ProfilePage({ onNavigate, onOpenAuthModal }: ProfilePageProps) {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.getDashboardSummary().then(setSummary).catch(() => {});
  }, [user]);

  const milestones: StudentMilestones = {
    studyStreakDays: summary?.stats?.studyStreakDays ?? 0,
    questionsAnswered: summary?.stats?.questionsAnswered ?? 0,
    completedLessons: summary?.completedLessons ?? 0,
    quizzesTaken: summary?.stats?.quizzesTaken ?? 0,
    perfectQuizzes: summary?.stats?.perfectQuizzes ?? 0,
    avgQuizScore: summary?.stats?.avgQuizScore ?? 0,
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
      {/* Student Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <StudentAvatar
            name={user?.fullName || 'Guest Learner'}
            className="w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl shrink-0"
          />
          <div className="min-w-0 space-y-1">
            <h1 className="text-lg sm:text-2xl font-bold font-classical text-slate-800 truncate">
              {user ? user.fullName : 'Guest Student'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 truncate">
              {user ? user.email : 'অধ্যয়নের অগ্রগতি সংরক্ষণ করতে অনুগ্রহ করে লগইন করুন'}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold text-[#1570CD] font-bn">
              <span>নিবন্ধিত শিক্ষার্থী</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Level {Math.max(1, Math.floor(milestones.completedLessons / 3) + 1)} Scholar</span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs font-bold text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/80 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuthModal('login')}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer font-bn"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন / অ্যাকাউন্ট খুলুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-2xl border border-slate-200/85 p-3 sm:p-4 text-center space-y-1 shadow-2xs">
          <div className="flex items-center justify-center gap-1.5">
            <PremiumFlameIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="text-base sm:text-xl font-extrabold text-slate-800 tabular-nums">
              {milestones.studyStreakDays}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 font-bn">দিনের স্ট্রিক</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/85 p-3 sm:p-4 text-center space-y-1 shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-[#1E82E6]">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="text-base sm:text-xl font-extrabold text-slate-800 tabular-nums">
              {milestones.completedLessons}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 font-bn">সম্পন্ন লেসন</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/85 p-3 sm:p-4 text-center space-y-1 shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-[#1E82E6]">
            <PremiumAwardMedalIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="text-base sm:text-xl font-extrabold text-slate-800 tabular-nums">
              {milestones.avgQuizScore}%
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 font-bn">গড় স্কোর</p>
        </div>
      </div>

      {/* Shortcuts to Tools & Study Modes */}
      <div className="bg-white rounded-3xl border border-slate-200/85 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {[
          {
            id: 'ai-tutor',
            title: 'Personal Grammar Tutor',
            subtitle: '১৩টি সুশৃঙ্খল ধাপে বাংলা ব্যাখ্যা, পদ বিশ্লেষণ ও প্রশ্নোত্তর',
            icon: PremiumTutorIcon,
            color: 'bg-sky-50 border border-sky-200/80 text-[#1E82E6]',
          },
          {
            id: 'activities',
            title: 'Interactive Grammar Labs',
            subtitle: 'শব্দ বিন্যাস, পদ নির্ণয় ও কাল রূপান্তরের ব্যবহারিক অনুশীলন',
            icon: PremiumGamepadIcon,
            color: 'bg-sky-50 border border-sky-200/80 text-[#1E82E6]',
          },
          {
            id: 'library',
            title: 'Grammar Rulebook & Reference',
            subtitle: 'কাল, বাক্য গঠন ও আর্টিকেলের সকল মৌলিক সূত্রের সংকলন',
            icon: PremiumRulebookIcon,
            color: 'bg-sky-50 border border-sky-200/80 text-[#1E82E6]',
          },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="w-full min-h-[64px] p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-sky-50/50 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${item.color}`}>
                  <Icon active className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-extrabold text-slate-800 truncate">{item.title}</h2>
                  <p className="text-xs text-slate-500 font-bn line-clamp-2 sm:truncate">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1E82E6] transition-colors shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Milestone Badges */}
      <Badges
        milestones={milestones}
        isAuthenticated={Boolean(user)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
