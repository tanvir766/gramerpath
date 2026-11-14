import React, { useEffect, useState } from 'react';
import { Question, Level } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Filter,
  Check,
  X,
  Volume2,
  Gamepad2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InteractiveExerciseModal } from '../components/InteractiveExerciseModal.tsx';
import { CatnivoCharacter } from '../components/CatnivoCharacter.tsx';
import { PremiumGamepadIcon, PremiumSpeakerIcon } from '../components/PremiumIcons.tsx';

interface PracticePageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function PracticePage({ onNavigate }: PracticePageProps) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([]);
  const [isRetryingIncorrect, setIsRetryingIncorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [lvls, qList] = await Promise.all([
          api.getLevels(),
          api.getQuizQuestions({ count: 20 }),
        ]);
        setLevels(lvls);
        setQuestions(qList);
      } catch (err) {
        console.error('Failed to load practice questions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFilterChange = async (levelId: string, type: string) => {
    setSelectedLevelId(levelId);
    setSelectedType(type);
    setIsLoading(true);
    try {
      const qList = await api.getQuizQuestions({
        levelId: levelId === 'all' ? undefined : levelId,
        count: 20,
      });

      const filtered = type === 'all' ? qList : qList.filter(q => q.type === type);
      setQuestions(filtered);
      setCurrentIndex(0);
      setSelectedAnswer('');
      setIsSubmitted(false);
      setScore(0);
      setIncorrectQuestions([]);
      setIsRetryingIncorrect(false);
      setIsFinished(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    if (!selectedAnswer || isSubmitted || !currentQ) return;
    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setIsSubmitted(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectQuestions(prev => [...prev, currentQ]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      if (score >= Math.ceil(questions.length * 0.7)) {
        confetti({ particleCount: 80, spread: 60 });
      }
    }
  };

  const handleStartRetry = () => {
    if (incorrectQuestions.length === 0) return;
    setQuestions(incorrectQuestions);
    setIncorrectQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer('');
    setIsSubmitted(false);
    setScore(0);
    setIsRetryingIncorrect(true);
    setIsFinished(false);
  };

  const handleResetAll = () => {
    handleFilterChange(selectedLevelId, selectedType);
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1570CD] font-bn">
            <span>ধারাবাহিক অনুশীলন</span>
            <span aria-hidden="true">·</span>
            <span>Immediate Evaluation</span>
          </div>
          <h1 className="font-classical text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight mt-1">
            Grammar Practice &amp; Drills
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-bn">
            বহুনির্বাচনী প্রশ্ন, শূন্যস্থান পূরণ, বাক্য সংশোধন এবং বাংলা-ইংরেজি অনুবাদের সুবিন্যস্ত অনুশীলন।
          </p>
        </div>

        {/* Guided Exercise Mode Button */}
        <button
          onClick={() => {
            setIsGameModalOpen(true);
          }}
          className="w-full sm:w-auto min-h-[44px] px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-bn shrink-0"
        >
          <PremiumGamepadIcon active className="w-5 h-5 text-sky-100" />
          <span>নির্দেশিত অনুশীলন (Guided Drills)</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/85 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full flex-1 text-xs">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-semibold text-slate-500 font-bn">কোর্স/লেভেল:</span>
            <select
              value={selectedLevelId}
              onChange={e => handleFilterChange(e.target.value, selectedType)}
              className="w-full min-w-0 min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 bg-[#F7FAFE] text-slate-800 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1E82E6]"
            >
            <option value="all">সব বিষয় (All Topics)</option>
            {levels.map(l => (
              <option key={l.id} value={l.id}>
                Level {l.levelNumber}: {l.title}
              </option>
            ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-semibold text-slate-500 font-bn">প্রশ্নের ধরন:</span>
            <select
              value={selectedType}
              onChange={e => handleFilterChange(selectedLevelId, e.target.value)}
              className="w-full min-w-0 min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 bg-[#F7FAFE] text-slate-800 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1E82E6]"
            >
              <option value="all">সকল ধরন (All Types)</option>
              <option value="mcq">MCQ</option>
              <option value="fill_in_the_blank">Fill in the blanks</option>
              <option value="choose_correct">Choose correct sentence</option>
              <option value="correct_sentence">Correct the sentence</option>
              <option value="translate_bn_to_en">Bengali to English</option>
              <option value="translate_en_to_bn">English to Bengali</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleResetAll}
          className="min-h-[38px] self-end md:self-auto px-3 py-1.5 rounded-xl text-xs text-[#1570CD] hover:text-[#1E82E6] hover:bg-sky-50 font-semibold flex items-center gap-1.5 font-bn cursor-pointer shrink-0 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>নতুন প্রশ্ন আনুন</span>
        </button>
      </div>

      {/* Practice Sandbox */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin w-8 h-8 border-2 border-[#1E82E6] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-bn">অনুশীলনী প্রস্তুত হচ্ছে...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-600 font-bn">
            এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি। অনুগ্রহ করে অন্য ফিল্টার নির্বাচন করুন।
          </p>
        </div>
      ) : isFinished ? (
        /* Results View */
        <div className="bg-white rounded-2xl border border-slate-200/85 p-5 sm:p-8 text-center space-y-6 shadow-xs">
          <div className="flex justify-center">
            <CatnivoCharacter
              pose={score >= Math.ceil(questions.length * 0.7) ? 'excited' : 'hero'}
              size="xl"
              interactive={true}
              animate={true}
            />
          </div>

          <div>
            <h2 className="font-classical text-2xl font-semibold text-slate-800 font-bn">
              অনুশীলন সফলভাবে সমাপ্ত হয়েছে
            </h2>
            <p className="text-sm text-slate-600 font-bn mt-1">
              মোট প্রশ্ন: {questions.length} · সঠিক উত্তর: {score}
            </p>
            <p className="text-3xl font-semibold text-[#1E82E6] tabular-nums mt-3">
              {Math.round((score / questions.length) * 100)}%
            </p>
          </div>

          {incorrectQuestions.length > 0 && (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-left">
              <p className="text-xs font-semibold text-amber-900 font-bn">
                আপনি {incorrectQuestions.length}টি প্রশ্নে ভুল করেছেন।
              </p>
              <p className="text-xs text-amber-800 font-bn mt-1">
                ভুল প্রশ্নগুলো পুনরায় প্র্যাকটিস করে শতভাগ আত্মবিশ্বাস অর্জন করুন!
              </p>
            </div>
          )}

          <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {incorrectQuestions.length > 0 && (
              <button
                onClick={handleStartRetry}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bn"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ভুলগুলো আবার দিন ({incorrectQuestions.length})</span>
              </button>
            )}

            <button
              onClick={handleResetAll}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors cursor-pointer font-bn"
            >
              আবার সম্পূর্ণ প্র্যাকটিস করুন
            </button>
          </div>
        </div>
      ) : (
        /* Active Question */
        <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bn">
              প্রশ্ন {currentIndex + 1} / {questions.length}
              {isRetryingIncorrect && ' (ভুল সংশোধন রাউন্ড)'}
            </span>
            <span className="font-bn text-[#1570CD] font-semibold">স্কোর: {score}</span>
          </div>

          <div className="w-full bg-sky-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#1E82E6] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-sky-50/55 border border-sky-200/75">
            <div className="shrink-0">
              <CatnivoCharacter
                pose={
                  isSubmitted
                    ? selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()
                      ? 'excited'
                      : 'surprised'
                    : selectedAnswer
                    ? 'reading'
                    : 'thinking'
                }
                size="md"
                interactive={true}
                animate={isSubmitted && selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()}
              />
            </div>
            <div className="space-y-1 flex-1">
              <span className="text-[10px] font-semibold text-[#1570CD] uppercase tracking-wider">
                Type: {currentQ.type.replace(/_/g, ' ')}
              </span>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-classical text-base sm:text-xl font-semibold text-slate-800 leading-snug">
                  {currentQ.prompt}
                </h3>
                <button
                  onClick={() => playVoice(currentQ.correctAnswer || currentQ.prompt)}
                  className="shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-[#1570CD] hover:text-white rounded-xl bg-sky-50 hover:bg-[#1E82E6] border border-sky-200/70 transition-colors cursor-pointer"
                  title="উচ্চারণ শুনুন"
                  aria-label="উচ্চারণ শুনুন"
                >
                  <PremiumSpeakerIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 font-bn">
                {currentQ.promptBn}
              </p>
            </div>
          </div>

          {/* Options with interactive radio selection indicator */}
          <div className="space-y-3 pt-2">
            {currentQ.options?.map((opt, optIdx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

              let btnStyle = 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-800';

              if (isSelected && !isSubmitted) {
                btnStyle = 'border-[#1E82E6] bg-sky-50/85 text-slate-800 font-bold';
              }

              if (isSubmitted) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold';
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
                  onClick={() => setSelectedAnswer(opt)}
                  className={`w-full p-4 text-left rounded-2xl border text-sm sm:text-base transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-[#1E82E6] bg-[#1E82E6]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span>{opt}</span>
                  </div>

                  {isSubmitted && isCorrect && <Check className="w-5 h-5 text-emerald-700 shrink-0" />}
                  {isSubmitted && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-700 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Immediate Feedback Explanation */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-xl border animate-in fade-in space-y-2 ${
                selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}
            >
              <p className="text-xs font-bold font-bn">
                {selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()
                  ? 'সঠিক উত্তর! (Correct Answer)'
                  : 'ভুল উত্তর! (Incorrect Answer)'}
              </p>
              <p className="text-xs font-medium font-bn">
                সঠিক উত্তর: <span className="font-bold underline">{currentQ.correctAnswer}</span>
              </p>
              <p className="text-xs font-bn text-slate-700 pt-1">
                ব্যাখ্যা: {currentQ.explanationBn || currentQ.explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end">
            {!isSubmitted ? (
              <button
                disabled={!selectedAnswer}
                onClick={handleSubmit}
                className={`w-full sm:w-auto min-h-[46px] px-6 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer font-bn ${
                  selectedAnswer
                    ? 'bg-[#1E82E6] text-white hover:bg-[#1673D1] shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                উত্তর জমা দিন
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto min-h-[46px] px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-bn"
              >
                <span>
                  {currentIndex + 1 === questions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full-Screen Interactive Game Mode Modal */}
      <InteractiveExerciseModal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        questions={questions}
      />
    </div>
  );
}
