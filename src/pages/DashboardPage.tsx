import React, { useEffect, useState } from 'react';
import { DashboardSummary } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { CatnivoCharacter } from '../components/CatnivoCharacter.tsx';
import { RightSidebarWidgets, DailyGoalCard } from '../components/RightSidebarWidgets.tsx';
import { InteractiveExerciseModal } from '../components/InteractiveExerciseModal.tsx';
import { Badges, StudentMilestones } from '../components/Badges.tsx';
import {
  ArrowRight,
  ChevronRight,
  MessageSquare,
  Lock,
  Clock,
} from 'lucide-react';
import {
  PremiumLearnIcon,
  PremiumTutorIcon,
  PremiumPracticeIcon,
  PremiumTimerIcon,
  PremiumPuzzleIcon,
  PremiumTargetIcon,
  PremiumHeadphonesIcon,
  PremiumMicIcon,
  PremiumBooksIcon,
  PremiumPenIcon,
  PremiumArticlesIcon,
  PremiumVoiceIcon,
} from '../components/PremiumIcons.tsx';

interface DashboardPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [dailyGoalMin, setDailyGoalMin] = useState<number>(20);

  // Quick Exercise Modal
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [exerciseQuestions, setExerciseQuestions] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const dashRes = await api.getDashboardSummary().catch(() => null);
        if (dashRes) setSummary(dashRes);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      }
    }
    loadData();
  }, [user]);

  const handleLaunchPractice = async (lessonId?: string) => {
    try {
      const qList = await api.getQuizQuestions({
        lessonId: lessonId || 'lsn_4_2',
        count: 5,
      });
      setExerciseQuestions(qList);
      setIsExerciseOpen(true);
    } catch {
      setIsExerciseOpen(true);
    }
  };

  const studentName = user ? user.fullName.split(' ')[0] : 'Learner';
  const continueLesson = summary?.continueLesson;

  const milestones: StudentMilestones = {
    studyStreakDays: summary?.stats?.studyStreakDays ?? 0,
    questionsAnswered: summary?.stats?.questionsAnswered ?? 0,
    completedLessons: summary?.completedLessons ?? 0,
    quizzesTaken: summary?.stats?.quizzesTaken ?? 0,
    perfectQuizzes: summary?.stats?.perfectQuizzes ?? 0,
    avgQuizScore: summary?.stats?.avgQuizScore ?? 0,
  };

  const pathNodes = [
    {
      id: 'course_1',
      title: 'Basics',
      titleBn: 'প্রাথমিক ভিত্তি',
      icon: MessageSquare,
      status: 'completed',
    },
    {
      id: 'course_2',
      title: 'Parts of Speech',
      titleBn: 'পদ প্রকরণ',
      icon: PremiumLearnIcon,
      status: 'completed',
    },
    {
      id: 'course_3',
      title: 'Sentences',
      titleBn: 'বাক্য গঠন',
      icon: PremiumPracticeIcon,
      status: 'active',
    },
    {
      id: 'course_4',
      title: 'Tenses',
      titleBn: '১২টি টেন্স',
      icon: Clock,
      status: 'current',
    },
    {
      id: 'course_5',
      title: 'Advanced',
      titleBn: 'উচ্চতর',
      icon: Lock,
      status: 'locked',
    },
  ];

  return (
    <div className="pb-6 lg:p-8 space-y-5 sm:space-y-6 lg:space-y-8">
      {/* 2-Column Grid: Left Content (Main) + Right Column (Goal, Leaderboard, Reward) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {/* Main 2-Column Left Area */}
        <div className="xl:col-span-2 space-y-5 sm:space-y-6 lg:space-y-8">
          {/* 1. Light Sky-Blue Hero Banner: Greeting Writing + Cat Mascot */}
          <div className="relative overflow-hidden lg:rounded-3xl bg-linear-to-b from-[#EAF4FF] via-[#F4F9FF] to-[#DFEEFF] border-b lg:border border-sky-200/80 px-4 pt-5 pb-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9 shadow-[0_6px_24px_rgba(30,130,230,0.05)]">
            {/* Soft pastel sky horizon */}
            <svg
              aria-hidden="true"
              viewBox="0 0 800 220"
              preserveAspectRatio="none"
              className="absolute inset-x-0 bottom-0 w-full h-24 sm:h-36 pointer-events-none"
            >
              <ellipse cx="145" cy="54" rx="75" ry="20" fill="#FFFFFF" fillOpacity="0.72" />
              <ellipse cx="440" cy="40" rx="90" ry="22" fill="#FFFFFF" fillOpacity="0.65" />
              <ellipse cx="700" cy="58" rx="68" ry="18" fill="#FFFFFF" fillOpacity="0.6" />
              <path
                d="M0 165 Q210 132 430 162 T800 144 L800 220 L0 220 Z"
                fill="#D4EBFF"
                fillOpacity="0.65"
              />
              <path
                d="M0 182 Q280 156 540 178 T800 164 L800 220 L0 220 Z"
                fill="#BAE0FF"
                fillOpacity="0.55"
              />
            </svg>

            <div className="flex flex-row items-center justify-between gap-2 sm:gap-8 relative z-10">
              <div className="space-y-1.5 sm:space-y-2.5 text-left min-w-0 flex-1 max-w-md">
                <h1 className="text-[22px] sm:text-3xl lg:text-[40px] font-bold font-classical text-slate-900 leading-[1.16] tracking-tight">
                  <span className="block whitespace-nowrap">Good morning,</span>
                  <span className="block text-[#1E82E6] truncate">{studentName}!</span>
                </h1>

                <p className="text-xs sm:text-base text-slate-600 font-medium leading-relaxed">
                  Let&apos;s learn something new today!
                  <span className="block text-[11px] sm:text-xs text-slate-500 font-bn mt-0.5">
                    আজকের ইংরেজি ব্যাকরণ পাঠ শুরু করুন।
                  </span>
                </p>
              </div>

              {/* Cat Mascot on the Right */}
              <div className="shrink-0 flex items-end justify-center -mr-2 sm:mr-2 -mb-2 sm:-mb-4">
                <CatnivoCharacter
                  pose="welcome"
                  size="hero"
                  interactive={true}
                  animate={true}
                  onClick={() => onNavigate('activities')}
                />
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Content Container */}
          <div className="px-3.5 sm:px-6 lg:px-0 space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Daily Goal Card on Mobile & Tablet (cleanly separated without overlap) */}
            <div className="xl:hidden">
              <DailyGoalCard
                streakDays={milestones.studyStreakDays}
                completedLessons={milestones.completedLessons}
                dailyGoalMin={dailyGoalMin}
                onChangeGoalMin={setDailyGoalMin}
              />
            </div>

            {/* 2. Continue Learning Banner Card */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold font-classical text-slate-800">
                  Continue Learning
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className="text-xs font-semibold text-[#1570CD] hover:text-[#1E82E6] cursor-pointer"
                >
                  View Syllabus
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchPractice(continueLesson?.id)}
                className="w-full text-left bg-linear-to-r from-[#2186EB] to-[#3A9AF5] hover:from-[#1877D8] hover:to-[#298BE8] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-sky-400/40 transition-all active:scale-[0.99] flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center shrink-0">
                    <PremiumLearnIcon active className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                      {continueLesson?.title || 'Tense Fundamentals: Present Indefinite'}
                    </h3>
                    <p className="text-xs text-sky-50 font-bn truncate">
                      {continueLesson?.titleBn || 'Unit II · Lesson 3 · সাধারণ বর্তমান কাল'}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-sky-100 shrink-0 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </button>
            </section>

            {/* 3. Curriculum Path Node Stepper */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold font-classical text-slate-800">
                  Curriculum Path
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className="text-xs font-semibold text-[#1570CD] hover:text-[#1E82E6] cursor-pointer font-bn"
                >
                  সম্পূর্ণ পাঠ্যক্রম →
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/85 px-3 py-4 sm:p-6 shadow-xs">
                <div className="flex sm:grid sm:grid-cols-5 items-start relative overflow-x-auto sm:overflow-visible scrollbar-none gap-2 sm:gap-0 pb-1 sm:pb-0">
                  {/* Connecting Track Line (desktop/tablet grid alignment) */}
                  <div className="hidden sm:block absolute top-[28px] left-[10%] right-[10%] h-1 bg-sky-100 rounded-full z-0">
                    <div className="w-3/5 h-full bg-[#3898F0] rounded-full" />
                  </div>

                  {pathNodes.map(node => {
                    const Icon = node.icon;
                    const isLocked = node.status === 'locked';
                    const isCurrent = node.status === 'current' || node.status === 'active';

                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => onNavigate('courses')}
                        className="relative z-10 flex flex-col items-center group cursor-pointer px-1 sm:px-0.5 min-w-[80px] sm:min-w-0 shrink-0"
                      >
                        <div
                          className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isLocked
                              ? 'bg-slate-100 text-slate-400 border-2 border-white shadow-xs'
                              : isCurrent
                              ? 'bg-[#1E82E6] text-white ring-4 ring-sky-100 border-2 border-white shadow-sm group-hover:scale-105'
                              : 'bg-[#3898F0] text-white border-2 border-white shadow-xs group-hover:scale-105'
                          }`}
                        >
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>

                        <span
                          className={`mt-2 text-[11px] sm:text-xs font-bold text-center leading-tight whitespace-nowrap sm:whitespace-normal ${
                            isLocked ? 'text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {node.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bn text-center leading-tight mt-0.5 whitespace-nowrap sm:whitespace-normal">
                          {node.titleBn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 4. Personal Grammar Tutor Quick Entry */}
            <section className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-5 shadow-[0_2px_12px_rgba(30,130,230,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 text-[#1E82E6] flex items-center justify-center shrink-0">
                  <PremiumTutorIcon active className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 font-bn">
                    ব্যক্তিগত ব্যাকরণ শিক্ষক · ধারাবাহিক বাংলা গাইড
                  </h3>
                  <p className="text-xs text-slate-600 font-bn">
                    ১৩টি সুশৃঙ্খল ধাপে বাংলায় সহজ ব্যাখ্যা, বাক্যের পদ বিশ্লেষণ এবং প্রশ্নোত্তর।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('ai-tutor')}
                className="w-full sm:w-auto min-h-[42px] px-5 py-2.5 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 font-bn shadow-xs"
              >
                <span>পাঠ শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </section>

            {/* 5. Interactive Grammar Labs */}
            <section className="space-y-3">
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <h2 className="text-base sm:text-lg font-bold font-classical text-slate-800">
                      Interactive Grammar Labs
                    </h2>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-500 font-bn">
                      ৪টি অনুশীলন মডিউল
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-bn mt-0.5">
                    শব্দ বিন্যাসের মাধ্যমে বাক্য গঠন, পদ নির্ণয় ও কাল রূপান্তরের ব্যবহারিক অনুশীলন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('activities')}
                  className="text-xs font-semibold text-[#1570CD] hover:text-[#1E82E6] cursor-pointer shrink-0 font-bn whitespace-nowrap pt-0.5 sm:pt-0"
                >
                  সকল ল্যাব →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('activities')}
                  className="text-left p-4 bg-white rounded-3xl border border-slate-200/85 hover:border-sky-400 shadow-[0_2px_10px_rgba(30,130,230,0.04)] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50/80 border border-sky-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PremiumPuzzleIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Sentence Construction</h3>
                      <p className="text-xs text-slate-500 font-bn">শব্দ বিন্যাসে বাক্য গঠন (S + V + O)</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E82E6] group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('activities')}
                  className="text-left p-4 bg-white rounded-3xl border border-slate-200/85 hover:border-sky-400 shadow-[0_2px_10px_rgba(30,130,230,0.04)] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50/80 border border-sky-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PremiumTargetIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Word Class Analysis</h3>
                      <p className="text-xs text-slate-500 font-bn">বাক্যে ব্যবহৃত পদের পরিচয় নির্ণয়</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E82E6] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </section>

            {/* 6. Core Language Competencies */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold font-classical text-slate-800">
                Core Language Competencies
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  {
                    title: 'Listening',
                    subtitle: '12 Modules',
                    Icon: PremiumHeadphonesIcon,
                    view: 'practice',
                  },
                  {
                    title: 'Pronunciation',
                    subtitle: '10 Modules',
                    Icon: PremiumMicIcon,
                    view: 'courses',
                  },
                  {
                    title: 'Vocabulary',
                    subtitle: '24 Modules',
                    Icon: PremiumLearnIcon,
                    view: 'courses',
                  },
                  {
                    title: 'Syntax & Grammar',
                    subtitle: '18 Modules',
                    Icon: PremiumPracticeIcon,
                    view: 'courses',
                  },
                ].map((skill, sIdx) => {
                  const SkillIcon = skill.Icon;
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => onNavigate(skill.view)}
                      className="text-left p-4 rounded-3xl bg-white border border-slate-200/85 hover:border-sky-400 shadow-[0_2px_10px_rgba(30,130,230,0.04)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200/80 text-[#1E82E6] flex items-center justify-center mb-3 group-hover:bg-[#1E82E6] group-hover:text-white group-hover:border-[#1E82E6] transition-colors">
                        <SkillIcon active className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800">{skill.title}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">{skill.subtitle}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-end text-slate-400 group-hover:text-[#1E82E6]">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 7. Foundational Grammar Topics */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold font-classical text-slate-800">
                  Foundational Topics
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className="text-xs font-semibold text-[#1570CD] hover:text-[#1E82E6] cursor-pointer"
                >
                  All Topics
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                {[
                  { name: 'Tenses', Icon: PremiumTimerIcon, meta: '12 Lessons' },
                  { name: 'Parts of Speech', Icon: PremiumBooksIcon, meta: '8 Lessons' },
                  { name: 'Sentences', Icon: PremiumPenIcon, meta: '6 Lessons' },
                  { name: 'Articles', Icon: PremiumArticlesIcon, meta: '4 Lessons' },
                  { name: 'Voice Change', Icon: PremiumVoiceIcon, meta: '6 Lessons' },
                ].map((topic, tIdx, arr) => {
                  const TopicIcon = topic.Icon;
                  const isOrphanLast = arr.length % 2 === 1 && tIdx === arr.length - 1;
                  return (
                    <button
                      key={tIdx}
                      type="button"
                      onClick={() => onNavigate('courses')}
                      className={`text-left p-3 bg-white rounded-2xl border border-slate-200/85 hover:border-sky-400 shadow-[0_1px_6px_rgba(30,130,230,0.03)] hover:shadow-sm transition-all cursor-pointer flex items-center gap-2.5 group ${
                        isOrphanLast ? 'col-span-2 sm:col-span-1' : ''
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-sky-50/80 border border-sky-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <TopicIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{topic.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{topic.meta}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Right Sidebar Widgets Column (Daily Goal on xl+, Leaderboard, Milestone Reward) */}
        <div className="xl:col-span-1 px-3.5 sm:px-6 lg:px-0">
          <RightSidebarWidgets
            userName={studentName}
            streakDays={milestones.studyStreakDays}
            completedLessons={milestones.completedLessons}
            dailyGoalMin={dailyGoalMin}
            onChangeGoalMin={setDailyGoalMin}
            onStartQuiz={() => handleLaunchPractice()}
            onExploreCourses={() => onNavigate('courses')}
          />
        </div>
      </div>

      {/* Milestone Badges Section */}
      <div className="px-3.5 sm:px-6 lg:px-0">
        <Badges
          milestones={milestones}
          isAuthenticated={Boolean(user)}
          onNavigate={onNavigate}
        />
      </div>

      {/* Interactive Exercise Modal */}
      <InteractiveExerciseModal
        isOpen={isExerciseOpen}
        onClose={() => {
          setIsExerciseOpen(false);
          if (user) {
            api.getDashboardSummary().then(setSummary).catch(() => {});
          }
        }}
        questions={exerciseQuestions}
      />
    </div>
  );
}
