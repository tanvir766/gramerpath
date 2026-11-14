import React, { useEffect, useState } from 'react';
import { Lesson, Question } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import confetti from 'canvas-confetti';
import { InteractiveExerciseModal } from '../components/InteractiveExerciseModal.tsx';
import { CatnivoCharacter } from '../components/CatnivoCharacter.tsx';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Gamepad2,
  Layers,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  Award,
  Play,
} from 'lucide-react';

interface LessonDetailPageProps {
  lessonId: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export function LessonDetailPage({ lessonId, onNavigate, onOpenAuthModal }: LessonDetailPageProps) {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  // Practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<{ [qId: string]: { answer: string; isCorrect: boolean } }>({});
  const [practiceFinished, setPracticeFinished] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [lessonRes, questionsRes] = await Promise.all([
          api.getLesson(lessonId),
          api.getLessonQuestions(lessonId),
        ]);
        setLesson(lessonRes);
        setIsCompleted(lessonRes.isCompleted || false);
        setQuestions(questionsRes);

        // Reset practice
        setCurrentQuestionIndex(0);
        setSelectedAnswer('');
        setIsSubmitted(false);
        setPracticeScore(0);
        setAnswersHistory({});
        setPracticeFinished(false);
      } catch (err) {
        console.error('Failed to load lesson detail:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [lessonId]);

  const speakEnglish = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for language learners
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMarkCompleted = async () => {
    if (!user) {
      onOpenAuthModal?.('login');
      return;
    }
    try {
      await api.markLessonCompleted(lessonId);
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    }
  };

  // Practice handlers
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isSubmitted || !currentQuestion) return;
    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsSubmitted(true);

    if (isCorrect) {
      setPracticeScore(prev => prev + 1);
    }

    setAnswersHistory(prev => ({
      ...prev,
      [currentQuestion.id]: { answer: selectedAnswer, isCorrect },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setIsSubmitted(false);
    } else {
      setPracticeFinished(true);
      // Auto complete lesson if passed
      if (user && practiceScore + (isSubmitted && selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0) >= Math.ceil(questions.length * 0.6)) {
        handleMarkCompleted();
      }
    }
  };

  const handleRestartPractice = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setIsSubmitted(false);
    setPracticeScore(0);
    setAnswersHistory({});
    setPracticeFinished(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-16 bg-slate-200 rounded w-2/3"></div>
          <div className="h-48 bg-slate-200 rounded"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 font-bn mb-4">লেসনটি খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => onNavigate('courses')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-lg"
        >
          কোর্সে ফিরে যান
        </button>
      </div>
    );
  }

  const { content } = lesson;

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          onClick={() => onNavigate('courses')}
          className="min-h-[38px] flex items-center gap-1.5 text-xs font-medium text-[#1570CD] hover:text-[#1E82E6] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সব লেসনে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-bn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>লেসন সম্পন্ন হয়েছে</span>
            </span>
          ) : (
            <button
              onClick={handleMarkCompleted}
              className="min-h-[38px] px-3.5 py-1.5 text-xs font-medium text-[#1570CD] bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition-colors cursor-pointer font-bn"
            >
              সম্পন্ন হিসেবে চিহ্নিত করুন
            </button>
          )}
        </div>
      </div>

      {/* Lesson Header */}
      <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-[#1570CD] font-semibold uppercase tracking-wider mb-1.5">
          <span>Level {lesson.levelNumber || 1}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Lesson {lesson.lessonOrder}</span>
        </div>

        <h1 className="font-classical text-xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-lg font-semibold text-slate-700 font-bn mt-1">
          {lesson.titleBn}
        </p>

        {/* Navigation Tabs: Lesson Content vs Interactive Practice vs Game Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('content')}
              className={`min-h-[42px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-[#1E82E6] text-white shadow-xs'
                  : 'bg-slate-50 sm:bg-transparent text-slate-600 hover:bg-sky-50 hover:text-[#1570CD]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">পাঠ ও নিয়মাবলী</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`min-h-[42px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'practice'
                  ? 'bg-[#1E82E6] text-white shadow-xs'
                  : 'bg-slate-50 sm:bg-transparent text-slate-600 hover:bg-sky-50 hover:text-[#1570CD]'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>অনুশীলন ({questions.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsExerciseModalOpen(true)}
            className="w-full sm:w-auto min-h-[42px] px-4 py-2 text-xs sm:text-sm font-bold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer shrink-0 font-bn"
          >
            <Gamepad2 className="w-4 h-4 text-[#1E82E6]" />
            <span>Guided Practice Mode</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Complete 10-Component Pedagogical Lesson Content */}
      {activeTab === 'content' && (
        <div className="space-y-5 sm:space-y-6">
          {/* 1 & 2: Simple Bengali Explanation & English Definition */}
          <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1570CD] uppercase tracking-wider mb-2">
                <span>01. বাংলায় সহজ ব্যাখ্যা (Bengali Explanation)</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5 rounded-2xl bg-sky-50/55 border border-sky-200/75">
                <div className="shrink-0">
                  <CatnivoCharacter pose="reading" size="md" interactive={true} />
                </div>
                <div className="text-slate-800 text-base font-bn leading-relaxed">
                  {content?.banglaExplanation || 'এই পাঠে আমরা ইংরেজি ব্যাকরণের প্রাথমিক নিয়মগুলো অত্যন্ত সহজ বাংলায় শিখব।'}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1570CD] uppercase tracking-wider mb-2">
                <span>02. English Definition (ইংরেজি সংজ্ঞা)</span>
              </div>
              <blockquote className="p-4 rounded-xl bg-[#F7FAFE] border border-slate-200 text-slate-800 text-sm font-medium leading-relaxed italic">
                "{content?.englishDefinition || 'Grammar is the system and structure of a language.'}"
              </blockquote>
            </div>
          </div>

          {/* 7. Sentence Structure or Formula */}
          {content?.sentenceStructure && (
            <div className="bg-linear-to-br from-[#E5F2FF] via-[#F2F8FF] to-[#DCEEFF] text-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs border border-sky-200/85">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1570CD] uppercase tracking-wider mb-3 font-bn">
                <Layers className="w-4 h-4 text-[#1E82E6] shrink-0" />
                <span>বাক্য গঠনের সূত্র ও কাঠামো (Formula / Structure)</span>
              </div>
              <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-sky-200/90 text-sm sm:text-xl font-mono font-bold tracking-wide text-slate-800 break-words overflow-x-auto shadow-2xs">
                {content.sentenceStructure}
              </div>
              <p className="mt-3 text-xs text-slate-600 font-bn">
                সূত্রটি সবসময় মনে রাখবেন—ইংরেজি বাক্য গঠন করার সময় এই ক্রমানুসারেই শব্দগুলো বসাতে হবে।
              </p>
            </div>
          )}

          {/* 6. Grammar Rules & Special Rules */}
          <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6">
            <div>
              <h3 className="font-classical text-base font-semibold text-slate-800 font-bn mb-3">
                গুরুত্বপূর্ণ ব্যাকরণিক নিয়মাবলী (Grammar Rules)
              </h3>
              <ul className="space-y-3">
                {content?.grammarRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7FAFE] border border-slate-200/75">
                    <span className="w-6 h-6 rounded-full bg-[#1E82E6] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-700 font-bn leading-relaxed">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {content?.specialRules && content.specialRules.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 font-bn">
                  বিশেষ নিয়ম (Special Rule)
                </h4>
                <div className="space-y-2">
                  {content.specialRules.map((sRule, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 font-bn">
                      {sRule}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4 & 5. Easy Examples with Bengali Translations & Audio Pronunciation */}
          <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-4">
              <h3 className="font-classical text-base font-semibold text-slate-800 font-bn">
                সহজ উদাহরণ ও বাংলা অর্থ (Examples with Translations)
              </h3>
              <span className="text-xs text-slate-500 font-bn flex items-center gap-1 shrink-0">
                <Volume2 className="w-3.5 h-3.5 text-[#1E82E6]" />
                <span>উচ্চারণ শুনতে স্পিকারে চাপুন</span>
              </span>
            </div>

            <div className="space-y-3">
              {content?.examples.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#F7FAFE] border border-slate-200/75 flex items-start justify-between gap-3 hover:border-sky-300 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm sm:text-base font-bold text-slate-800 font-mono break-words">
                        {ex.english}
                      </span>
                      <button
                        onClick={() => speakEnglish(ex.english)}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center text-[#1570CD] hover:text-[#1E82E6] rounded-lg hover:bg-sky-50 transition-colors cursor-pointer shrink-0"
                        title="Listen pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-bn font-medium">
                      = {ex.bangla}
                    </p>
                    {ex.note && (
                      <p className="text-[11px] text-slate-500 font-bn">
                        {ex.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Common Mistakes */}
          {content?.commonMistakes && content.commonMistakes.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-rose-800 mb-4 font-bn">
                <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
                <h3 className="font-classical text-base font-semibold text-slate-900">
                  সাধারণ ভুলসমূহ (Common Mistakes to Avoid)
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {content.commonMistakes.map((mistake, mIdx) => (
                  <div key={mIdx} className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-neutral-50/70 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-900 font-mono flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-700 shrink-0" />
                        <span>{mistake.wrong}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-mono flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{mistake.correct}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-bn pt-1">
                      <span className="font-semibold text-slate-900">ব্যাখ্যা:</span> {mistake.explanationBn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. Practical Examples & Real Life Scenarios */}
          {content?.practicalExamples && content.practicalExamples.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-slate-700 mb-4 font-bn">
                <MessageSquare className="w-5 h-5 shrink-0" />
                <h3 className="font-classical text-base font-semibold text-slate-900">
                  বাস্তব জীবনের কথোপকথন (Practical Dialogue)
                </h3>
              </div>

              <div className="space-y-4">
                {content.practicalExamples.map((pe, pIdx) => (
                  <div key={pIdx} className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-bn block">
                      পরিস্থিতি: {pe.scenarioBn} ({pe.scenario})
                    </span>
                    <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900">
                          {pe.dialogueEn}
                        </p>
                        <button
                          onClick={() => speakEnglish(pe.dialogueEn)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-500 hover:text-[#1E82E6] rounded-lg hover:bg-sky-50 cursor-pointer shrink-0"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 font-bn">
                        {pe.dialogueBn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. Lesson Summary */}
          <div className="bg-linear-to-br from-[#E5F2FF] via-[#F2F8FF] to-[#DCEEFF] text-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs space-y-3 border border-sky-200/85">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1570CD] font-bn">
              পাঠের সারসংক্ষেপ (Lesson Summary)
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-bn">
              {content?.lessonSummaryBn}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed italic border-t border-sky-200/70 pt-3">
              "{content?.lessonSummary}"
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/85 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('practice')}
              className="w-full sm:w-auto min-h-[46px] px-6 py-3 text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>অনুশীলন শুরু করুন ({questions.length} Questions)</span>
            </button>

            {!isCompleted && (
              <button
                onClick={handleMarkCompleted}
                className="w-full sm:w-auto min-h-[46px] px-5 py-3 text-sm font-medium text-[#1570CD] bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200/70 transition-colors cursor-pointer font-bn"
              >
                সম্পন্ন হিসেবে মার্ক করুন
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Practice System */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-600 font-bn">
                এই লেসনের অনুশীলনী প্রশ্ন শীঘ্রই যুক্ত করা হবে।
              </p>
            </div>
          ) : practiceFinished ? (
            /* Results Screen */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-[#1E82E6] flex items-center justify-center mx-auto border border-sky-200">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-classical text-2xl font-bold text-slate-800">
                  অনুশীলন সম্পন্ন হয়েছে!
                </h3>
                <p className="text-sm text-slate-600 font-bn mt-1">
                  আপনার অর্জিত ফলাফল:
                </p>
                <p className="text-3xl font-extrabold text-[#1E82E6] tabular-nums mt-2">
                  {practiceScore} / {questions.length} সঠিক
                </p>
              </div>

              <div className="max-w-md mx-auto pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRestartPractice}
                  className="flex-1 px-4 py-2.5 text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200/70 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-bn"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>পুনরায় অনুশীলন করুন</span>
                </button>

                <button
                  onClick={() => onNavigate('courses')}
                  className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-bn"
                >
                  <span>পরবর্তী লেসন দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="space-y-6">
              {/* Question Progress bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="font-bn">
                  প্রশ্ন {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span className="font-bn text-[#1570CD] font-semibold">
                  স্কোর: {practiceScore}
                </span>
              </div>

              <div className="w-full bg-sky-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#1E82E6] h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Prompt */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#1570CD] uppercase tracking-wider">
                  Type: {currentQuestion.type.replace(/_/g, ' ')}
                </span>
                <h3 className="font-classical text-lg sm:text-xl font-bold text-slate-800">
                  {currentQuestion.prompt}
                </h3>
                <p className="text-sm font-semibold text-slate-700 font-bn">
                  {currentQuestion.promptBn}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options?.map((opt, optIdx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

                  let btnStyle = 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-800';

                  if (isSelected && !isSubmitted) {
                    btnStyle = 'border-[#1E82E6] bg-sky-50/85 text-slate-800 font-medium';
                  }

                  if (isSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'border-rose-700 bg-rose-50/70 text-rose-950';
                    } else {
                      btnStyle = 'border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-4 text-left rounded-xl border text-sm sm:text-base transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0 font-medium">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSubmitted && isCorrect && (
                        <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-rose-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback after submitting */}
              {isSubmitted && (
                <div
                  className={`p-4 rounded-xl border animate-in fade-in space-y-2 ${
                    selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}
                >
                  <p className="text-xs font-bold font-bn">
                    {selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()
                      ? 'সঠিক উত্তর! (Correct Answer)'
                      : 'ভুল উত্তর! (Incorrect Answer)'}
                  </p>
                  <p className="text-xs font-medium font-bn">
                    সঠিক উত্তর: <span className="font-bold underline">{currentQuestion.correctAnswer}</span>
                  </p>
                  <p className="text-xs font-bn text-slate-700 pt-1">
                    ব্যাখ্যা: {currentQuestion.explanationBn || currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="pt-4 flex items-center justify-end">
                {!isSubmitted ? (
                  <button
                    disabled={!selectedAnswer}
                    onClick={handleSubmitAnswer}
                    className={`w-full sm:w-auto min-h-[46px] px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      selectedAnswer
                        ? 'bg-[#1E82E6] text-white hover:bg-[#1673D1] shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    উত্তর জমা দিন (Submit)
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-bn"
                  >
                    <span>
                      {currentQuestionIndex + 1 === questions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full-Screen Interactive Game Mode Exercise Modal */}
      <InteractiveExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        questions={questions}
        onComplete={(sc, tot) => {
          if (tot > 0 && sc >= Math.ceil(tot * 0.6)) {
            handleMarkCompleted();
          }
        }}
      />
    </div>
  );
}
