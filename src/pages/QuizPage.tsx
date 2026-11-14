import React, { useEffect, useState, useRef } from 'react';
import { Question, Level, QuizAttempt } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import confetti from 'canvas-confetti';
import {
  Timer,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Play,
  AlertCircle,
} from 'lucide-react';
import { PremiumTrophyIcon } from '../components/PremiumIcons.tsx';

interface QuizPageProps {
  initialLevelId?: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export function QuizPage({ initialLevelId, onNavigate, onOpenAuthModal }: QuizPageProps) {
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<string>(initialLevelId || 'all');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20>(5);
  const [enableTimer, setEnableTimer] = useState<boolean>(true);

  // Active quiz state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Result state
  const [quizResult, setQuizResult] = useState<any | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadLevels() {
      try {
        const lvls = await api.getLevels();
        setLevels(lvls);
      } catch (err) {
        console.error('Failed to load levels for quiz:', err);
      }
    }
    loadLevels();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isQuizActive && enableTimer && !isTimerPaused && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuizActive, enableTimer, isTimerPaused, timeLeftSeconds]);

  const handleStartQuiz = async () => {
    setQuizError(null);
    try {
      const qList = await api.getQuizQuestions({
        levelId: selectedLevelId === 'all' ? undefined : selectedLevelId,
        count: questionCount,
      });

      if (qList.length === 0) {
        setQuizError('দুঃখিত, এই ক্যাটাগরিতে পর্যাপ্ত প্রশ্ন পাওয়া যায়নি। অনুগ্রহ করে অন্য বিষয় নির্বাচন করুন।');
        return;
      }

      setQuestions(qList);
      setCurrentIndex(0);
      setUserAnswers({});
      setQuizResult(null);
      setQuizStartTime(Date.now());

      // 1 minute per question for timer
      setTimeLeftSeconds(questionCount * 60);
      setIsTimerPaused(false);
      setIsQuizActive(true);
    } catch (err) {
      console.error('Failed to start quiz:', err);
    }
  };

  const handleSelectAnswer = (qId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleAutoSubmit = () => {
    finishQuiz();
  };

  const finishQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const answersArray = questions.map(q => ({
      questionId: q.id,
      selectedAnswer: userAnswers[q.id] || '',
    }));

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - quizStartTime) / 1000));
    const levelObj = levels.find(l => l.id === selectedLevelId);
    const quizTitle = levelObj ? `Level ${levelObj.levelNumber} Grammar Quiz` : 'General Grammar Quiz';

    if (user) {
      try {
        const res = await api.submitQuiz({
          levelId: selectedLevelId === 'all' ? undefined : selectedLevelId,
          quizTitle,
          userAnswers: answersArray,
          timeSpentSeconds,
        });
        setQuizResult(res.summary);
        setIsQuizActive(false);

        if (res.summary.scorePercentage >= 75) {
          confetti({ particleCount: 100, spread: 70 });
        }
      } catch (err) {
        console.error('Failed to submit quiz to server:', err);
        fallbackLocalCalculation(answersArray, timeSpentSeconds);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      fallbackLocalCalculation(answersArray, timeSpentSeconds);
      setIsSubmitting(false);
    }
  };

  const fallbackLocalCalculation = (answersArray: any[], timeSpentSeconds: number) => {
    let correct = 0;
    const details = answersArray.map(a => {
      const q = questions.find(item => item.id === a.questionId);
      const isCorrect = q ? q.correctAnswer.trim().toLowerCase() === a.selectedAnswer.trim().toLowerCase() : false;
      if (isCorrect) correct++;
      return {
        questionId: a.questionId,
        userAnswer: a.selectedAnswer,
        isCorrect,
        correctAnswer: q?.correctAnswer || '',
        explanationBn: q?.explanationBn || q?.explanation || '',
      };
    });

    const total = answersArray.length;
    const scorePercentage = Math.round((correct / total) * 100);

    setQuizResult({
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: total - correct,
      scorePercentage,
      passed: scorePercentage >= 60,
      details,
      timeSpentSeconds,
    });
    setIsQuizActive(false);

    if (scorePercentage >= 75) {
      confetti({ particleCount: 100, spread: 70 });
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1570CD] font-bn">
          <span>মূল্যায়ন ও পরীক্ষা</span>
          <span aria-hidden="true">·</span>
          <span>Topic-Wise Assessments</span>
        </div>
        <h1 className="font-classical text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight mt-1">
          English Grammar Assessments
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-bn">
          ৫, ১০ অথবা ২০ প্রশ্নের অধ্যায়ভিত্তিক পরীক্ষায় অংশগ্রহণ করে আপনার ব্যাকরণগত প্রস্তুতি মূল্যায়ন করুন।
        </p>
      </div>

      {!isQuizActive && !quizResult && (
        /* Quiz Configuration Screen */
        <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs space-y-6 sm:space-y-8">
          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2 font-bn">
              ১. গ্রামার টপিক বা লেভেল নির্বাচন করুন
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedLevelId('all')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedLevelId === 'all'
                    ? 'border-[#1E82E6] bg-sky-50/80 text-slate-800 font-semibold'
                    : 'border-slate-200 hover:border-sky-400 text-slate-700'
                }`}
              >
                <p className="text-sm font-semibold">All Topics (সকল বিষয়)</p>
                <p className="text-xs text-slate-500 font-bn mt-1">
                  সকল অধ্যায় থেকে সম্মিলিত প্রশ্নমালা
                </p>
              </button>

              {levels.map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevelId(lvl.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedLevelId === lvl.id
                      ? 'border-[#1E82E6] bg-sky-50/80 text-slate-800 font-semibold'
                      : 'border-slate-200 hover:border-sky-400 text-slate-700'
                  }`}
                >
                  <p className="text-sm font-bold">Level {lvl.levelNumber}: {lvl.title}</p>
                  <p className="text-xs text-slate-500 font-bn mt-1 truncate">
                    {lvl.titleBn}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selection: 5, 10, or 20 */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2 font-bn">
              ২. প্রশ্নের সংখ্যা নির্ধারণ করুন (Question Length)
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {[5, 10, 20].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCount(cnt as 5 | 10 | 20)}
                  className={`p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    questionCount === cnt
                      ? 'border-[#1E82E6] bg-[#1E82E6] text-white font-bold shadow-xs'
                      : 'border-slate-200 hover:border-sky-400 text-slate-800'
                  }`}
                >
                  <span className="text-lg sm:text-xl font-bold tabular-nums">{cnt}</span>
                  <span className="block text-[11px] sm:text-xs mt-1 font-bn">টি প্রশ্ন</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timer Toggle */}
          <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-sky-50/55 border border-sky-200/75">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <Timer className="w-5 h-5 text-[#1E82E6] shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 font-bn">
                  টাইমার চালু রাখুন ({questionCount} মিনিট সময়)
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bn">
                  বাস্তব পরীক্ষার অভিজ্ঞতা পাওয়ার জন্য সময় সীমাবদ্ধ রাখতে পারেন।
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                aria-label="Enable quiz timer"
                checked={enableTimer}
                onChange={e => setEnableTimer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1E82E6] peer-focus-visible:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E82E6]"></div>
            </label>
          </div>

          {quizError && (
            <div role="alert" className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm font-semibold text-amber-900 font-bn flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{quizError}</span>
            </div>
          )}

          {/* Start Button */}
          <button
            type="button"
            onClick={handleStartQuiz}
            className="w-full min-h-[48px] py-3.5 text-sm sm:text-base font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] active:scale-[0.99] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>পরীক্ষা শুরু করুন (Start Assessment)</span>
          </button>
        </div>
      )}

      {/* Active Quiz View */}
      {isQuizActive && questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6">
          {/* Quiz Top bar: Counter & Timer */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 font-bn">
              <span>প্রশ্ন {currentIndex + 1} / {questions.length}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1570CD]">
                উত্তর প্রদান: {Object.keys(userAnswers).length} / {questions.length}
              </span>
            </div>

            {enableTimer && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                  timeLeftSeconds <= 60
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-sky-50 text-[#1570CD]'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span className="tabular-nums">{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-sky-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#1E82E6] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Active Question */}
          {(() => {
            const q = questions[currentIndex];
            const currentSelected = userAnswers[q.id];

            return (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-classical text-xl font-semibold text-slate-800 leading-snug">
                    {q.prompt}
                  </h3>
                  <p className="text-base font-semibold text-slate-700 font-bn">
                    {q.promptBn}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {q.options?.map((opt, optIdx) => {
                    const isSelected = currentSelected === opt;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={`w-full p-4 text-left rounded-xl border text-sm sm:text-base transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-[#1E82E6] bg-sky-50/85 text-slate-800 font-semibold'
                            : 'border-slate-200 hover:border-sky-400 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                              isSelected
                                ? 'bg-[#1E82E6] text-white border-[#1E82E6]'
                                : 'border-slate-300 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#1570CD] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    আগের প্রশ্ন
                  </button>

                  <div className="flex items-center gap-2">
                    {currentIndex + 1 < questions.length ? (
                      <button
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>পরবর্তী প্রশ্ন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={finishQuiz}
                        disabled={isSubmitting}
                        className="min-h-[44px] px-6 py-2.5 text-xs font-bold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-all shadow-xs cursor-pointer font-bn"
                      >
                        {isSubmitting ? 'জমা হচ্ছে...' : 'কুইজ সমাপ্ত করুন'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Quiz Result & Performance Summary Screen */}
      {quizResult && (
        <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs space-y-6 sm:space-y-8">
          <div className="text-center space-y-3">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xs border ${
                quizResult.passed
                  ? 'bg-sky-50 border-sky-200 text-[#1E82E6]'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <PremiumTrophyIcon className="w-9 h-9" />
            </div>

            <h2 className="font-classical text-2xl font-semibold text-slate-800 font-bn">
              {quizResult.passed ? 'অভিনন্দন। আপনি মূল্যায়নে উত্তীর্ণ হয়েছেন।' : 'মূল্যায়ন সম্পন্ন হয়েছে'}
            </h2>
            <p className="text-xs text-slate-500 font-bn">
              {quizResult.passed
                ? 'আপনার অর্জিত ফলাফল সংরক্ষণ করা হয়েছে।'
                : 'নিয়মাবলী পুনরায় অধ্যয়ন করে পুনর্বার অনুশীলন করুন।'}
            </p>
          </div>

          {/* Scoreboard Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#F7FAFE] border border-slate-200/80">
              <p className="text-xs text-slate-500 font-bn">মোট প্রশ্ন</p>
              <p className="text-xl font-bold text-slate-800 tabular-nums">
                {quizResult.totalQuestions}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <p className="text-xs text-emerald-800 font-bn">সঠিক উত্তর</p>
              <p className="text-xl font-bold text-emerald-800 tabular-nums">
                {quizResult.correctAnswers}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
              <p className="text-xs text-rose-800 font-bn">ভুল উত্তর</p>
              <p className="text-xl font-bold text-rose-800 tabular-nums">
                {quizResult.wrongAnswers}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
              <p className="text-xs text-[#1570CD] font-bn">চূড়ান্ত স্কোর</p>
              <p className="text-xl font-bold text-slate-800 tabular-nums">
                {quizResult.scorePercentage}%
              </p>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 font-bn">
              প্রশ্নের বিশদ সমাধান ও সঠিক উত্তর
            </h3>

            <div className="space-y-4">
              {quizResult.details?.map((item: any, idx: number) => {
                const questionObj = questions.find(q => q.id === item.questionId);

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border space-y-2 ${
                      item.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-500">
                          Question {idx + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
                          {questionObj?.prompt}
                        </h4>
                        <p className="text-xs text-slate-600 font-bn mt-0.5">
                          {questionObj?.promptBn}
                        </p>
                      </div>

                      {item.isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded shrink-0 font-bn">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>সঠিক</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded shrink-0 font-bn">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>ভুল</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs pt-1 space-y-1">
                      <p className="text-slate-700">
                        <span className="font-semibold">আপনার উত্তর:</span>{' '}
                        <span className={item.isCorrect ? 'text-emerald-800 font-bold' : 'text-rose-800 line-through'}>
                          {item.userAnswer || '(উত্তর দেওয়া হয়নি)'}
                        </span>
                      </p>
                      {!item.isCorrect && (
                        <p className="text-emerald-900">
                          <span className="font-semibold">সঠিক উত্তর:</span>{' '}
                          <span className="font-bold underline">{item.correctAnswer}</span>
                        </p>
                      )}
                      <p className="text-slate-600 font-bn pt-1 bg-white/80 p-2 rounded-lg border border-slate-200/70">
                        <span className="font-semibold text-slate-900">ব্যাখ্যা:</span>{' '}
                        {item.explanationBn || item.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setQuizResult(null);
                setIsQuizActive(false);
              }}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200/70 rounded-xl transition-colors cursor-pointer font-bn"
            >
              নতুন কুইজ শুরু করুন
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors cursor-pointer font-bn"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
