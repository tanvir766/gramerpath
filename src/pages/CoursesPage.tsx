import React, { useEffect, useState } from 'react';
import { Course, Lesson, Level } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CatnivoCharacter } from '../components/CatnivoCharacter.tsx';
import {
  PremiumCheckShieldIcon,
  PremiumAwardMedalIcon,
  PremiumTutorIcon,
} from '../components/PremiumIcons.tsx';

interface CoursesPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function CoursesPage({ onNavigate }: CoursesPageProps) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [courseLessonsMap, setCourseLessonsMap] = useState<{ [courseId: string]: Lesson[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingLessonsFor, setLoadingLessonsFor] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      setIsLoading(true);
      try {
        const res = await api.getCourses();
        setCourses(res);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, [user]);

  const toggleExpandSyllabus = async (course: Course) => {
    if (expandedCourseId === course.id) {
      setExpandedCourseId(null);
      return;
    }

    setExpandedCourseId(course.id);

    // If lessons not cached for this course, load them
    if (!courseLessonsMap[course.id]) {
      setLoadingLessonsFor(course.id);
      try {
        const fullCourse = await api.getCourse(course.id);
        setCourseLessonsMap(prev => ({
          ...prev,
          [course.id]: fullCourse.lessons || [],
        }));
      } catch (err) {
        console.error('Failed to load course lessons:', err);
      } finally {
        setLoadingLessonsFor(null);
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.titleBn.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q) ||
      course.descriptionBn.toLowerCase().includes(q) ||
      course.highlightsBn.some(h => h.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      {/* Top Editorial Banner */}
      <div className="bg-linear-to-br from-[#E5F2FF] via-[#F2F8FF] to-[#DCEEFF] rounded-3xl p-5 sm:p-8 lg:p-10 text-slate-800 shadow-xs border border-sky-200/85 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#1570CD] font-bn">
            <PremiumCheckShieldIcon className="w-4 h-4 text-[#1E82E6] shrink-0" />
            <span>উন্মুক্ত পাঠ্যক্রম · সম্পূর্ণ অবৈতনিক শিক্ষা ব্যবস্থা</span>
          </div>

          <h1 className="font-classical text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-800 text-balance">
            English Grammar Curriculum
          </h1>

          <p className="text-xs sm:text-base text-slate-600 font-bn leading-relaxed">
            কাল (Tense), পদ প্রকরণ (Parts of Speech) ও বাক্য গঠনসহ ইংরেজি ব্যাকরণের মৌলিক থেকে উচ্চতর পর্যায় পর্যন্ত প্রতিটি পাঠ ধারাবাহিকভাবে বিন্যস্ত করা হয়েছে। প্রমিত বাংলা ব্যাখ্যার মাধ্যমে অনুশীলন করে আপনার ভাষাগত দক্ষতা সুদৃঢ় করুন।
          </p>

          <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1E82E6] shrink-0" />
              <span>প্রমিত বাংলা ব্যাখ্যা ও সূত্র</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1E82E6] shrink-0" />
              <span>প্রাসঙ্গিক উদাহরণ ও শ্রবণ উচ্চারণ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1E82E6] shrink-0" />
              <span>অধ্যায়ভিত্তিক মূল্যায়ন ও অনুশীলন</span>
            </span>
          </div>
        </div>

