import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CatnivoCharacter, CatnivoPose } from '../components/CatnivoCharacter.tsx';
import {
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Timer,
  Play,
  Check,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  Target,
} from 'lucide-react';
import {
  PremiumPuzzleIcon,
  PremiumTargetIcon,
  PremiumTimerIcon,
  PremiumZapIcon,
} from '../components/PremiumIcons.tsx';

interface ActivitiesPageProps {
  onNavigate: (view: string, param?: string) => void;
}

type ActivityTab = 'sentence_builder' | 'parts_of_speech' | 'tense_transformer' | 'speed_sprint';

// ----------------------------------------------------
// Activity 1 Data: Sentence Builder (SVO Scramble)
// ----------------------------------------------------
const SENTENCE_CHALLENGES = [
  {
    id: 'sb_1',
    bangla: 'আমি প্রতিদিন ইংরেজি ব্যাকরণ অনুশীলন করি।',
    correctWords: ['I', 'practice', 'English', 'grammar', 'every', 'day.'],
    hint: 'S+V+O নিয়ম: Subject (I) + Verb (practice) + Object (English grammar) + Time (every day).',
  },
  {
    id: 'sb_2',
    bangla: 'সূর্য পূর্ব দিকে উদিত হয়।',
    correctWords: ['The', 'sun', 'rises', 'in', 'the', 'east.'],
    hint: 'চিরন্তন সত্য: Subject (The sun) 3rd person singular হওয়ায় verb-এর সাথে s (rises) যুক্ত হয়েছে।',
  },
  {
    id: 'sb_3',
    bangla: 'সে একটি চমৎকার উপন্যাস পড়ছে।',
    correctWords: ['She', 'is', 'reading', 'a', 'wonderful', 'novel.'],
    hint: 'Present Continuous: Subject (She) + is + reading (verb-ing) + Object.',
  },
  {
    id: 'sb_4',
    bangla: 'তারা গতকাল নদীতে সাঁতার কেটেছিল।',
    correctWords: ['They', 'swam', 'in', 'the', 'river', 'yesterday.'],
    hint: 'Past Indefinite: Subject (They) + Past Verb (swam) + Preposition + Time.',
  },
  {
    id: 'sb_5',
    bangla: 'সততা হলো সর্বোৎকৃষ্ট পন্থা।',
    correctWords: ['Honesty', 'is', 'the', 'best', 'policy.'],
    hint: 'প্রবাদ বাক্য (Proverb): Abstract Noun (Honesty) + Linking Verb (is) + Superlative Degree (the best policy).',
  },
  {
    id: 'sb_6',
    bangla: 'আমরা আগামীকাল একটি নতুন পাঠ শিখব।',
    correctWords: ['We', 'will', 'learn', 'a', 'new', 'lesson', 'tomorrow.'],
    hint: 'Future Indefinite: Subject (We) + will + Base Verb (learn) + Object + Time.',
  },
];

// ----------------------------------------------------
// Activity 2 Data: Parts of Speech Fast Match
// ----------------------------------------------------
const POS_CATEGORIES = [
  { id: 'noun', name: 'Noun', bn: 'বিশেষ্য (নাম)' },
  { id: 'verb', name: 'Verb', bn: 'ক্রিয়া (কাজ)' },
  { id: 'adjective', name: 'Adjective', bn: 'বিশেষণ (দোষ/গুণ)' },
  { id: 'adverb', name: 'Adverb', bn: 'ক্রিয়া বিশেষণ' },
  { id: 'preposition', name: 'Preposition', bn: 'পদান্বয়ী অব্যয়' },
];

