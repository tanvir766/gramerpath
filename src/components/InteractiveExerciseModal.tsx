import React, { useState, useEffect } from 'react';
import { Question } from '../types/index.ts';
import confetti from 'canvas-confetti';
import { CatnivoCharacter } from './CatnivoCharacter.tsx';
import { X, AlertCircle, RotateCcw } from 'lucide-react';
import { PremiumHeartIcon, PremiumSpeakerIcon, PremiumStarIcon } from './PremiumIcons.tsx';

interface InteractiveExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onComplete?: (score: number, total: number) => void;
}

export function InteractiveExerciseModal({
  isOpen,
  onClose,
  questions,
  onComplete,
}: InteractiveExerciseModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedOption('');
      setIsSubmitted(false);
      setIsCorrect(false);
      setHearts(3);
      setScore(0);
      setIsFinished(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex] || {
    id: 'sample',
    type: 'mcq',
    prompt: 'Translate this sentence',
    promptBn: '"আমি নিয়মিত ইংরেজি পড়ি।" — সঠিক উত্তরটি বাছাই করুন',
    options: [
      'I read English regularly.',
      'I reads English regularly.',
      'I am read English.',
      'I reading English.',
    ],
    correctAnswer: 'I read English regularly.',
    explanationBn: 'Subject (I) এর ক্ষেত্রে মূল Verb-এর Base Form (read) বসে।',
  };

  // Derive a clean cue for the speech bubble without spoiling the answer
  const quotedMatch = currentQ.prompt?.match(/[“"]([^”"]+)[”"]/);
  const bubbleCue = quotedMatch
    ? quotedMatch[1]
    : currentQ.prompt?.includes('___')
    ? currentQ.prompt
    : currentQ.promptBn || currentQ.prompt;

  const playVoice = (text: string) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = /[\u0980-\u09FF]/.test(text) ? 'bn-BD' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isSubmitted) return;
    const correct =
      selectedOption.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleContinue = () => {
    if (currentIndex + 1 < questions.length && hearts > 0) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption('');
      setIsSubmitted(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
      onComplete?.(score, questions.length);
    }
  };

  const progressPercentage =
    questions.length > 0 ? ((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-slate-900/45 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full h-full sm:h-auto sm:max-w-lg bg-[#F7FAFE] sm:bg-white sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col sm:max-h-[92vh]">
        {/* Top Bar */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-5 bg-white border-b border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Close practice"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-[#1E82E6] rounded-full hover:bg-sky-50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-sky-100/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#1E82E6] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(12, progressPercentage)}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 font-extrabold text-sm text-[#1E82E6] tabular-nums shrink-0">
            <PremiumHeartIcon className="w-5 h-5 drop-shadow-2xs" />
            <span>{hearts}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-7 sm:py-6 space-y-3.5 sm:space-y-5 bg-[#F7FAFE] sm:bg-white">
          {!isFinished ? (
            <>
              {/* Question Title & Subtitle */}
              <div className="space-y-1">
                <h3 className="text-lg sm:text-2xl font-bold font-classical text-slate-800 leading-snug">
                  {currentQ.prompt || 'Translate this sentence'}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-600 font-bn">
                  {currentQ.promptBn || 'Choose the correct answer'}
                </p>
              </div>

              {/* Character + Crisp White Speech Bubble */}
              <div className="flex items-center gap-3 pt-0.5 sm:pt-1">
                <div className="shrink-0">
                  <CatnivoCharacter
                    pose={
                      isSubmitted
                        ? isCorrect
                          ? 'excited'
                          : 'surprised'
                        : selectedOption
                        ? 'reading'
                        : 'thinking'
                    }
                    size="md"
                    className="sm:scale-115"
                    interactive={true}
                    animate={isSubmitted && isCorrect}
                  />
                </div>

                <div className="relative flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3.5 bg-white border border-slate-200/85 rounded-2xl shadow-sm">
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-l border-b border-slate-200/85 rotate-45" />
                  <div className="flex items-center gap-2 sm:gap-2.5 relative z-10">
                    <button
                      type="button"
                      onClick={() => playVoice(bubbleCue)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center bg-sky-50 text-[#1E82E6] hover:bg-sky-100 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="Listen audio"
                      aria-label="Listen pronunciation"
                    >
                      <PremiumSpeakerIcon className="w-4 h-4" />
                    </button>
                    <span className="text-sm sm:text-base font-semibold text-slate-800 font-bn leading-snug">
                      {bubbleCue}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2x2 Option Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-0.5 sm:pt-1">
                {currentQ.options?.map((opt, oIdx) => {
                  const isSelected = selectedOption === opt;
                  const isAnswerCorrect =
                    opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

                  let cardStyle =
                    'bg-white border border-slate-200/90 text-slate-800 shadow-xs hover:border-sky-400';
                  let radioStyle = 'border-slate-300 bg-white';

                  if (isSelected && !isSubmitted) {
                    cardStyle =
                      'bg-sky-50/85 border-2 border-[#1E82E6] text-slate-800 font-bold shadow-xs';
                    radioStyle = 'border-[#1E82E6] bg-white ring-4 ring-sky-100';
                  }

                  if (isSubmitted) {
                    if (isAnswerCorrect) {
                      cardStyle =
                        'bg-emerald-50/70 border-2 border-emerald-700 text-emerald-950 font-bold';
                      radioStyle = 'border-emerald-700 bg-white';
                    } else if (isSelected && !isAnswerCorrect) {
                      cardStyle = 'bg-rose-50/70 border-2 border-rose-700 text-rose-950 font-bold';
                      radioStyle = 'border-rose-700 bg-white';
                    } else {
                      cardStyle = 'bg-white border border-slate-200/70 text-slate-400 opacity-55';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(opt)}
                      className={`min-h-[92px] sm:min-h-[120px] p-3 sm:p-3.5 rounded-2xl flex flex-col justify-between items-center text-center transition-all cursor-pointer active:scale-[0.98] ${cardStyle}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center self-start shrink-0 transition-all ${radioStyle}`}
                      >
                        {isSelected && (
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              isSubmitted
                                ? isAnswerCorrect
                                  ? 'bg-emerald-700'
                                  : 'bg-rose-700'
                                : 'bg-[#1E82E6]'
                            }`}
                          />
                        )}
                      </div>

                      <span className="text-sm sm:text-base font-semibold leading-snug my-auto px-1 break-words w-full">
                        {opt}
                      </span>

                      <span className="h-2" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Finished Results Screen */
            <div className="py-6 text-center space-y-5">
              <div className="flex justify-center">
                <CatnivoCharacter
                  pose={hearts > 0 ? (score === questions.length ? 'excited' : 'hero') : 'sad'}
                  size="xl"
                  interactive={true}
                  animate={hearts > 0}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-classical text-slate-800">
                  {hearts > 0 ? 'Practice Completed' : 'Session Ended'}
                </h3>
                <p className="text-sm text-slate-600 font-bn">
                  মোট প্রশ্ন: {questions.length} · আপনার সঠিক উত্তর: {score} টি
                </p>
                <p className="text-3xl font-extrabold text-[#1E82E6] tabular-nums">
                  {Math.round((score / Math.max(1, questions.length)) * 100)}%
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(0);
                    setSelectedOption('');
                    setIsSubmitted(false);
                    setHearts(3);
                    setScore(0);
                    setIsFinished(false);
                  }}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-[#1570CD] bg-sky-50 hover:bg-sky-100 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-bn"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>পুনরায় প্র্যাকটিস করুন</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-2xl transition-colors cursor-pointer font-bn shadow-xs"
                >
                  সমাপ্ত করুন
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sheet / Feedback Banner + Full-Width Continue CTA */}
        {!isFinished && (
          <div className="p-4 sm:p-6 bg-white border-t border-slate-100 space-y-3 pb-safe">
            {isSubmitted && (
              <div
                className={`relative overflow-hidden p-4 rounded-2xl border flex items-center gap-3.5 ${
                  isCorrect
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-rose-50/70 border-rose-200'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white ${
                    isCorrect
                      ? 'bg-emerald-800 text-white'
                      : 'bg-rose-700 text-white'
                  }`}
                >
                  {isCorrect ? <PremiumStarIcon className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>

                <div className="space-y-0.5 relative z-10 min-w-0">
                  <h4
                    className={`text-sm sm:text-base font-bold ${
                      isCorrect ? 'text-emerald-900' : 'text-rose-900'
                    }`}
                  >
                    {isCorrect ? 'Well done.' : 'Review Required'}
                  </h4>
                  <p
                    className={`text-xs font-medium font-bn ${
                      isCorrect ? 'text-emerald-800' : 'text-rose-800'
                    }`}
                  >
                    {isCorrect
                      ? 'Your answer is correct.'
                      : `সঠিক উত্তর: ${currentQ.correctAnswer}${currentQ.explanationBn ? ` — ${currentQ.explanationBn}` : ''}`}
                  </p>
                </div>
              </div>
            )}

            {!isSubmitted ? (
              <button
                type="button"
                disabled={!selectedOption}
                onClick={handleCheckAnswer}
                className={`w-full py-3.5 text-sm sm:text-base font-bold rounded-2xl transition-all cursor-pointer shadow-sm ${
                  selectedOption
                    ? 'bg-[#1E82E6] text-white hover:bg-[#1673D1]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Check Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContinue}
                className={`w-full py-3.5 text-sm sm:text-base font-bold rounded-2xl transition-all cursor-pointer shadow-sm text-white ${
                  isCorrect
                    ? 'bg-[#1E82E6] hover:bg-[#1673D1]'
                    : 'bg-rose-700 hover:bg-rose-800'
                }`}
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
