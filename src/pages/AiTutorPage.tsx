import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  TutorCurriculumLesson,
  TutorProgressState,
  TutorDifficultyLevel,
  TutorStructuredLesson,
  TutorEvaluationResult,
  SentenceAnalysisResult,
  TutorChatMessage,
} from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { CatnivoCharacter } from '../components/CatnivoCharacter.tsx';
import { PremiumTutorIcon, PremiumLearnIcon } from '../components/PremiumIcons.tsx';
import {
  BookOpen,
  CheckCircle2,
  Volume2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Trophy,
  Send,
  Search,
  Layers,
  Check,
  X,
  RotateCcw,
  MessageCircle,
  GraduationCap,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

interface AiTutorPageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export function AiTutorPage({ onNavigate, onOpenAuthModal }: AiTutorPageProps) {
  const { user } = useAuth();

  // Workspace mode
  const [workspaceTab, setWorkspaceTab] = useState<'lesson' | 'identifier' | 'chat'>('lesson');

  // Curriculum & persistent progress
  const [curriculum, setCurriculum] = useState<TutorCurriculumLesson[]>([]);
  const [progress, setProgress] = useState<TutorProgressState | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>('what-is-english-grammar');
  const [selectedLevel, setSelectedLevel] = useState<TutorDifficultyLevel>('beginner');
  const [showRoadmapDrawer, setShowRoadmapDrawer] = useState<boolean>(false);

  // Active 13-step structured lesson
  const [lesson, setLesson] = useState<TutorStructuredLesson | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(true);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [lessonStage, setLessonStage] = useState<'understand' | 'rules' | 'practice' | 'minitest'>('understand');

  // Practice answers (Step 10)
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceResult, setPracticeResult] = useState<TutorEvaluationResult | null>(null);
  const [isEvaluatingPractice, setIsEvaluatingPractice] = useState<boolean>(false);

  // Mini Test answers (Step 11-13)
  const [miniTestAnswers, setMiniTestAnswers] = useState<Record<string, string>>({});
  const [miniTestResult, setMiniTestResult] = useState<TutorEvaluationResult | null>(null);
  const [isEvaluatingMiniTest, setIsEvaluatingMiniTest] = useState<boolean>(false);

  // Special Identification Training (Step 8 in spec)
  const [sentenceInput, setSentenceInput] = useState<string>('Rahim reads a good book.');
  const [sentenceAnalysis, setSentenceAnalysis] = useState<SentenceAnalysisResult | null>(null);
  const [isAnalyzingSentence, setIsAnalyzingSentence] = useState<boolean>(false);
  const [sentenceError, setSentenceError] = useState<string | null>(null);

  // Personal Bengali Grammar Tutor Chat
  const [chatMessages, setChatMessages] = useState<TutorChatMessage[]>([
    {
      role: 'teacher',
      text: 'আসসালামু আলাইকুম / নমস্কার! আমি আপনার GrammarPath পার্সোনাল টিউটর। ইংরেজি গ্রামার নিয়ে যেকোনো প্রশ্ন সহজ বাংলায় করুন, অথবা একটি ইংরেজি বাক্য লিখে আমাকে দেখাতে পারেন—আমি ভুল শুধরে বুঝিয়ে দেব!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    async function initCurriculum() {
      try {
        const res = await api.getTutorCurriculum();
        setCurriculum(res.curriculum);
        if (res.progress) {
          setProgress(res.progress);
          const initialSlug = res.progress.recommendedNextLessonSlug || res.progress.currentLessonSlug || 'what-is-english-grammar';
          setSelectedSlug(initialSlug);
        }
      } catch (err) {
        console.error('Failed to load AI tutor curriculum:', err);
      }
    }
    initCurriculum();
  }, [user]);

  useEffect(() => {
    loadLesson(selectedSlug, selectedLevel, false);
  }, [selectedSlug, selectedLevel]);

  const loadLesson = async (slug: string, level: TutorDifficultyLevel, simpler = false) => {
    setIsLoadingLesson(true);
    setLessonError(null);
    setPracticeAnswers({});
    setPracticeResult(null);
    setMiniTestAnswers({});
    setMiniTestResult(null);
    setLessonStage('understand');

    try {
      const data = await api.generateTutorLesson({ lessonSlug: slug, level, simpler });
      setLesson(data);
    } catch (err: any) {
      setLessonError(err?.message || 'লেসন লোড করতে সমস্যা হয়েছে।');
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const speakEnglish = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmitPractice = async () => {
    if (!lesson) return;
    setIsEvaluatingPractice(true);
    try {
      const res = await api.evaluateTutorAnswers({
        mode: 'practice',
        lessonSlug: lesson.slug,
        level: lesson.level,
        questions: lesson.step10_practiceQuestions,
        userAnswers: lesson.step10_practiceQuestions.map(q => ({
          questionId: q.id,
          answer: practiceAnswers[q.id] || '',
        })),
      });
      setPracticeResult(res);
      if (res.updatedProgress) setProgress(res.updatedProgress);
    } catch (err: any) {
      setLessonError(err?.message || 'প্র্যাকটিস যাচাই করতে সমস্যা হয়েছে।');
    } finally {
      setIsEvaluatingPractice(false);
    }
  };

  const handleSubmitMiniTest = async () => {
    if (!lesson) return;
    setIsEvaluatingMiniTest(true);
    try {
      const res = await api.evaluateTutorAnswers({
        mode: 'mini_test',
        lessonSlug: lesson.slug,
        level: lesson.level,
        questions: lesson.step11_miniTestQuestions,
        userAnswers: lesson.step11_miniTestQuestions.map(q => ({
          questionId: q.id,
          answer: miniTestAnswers[q.id] || '',
        })),
      });
      setMiniTestResult(res);
      if (res.updatedProgress) setProgress(res.updatedProgress);
      if (res.lessonCompleted) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setLessonError(err?.message || 'মিনি টেস্ট মূল্যায়ন করতে সমস্যা হয়েছে।');
    } finally {
      setIsEvaluatingMiniTest(false);
    }
  };

  const handleAnalyzeSentence = async (e?: React.FormEvent, customSentence?: string) => {
    e?.preventDefault();
    const target = (customSentence ?? sentenceInput).trim();
    if (!target) return;
    setIsAnalyzingSentence(true);
    setSentenceError(null);
    try {
      const res = await api.identifySentencePOS(target);
      setSentenceAnalysis(res);
    } catch (err: any) {
      setSentenceError(err?.message || 'বাক্যটি বিশ্লেষণ করা যায়নি।');
    } finally {
      setIsAnalyzingSentence(false);
    }
  };

  useEffect(() => {
    if (workspaceTab === 'identifier' && !sentenceAnalysis && !isAnalyzingSentence) {
      handleAnalyzeSentence(undefined, 'Rahim reads a good book.');
    }
  }, [workspaceTab]);

  const handleSendChat = async (e?: React.FormEvent, quickPrompt?: string) => {
    e?.preventDefault();
    const msg = (quickPrompt ?? chatInput).trim();
    if (!msg || isSendingChat) return;

    const userMsg: TutorChatMessage = {
      role: 'user',
      text: msg,
      timestamp: new Date().toISOString(),
    };
    const nextHistory = [...chatMessages, userMsg];
    setChatMessages(nextHistory);
    setChatInput('');
    setChatError(null);
    setIsSendingChat(true);

    try {
      const res = await api.chatWithAiTeacher({
        message: msg,
        history: chatMessages,
        currentLessonTitle: lesson?.title,
      });
      setChatMessages([
        ...nextHistory,
        {
          role: 'teacher',
          text: res.reply,
          timestamp: res.timestamp,
        },
      ]);
    } catch (err: any) {
      setChatError(err?.message || 'এই মুহূর্তে টিউটরের উত্তর পাওয়া যায়নি।');
    } finally {
      setIsSendingChat(false);
    }
  };

  const selectedCurriculumMeta = curriculum.find(c => c.slug === selectedSlug);
  const completedCount = progress?.completedLessons.length || 0;
  const currentIdx = curriculum.findIndex(c => c.slug === selectedSlug);
  const nextCurriculumLesson =
    currentIdx >= 0 && currentIdx + 1 < curriculum.length ? curriculum[currentIdx + 1] : null;

  // Determine whether Intermediate/Advanced should show gentle prerequisite reminder
  const isBeginnerMasteredForSelected =
    progress?.lessonRecords.some(
      r => r.lessonSlug === selectedSlug && r.level === 'beginner' && r.isMastered
    ) || false;

  const phase0Lessons = curriculum.filter(c => c.phase === 'phase_0');
  const phase1Lessons = curriculum.filter(c => c.phase === 'phase_1');
  const phase2Lessons = curriculum.filter(c => c.phase === 'phase_2_exams');

  return (
    <div className="px-3.5 py-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Hero Header */}
      <div className="bg-linear-to-br from-[#E5F2FF] via-[#F2F8FF] to-[#DCEEFF] rounded-3xl p-5 sm:p-8 text-slate-800 shadow-xs border border-sky-200/85 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="space-y-2.5 sm:space-y-3 max-w-2xl text-center lg:text-left">
            <p className="text-xs font-semibold text-[#1570CD] font-bn tracking-wide flex items-center justify-center lg:justify-start gap-1.5">
              <PremiumTutorIcon active className="w-4 h-4 text-[#1E82E6] shrink-0" />
              <span>GrammarPath Academy · প্রাথমিক থেকে উচ্চতর বাংলা নির্দেশিকা</span>
            </p>

            <h1 className="font-classical text-xl sm:text-3xl font-semibold tracking-tight text-slate-800 text-balance">
              আপনার ব্যক্তিগত ইংরেজি ব্যাকরণ শিক্ষক (Personal Tutor)
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-bn leading-relaxed">
              একেবারে প্রাথমিক স্তর থেকে শুরু করে ১৩টি সুশৃঙ্খল ধাপে ইংরেজি ব্যাকরণ অধ্যয়ন করুন—প্রমিত বাংলা ব্যাখ্যা, প্রাসঙ্গিক উদাহরণ, অনুশীলন এবং মূল্যায়ন পরীক্ষাসহ।
            </p>

            {/* Real Progress Strip */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/85 border border-sky-200/90 font-semibold font-bn text-slate-800 shadow-2xs">
                সম্পন্ন পাঠ: {completedCount} / {curriculum.length || 19}
              </span>
              {progress?.masteredTopics && progress.masteredTopics.length > 0 && (
                <span className="px-3 py-1.5 rounded-xl bg-white/85 border border-sky-200/90 font-semibold font-bn text-[#1570CD] shadow-2xs">
                  দক্ষতা অর্জিত: {progress.masteredTopics.length}টি বিষয়
                </span>
              )}
              {!user && (
                <button
                  onClick={() => onOpenAuthModal?.('login')}
                  className="px-3 py-1.5 rounded-xl bg-[#1E82E6] text-white font-semibold hover:bg-[#1673D1] transition-colors cursor-pointer font-bn shadow-xs"
                >
                  অগ্রগতি সংরক্ষণে লগইন করুন
                </button>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <CatnivoCharacter pose="welcome" size="md" className="sm:scale-110" interactive={true} animate={true} />
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/85 shadow-[0_2px_12px_rgba(30,130,230,0.04)]">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full lg:w-auto pb-0.5">
          <button
            onClick={() => setWorkspaceTab('lesson')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer font-bn whitespace-nowrap shrink-0 ${
              workspaceTab === 'lesson'
                ? 'bg-[#1E82E6] text-white shadow-xs'
                : 'text-slate-600 hover:bg-sky-50/80 hover:text-[#1570CD]'
            }`}
          >
            <PremiumLearnIcon active={workspaceTab === 'lesson'} className="w-4 h-4 shrink-0" />
            <span>১৩-ধাপের পাঠক্রম (Lesson)</span>
          </button>

          <button
            onClick={() => setWorkspaceTab('identifier')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer font-bn whitespace-nowrap shrink-0 ${
              workspaceTab === 'identifier'
                ? 'bg-[#1E82E6] text-white shadow-xs'
                : 'text-slate-600 hover:bg-sky-50/80 hover:text-[#1570CD]'
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>পদ বিশ্লেষণ (POS)</span>
          </button>

          <button
            onClick={() => setWorkspaceTab('chat')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer font-bn whitespace-nowrap shrink-0 ${
              workspaceTab === 'chat'
                ? 'bg-[#1E82E6] text-white shadow-xs'
                : 'text-slate-600 hover:bg-sky-50/80 hover:text-[#1570CD]'
            }`}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>শিক্ষকের সহায়তা (Chat)</span>
          </button>
        </div>

        {workspaceTab === 'lesson' && (
          <button
            onClick={() => setShowRoadmapDrawer(!showRoadmapDrawer)}
            className="w-full lg:w-auto min-h-[42px] px-4 py-2 text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-bn shrink-0"
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>{showRoadmapDrawer ? 'সিলেবাস বন্ধ করুন' : 'সম্পূর্ণ রোডম্যাপ (Phase 0–1)'}</span>
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: 13-STEP GUIDED LESSON                                          */}
      {/* ===================================================================== */}
      {workspaceTab === 'lesson' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Roadmap Sidebar (Desktop always visible or toggled on mobile) */}
          <aside
            className={`lg:col-span-4 space-y-4 ${
              showRoadmapDrawer ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-5 max-h-[820px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800 font-bn">
                    সম্পূর্ণ শেখার রোডম্যাপ
                  </h2>
                  <p className="text-[11px] text-slate-500 font-bn">
                    Phase 0 থেকে শুরু করে ধাপে ধাপে এগোন
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#1E82E6] border border-sky-200/80 flex items-center justify-center shrink-0">
                  <PremiumTutorIcon active className="w-5 h-5" />
                </div>
              </div>

              {/* Weak Topics Reminder if any */}
              {progress && progress.weakTopics.length > 0 && (
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1 font-bn">
                  <p className="font-bold text-stone-900">পুনরালোচনা প্রয়োজন (Weak Topics):</p>
                  <p className="text-stone-700">{progress.weakTopics.join(', ')}</p>
                </div>
              )}

              {/* PHASE 0 */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1570CD] bg-sky-50/80 border border-sky-200/75 px-3 py-1.5 rounded-xl font-bn">
                  Phase 0 · Pre-Grammar Foundation (৯টি পাঠ)
                </div>
                <div className="space-y-1.5">
                  {phase0Lessons.map(item => {
                    const isActive = item.slug === selectedSlug;
                    const isDone = progress?.completedLessons.includes(item.slug);
                    return (
                      <button
                        key={item.slug}
                        onClick={() => {
                          setSelectedSlug(item.slug);
                          setSelectedLevel('beginner');
                          setShowRoadmapDrawer(false);
                        }}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-[#1E82E6] text-white border-[#1E82E6] shadow-xs'
                            : 'bg-sky-50/40 hover:bg-sky-50/85 border-slate-200/80 text-slate-800'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{item.title}</p>
                          <p
                            className={`text-[11px] font-bn truncate ${
                              isActive ? 'text-sky-100' : 'text-slate-500'
                            }`}
                          >
                            {item.titleBn}
                          </p>
                        </div>
                        {isDone && (
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-emerald-200' : 'text-emerald-700'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PHASE 1: 8 PARTS OF SPEECH */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1570CD] bg-sky-50/80 border border-sky-200/75 px-3 py-1.5 rounded-xl font-bn">
                  Phase 1 · Parts of Speech (Noun → Interjection)
                </div>
                <div className="space-y-1.5">
                  {phase1Lessons.map(item => {
                    const isActive = item.slug === selectedSlug;
                    const isDone = progress?.completedLessons.includes(item.slug);
                    return (
                      <button
                        key={item.slug}
                        onClick={() => {
                          setSelectedSlug(item.slug);
                          setSelectedLevel('beginner');
                          setShowRoadmapDrawer(false);
                        }}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-[#1E82E6] text-white border-[#1E82E6] shadow-xs'
                            : 'bg-sky-50/40 hover:bg-sky-50/85 border-slate-200/80 text-slate-800'
                        }`}
                      >
                        <div className="min-w-0">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase ${
                              isActive ? 'text-sky-100' : 'text-[#1570CD]'
                            }`}
                          >
                            {item.partOfSpeech}
                          </span>
                          <p className="text-xs font-bold truncate">{item.title}</p>
                          <p
                            className={`text-[11px] font-bn truncate ${
                              isActive ? 'text-sky-100' : 'text-slate-500'
                            }`}
                          >
                            {item.titleBn}
                          </p>
                        </div>
                        {isDone && (
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-emerald-200' : 'text-emerald-700'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PHASE 2: REVISION & EXAMS */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50/70 border border-amber-200/75 px-3 py-1.5 rounded-xl font-bn">
                  Phase 2 · Complete Revision & Exams
                </div>
                {phase2Lessons.map(item => {
                  const isActive = item.slug === selectedSlug;
                  return (
                    <button
                      key={item.slug}
                      onClick={() => {
                        setSelectedSlug(item.slug);
                        setSelectedLevel('beginner');
                        setShowRoadmapDrawer(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#1E82E6] text-white border-[#1E82E6] shadow-xs'
                          : 'bg-sky-50/40 hover:bg-sky-50/85 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{item.title}</p>
                        <p
                          className={`text-[11px] font-bn truncate ${
                            isActive ? 'text-sky-100' : 'text-slate-600'
                          }`}
                        >
                          {item.titleBn}
                        </p>
                      </div>
                      <Trophy className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-200' : 'text-amber-700'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main 13-Step Interactive Lesson Workspace */}
          <div className="lg:col-span-8 space-y-6">
            {/* Lesson Header + 3-Level Selector */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1570CD]">
                    {selectedCurriculumMeta?.partOfSpeech || 'Lesson'} ·{' '}
                    {selectedCurriculumMeta?.partOfSpeechBn}
                  </span>
                  <h2 className="font-classical text-xl sm:text-2xl font-semibold text-slate-800 mt-0.5">
                    {selectedCurriculumMeta?.title || lesson?.title}
                  </h2>
                  <p className="text-sm font-semibold text-slate-700 font-bn">
                    {selectedCurriculumMeta?.titleBn || lesson?.titleBn}
                  </p>
                </div>

                {/* 3-Level System Switcher */}
                <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center gap-1 p-1 bg-sky-50/80 border border-sky-200/70 rounded-2xl">
                  {(
                    [
                      { id: 'beginner', label: 'L1 Beginner' },
                      { id: 'intermediate', label: 'L2 Intermediate' },
                      { id: 'advanced', label: 'L3 Advanced' },
                    ] as { id: TutorDifficultyLevel; label: string }[]
                  ).map(lvl => {
                    const available =
                      selectedCurriculumMeta?.availableLevels.includes(lvl.id) ??
                      lvl.id === 'beginner';
                    return (
                      <button
                        key={lvl.id}
                        disabled={!available}
                        onClick={() => setSelectedLevel(lvl.id)}
                        className={`min-h-[38px] px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer truncate text-center ${
                          selectedLevel === lvl.id
                            ? 'bg-[#1E82E6] text-white shadow-2xs'
                            : available
                            ? 'text-slate-600 hover:text-[#1570CD]'
                            : 'text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Foundation Check Warning if jumping to Level 2/3 before Level 1 mastery */}
              {selectedLevel !== 'beginner' && !isBeginnerMasteredForSelected && (
                <div className="p-3 rounded-2xl bg-sky-50/75 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-bn text-slate-800">
                  <div className="flex items-start sm:items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#1E82E6] shrink-0 mt-0.5 sm:mt-0" />
                    <span>
                      পরামর্শ: আগে <strong>Level 1 (Beginner)</strong> মিনি টেস্টে ৮০%+ পেয়ে ভিত্তি মজবুত করলে এই ধাপটি অনেক সহজ লাগবে।
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedLevel('beginner')}
                    className="self-start sm:self-auto min-h-[36px] px-3 py-1.5 bg-[#1E82E6] text-white rounded-lg font-bold shrink-0 cursor-pointer hover:bg-[#1673D1]"
                  >
                    L1-এ ফিরুন
                  </button>
                </div>
              )}

              {/* 4-Stage Navigation Stepper (covering Steps 1-13) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                {[
                  { id: 'understand', label: 'Steps 1–4', titleBn: 'পরিচিতি ও উদাহরণ' },
                  { id: 'rules', label: 'Steps 5–9', titleBn: 'চেনার উপায় ও নিয়ম' },
                  { id: 'practice', label: 'Step 10', titleBn: 'অনুশীলন (Practice)' },
                  { id: 'minitest', label: 'Steps 11–13', titleBn: 'মিনি টেস্ট ও ফল' },
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setLessonStage(st.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      lessonStage === st.id
                        ? 'bg-[#1E82E6] border-[#1E82E6] text-white shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-sky-300 text-slate-600'
                    }`}
                  >
                    <span
                      className={`block text-[10px] font-bold uppercase tracking-wider ${
                        lessonStage === st.id ? 'text-sky-100' : 'text-[#1570CD]'
                      }`}
                    >
                      {st.label}
                    </span>
                    <span className="block text-xs font-bold font-bn mt-0.5">{st.titleBn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading or Error State */}
            {isLoadingLesson ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-[#1E82E6] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-800 font-bn">
                  সহজ বাংলায় পাঠটি প্রস্তুত করা হচ্ছে...
                </p>
                <p className="text-xs text-slate-500 font-bn">
                  একদম সহজ উদাহরণ ও নিয়ম গুছিয়ে আনা হচ্ছে, অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন।
                </p>
              </div>
            ) : lessonError ? (
              <div className="bg-rose-50/70 rounded-3xl border border-rose-200 p-8 text-center space-y-4">
                <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
                <p className="text-sm font-bold text-rose-900 font-bn">{lessonError}</p>
                <button
                  onClick={() => loadLesson(selectedSlug, selectedLevel, false)}
                  className="px-5 py-2.5 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-xl text-xs font-bold cursor-pointer font-bn"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            ) : lesson ? (
              <>
                {/* ========================================================= */}
                {/* STAGE A: STEPS 1 - 4                                      */}
                {/* ========================================================= */}
                {lessonStage === 'understand' && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Step 1: Friendly Introduction */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#1570CD]">
                          STEP 1 — Friendly Introduction (পাঠ পরিচিতি)
                        </span>
                        <button
                          onClick={() => loadLesson(selectedSlug, selectedLevel, true)}
                          className="min-h-[34px] text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-xl border border-sky-200 cursor-pointer font-bn shrink-0"
                        >
                          আরও সহজভাবে বুঝুন
                        </button>
                      </div>
                      <p className="text-sm sm:text-base text-slate-800 font-bn leading-relaxed bg-sky-50/55 p-3.5 sm:p-4 rounded-2xl border border-sky-100">
                        {lesson.step1_introBn}
                      </p>
                    </div>

                    {/* Step 2: Easy Definition */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#1570CD]">
                        STEP 2 — Clear Definition (সংজ্ঞা ও অর্থ)
                      </span>
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-linear-to-br from-[#E5F2FF] via-[#F2F8FF] to-[#DCEEFF] text-slate-800 border border-sky-200/85 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-classical text-sm sm:text-base font-medium text-slate-800">{lesson.step2_definitionEn}</p>
                          <button
                            onClick={() => speakEnglish(lesson.step2_definitionEn)}
                            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-2 rounded-xl bg-white hover:bg-sky-50 text-[#1E82E6] border border-sky-200 shrink-0 cursor-pointer"
                            title="Listen in English"
                            aria-label="Listen in English"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-slate-800 font-bn leading-relaxed p-3.5 sm:p-4 rounded-2xl bg-sky-50/55 border border-sky-100">
                        {lesson.step2_definitionBn}
                      </p>
                    </div>

                    {/* Step 3: Everyday Examples */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#1570CD]">
                        STEP 3 — Everyday Examples (দৈনন্দিন জীবনের উদাহরণ)
                      </span>
                      <ul className="space-y-2.5">
                        {lesson.step3_everydayExamplesBn.map((ex, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-sky-50/55 border border-sky-100 text-sm text-slate-800 font-bn"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#1E82E6] text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step 4: English Examples with Bengali Meaning */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1570CD]">
                          STEP 4 — English Examples with Bengali Meaning
                        </span>
                        <span className="text-xs text-slate-500 font-bn">অডিও শুনতে স্পিকারে চাপুন</span>
                      </div>

                      <div className="space-y-3">
                        {lesson.step4_englishExamples.map((ex, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/55 border border-sky-100 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-base font-extrabold text-slate-800">
                                  {ex.english}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-[#1570CD]">
                                  {ex.highlightedWord}
                                </span>
                              </div>
                              <button
                                onClick={() => speakEnglish(ex.english)}
                                className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 text-[#1E82E6] hover:bg-sky-100 rounded-xl cursor-pointer shrink-0"
                                aria-label="Speak sentence"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-slate-800 font-bn">
                              অর্থ: {ex.banglaMeaning}
                            </p>
                            <p className="text-xs text-slate-600 font-bn">{ex.reasonBn}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setLessonStage('rules')}
                          className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer font-bn shadow-xs"
                        >
                          <span>পরবর্তী ধাপ: চেনার কৌশল ও নিয়ম (Steps 5–9)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* STAGE B: STEPS 5 - 9                                      */}
                {/* ========================================================= */}
                {lessonStage === 'rules' && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Step 5: Identification Method */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#1570CD]">
                        STEP 5 — Identification Method (বাক্যে পদ নির্ণয়ের পদ্ধতি)
                      </span>
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/75 border border-sky-200 text-sm text-slate-800 font-bn leading-relaxed">
                        <p className="font-semibold flex items-center gap-2 mb-1 text-[#1570CD]">
                          <Lightbulb className="w-4 h-4 text-[#1E82E6]" />
                          <span>নির্ণয় কৌশল:</span>
                        </p>
                        {lesson.step5_identificationTrickBn}
                      </div>
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F7FAFE] border border-slate-200/80 text-xs sm:text-sm text-slate-700 font-bn leading-relaxed">
                        <strong className="text-slate-800">প্রাসঙ্গিক সতর্কতা (Context Matters):</strong> {lesson.step5_contextWarningBn}
                      </div>
                    </div>

                    {/* Step 6: Important Rules */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1570CD]">
                        STEP 6 — Important Rules (গুরুত্বপূর্ণ নিয়মাবলী)
                      </span>
                      <ul className="space-y-2.5">
                        {lesson.step6_importantRulesBn.map((rule, rIdx) => (
                          <li
                            key={rIdx}
                            className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-sky-50/55 border border-sky-100 text-sm text-slate-800 font-bn"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#1E82E6] text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {rIdx + 1}
                            </span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step 7: Examples in Sentences */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1570CD]">
                        STEP 7 — Examples in Sentences (পূর্ণ বাক্যে উদাহরণ)
                      </span>
                      <div className="space-y-3">
                        {lesson.step7_sentenceExamples.map((s, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/55 border border-sky-100 space-y-1"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-base font-bold text-slate-800">{s.english}</p>
                              <button
                                onClick={() => speakEnglish(s.english)}
                                className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 text-[#1E82E6] hover:bg-sky-100 rounded-xl cursor-pointer shrink-0"
                                aria-label="Speak sentence"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-slate-800 font-bn">{s.bangla}</p>
                            <p className="text-xs text-slate-600 font-bn">{s.explanationBn}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 8: Common Mistakes */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                        STEP 8 — Common Mistakes (সাধারণ ভুল ও সংশোধন)
                      </span>
                      <div className="space-y-3">
                        {lesson.step8_commonMistakes.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3.5 sm:p-4 rounded-2xl bg-[#F7FAFE] border border-slate-200 space-y-2"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900 flex items-center gap-2 break-words">
                                <X className="w-4 h-4 text-rose-700 shrink-0" />
                                <span>{m.wrong}</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-center gap-2 break-words">
                                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>{m.correct}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-700 font-bn">{m.whyBn}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 9: Quick Revision */}
                    <div className="bg-linear-to-br from-[#E5F2FF] via-[#F2F8FF] to-[#DCEEFF] text-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs border border-sky-200/85 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1570CD]">
                        STEP 9 — Quick Revision (এক নজরে পুনরালোচনা)
                      </span>
                      <ul className="space-y-2 text-sm text-slate-700 font-bn">
                        {lesson.step9_quickRevisionBn.map((rev, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#1E82E6] shrink-0 mt-1" />
                            <span>{rev}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                        <button
                          onClick={() => setLessonStage('understand')}
                          className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-white hover:bg-sky-50 text-slate-700 border border-sky-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer font-bn"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>আগের ধাপ</span>
                        </button>
                        <button
                          onClick={() => setLessonStage('practice')}
                          className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer font-bn shadow-xs"
                        >
                          <span>অনুশীলন শুরু করুন (Step 10)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* STAGE C: STEP 10 — GUIDED PRACTICE                        */}
                {/* ========================================================= */}
                {lessonStage === 'practice' && (
                  <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-5 sm:space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1570CD]">
                        STEP 10 — Practice Exercises (সহজ অনুশীলন)
                      </span>
                      <h3 className="font-classical text-base sm:text-lg font-extrabold text-slate-800 font-bn mt-1">
                        উপরের নিয়মগুলোর ওপর ভিত্তি করে নিচের প্রশ্নগুলো সমাধান করুন
                      </h3>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      {lesson.step10_practiceQuestions.map((q, qIdx) => {
                        const evalDetail = practiceResult?.details.find(d => d.questionId === q.id);
                        return (
                          <div
                            key={q.id}
                            className="p-4 sm:p-5 rounded-2xl bg-sky-50/55 border border-sky-100 space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-bold uppercase text-[#1570CD]">
                                Question {qIdx + 1} · {q.format.replace(/_/g, ' ')}
                              </span>
                              {q.hintBn && (
                                <span className="text-[11px] text-[#1570CD] bg-white px-2.5 py-0.5 rounded-full border border-sky-200 font-bn">
                                  ইঙ্গিত: {q.hintBn}
                                </span>
                              )}
                            </div>

                            <p className="text-base font-bold text-slate-800">{q.promptEn}</p>
                            <p className="text-sm font-semibold text-slate-700 font-bn">{q.promptBn}</p>

                            {q.options && q.options.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                {q.options.map((opt, oIdx) => {
                                  const selected = practiceAnswers[q.id] === opt;
                                  return (
                                    <button
                                      key={oIdx}
                                      disabled={Boolean(practiceResult)}
                                      onClick={() =>
                                        setPracticeAnswers(prev => ({ ...prev, [q.id]: opt }))
                                      }
                                      className={`p-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                                        selected
                                          ? 'bg-[#1E82E6] text-white border-[#1E82E6] shadow-2xs'
                                          : 'bg-white border-slate-200 hover:border-sky-400 text-slate-800'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <input
                                type="text"
                                disabled={Boolean(practiceResult)}
                                value={practiceAnswers[q.id] || ''}
                                onChange={e =>
                                  setPracticeAnswers(prev => ({ ...prev, [q.id]: e.target.value }))
                                }
                                placeholder="এখানে আপনার ইংরেজি উত্তর লিখুন..."
                                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E82E6]"
                              />
                            )}

                            {evalDetail && (
                              <div
                                className={`p-3.5 rounded-xl border text-xs font-bn space-y-1 ${
                                  evalDetail.isCorrect
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                    : 'bg-rose-50/70 border-rose-200 text-rose-900'
                                }`}
                              >
                                <p className="font-bold">
                                  {evalDetail.isCorrect ? 'সঠিক উত্তর!' : 'ভুল উত্তর — আসুন বুঝে নিই:'}
                                </p>
                                <p>{evalDetail.feedbackBn}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Adaptive Practice Feedback Banner */}
                    {practiceResult && (
                      <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2 font-bn">
                        <p className="text-base font-extrabold text-slate-800">
                          প্র্যাকটিস স্কোর: {practiceResult.correctCount} / {practiceResult.totalQuestions} ({practiceResult.scorePercentage}%)
                        </p>
                        <p className="text-sm text-slate-800">{practiceResult.encouragementBn}</p>
                        <p className="text-xs font-semibold text-[#1570CD]">
                          {practiceResult.adaptiveActionBn}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      {!practiceResult ? (
                        <button
                          onClick={handleSubmitPractice}
                          disabled={isEvaluatingPractice}
                          className="px-6 py-3 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-2xl text-sm font-bold cursor-pointer font-bn shadow-xs disabled:opacity-60"
                        >
                          {isEvaluatingPractice ? 'উত্তর যাচাই করা হচ্ছে...' : 'প্র্যাকটিস জমা দিন'}
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => {
                              setPracticeResult(null);
                              setPracticeAnswers({});
                            }}
                            className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-[#1570CD] border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer font-bn"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>আবার প্র্যাকটিস করুন</span>
                          </button>

                          {practiceResult.scorePercentage < 60 && (
                            <button
                              onClick={() => loadLesson(selectedSlug, selectedLevel, true)}
                              className="px-4 py-2.5 bg-[#3898F0] hover:bg-[#1E82E6] text-white rounded-xl text-xs font-bold cursor-pointer font-bn"
                            >
                              আরও সহজভাবে আবার পড়ুন
                            </button>
                          )}

                          <button
                            onClick={() => setLessonStage('minitest')}
                            className="px-6 py-2.5 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer font-bn"
                          >
                            <span>এবার মিনি টেস্ট দিন (Steps 11–13)</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* STAGE D: STEPS 11–13 — MINI TEST, FEEDBACK & COMPLETION   */}
                {/* ========================================================= */}
                {lessonStage === 'minitest' && (
                  <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-5 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1570CD]">
                          STEPS 11–13 — Mini Test, Adaptive Feedback & Lesson Completion
                        </span>
                        <h3 className="font-classical text-base sm:text-lg font-extrabold text-slate-800 font-bn mt-1">
                          ৫টি প্রশ্নের মূল্যায়ন পরীক্ষা (জমা দেওয়ার আগে উত্তর দেখানো হবে না)
                        </h3>
                      </div>
                      <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#1570CD] border border-sky-200 font-bn shrink-0">
                        পাশ নম্বর: ৮০%+
                      </span>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      {lesson.step11_miniTestQuestions.map((q, qIdx) => {
                        const evalDetail = miniTestResult?.details.find(d => d.questionId === q.id);
                        return (
                          <div
                            key={q.id}
                            className="p-4 sm:p-5 rounded-2xl bg-sky-50/55 border border-sky-100 space-y-3"
                          >
                            <span className="text-[11px] font-bold uppercase text-[#1570CD]">
                              Test Question {qIdx + 1} / {lesson.step11_miniTestQuestions.length}
                            </span>
                            <p className="text-base font-bold text-slate-800">{q.promptEn}</p>
                            <p className="text-sm font-semibold text-slate-700 font-bn">{q.promptBn}</p>

                            {q.options && q.options.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {q.options.map((opt, oIdx) => {
                                  const selected = miniTestAnswers[q.id] === opt;
                                  return (
                                    <button
                                      key={oIdx}
                                      disabled={Boolean(miniTestResult)}
                                      onClick={() =>
                                        setMiniTestAnswers(prev => ({ ...prev, [q.id]: opt }))
                                      }
                                      className={`p-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                                        selected
                                          ? 'bg-[#1E82E6] text-white border-[#1E82E6] shadow-2xs'
                                          : 'bg-white border-slate-200 hover:border-sky-400 text-slate-800'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <input
                                type="text"
                                disabled={Boolean(miniTestResult)}
                                value={miniTestAnswers[q.id] || ''}
                                onChange={e =>
                                  setMiniTestAnswers(prev => ({ ...prev, [q.id]: e.target.value }))
                                }
                                placeholder="এখানে উত্তর লিখুন..."
                                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E82E6]"
                              />
                            )}

                            {/* Feedback ONLY visible after submission (Step 12) */}
                            {evalDetail && (
                              <div
                                className={`p-3.5 rounded-xl border text-xs font-bn space-y-1 ${
                                  evalDetail.isCorrect
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                    : 'bg-rose-50/70 border-rose-200 text-rose-900'
                                }`}
                              >
                                <p className="font-bold">
                                  {evalDetail.isCorrect ? 'সঠিক হয়েছে!' : 'সংশোধন:'}
                                </p>
                                <p>{evalDetail.feedbackBn}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!miniTestResult ? (
                      <button
                        onClick={handleSubmitMiniTest}
                        disabled={isEvaluatingMiniTest}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-2xl text-sm font-extrabold cursor-pointer font-bn shadow-xs disabled:opacity-60"
                      >
                        {isEvaluatingMiniTest ? 'পরীক্ষা মূল্যায়ন হচ্ছে...' : 'মিনি টেস্ট জমা দিন'}
                      </button>
                    ) : (
                      /* Step 12 & 13: Adaptive Feedback + Real DB Completion Confirmation */
                      <div
                        className={`p-6 rounded-3xl border space-y-4 font-bn ${
                          miniTestResult.lessonCompleted
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-sky-50/80 border-sky-200'
                        }`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <h4 className="text-xl font-extrabold text-slate-800">
                              ফলাফল: {miniTestResult.correctCount} / {miniTestResult.totalQuestions} ({miniTestResult.scorePercentage}%)
                            </h4>
                            <p className="text-sm text-slate-800 mt-1">{miniTestResult.encouragementBn}</p>
                          </div>

                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-extrabold ${
                              miniTestResult.lessonCompleted
                                ? 'bg-emerald-800 text-white'
                                : 'bg-[#1E82E6] text-white'
                            }`}
                          >
                            {miniTestResult.lessonCompleted
                              ? 'লেসন সম্পন্ন (Mastered!)'
                              : 'আরও অনুশীলন প্রয়োজন'}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-slate-800 bg-white/90 p-3.5 rounded-2xl border border-slate-200">
                          {miniTestResult.adaptiveActionBn}
                        </p>

                        <p className="text-xs text-slate-600">
                          {miniTestResult.progressSaved
                            ? '✓ আপনার স্কোর এবং শেখার অগ্রগতি ডেটাবেসে সংরক্ষণ করা হয়েছে।'
                            : 'নোট: আপনি গেস্ট হিসেবে পরীক্ষা দিয়েছেন—স্থায়ীভাবে অগ্রগতি সেভ করতে লগইন করুন।'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {!miniTestResult.lessonCompleted && (
                            <>
                              <button
                                onClick={() => loadLesson(selectedSlug, selectedLevel, true)}
                                className="px-5 py-2.5 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-xl text-xs font-bold cursor-pointer"
                              >
                                আবার সহজ করে পড়ুন
                              </button>
                              <button
                                onClick={() => {
                                  setMiniTestResult(null);
                                  setMiniTestAnswers({});
                                }}
                                className="px-5 py-2.5 bg-white border border-sky-200 text-[#1570CD] hover:bg-sky-50 rounded-xl text-xs font-bold cursor-pointer"
                              >
                                মিনি টেস্ট পুনরায় দিন
                              </button>
                            </>
                          )}

                          {miniTestResult.lessonCompleted && nextCurriculumLesson && (
                            <button
                              onClick={() => {
                                setSelectedSlug(nextCurriculumLesson.slug);
                                setSelectedLevel('beginner');
                              }}
                              className="px-6 py-3 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 cursor-pointer shadow-xs"
                            >
                              <span>পরবর্তী লেসন: {nextCurriculumLesson.titleBn}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: SPECIAL IDENTIFICATION TRAINING (POS IN CONTEXT LAB)           */}
      {/* ===================================================================== */}
      {workspaceTab === 'identifier' && (
        <div className="bg-white rounded-3xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-[0_2px_12px_rgba(30,130,230,0.04)] space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1570CD]">
              Contextual Grammar Analysis · বাক্যের প্রয়োগ অনুসারে পদ নির্ণয়
            </span>
            <h2 className="font-classical text-xl sm:text-2xl font-semibold text-slate-800 font-bn">
              যেকোনো ইংরেজি বাক্যে প্রতিটি শব্দের ব্যাকরণিক পরিচয় বিশ্লেষণ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-bn">
              একই শব্দ ভিন্ন বাক্যে ভিন্ন পদ হিসেবে ব্যবহৃত হতে পারে। নিচে যেকোনো ইংরেজি বাক্য লিখুন এবং প্রতিটি শব্দের প্রকৃত ব্যাকরণিক ভূমিকা বাংলায় দেখুন।
            </p>
          </div>

          <form onSubmit={e => handleAnalyzeSentence(e)} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <input
              type="text"
              value={sentenceInput}
              onChange={e => setSentenceInput(e.target.value)}
              placeholder="উদাহরণ: Rahim reads a good book."
              className="flex-1 min-w-0 min-h-[46px] px-4 py-3 rounded-2xl border border-slate-300 bg-sky-50/35 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E82E6] text-sm font-medium"
            />
            <button
              type="submit"
              disabled={isAnalyzingSentence}
              className="w-full sm:w-auto min-h-[46px] px-6 py-3 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-2xl text-sm font-bold cursor-pointer font-bn shrink-0 disabled:opacity-60"
            >
              {isAnalyzingSentence ? 'বিশ্লেষণ চলছে...' : 'পদ বিশ্লেষণ করুন'}
            </button>
          </form>

          {/* Quick Example Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-bn">নমুনা বাক্য:</span>
            {[
              'Rahim reads a good book.',
              'I book a train ticket.',
              'She runs very fast in the morning.',
              'Wow! The brave boy helped his friend and smiled.',
            ].map(ex => (
              <button
                key={ex}
                onClick={() => {
                  setSentenceInput(ex);
                  handleAnalyzeSentence(undefined, ex);
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-50/75 hover:bg-sky-100/80 text-[#1570CD] font-semibold border border-sky-200/80 cursor-pointer transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          {sentenceError && (
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs font-bold text-rose-800 font-bn">
              {sentenceError}
            </div>
          )}

          {sentenceAnalysis && (
            <div className="space-y-5 pt-2">
              <div className="p-5 rounded-2xl bg-sky-50/55 border border-sky-200/75 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-800">
                    "{sentenceAnalysis.sentence}"
                  </h3>
                  <button
                    onClick={() => speakEnglish(sentenceAnalysis.sentence)}
                    className="p-2 rounded-xl bg-white text-[#1E82E6] hover:bg-sky-50 border border-sky-200 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-800 font-bn">
                  বাংলা অর্থ: {sentenceAnalysis.translationBn}
                </p>
                <p className="text-xs text-slate-600 font-bn">{sentenceAnalysis.summaryBn}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {sentenceAnalysis.words.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-sky-50/55 border border-sky-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-slate-800">{w.word}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1E82E6] text-white">
                        {w.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#1570CD] font-bn">{w.partOfSpeechBn}</p>
                    <p className="text-xs text-slate-600 font-bn leading-relaxed">
                      {w.roleInSentenceBn}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/75 border border-sky-200 text-xs sm:text-sm text-slate-800 font-bn">
                <strong>কনটেক্সট টিপস:</strong> {sentenceAnalysis.contextNoteBn}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: ASK GRAMMARPATH AI TEACHER (BENGALI TUTOR CHAT)                */}
      {/* ===================================================================== */}
      {workspaceTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/85 shadow-[0_2px_12px_rgba(30,130,230,0.04)] overflow-hidden flex flex-col h-[calc(100dvh-14.5rem)] min-h-[380px] sm:h-[min(580px,72vh)]">
          <div className="p-3.5 sm:p-5 border-b border-slate-100 bg-sky-50/55 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <CatnivoCharacter pose="happy" size="sm" />
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800 font-bn truncate">
                  GrammarPath পার্সোনাল টিউটর · সরাসরি বাংলায় সাহায্য নিন
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bn truncate">
                  ভয় ছাড়াই যেকোনো প্রশ্ন করুন বা নিজের লেখা ইংরেজি বাক্য যাচাই করান
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4">
            {chatMessages.map((msg, mIdx) => (
              <div
                key={mIdx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bn whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1E82E6] text-white rounded-br-xs'
                      : 'bg-sky-50/65 text-slate-800 border border-sky-100 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isSendingChat && (
              <div className="flex justify-start">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/65 text-[#1570CD] text-xs font-bn animate-pulse">
                  সহজ বাংলায় উত্তর লেখা হচ্ছে...
                </div>
              </div>
            )}

            {chatError && (
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs font-bold text-rose-800 font-bn">
                {chatError}
              </div>
            )}
          </div>

          {/* Starter Prompts */}
          <div className="px-3.5 sm:px-5 py-2 border-t border-slate-100 bg-sky-50/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              'শুরু থেকে Noun খুব সহজ করে বুঝিয়ে দিন',
              'আমার বাক্যটি সঠিক কি? "She go to school everyday"',
              'Same word কীভাবে Noun ও Verb দুই-ই হয়?',
            ].map(qp => (
              <button
                key={qp}
                onClick={() => handleSendChat(undefined, qp)}
                className="min-h-[34px] px-3 py-1.5 bg-white hover:bg-sky-50 border border-sky-200/80 rounded-xl text-[11px] font-semibold text-[#1570CD] whitespace-nowrap shrink-0 cursor-pointer font-bn"
              >
                {qp}
              </button>
            ))}
          </div>

          <form
            onSubmit={e => handleSendChat(e)}
            className="p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2 sm:gap-3 bg-white"
          >
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="আপনার প্রশ্ন বা ইংরেজি বাক্য লিখুন..."
              className="flex-1 min-w-0 min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-300 bg-sky-50/35 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E82E6] text-sm font-bn"
            />
            <button
              type="submit"
              disabled={isSendingChat || !chatInput.trim()}
              className="min-h-[44px] min-w-[44px] px-4 sm:px-5 py-2.5 sm:py-3 bg-[#1E82E6] hover:bg-[#1673D1] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline font-bn">পাঠান</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
