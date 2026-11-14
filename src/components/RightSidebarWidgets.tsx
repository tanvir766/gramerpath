import React, { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { StudentAvatar } from './MascotAvatar.tsx';
import { PremiumCrownIcon, PremiumGiftIcon } from './PremiumIcons.tsx';

interface DailyGoalCardProps {
  streakDays?: number;
  completedLessons?: number;
  dailyGoalMin?: number;
  onChangeGoalMin?: (mins: number) => void;
}

export function DailyGoalCard({
  streakDays = 0,
  completedLessons = 0,
  dailyGoalMin: controlledGoal,
  onChangeGoalMin,
}: DailyGoalCardProps) {
  const [localGoal, setLocalGoal] = useState<number>(20);
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);

  const dailyGoalMin = controlledGoal ?? localGoal;
  const updateGoalMin = (mins: number) => {
    if (onChangeGoalMin) {
      onChangeGoalMin(mins);
    } else {
      setLocalGoal(mins);
    }
    setIsEditingGoal(false);
  };

  const studiedMinutes = Math.min(dailyGoalMin, Math.max(5, completedLessons * 5));
  const goalPct = Math.round((studiedMinutes / dailyGoalMin) * 100);
  const activeChecks = streakDays > 0 ? streakDays : completedLessons > 0 ? 1 : 0;

  const weekDays = [
    { label: 'M', full: 'Mon', done: activeChecks >= 1 },
    { label: 'T', full: 'Tue', done: activeChecks >= 2 },
    { label: 'W', full: 'Wed', done: activeChecks >= 3 },
    { label: 'T', full: 'Thu', done: activeChecks >= 4 },
    { label: 'F', full: 'Fri', done: activeChecks >= 5 },
    { label: 'S', full: 'Sat', done: activeChecks >= 6 },
    { label: 'S', full: 'Sun', done: activeChecks >= 7 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-5 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-3.5 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-classical text-slate-800">Daily Study Goal</h3>
        <button
          type="button"
          onClick={() => setIsEditingGoal(!isEditingGoal)}
          className="min-h-[36px] px-2.5 text-xs font-semibold text-[#1570CD] hover:text-[#1E82E6] hover:bg-sky-50 rounded-xl flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          <span>{isEditingGoal ? 'Done' : 'Adjust'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {isEditingGoal && (
        <div className="flex items-center gap-1.5 p-1 bg-sky-50/80 rounded-xl gp-page-enter">
          {[10, 20, 30].map(mins => (
            <button
              key={mins}
              type="button"
              onClick={() => updateGoalMin(mins)}
              className={`flex-1 min-h-[38px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer tabular-nums ${
                dailyGoalMin === mins
                  ? 'bg-[#1E82E6] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#1570CD]'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
      )}

      {/* Circular Progress Ring + Streak Message & Weekdays */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative w-16 h-16 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
            <path
              className="text-sky-100"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#1E82E6] transition-all duration-700 ease-out"
              strokeDasharray={`${goalPct}, 100`}
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-lg sm:text-xl font-extrabold text-slate-800 leading-none tabular-nums">
              {studiedMinutes}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">min</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {streakDays > 0 ? 'Consistent Progress' : 'Steady Beginning'}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-snug">
              {streakDays > 0
                ? `You have maintained a ${streakDays}-day study streak.`
                : `Daily goal: ${dailyGoalMin} min · নিয়মিত অনুশীলন শুরু করুন`}
            </p>
          </div>

          {/* 7-Day Compact Check Row */}
          <div className="flex items-center justify-between gap-0.5 sm:gap-1">
            {weekDays.map((w, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  aria-label={`${w.full}: ${w.done ? 'Completed' : 'Pending'}`}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors ${
                    w.done
                      ? 'bg-[#1E82E6] text-white shadow-2xs'
                      : 'bg-slate-50 text-transparent border border-slate-200'
                  }`}
                >
                  {w.done && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[10px] font-bold text-slate-500">{w.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface RightWidgetsProps {
  onStartQuiz: () => void;
  onExploreCourses: () => void;
  userName?: string;
  streakDays?: number;
  completedLessons?: number;
  dailyGoalMin?: number;
  onChangeGoalMin?: (mins: number) => void;
}

export function RightSidebarWidgets({
  onStartQuiz,
  onExploreCourses,
  userName = 'Learner',
  streakDays = 0,
  completedLessons = 0,
  dailyGoalMin,
  onChangeGoalMin,
}: RightWidgetsProps) {
  const leaderboardUsers = [
    { rank: 1, name: 'Sophie', xp: '3,420 XP', isCrown: true },
    { rank: 2, name: `${userName} (You)`, xp: '3,150 XP', isYou: true },
    { rank: 3, name: 'Daniel', xp: '2,980 XP' },
    { rank: 4, name: 'Maya', xp: '2,760 XP' },
    { rank: 5, name: 'Liam', xp: '2,540 XP' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Daily Goal Card (Desktop sidebar placement) */}
      <div className="hidden xl:block">
        <DailyGoalCard
          streakDays={streakDays}
          completedLessons={completedLessons}
          dailyGoalMin={dailyGoalMin}
          onChangeGoalMin={onChangeGoalMin}
        />
      </div>

      {/* 2. Weekly Standings Widget */}
      <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-classical text-slate-800">Weekly Standings</h3>
          <span className="text-[11px] font-semibold text-[#1570CD] bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200/75">
            This Week
          </span>
        </div>

        <div className="space-y-1.5">
          {leaderboardUsers.map(u => (
            <div
              key={u.rank}
              className={`flex items-center justify-between p-2.5 rounded-2xl transition-colors ${
                u.isYou
                  ? 'bg-sky-50/85 border border-sky-200 text-slate-800 font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-5 text-center text-xs font-extrabold tabular-nums ${
                    u.rank === 1 ? 'text-amber-700' : u.isYou ? 'text-[#1570CD]' : 'text-slate-400'
                  }`}
                >
                  {u.rank}
                </span>

                <StudentAvatar name={u.name} className="w-7 h-7 text-xs shrink-0" />

                <div className="truncate">
                  <p className="text-xs font-semibold truncate flex items-center gap-1">
                    <span className="truncate">{u.name}</span>
                    {u.isCrown && (
                      <span title="Weekly Champion" className="inline-flex shrink-0">
                        <PremiumCrownIcon className="w-4 h-4" />
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold tabular-nums shrink-0 ml-2 ${u.isYou ? 'text-[#1570CD]' : 'text-slate-600'}`}>
                {u.xp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Next Milestone Distinction Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/85 shadow-[0_2px_12px_rgba(30,130,230,0.04)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-sky-50/80 border border-sky-200/80 flex items-center justify-center shrink-0">
            <PremiumGiftIcon className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 font-bn truncate">
              {completedLessons >= 5 ? '5 Lessons Completed' : `Complete ${Math.max(1, 5 - completedLessons)} more lessons`}
            </p>
            <p className="text-[11px] text-slate-600 font-bn">
              to earn the <span className="font-semibold text-[#1570CD]">Grammar Explorer</span> badge
            </p>
            <div className="mt-2 w-28 max-w-full bg-sky-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#1E82E6] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((completedLessons / 5) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartQuiz}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-sky-50/75 rounded-xl shadow-xs text-[#1570CD] hover:text-white hover:bg-[#1E82E6] border border-sky-200 hover:border-[#1E82E6] active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="Start quick grammar practice"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