const POS_WORDS = [
  { word: 'Quickly', category: 'adverb', meaning: 'দ্রুতভাবে' },
  { word: 'Elephant', category: 'noun', meaning: 'হাতি (প্রাণী)' },
  { word: 'Sing', category: 'verb', meaning: 'গান গাওয়া' },
  { word: 'Beautiful', category: 'adjective', meaning: 'সুন্দর' },
  { word: 'Under', category: 'preposition', meaning: 'নিচে' },
  { word: 'Happiness', category: 'noun', meaning: 'সুখ / আনন্দ' },
  { word: 'Write', category: 'verb', meaning: 'লেখা' },
  { word: 'Bright', category: 'adjective', meaning: 'উজ্জ্বল' },
  { word: 'Between', category: 'preposition', meaning: 'দুইয়ের মাঝে' },
  { word: 'Always', category: 'adverb', meaning: 'সর্বদা' },
  { word: 'Teacher', category: 'noun', meaning: 'শিক্ষক' },
  { word: 'Listen', category: 'verb', meaning: 'মনোযোগ দিয়ে শোনা' },
];

// ----------------------------------------------------
// Activity 3 Data: Tense Transformer Lab
// ----------------------------------------------------
const TENSE_TRANSFORM_CHALLENGES = [
  {
    base: 'He plays cricket.',
    baseTense: 'Present Indefinite (সাধারণ বর্তমান)',
    targetTense: 'Present Continuous (চলমান বর্তমান)',
    targetFormula: 'Subject + am/is/are + verb-ing + Object',
    options: [
      'He is playing cricket.',
      'He was playing cricket.',
      'He has played cricket.',
      'He will play cricket.',
    ],
    correct: 'He is playing cricket.',
    explanationBn: 'Present Continuous-এ Subject (He)-এর পর "is" এবং মূল verb-এর সাথে "ing" (playing) বসে।',
  },
  {
    base: 'They eat rice.',
    baseTense: 'Present Indefinite (সাধারণ বর্তমান)',
    targetTense: 'Past Indefinite (সাধারণ অতীত)',
    targetFormula: 'Subject + Past Form of Verb (V2) + Object',
    options: [
      'They ate rice.',
      'They are eating rice.',
      'They will eat rice.',
      'They have eaten rice.',
    ],
    correct: 'They ate rice.',
    explanationBn: 'Past Indefinite-এ verb-এর Past Form বসে; "eat"-এর Past Form হলো "ate"।',
  },
  {
    base: 'She reads a book.',
    baseTense: 'Present Indefinite (সাধারণ বর্তমান)',
    targetTense: 'Future Indefinite (সাধারণ ভবিষ্যৎ)',
    targetFormula: 'Subject + shall/will + Base Verb (V1) + Object',
    options: [
      'She will read a book.',
      'She is reading a book.',
      'She was read a book.',
      'She reads will a book.',
    ],
    correct: 'She will read a book.',
    explanationBn: 'Future Indefinite-এ Subject-এর পর will এবং verb-এর base form (read) বসে।',
  },
  {
    base: 'I do my homework.',
    baseTense: 'Present Indefinite (সাধারণ বর্তমান)',
    targetTense: 'Present Perfect (পুরাঘটিত বর্তমান)',
    targetFormula: 'Subject + have/has + Past Participle (V3) + Object',
    options: [
      'I have done my homework.',
      'I am doing my homework.',
      'I did my homework.',
      'I had done my homework.',
    ],
    correct: 'I have done my homework.',
    explanationBn: 'Present Perfect-এ I-এর সাথে have বসে এবং "do"-এর Past Participle (V3) হলো "done"।',
  },
];

// ----------------------------------------------------
// Activity 4 Data: Grammar 60s Speed Sprint
// ----------------------------------------------------
const SPRINT_QUESTIONS = [
  {
    prompt: 'She go to school every day.',
    isCorrect: false,
    correction: 'She goes to school every day. (She 3rd person singular)',
  },
  {
    prompt: 'I have an umbrella.',
    isCorrect: true,
    correction: 'সঠিক! "umbrella" স্বরবর্ণ ধ্বনি (vowel sound) দিয়ে শুরু হওয়ায় "an" বসে।',
  },
  {
    prompt: 'Yesterday he was not come.',
    isCorrect: false,
    correction: 'Yesterday he did not come. (Past negative-এ did not + base verb বসে)',
  },
  {
    prompt: 'They are playing football.',
    isCorrect: true,
    correction: 'সঠিক! Present Continuous Tense-এর সঠিক নিয়ম।',
  },
  {
    prompt: 'He is taller than me.',
    isCorrect: true,
    correction: 'সঠিক! Comparative Degree-এর সঠিক ব্যবহার।',
  },
  {
    prompt: 'The dog barked loudly.',
    isCorrect: true,
    correction: 'সঠিক! Past Indefinite Tense-এর নিয়ম অনুসরণ করেছে।',
  },
];