        {/* Catnivo mascot reading pose */}
        <div className="shrink-0 relative z-10 flex items-center justify-center">
          <CatnivoCharacter pose="reading" size="lg" className="sm:scale-115" interactive={true} animate={true} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/85 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Courses (সকল কোর্স)' },
            { id: 'tense', label: 'Tenses (টেন্স)' },
            { id: 'parts_of_speech', label: 'Parts of Speech' },
            { id: 'sentence', label: 'Sentence Making (বাক্য গঠন)' },
            { id: 'basics', label: 'Basics (প্রাথমিক ভিত্তি)' },
            { id: 'advanced', label: 'Advanced (উচ্চতর)' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1E82E6] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-sky-50/80 hover:text-[#1570CD]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 lg:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            placeholder="কোর্স বা বিষয় খুঁজুন (যেমন: Tense)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full min-h-[42px] pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-[#F7FAFE] focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:bg-white transition-all font-bn"
          />
        </div>
      </div>

      {/* Course List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-72 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-bn">
            কোনো কোর্স পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 font-bn mt-1">
            অনুগ্রহ করে অন্য কোনো সার্চ শব্দ বা ক্যাটাগরি ফিল্টার নির্বাচন করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCourses.map(course => {
            const isExpanded = expandedCourseId === course.id;
            const courseLessons = courseLessonsMap[course.id] || [];

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/85 hover:border-sky-400 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Course Card Main Row */}
                <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
                  {/* Left Details */}
                  <div className="space-y-3 max-w-3xl min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-sky-50 text-[#1570CD] border border-sky-200/80 rounded-md text-[11px] font-semibold font-bn">
                        {course.badge}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[11px] font-semibold">
                        {course.difficulty}
                      </span>
                      <span className="text-xs text-slate-500 font-bn">
                        ক্রম: {course.levelOrder}
                      </span>
                    </div>

                    <h2 className="font-classical text-lg sm:text-2xl font-semibold text-slate-800 tracking-tight">
                      {course.title}
                    </h2>

                    <p className="text-sm sm:text-base font-semibold text-[#1570CD] font-bn">
                      {course.titleBn}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 font-bn leading-relaxed">
                      {course.descriptionBn}
                    </p>

                    {/* Highlights bullet list */}
                    <div className="pt-1 sm:pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bn text-slate-700">
                      {course.highlightsBn.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-start sm:items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#1E82E6] shrink-0 mt-0.5 sm:mt-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Metadata Strip */}
                    <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>আনুমানিক {course.durationHours} ঘণ্টা</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.totalLessons || 6} টি লেসন</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <PremiumAwardMedalIcon className="w-4 h-4 text-[#1E82E6]" />
                        <span>কুইজ টেস্ট অন্তর্ভুক্ত</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Actions & Progress */}
                  <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3 p-4 sm:p-5 rounded-xl bg-sky-50/55 border border-sky-200/75">
                    {course.totalLessons ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-700 font-bn">
                          <span>আপনার অগ্রগতি</span>
                          <span className="font-bold tabular-nums text-slate-800">
                            {course.progressPercentage || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#1E82E6] h-full rounded-full transition-all duration-300"
                            style={{ width: `${course.progressPercentage || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-bn">
                          {course.completedLessons || 0} / {course.totalLessons} টি লেসন সম্পন্ন
                        </p>
                      </div>
                    ) : null}

                    <button
                      onClick={() => toggleExpandSyllabus(course)}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-white hover:bg-sky-50 border border-sky-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-bn"
                    >
                      <span>{isExpanded ? 'পাঠসূচি বন্ধ করুন' : 'সম্পূর্ণ পাঠসূচি দেখুন (Syllabus)'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        if (course.levelId) {
                          onNavigate('quizzes', course.levelId);
                        }
                      }}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer font-bn"
                    >
                      <PremiumAwardMedalIcon className="w-4 h-4" />
                      <span>মূল্যায়ন পরীক্ষায় অংশ নিন</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Syllabus Drawer */}
                {isExpanded && (
                  <div className="bg-[#F7FAFE] border-t border-slate-200 p-4 sm:p-6 lg:p-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 font-bn uppercase tracking-wider">
                        ধারাবাহিক পাঠসূচি (Step-by-Step Lessons)
                      </h3>
                      <span className="text-xs text-slate-500 font-bn">
                        শুরু থেকে শেষ পর্যন্ত সাজানো
                      </span>
                    </div>

                    {loadingLessonsFor === course.id ? (
                      <div className="py-8 text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-[#1E82E6] border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-xs text-slate-500 font-bn">পাঠসূচি লোড হচ্ছে...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {courseLessons.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            onClick={() => onNavigate('lesson', lesson.id)}
                            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-md bg-sky-50 text-[#1570CD] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#1E82E6] group-hover:text-white transition-colors">
                                {lIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-800 transition-colors truncate">
                                  {lesson.title}
                                </h4>
                                <p className="text-xs text-slate-500 font-bn truncate mt-0.5">
                                  {lesson.titleBn}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {lesson.isCompleted ? (
                                <span className="p-1 text-emerald-800 bg-emerald-50 border border-emerald-200/70 rounded-md text-[11px] flex items-center gap-1 font-bn font-medium">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>সম্পন্ন</span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-sky-50 text-[#1570CD] rounded-md text-[11px] font-medium group-hover:bg-[#1E82E6] group-hover:text-white transition-colors font-bn flex items-center gap-1">
                                  <span>পড়ুন</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Academic Assurance Card */}
      <div className="bg-white rounded-2xl border border-slate-200/85 p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-xs space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 text-[#1E82E6] flex items-center justify-center mx-auto">
          <PremiumTutorIcon active className="w-6 h-6" />
        </div>
        <h3 className="font-classical text-lg font-semibold text-slate-800 font-bn">
          সর্বজনীন ও মানসম্মত ইংরেজি ব্যাকরণ শিক্ষা
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-bn leading-relaxed">
          প্রতিটি শিক্ষার্থীর জন্য ইংরেজি ব্যাকরণের জটিলতা দূর করে স্পষ্ট, প্রাঞ্জল ও নির্ভুলভাবে ভাষা শিক্ষার পরিবেশ নিশ্চিত করাই আমাদের মূল উদ্দেশ্য। প্রতিটি অধ্যায়ে পর্যাপ্ত উদাহরণ ও ধারাবাহিক অনুশীলন অন্তর্ভুক্ত রয়েছে।
        </p>
      </div>
    </div>
  );
}
