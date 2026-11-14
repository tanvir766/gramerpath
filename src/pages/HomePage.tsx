import React, { useEffect, useState } from 'react';
import { PublicPlatformStats, Lesson } from '../types/index.ts';
import { api } from '../services/api.ts';
import { CatnivoCharacter } from '../components/CatnivoCharacter.tsx';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Users,
  Award,
  HelpCircle,
  Play,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export function HomePage({ onNavigate, onOpenAuthModal }: HomePageProps) {
  const [stats, setStats] = useState<PublicPlatformStats>({
    totalStudents: 1,
    totalLessons: 20,
    totalQuizzesTaken: 2,
    averageMasteryRate: 90,
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [featuredLessons, setFeaturedLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, levelsRes, coursesRes] = await Promise.all([
          api.getPublicStats(),
          api.getLevels(),
          api.getCourses(),
        ]);
        setStats(statsRes);
        setCourses(coursesRes);

        // Fetch a few featured lessons
        if (levelsRes.length > 0) {
          const lvl1 = await api.getLevelWithLessons(levelsRes[0].id);
          const lvl4 = levelsRes.find(l => l.levelNumber === 4);
          let extraLessons: Lesson[] = [];
          if (lvl4) {
            const lvl4Data = await api.getLevelWithLessons(lvl4.id);
            extraLessons = lvl4Data.lessons.slice(0, 2);
          }
          setFeaturedLessons([...lvl1.lessons.slice(0, 2), ...extraLessons]);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 bg-linear-to-b from-blue-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl text-center lg:text-left">
                {/* Context kicker: clean unboxed text */}
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-4 font-bn">
                  <span>জিরো থেকে ইংরেজি শেখার সহজ পথ</span>
                  <span aria-hidden="true">·</span>
                  <span>সহজ বাংলা ব্যাখ্যা ও প্র্যাকটিস</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
                  Learn English Grammar From Zero
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-600 font-bn leading-relaxed [text-wrap:balance]">
                  Start your English grammar journey today. Learn step by step with easy Bengali explanations.
                  <br className="hidden sm:inline" />
                  <span className="text-slate-500 text-sm mt-1 inline-block">
                    ইংরেজি ব্যাকরণের ভীতি দূর করে প্রথম দিন থেকেই স্পষ্ট ধারণা অর্জন করুন। কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই।
                  </span>
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => onNavigate('courses')}
                    className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('courses')}
                    className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Explore Lessons</span>
                    <BookOpen className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center">
                <CatnivoCharacter pose="welcome" size="hero" interactive={true} animate={true} />
              </div>
            </div>

            {/* Quick trust metrics: real database-driven */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 shadow-xs">
                <p className="text-xs text-slate-500 font-bn">নিবন্ধিত শিক্ষার্থী</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums">
                  {stats.totalStudents} <span className="text-xs font-normal text-slate-500">জন</span>
                </p>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 shadow-xs">
                <p className="text-xs text-slate-500 font-bn">প্রকাশিত লেসন</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums">
                  {stats.totalLessons} <span className="text-xs font-normal text-slate-500">টি</span>
                </p>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 shadow-xs">
                <p className="text-xs text-slate-500 font-bn">সম্পন্ন কুইজ</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums">
                  {stats.totalQuizzesTaken} <span className="text-xs font-normal text-slate-500">বার</span>
                </p>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 shadow-xs">
                <p className="text-xs text-slate-500 font-bn">গড় সাফল্য হার</p>
                <p className="text-xl font-bold text-emerald-600 tabular-nums">
                  {stats.averageMasteryRate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beginner-Friendly Learning Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-bn">
              কাদের জন্য গ্রামারপাথ তৈরি করা হয়েছে?
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-bn leading-relaxed">
              আপনি যদি কখনো ইংরেজি ব্যাকরণ মুখস্থ করতে গিয়ে বিভ্রান্ত হয়ে থাকেন, অথবা এখনো ইংরেজি বাক্য তৈরির নিয়ম বুঝতে না পারেন—তবে গ্রামারপাথ আপনার জন্যই।
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm mb-3">
                  01
                </span>
                <h3 className="text-base font-semibold text-slate-900 font-bn">
                  সহজ বাংলায় ব্যাখ্যা (Zero Assumption)
                </h3>
                <p className="mt-2 text-xs text-slate-600 font-bn leading-relaxed">
                  আমরা ধরে নিই না যে আপনি আগে থেকে কোনো ইংরেজি নিয়ম জানেন। কঠিন পরিভাষা বাদ দিয়ে আমাদের পরিচিত বাংলা ভাষায় প্রতিটি নিয়ম বুঝিয়ে বলা হয়েছে।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-blue-700 font-medium">
                বাংলা উদাহরণ ও অর্থসহ
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm mb-3">
                  02
                </span>
                <h3 className="text-base font-semibold text-slate-900 font-bn">
                  স্পষ্ট স্ট্রাকচার ও সূত্র (Formulas)
                </h3>
                <p className="mt-2 text-xs text-slate-600 font-bn leading-relaxed">
                  গণিতের সূত্রের মতো স্পষ্ট ছকে ইংরেজি বাক্যের কাঠামো শিখুন: Subject + Verb + Object। কোন জায়গায় কোন শব্দ বসবে তা পরিষ্কারভাবে জেনে নিন।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-blue-700 font-medium">
                মৌলিক কাঠামো ও প্রয়োগ
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm mb-3">
                  03
                </span>
                <h3 className="text-base font-semibold text-slate-900 font-bn">
                  প্রতি লেসনের পর তাৎক্ষণিক অনুশীলন
                </h3>
                <p className="mt-2 text-xs text-slate-600 font-bn leading-relaxed">
                  শুধু পড়ে যাওয়া নয়! প্রতিটি লেসন পড়ার সাথে সাথেই রয়েছে MCQ, বাক্য সংশোধন এবং বাংলা-ইংরেজি অনুবাদের সক্রিয় প্র্যাকটিস।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-blue-700 font-medium">
                তাৎক্ষণিক ফিডব্যাক ও স্কোর
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Grammar Courses (100% Free) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-bn mb-1.5">
              ১০০% সম্পূর্ণ ফ্রি কোর্সসমূহ · No Fees
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Grammar Courses (জনপ্রিয় কোর্সসমূহ)
            </h2>
            <p className="mt-1 text-sm text-slate-600 font-bn">
              টেন্স, পার্টস অফ স্পিচ ও বাক্য গঠনসহ ব্যাকরণের প্রতিটি ধাপ শুরু থেকে শেষ পর্যন্ত সাজানো
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-bn"
          >
            <span>সবগুলো কোর্স দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              onClick={() => onNavigate('courses')}
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold font-bn">
                    100% Free
                  </span>
                  <span className="text-xs text-slate-400 font-bn">
                    {course.totalLessons || 6} টি লেসন
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm font-semibold text-blue-700 font-bn">
                  {course.titleBn}
                </p>
                <p className="text-xs text-slate-600 font-bn line-clamp-2 leading-relaxed">
                  {course.descriptionBn}
                </p>

                <div className="pt-2 space-y-1.5 text-xs text-slate-600 font-bn">
                  {course.highlightsBn?.slice(0, 2).map((h: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 font-bn">
                <span>কোর্স শুরু করুন</span>
                <span className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Learning Roadmap (শেখার রোডম্যাপ)
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-bn">
            ধাপে ধাপে শূন্য থেকে দক্ষতায় পৌঁছানোর ৫টি প্রগ্রেসিভ লেভেল
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              num: 1,
              title: 'Grammar Basics',
              titleBn: 'প্রাথমিক ভিত্তি',
              topics: 'Letters, Words, Sentence SVO, Vowels',
            },
            {
              num: 2,
              title: 'Parts of Speech',
              titleBn: 'পদ প্রকরণ',
              topics: 'Noun, Pronoun, Verb, Adjective, 8 প্রকার',
            },
            {
              num: 3,
              title: 'Sentence Structure',
              titleBn: 'বাক্য গঠন',
              topics: 'Subject, Helping Verb, Negative, Questions',
            },
            {
              num: 4,
              title: 'Tense Mastery',
              titleBn: 'টেন্স বা কাল',
              topics: 'Present, Past, Future এর ১২টি কাল',
            },
            {
              num: 5,
              title: 'More Topics',
              titleBn: 'উচ্চতর ব্যাকরণ',
              topics: 'Articles, Prepositions, Voice, Modals',
            },
          ].map((level, i) => (
            <div
              key={level.num}
              onClick={() => onNavigate('courses')}
              className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-blue-600">LEVEL 0{level.num}</span>
                  <span className="text-[11px] font-bn">ধাপ {level.num}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {level.title}
                </h3>
                <p className="text-xs font-semibold text-slate-700 font-bn mt-0.5">
                  {level.titleBn}
                </p>
                <p className="text-[11px] text-slate-500 mt-2 font-bn leading-relaxed">
                  {level.topics}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
                <span>পাঠসূচি দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Grammar Lessons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Featured Lessons
            </h2>
            <p className="mt-1 text-sm text-slate-600 font-bn">
              এখনই পড়া শুরু করার জন্য বাছাইকৃত কিছু গুরুত্বপূর্ণ লেসন
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>সবগুলো লেসন দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredLessons.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => onNavigate('lesson', lesson.id)}
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-medium text-blue-600">Level {lesson.levelNumber || 1}</span>
                  <span className="text-[11px] font-bn">লেসন {lesson.lessonOrder}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-sm text-slate-600 font-bn mt-1 font-medium">
                  {lesson.titleBn}
                </p>

                <p className="text-xs text-slate-500 mt-3 font-bn line-clamp-2">
                  {lesson.content?.banglaExplanation || 'সহজ বাংলা ভাষায় বিস্তারিত ব্যাখ্যা ও উদাহরণসহ জানুন।'}
                </p>

                {lesson.content?.sentenceStructure && (
                  <div className="mt-3 p-2 bg-blue-50/70 border border-blue-100 rounded-lg text-xs font-mono text-blue-900 truncate">
                    {lesson.content.sentenceStructure}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="text-blue-600 font-bn">পড়ুন ও অনুশীলন করুন</span>
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Learn With GrammarPath */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Why Learn With GrammarPath?
            </h2>
            <p className="mt-2 text-sm text-slate-400 font-bn">
              কেন গ্রামারপাথ বাংলাদেশের শিক্ষার্থীদের জন্য সবচেয়ে কার্যকর মাধ্যম?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold font-bn">জিরো প্রিজাম্পশন</h3>
              <p className="mt-2 text-xs text-slate-300 font-bn leading-relaxed">
                কোনো জটিল ব্যাকরণিক ধারণা আগে থেকে জানা লাগবে না। প্রতিটি ধারণা প্রথম থেকে বুঝিয়ে বলা হয়।
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold font-bn">ভুল বনাম সঠিক বিশ্লেষণ</h3>
              <p className="mt-2 text-xs text-slate-300 font-bn leading-relaxed">
                শিক্ষার্থীরা কোথায় সাধারণত ভুল করেন (Common Mistakes), তা স্পষ্টভাবে চিহ্নিত করে সঠিক নিয়ম শেখানো হয়।
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold font-bn">বাস্তব কথোপকথন</h3>
              <p className="mt-2 text-xs text-slate-300 font-bn leading-relaxed">
                শুধু বইয়ের নিয়মে আবদ্ধ না থেকে দৈনন্দিন জীবনে কীভাবে বাক্য ব্যবহার করবেন তা সংলাপের মাধ্যমে শেখানো হয়।
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold font-bn">রিয়েল-টাইম কুইজ ট্র্যাকিং</h3>
              <p className="mt-2 text-xs text-slate-300 font-bn leading-relaxed">
                আপনার স্কোর, ভুল উত্তরের সমাধান এবং অগ্রগতির সম্পূর্ণ ডেটা ডাটাবেজে সংরক্ষিত থাকে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-blue-600/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Master English Grammar?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100 font-bn max-w-xl mx-auto">
            আজই বিনামূল্যে শুরু করুন। প্রথম লেসনটি পড়ে দেখুন এবং ৫ মিনিটে আপনার প্রথম কুইজ সম্পন্ন করুন!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
              Create Free Account (অ্যাকাউন্ট খুলুন)
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-white border border-blue-300/40 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              View All Courses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