export function ActivitiesPage({ onNavigate }: ActivitiesPageProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>('sentence_builder');

  // Activity 1: Sentence Builder State
  const [sbIndex, setSbIndex] = useState(0);
  const [sbPool, setSbPool] = useState<string[]>([]);
  const [sbPlaced, setSbPlaced] = useState<string[]>([]);
  const [sbStatus, setSbStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [sbScore, setSbScore] = useState(0);

  // Activity 2: Parts of Speech Match State
  const [posIndex, setPosIndex] = useState(0);
  const [posScore, setPosScore] = useState(0);
  const [posStreak, setPosStreak] = useState(0);
  const [posFeedback, setPosFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  // Activity 3: Tense Transformer State
  const [ttIndex, setTtIndex] = useState(0);
  const [ttSelected, setTtSelected] = useState<string>('');
  const [ttSubmitted, setTtSubmitted] = useState(false);
  const [ttScore, setTtScore] = useState(0);

  // Activity 4: Speed Sprint State
  const [sprintIndex, setSprintIndex] = useState(0);
  const [sprintScore, setSprintScore] = useState(0);
  const [sprintTimeLeft, setSprintTimeLeft] = useState(60);
  const [sprintActive, setSprintActive] = useState(false);
  const [sprintFinished, setSprintFinished] = useState(false);

  // Speech Pronunciation Helper
  const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ----------------------------------------------------
  // Init Activity 1 (Sentence Builder)
  // ----------------------------------------------------
  useEffect(() => {
    const challenge = SENTENCE_CHALLENGES[sbIndex];
    if (challenge) {
      // Shuffle words deterministically
      const shuffled = [...challenge.correctWords].sort(() => 0.5 - Math.random());
      setSbPool(shuffled);
      setSbPlaced([]);
      setSbStatus('idle');
    }
  }, [sbIndex]);

  const handlePickWord = (word: string, poolIdx: number) => {
    if (sbStatus === 'correct') return;
    setSbPlaced(prev => [...prev, word]);
    setSbPool(prev => prev.filter((_, idx) => idx !== poolIdx));
    setSbStatus('idle');
  };

  const handleRemoveWord = (word: string, placedIdx: number) => {
    if (sbStatus === 'correct') return;
    setSbPool(prev => [...prev, word]);
    setSbPlaced(prev => prev.filter((_, idx) => idx !== placedIdx));
    setSbStatus('idle');
  };

  const handleCheckSentence = () => {
    const challenge = SENTENCE_CHALLENGES[sbIndex];
    const isCorrect = sbPlaced.join(' ') === challenge.correctWords.join(' ');

    if (isCorrect) {
      setSbStatus('correct');
      setSbScore(prev => prev + 10);
      playVoice(challenge.correctWords.join(' '));
      confetti({ particleCount: 50, spread: 60 });
    } else {
      setSbStatus('wrong');
    }
  };

  const handleNextSentence = () => {
    if (sbIndex + 1 < SENTENCE_CHALLENGES.length) {
      setSbIndex(prev => prev + 1);
    } else {
      setSbIndex(0);
    }
  };

  // ----------------------------------------------------
  // Activity 2 (Parts of Speech) Handlers
  // ----------------------------------------------------
  const currentPosItem = POS_WORDS[posIndex % POS_WORDS.length];

  const handleSelectPosCategory = (catId: string) => {
    if (posFeedback) return;
    const isCorrect = currentPosItem.category === catId;

    if (isCorrect) {
      setPosScore(prev => prev + (posStreak >= 3 ? 20 : 10));
      setPosStreak(prev => prev + 1);
      setPosFeedback({
        isCorrect: true,
        msg: `সঠিক! "${currentPosItem.word}" হলো ${POS_CATEGORIES.find(c => c.id === catId)?.name}।`,
      });
      playVoice(currentPosItem.word);
    } else {
      setPosStreak(0);
      const rightCat = POS_CATEGORIES.find(c => c.id === currentPosItem.category);
      setPosFeedback({
        isCorrect: false,
        msg: `ভুল! সঠিক উত্তর: ${rightCat?.name} (${rightCat?.bn})`,
      });
    }

    setTimeout(() => {
      setPosFeedback(null);
      setPosIndex(prev => prev + 1);
    }, 1200);
  };

  // ----------------------------------------------------
  // Activity 3 (Tense Transformer) Handlers
  // ----------------------------------------------------
  const currentTtChallenge = TENSE_TRANSFORM_CHALLENGES[ttIndex];

  const handleSubmitTt = () => {
    if (!ttSelected || ttSubmitted) return;
    setTtSubmitted(true);
    if (ttSelected === currentTtChallenge.correct) {
      setTtScore(prev => prev + 15);
      confetti({ particleCount: 40, spread: 50 });
      playVoice(currentTtChallenge.correct);
    }
  };

  const handleNextTt = () => {
    setTtSubmitted(false);
    setTtSelected('');
    if (ttIndex + 1 < TENSE_TRANSFORM_CHALLENGES.length) {
      setTtIndex(prev => prev + 1);
    } else {
      setTtIndex(0);
    }
  };

  // ----------------------------------------------------
  // Activity 4 (Speed Sprint) Handlers
  // ----------------------------------------------------
  useEffect(() => {
    let timer: any;
    if (sprintActive && sprintTimeLeft > 0) {
      timer = setInterval(() => {
        setSprintTimeLeft(prev => {
          if (prev <= 1) {
            setSprintActive(false);
            setSprintFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sprintActive, sprintTimeLeft]);

  const handleStartSprint = () => {
    setSprintIndex(0);
    setSprintScore(0);
    setSprintTimeLeft(60);
    setSprintActive(true);
    setSprintFinished(false);
  };

  const handleAnswerSprint = (userThinksCorrect: boolean) => {
    const currentQ = SPRINT_QUESTIONS[sprintIndex % SPRINT_QUESTIONS.length];
    const isAnswerRight = userThinksCorrect === currentQ.isCorrect;

    if (isAnswerRight) {
      setSprintScore(prev => prev + 10);
    }

    setSprintIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8">
      {/* Header with Catnivo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#E5F2FF] via-[#F2F8FF] to-[#DCEEFF] border border-sky-200/85 p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="space-y-2.5 sm:space-y-3 text-center sm:text-left max-w-lg">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#1570CD]">
              <span>GrammarPath Practice Studio</span>
              <span aria-hidden="true" className="text-sky-300">·</span>
              <span>Applied Syntax Labs</span>
            </div>

            <h1 className="font-classical text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
              Interactive Grammar Labs
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-bn leading-relaxed">
              শব্দ বিন্যাস, পদ নির্ণয়, কাল রূপান্তর এবং সময়বদ্ধ অনুশীলনের মাধ্যমে ইংরেজি ব্যাকরণের প্রয়োগিক দক্ষতা সুদৃঢ় করুন।
            </p>
          </div>

          {/* Catnivo Mascot Pose */}
          <div className="shrink-0 flex items-center justify-center">
            <CatnivoCharacter
              pose="hero"
              size="lg"
              className="sm:scale-115"
              interactive={true}
              animate={true}
            />
          </div>
        </div>
      </div>

      {/* Activity Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          {
            id: 'sentence_builder',
            title: 'Sentence Builder',
            titleBn: 'বাক্য গঠন অনুশীলন',
            Icon: PremiumPuzzleIcon,
            badge: 'S+V+O Formula',
          },
          {
            id: 'parts_of_speech',
            title: 'Parts of Speech',
            titleBn: 'পদ নির্ণয় অনুশীলন',
            Icon: PremiumTargetIcon,
            badge: 'Classification',
          },
          {
            id: 'tense_transformer',
            title: 'Tense Lab',
            titleBn: 'কাল রূপান্তর ল্যাব',
            Icon: PremiumTimerIcon,
            badge: 'Grammar Formulas',
          },
          {
            id: 'speed_sprint',
            title: 'Timed Review',
            titleBn: '৬০-সেকেন্ড মূল্যায়ন',
            Icon: PremiumZapIcon,
            badge: '60s Check',
          },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.Icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActivityTab)}
              className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                isActive
                  ? 'bg-[#1E82E6] text-white border-[#1E82E6] shadow-xs'
                  : 'bg-white border-slate-200/85 hover:border-sky-400 text-slate-800 hover:bg-sky-50/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'bg-white shadow-xs' : 'bg-sky-50 border border-sky-200/75'
                  }`}
                >
                  <TabIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span
                  className={`hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-sky-50 text-[#1570CD]'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold leading-tight">{tab.title}</p>
                <p className={`text-[11px] font-bn mt-0.5 ${isActive ? 'text-sky-100' : 'text-slate-500'}`}>
                  {tab.titleBn}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* ACTIVITY 1: SENTENCE BUILDER (WORD SCRAMBLE)        */}
      {/* ==================================================== */}
      {activeTab === 'sentence_builder' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-semibold text-[#1570CD] uppercase tracking-wider font-bn">
                অনুশীলন ১ · বাক্য গঠনের অনুশীলন ({sbIndex + 1}/{SENTENCE_CHALLENGES.length})
              </span>
              <h2 className="font-classical text-lg sm:text-xl font-semibold text-slate-800 mt-0.5">
                Build the English Sentence
              </h2>
            </div>
            <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-[#1570CD] rounded-xl font-semibold text-xs border border-sky-200/80 shrink-0">
              <Award className="w-4 h-4 text-[#1E82E6]" />
              <span>Score: {sbScore} XP</span>
            </div>
          </div>

          {/* Bengali Prompt & Catnivo Character */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-sky-50/55 border border-sky-200/75">
            <div className="shrink-0">
              <CatnivoCharacter
                pose={sbStatus === 'correct' ? 'excited' : sbStatus === 'wrong' ? 'surprised' : 'thinking'}
                size="md"
                interactive={true}
              />
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <p className="text-xs text-slate-500 font-bn">প্রদত্ত বাংলা বাক্যটি অনুসরণ করে সঠিক ইংরেজি শব্দসমূহ ক্রমানুসারে বিন্যস্ত করুন:</p>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 font-bn">
                "{SENTENCE_CHALLENGES[sbIndex].bangla}"
              </h3>
              <p className="text-xs text-slate-600 font-bn flex items-center justify-center sm:justify-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>নির্দেশনা: {SENTENCE_CHALLENGES[sbIndex].hint}</span>
              </p>
            </div>
          </div>

          {/* Placed Words Slot (The Answer Construction Zone) */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-600 font-bn">
              গঠিত বাক্য (সংশোধনের জন্য শব্দে ক্লিক করুন):
            </span>
            <div className="min-h-16 p-4 rounded-2xl border-2 border-dashed border-sky-200 bg-[#F7FAFE] flex flex-wrap items-center gap-2.5">
              {sbPlaced.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  নিচের শব্দতালিকা থেকে উপযুক্ত শব্দ নির্বাচন করে বাক্য গঠন করুন...
                </span>
              ) : (
                sbPlaced.map((w, wIdx) => (
                  <button
                    key={wIdx}
                    onClick={() => handleRemoveWord(w, wIdx)}
                    className="min-h-[40px] px-3 sm:px-4 py-2 bg-[#1E82E6] text-white font-semibold rounded-xl text-sm sm:text-base shadow-xs hover:bg-[#1673D1] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{w}</span>
                    <span className="text-xs opacity-80">✕</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Word Bank (The Pool) */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-600 font-bn">
              শব্দভাণ্ডার (বাক্যে যুক্ত করতে ক্লিক করুন):
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-[#F7FAFE] border border-slate-200/80">
              {sbPool.map((w, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handlePickWord(w, pIdx)}
                  className="min-h-[40px] px-3 sm:px-4 py-2 bg-white border border-slate-200 text-slate-800 font-semibold rounded-xl text-sm sm:text-base hover:border-[#1E82E6] hover:text-[#1570CD] hover:bg-sky-50 shadow-2xs transition-all cursor-pointer"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs font-bn">
              {sbStatus === 'correct' && (
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>চমৎকার। বাক্যটি ব্যাকরণগতভাবে সম্পূর্ণ নির্ভুল হয়েছে।</span>
                </div>
              )}
              {sbStatus === 'wrong' && (
                <div className="flex items-center gap-2 text-rose-800 font-semibold">
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                  <span>শব্দক্রম সঠিক হয়নি। পুনরায় বিন্যাস করে যাচাই করুন।</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {sbStatus !== 'correct' ? (
                <button
                  disabled={sbPlaced.length === 0}
                  onClick={handleCheckSentence}
                  className="w-full sm:w-auto min-h-[46px] px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] disabled:opacity-40 rounded-xl transition-all shadow-xs cursor-pointer font-bn"
                >
                  যাচাই করুন (Verify)
                </button>
              ) : (
                <button
                  onClick={handleNextSentence}
                  className="w-full sm:w-auto min-h-[46px] px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-bn"
                >
                  <span>পরবর্তী বাক্য</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ACTIVITY 2: PARTS OF SPEECH SPEED MATCH             */}
      {/* ==================================================== */}
      {activeTab === 'parts_of_speech' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 lg:p-8 shadow-xs space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-semibold text-[#1570CD] uppercase tracking-wider font-bn">
                অনুশীলন ২ · পদ প্রকরণ নির্ণয়
              </span>
              <h2 className="font-classical text-lg sm:text-xl font-semibold text-slate-800 mt-0.5">
                Parts of Speech Classification
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 rounded-xl font-semibold text-xs border border-amber-200/80">
                <Flame className="w-4 h-4 text-amber-700" />
                <span>Streak: {posStreak}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-[#1570CD] rounded-xl font-semibold text-xs border border-sky-200/80">
                <Award className="w-4 h-4 text-[#1E82E6]" />
                <span>Score: {posScore}</span>
              </div>
            </div>
          </div>

          {/* Current Word Card with Catnivo mascot */}
          <div className="max-w-md mx-auto text-center space-y-4 p-5 sm:p-8 rounded-3xl bg-sky-50/55 border border-sky-200/75 shadow-xs">
            <div className="flex justify-center">
              <CatnivoCharacter
                pose={posFeedback?.isCorrect ? 'wink' : posStreak >= 3 ? 'excited' : 'reading'}
                size="md"
                interactive={true}
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 font-bn">
                নিচের শব্দটি কোন Part of Speech-এর অন্তর্ভুক্ত?
              </span>
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-classical text-3xl sm:text-4xl font-semibold text-slate-800 tracking-tight">
                  {currentPosItem.word}
                </h3>
                <button
                  onClick={() => playVoice(currentPosItem.word)}
                  className="p-1.5 rounded-lg bg-sky-100 text-[#1570CD] hover:bg-[#1E82E6] hover:text-white transition-colors cursor-pointer"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-700 font-bn">
                অর্থ: {currentPosItem.meaning}
              </p>
            </div>

            {posFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold font-bn animate-in fade-in ${
                  posFeedback.isCorrect
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {posFeedback.msg}
              </div>
            )}
          </div>

          {/* Category Baskets */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-600 font-bn text-center">
              সঠিক ব্যাকরণিক শ্রেণি নির্বাচন করুন:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
              {POS_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectPosCategory(cat.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#1E82E6] hover:bg-sky-50/55 hover:shadow-xs transition-all cursor-pointer text-center group ${
                    idx === POS_CATEGORIES.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                  }`}
                >
                  <p className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-[#1570CD]">
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-bn mt-0.5">
                    {cat.bn}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ACTIVITY 3: TENSE TRANSFORMER LAB                   */}
      {/* ==================================================== */}
      {activeTab === 'tense_transformer' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-semibold text-[#1570CD] uppercase tracking-wider font-bn">
                অনুশীলন ৩ · কাল রূপান্তর ল্যাব ({ttIndex + 1}/{TENSE_TRANSFORM_CHALLENGES.length})
              </span>
              <h2 className="font-classical text-lg sm:text-xl font-semibold text-slate-800 mt-0.5">
                Tense Transformation Lab
              </h2>
            </div>
            <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-[#1570CD] rounded-xl font-semibold text-xs border border-sky-200/80 shrink-0">
              <Award className="w-4 h-4 text-[#1E82E6]" />
              <span>Score: {ttScore} XP</span>
            </div>
          </div>

          {/* Current Tense Lab Mission */}
          <div className="p-4 sm:p-6 rounded-2xl bg-linear-to-br from-[#E5F2FF] via-[#F2F8FF] to-[#DCEEFF] text-slate-800 space-y-4 shadow-xs border border-sky-200/85">
            <div className="flex items-center gap-3">
              <CatnivoCharacter pose="laptop" size="sm" />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1570CD] font-bn">
                  মূল বাক্য ({currentTtChallenge.baseTense})
                </span>
                <h3 className="font-classical text-xl sm:text-2xl font-semibold text-slate-800">
                  "{currentTtChallenge.base}"
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-sky-200/85 space-y-1 shadow-2xs">
              <span className="text-xs font-semibold text-slate-800 font-bn flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#1E82E6] shrink-0" />
                <span>কাঙ্ক্ষিত রূপান্তর: {currentTtChallenge.targetTense}</span>
              </span>
              <p className="text-xs text-[#1570CD] font-mono font-medium">
                সূত্র: {currentTtChallenge.targetFormula}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-slate-600 font-bn">
              সঠিক রূপান্তরিত বাক্যটি নির্বাচন করুন:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTtChallenge.options.map((opt, oIdx) => {
                const isSelected = ttSelected === opt;
                let btnStyle = 'border-slate-200 hover:border-sky-400 bg-white text-slate-800';

                if (isSelected && !ttSubmitted) {
                  btnStyle = 'border-[#1E82E6] bg-sky-50/85 text-slate-800 font-semibold';
                }

                if (ttSubmitted) {
                  if (opt === currentTtChallenge.correct) {
                    btnStyle = 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold';
                  } else if (isSelected && opt !== currentTtChallenge.correct) {
                    btnStyle = 'border-rose-700 bg-rose-50/70 text-rose-950';
                  } else {
                    btnStyle = 'border-slate-200 text-slate-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={ttSubmitted}
                    onClick={() => setTtSelected(opt)}
                    className={`p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#1E82E6] bg-[#1E82E6]' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation when submitted */}
          {ttSubmitted && (
            <div
              className={`p-4 rounded-2xl border text-xs font-bn space-y-1 ${
                ttSelected === currentTtChallenge.correct
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}
            >
              <p className="font-bold">
                {ttSelected === currentTtChallenge.correct
                  ? 'সঠিক উত্তর! (Correct Answer)'
                  : 'ভুল উত্তর! সঠিক উত্তর: ' + currentTtChallenge.correct}
              </p>
              <p>{currentTtChallenge.explanationBn}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-end pt-2">
            {!ttSubmitted ? (
              <button
                disabled={!ttSelected}
                onClick={handleSubmitTt}
                className="w-full sm:w-auto min-h-[46px] px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] disabled:opacity-40 rounded-xl transition-all shadow-xs cursor-pointer font-bn"
              >
                উত্তর যাচাই করুন
              </button>
            ) : (
              <button
                onClick={handleNextTt}
                className="w-full sm:w-auto min-h-[46px] px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-bn"
              >
                <span>পরবর্তী অনুশীলন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ACTIVITY 4: 60-SECOND SPEED SPRINT                  */}
      {/* ==================================================== */}
      {activeTab === 'speed_sprint' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 lg:p-8 shadow-xs space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-semibold text-[#1570CD] uppercase tracking-wider font-bn">
                অনুশীলন ৪ · ৬০-সেকেন্ড মূল্যায়ন
              </span>
              <h2 className="font-classical text-lg sm:text-xl font-semibold text-slate-800 mt-0.5">
                Timed Grammar Assessment
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-xs ${
                  sprintTimeLeft <= 10 ? 'bg-rose-100 text-rose-800' : 'bg-sky-50 text-[#1570CD]'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>{sprintTimeLeft}s</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-[#1570CD] rounded-xl font-semibold text-xs border border-sky-200/80">
                <Award className="w-4 h-4 text-[#1E82E6]" />
                <span>Score: {sprintScore}</span>
              </div>
            </div>
          </div>

          {!sprintActive && !sprintFinished && (
            /* Start Screen */
            <div className="text-center py-6 sm:py-10 space-y-5 max-w-md mx-auto">
              <div className="flex justify-center">
                <CatnivoCharacter pose="excited" size="lg" className="sm:scale-115" interactive={true} />
              </div>
              <div className="space-y-2">
                <h3 className="font-classical text-xl sm:text-2xl font-semibold text-slate-800 font-bn">
                  ৬০ সেকেন্ডে দ্রুত নির্ভুলতা যাচাই করুন
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-bn">
                  প্রদত্ত বাক্যটি ব্যাকরণগতভাবে শুদ্ধ নাকি অশুদ্ধ—তা দ্রুত নির্ণয় করে আপনার দক্ষতা মূল্যায়ন করুন।
                </p>
              </div>

              <button
                onClick={handleStartSprint}
                className="w-full min-h-[48px] py-3.5 text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-bn"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>মূল্যায়ন শুরু করুন (Start Assessment)</span>
              </button>
            </div>
          )}

          {sprintActive && (
            /* Active Sprint Question */
            <div className="space-y-6 sm:space-y-8 py-2 sm:py-4 max-w-lg mx-auto text-center">
              <div className="p-4 sm:p-6 rounded-3xl bg-[#F7FAFE] border border-sky-200/80 space-y-3">
                <span className="text-xs font-semibold text-[#1570CD] font-bn">
                  বাক্যটি কি ব্যাকরণগতভাবে শুদ্ধ? (Is it grammatically correct?)
                </span>
                <h3 className="font-classical text-xl sm:text-3xl font-semibold text-slate-800">
                  "{SPRINT_QUESTIONS[sprintIndex % SPRINT_QUESTIONS.length].prompt}"
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleAnswerSprint(true)}
                  className="py-5 px-3 sm:py-6 sm:px-4 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-emerald-700 hover:bg-emerald-50/70 hover:text-emerald-900 transition-all text-sm sm:text-lg font-semibold cursor-pointer flex flex-col items-center gap-2 shadow-xs"
                >
                  <Check className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />
                  <span>শুদ্ধ (Correct)</span>
                </button>

                <button
                  onClick={() => handleAnswerSprint(false)}
                  className="py-5 px-3 sm:py-6 sm:px-4 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-rose-700 hover:bg-rose-50/70 hover:text-rose-900 transition-all text-sm sm:text-lg font-semibold cursor-pointer flex flex-col items-center gap-2 shadow-xs"
                >
                  <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-rose-700" />
                  <span>অশুদ্ধ (Incorrect)</span>
                </button>
              </div>
            </div>
          )}

          {sprintFinished && (
            /* Sprint Results Screen */
            <div className="text-center py-8 space-y-6 max-w-md mx-auto">
              <div className="flex justify-center">
                <CatnivoCharacter
                  pose={sprintScore >= 30 ? 'excited' : 'hero'}
                  size="xl"
                  interactive={true}
                  animate={true}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-classical text-2xl font-semibold text-slate-800 font-bn">
                  মূল্যায়ন সমাপ্ত হয়েছে
                </h3>
                <p className="text-sm text-slate-600 font-bn">
                  আপনার অর্জিত ফলাফল:
                </p>
                <p className="text-4xl font-semibold text-[#1E82E6] tabular-nums">
                  {sprintScore} XP
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleStartSprint}
                  className="flex-1 py-3 text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200/70 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-bn"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>পুনরায় অনুশীলন করুন</span>
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex-1 py-3 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors cursor-pointer font-bn shadow-xs"
                >
                  ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
