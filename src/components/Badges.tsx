import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import {
  PremiumLearnIcon,
  PremiumFlameIcon,
  PremiumCrownIcon,
  PremiumZapIcon,
  PremiumTrophyIcon,
  PremiumAwardMedalIcon,
  PremiumTargetIcon,
} from './PremiumIcons.tsx';

export interface StudentMilestones {
  studyStreakDays: number;
  questionsAnswered: number;
  completedLessons: number;
  quizzesTaken: number;
  perfectQuizzes: number;
  avgQuizScore: number;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  category: 'streak' | 'practice' | 'mastery';
  target: number;
  unitLabel: string;
  unitLabelBn: string;
  getCurrentValue: (m: StudentMilestones) => number;
  isUnlocked: (m: StudentMilestones) => boolean;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  ringColor: string;
  badgeBg: string;
  textColor: string;
  actionView: string;
  actionLabel: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_step',
    title: 'First Step',
    titleBn: 'প্রথম পদক্ষেপ',
    description: 'Complete your first grammar lesson',
    descriptionBn: 'প্রথম গ্রামার লেসন সম্পন্ন করুন',
    category: 'mastery',
    target: 1,
    unitLabel: 'lesson',
    unitLabelBn: 'টি লেসন',
    getCurrentValue: m => Math.min(m.completedLessons, 1),
    isUnlocked: m => m.completedLessons >= 1,
    icon: PremiumLearnIcon,
    gradient: 'from-sky-50 to-blue-50 text-[#1570CD] border border-sky-200',
    ringColor: 'ring-sky-100',
    badgeBg: 'bg-sky-50/50 border-sky-200',
    textColor: 'text-[#1570CD]',
    actionView: 'courses',
    actionLabel: 'Open Curriculum',
  },
  {
    id: 'streak_3',
    title: '3-Day Consistency',
    titleBn: '৩ দিনের নিয়মিত অধ্যয়ন',
    description: 'Study grammar across 3 active days',
    descriptionBn: '৩ দিন নিয়মিত ব্যাকরণ অনুশীলন সম্পন্ন করুন',
    category: 'streak',
    target: 3,
    unitLabel: 'days',
    unitLabelBn: 'দিন',
    getCurrentValue: m => Math.min(m.studyStreakDays, 3),
    isUnlocked: m => m.studyStreakDays >= 3,
    icon: PremiumFlameIcon,
    gradient: 'from-amber-50 to-stone-50 text-amber-900 border border-amber-200/80',
    ringColor: 'ring-amber-100/70',
    badgeBg: 'bg-blue-50/40 border-blue-200',
    textColor: 'text-amber-800',
    actionView: 'practice',
    actionLabel: 'Continue Practice',
  },
  {
    id: 'streak_7',
    title: '7-Day Scholar Streak',
    titleBn: '৭ দিনের ধারাবাহিক সম্মাননা',
    description: 'Maintain a 7-day learning streak',
    descriptionBn: 'টানা ৭ দিন অধ্যয়নের লক্ষ্য অর্জন করুন',
    category: 'streak',
    target: 7,
    unitLabel: 'days',
    unitLabelBn: 'দিন',
    getCurrentValue: m => Math.min(m.studyStreakDays, 7),
    isUnlocked: m => m.studyStreakDays >= 7,
    icon: PremiumCrownIcon,
    gradient: 'from-amber-50 to-stone-50 text-amber-900 border border-amber-200/80',
    ringColor: 'ring-amber-100/70',
    badgeBg: 'bg-blue-50/40 border-blue-200',
    textColor: 'text-amber-800',
    actionView: 'activities',
    actionLabel: 'Open Grammar Labs',
  },
  {
    id: 'questions_25',
    title: '25 Questions Milestone',
    titleBn: '২৫ প্রশ্ন সমাধান',
    description: 'Answer 25 grammar quiz questions',
    descriptionBn: '২৫টি ব্যাকরণ প্রশ্নের উত্তর প্রদান করুন',
    category: 'practice',
    target: 25,
    unitLabel: 'questions',
    unitLabelBn: 'টি প্রশ্ন',
    getCurrentValue: m => Math.min(m.questionsAnswered, 25),
    isUnlocked: m => m.questionsAnswered >= 25,
    icon: PremiumZapIcon,
    gradient: 'from-sky-50 to-blue-50 text-[#1570CD] border border-sky-200',
    ringColor: 'ring-sky-100',
    badgeBg: 'bg-sky-50/50 border-sky-200',
    textColor: 'text-[#1570CD]',
    actionView: 'practice',
    actionLabel: 'Practice Questions',
  },
  {
    id: 'questions_100',
    title: '100 Questions Century',
    titleBn: '১০০ প্রশ্নের মাইলফলক',
    description: 'Answer 100 grammar questions',
    descriptionBn: 'সর্বমোট ১০০টি প্রশ্নের উত্তর সম্পন্ন করুন',
    category: 'practice',
    target: 100,
    unitLabel: 'questions',
    unitLabelBn: 'টি প্রশ্ন',
    getCurrentValue: m => Math.min(m.questionsAnswered, 100),
    isUnlocked: m => m.questionsAnswered >= 100,
    icon: HelpCircle,
    gradient: 'from-sky-50 to-blue-50 text-[#1570CD] border border-sky-200',
    ringColor: 'ring-sky-100',
    badgeBg: 'bg-sky-50/50 border-sky-200',
    textColor: 'text-[#1570CD]',
    actionView: 'quizzes',
    actionLabel: 'Take Assessment',
  },
  {
    id: 'perfect_quiz',
    title: 'Distinction in Quiz',
    titleBn: 'শতভাগ সঠিক মূল্যায়ন',
    description: 'Score 100% on any grammar quiz',
    descriptionBn: 'যেকোনো মূল্যায়ন কুইজে ১০০% নম্বর অর্জন করুন',
    category: 'practice',
    target: 1,
    unitLabel: 'quiz',
    unitLabelBn: 'টি কুইজ',
    getCurrentValue: m => Math.min(m.perfectQuizzes, 1),
    isUnlocked: m => m.perfectQuizzes >= 1,
    icon: PremiumTrophyIcon,
    gradient: 'from-amber-50 to-stone-50 text-amber-900 border border-amber-200/80',
    ringColor: 'ring-amber-100/70',
    badgeBg: 'bg-blue-50/40 border-blue-200',
    textColor: 'text-amber-800',
    actionView: 'quizzes',
    actionLabel: 'Start Assessment',
  },
  {
    id: 'lessons_5',
    title: 'Grammar Explorer',
    titleBn: 'ব্যাকরণ অন্বেষক',
    description: 'Complete 5 grammar lessons',
    descriptionBn: '৫টি ব্যাকরণ পাঠ সফলভাবে সম্পন্ন করুন',
    category: 'mastery',
    target: 5,
    unitLabel: 'lessons',
    unitLabelBn: 'টি পাঠ',
    getCurrentValue: m => Math.min(m.completedLessons, 5),
    isUnlocked: m => m.completedLessons >= 5,
    icon: PremiumAwardMedalIcon,
    gradient: 'from-sky-50 to-blue-50 text-[#1570CD] border border-sky-200',
    ringColor: 'ring-sky-100',
    badgeBg: 'bg-sky-50/50 border-sky-200',
    textColor: 'text-[#1570CD]',
    actionView: 'courses',
    actionLabel: 'Explore Curriculum',
  },
  {
    id: 'accuracy_pro',
    title: 'Precision Scholar',
    titleBn: 'নির্ভুল ব্যাকরণবিদ',
    description: 'Maintain 85%+ average quiz score',
    descriptionBn: 'কুইজে গড়ে ৮৫% বা তার বেশি নম্বর বজায় রাখুন',
    category: 'mastery',
    target: 85,
    unitLabel: '% avg',
    unitLabelBn: '% গড়',
    getCurrentValue: m => (m.quizzesTaken > 0 ? Math.min(m.avgQuizScore, 85) : 0),
    isUnlocked: m => m.quizzesTaken >= 1 && m.avgQuizScore >= 85,
    icon: PremiumTargetIcon,
    gradient: 'from-sky-50 to-blue-50 text-[#1570CD] border border-sky-200',
    ringColor: 'ring-sky-100',
    badgeBg: 'bg-sky-50/50 border-sky-200',
    textColor: 'text-[#1570CD]',
    actionView: 'quizzes',
    actionLabel: 'Improve Accuracy',
  },
];

interface BadgesProps {
  milestones: StudentMilestones;
  isAuthenticated: boolean;
  onNavigate?: (view: string, param?: string) => void;
}

export function Badges({ milestones, isAuthenticated, onNavigate }: BadgesProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  const unlockedCount = BADGE_DEFINITIONS.filter(b => b.isUnlocked(milestones)).length;

  const filteredBadges = BADGE_DEFINITIONS.filter(b => {
    const unlocked = b.isUnlocked(milestones);
    if (filter === 'unlocked') return unlocked;
    if (filter === 'locked') return !unlocked;
    return true;
  });

  const selectedBadge = BADGE_DEFINITIONS.find(b => b.id === selectedBadgeId) || null;

  return (
    <section className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold font-classical text-slate-800">
              Academic Honors &amp; Milestones
            </h2>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1570CD] tabular-nums">
              <PremiumAwardMedalIcon className="w-4 h-4 text-[#1E82E6]" />
              <span>{unlockedCount} / {BADGE_DEFINITIONS.length} Earned</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 font-bn mt-0.5">
            {isAuthenticated
              ? 'নিয়মিত অধ্যয়ন, ধারাবাহিকতা ও মূল্যায়ন পরীক্ষার ভিত্তিতে অর্জিত সম্মাননাসমূহ।'
              : 'আপনার অধ্যয়নের অগ্রগতি ও অর্জিত সম্মাননাসমূহ সংরক্ষণ করতে অনুগ্রহ করে লগইন করুন।'}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex items-center p-1 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'unlocked', label: `Earned (${unlockedCount})` },
            { id: 'locked', label: `Locked (${BADGE_DEFINITIONS.length - unlockedCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as 'all' | 'unlocked' | 'locked')}
              className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap truncate ${
                filter === tab.id
                  ? 'bg-[#1E82E6] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#1570CD]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      {filteredBadges.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center">
          <p className="text-sm font-semibold text-slate-700 font-bn">
            {filter === 'unlocked'
              ? 'এখনো কোনো সম্মাননা অর্জিত হয়নি — প্রথম পাঠ বা মূল্যায়ন সম্পন্ন করে শুরু করুন।'
              : 'অভিনন্দন। আপনি নির্ধারিত সকল মাইলফলক সম্মাননা অর্জন করেছেন।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {filteredBadges.map(badge => {
            const Icon = badge.icon;
            const unlocked = badge.isUnlocked(milestones);
            const currentVal = badge.getCurrentValue(milestones);
            const pct = Math.min(100, Math.round((currentVal / badge.target) * 100));
            const isSelected = selectedBadgeId === badge.id;

            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => setSelectedBadgeId(isSelected ? null : badge.id)}
                className={`text-left p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-3.5 sm:gap-3 group ${
                  unlocked
                    ? `bg-white ${
                        isSelected ? 'border-[#1E82E6] ring-2 ring-sky-100' : 'border-slate-200/85 hover:border-sky-400'
                      } shadow-xs`
                    : `bg-slate-50/70 ${
                        isSelected ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200/70 hover:border-sky-300'
                      }`
                }`}
              >
                <div className="flex items-center sm:items-start justify-between gap-2 shrink-0">
                  {/* Badge Medallion */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                      unlocked
                        ? `bg-linear-to-br ${badge.gradient} shadow-xs ring-4 ${badge.ringColor}`
                        : 'bg-slate-100 text-slate-400 border border-slate-200/80'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Status Label (Desktop top-right) */}
                  <div className="hidden sm:block">
                    {unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title, Description & Progress */}
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm font-extrabold truncate ${
                          unlocked ? 'text-slate-800' : 'text-slate-600'
                        }`}
                      >
                        {badge.title}
                      </h3>
                      {/* Status Label (Mobile inline right) */}
                      <span className="sm:hidden shrink-0">
                        {unlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Earned</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 font-bn truncate">
                      {badge.titleBn}
                    </p>
                    <p className="text-[11px] text-slate-500 font-bn leading-snug pt-0.5 line-clamp-2">
                      {badge.descriptionBn}
                    </p>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center justify-between text-[10px] font-bold tabular-nums">
                      <span className={unlocked ? 'text-emerald-800' : 'text-slate-500'}>
                        {unlocked ? 'Completed' : `${currentVal} / ${badge.target} ${badge.unitLabel}`}
                      </span>
                      <span className={unlocked ? 'text-emerald-800' : 'text-slate-400'}>{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          unlocked ? 'bg-[#1E82E6]' : 'bg-[#60A5FA]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Badge Detail Bar */}
      {selectedBadge && (
        <div
          className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in ${
            selectedBadge.isUnlocked(milestones)
              ? 'bg-sky-50/75 border-sky-200'
              : selectedBadge.badgeBg
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-linear-to-br ${selectedBadge.gradient} shadow-2xs`}
            >
              <selectedBadge.icon className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-800">
                  {selectedBadge.title} · {selectedBadge.titleBn}
                </h4>
              </div>
              <p className="text-xs text-slate-600 font-bn">
                {selectedBadge.description} —{' '}
                {selectedBadge.isUnlocked(milestones)
                  ? 'অভিনন্দন! আপনি এই মাইলফলকটি অর্জন করেছেন।'
                  : `অগ্রগতি: ${selectedBadge.getCurrentValue(milestones)} / ${selectedBadge.target} ${selectedBadge.unitLabelBn}`}
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate(selectedBadge.actionView)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
            >
              <span>{selectedBadge.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
