import React, { useEffect, useState } from 'react';
import { User, Level, Lesson, Question, SiteSettings } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Users,
  BookOpen,
  HelpCircle,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'lessons' | 'questions' | 'settings'>('lessons');

  // Data states
  const [students, setStudents] = useState<any[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lesson modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Lesson form
  const [lessonForm, setLessonForm] = useState({
    title: '',
    titleBn: '',
    levelId: '',
    lessonOrder: 1,
    isPublished: true,
    banglaExplanation: '',
    englishDefinition: '',
    sentenceStructure: '',
    grammarRules: '',
    specialRules: '',
    examples: '',
    commonMistakes: '',
    lessonSummary: '',
    lessonSummaryBn: '',
  });

  // Question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    levelId: '',
    lessonId: '',
    type: 'mcq',
    prompt: '',
    promptBn: '',
    options: 'Option A\nOption B\nOption C\nOption D',
    correctAnswer: '',
    explanation: '',
    explanationBn: '',
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, levelsRes, settingsRes] = await Promise.all([
        api.adminGetStudents(),
        api.getLevels(),
        api.adminGetSettings(),
      ]);
      setStudents(studentsRes);
      setLevels(levelsRes);
      setSiteSettings(settingsRes);

      // Collect lessons for all levels
      const lessonsList: Lesson[] = [];
      for (const lvl of levelsRes) {
        const lvlData = await api.getLevelWithLessons(lvl.id);
        lessonsList.push(...lvlData.lessons.map(l => ({ ...l, levelNumber: lvl.levelNumber })));
      }
      setAllLessons(lessonsList);
    } catch (err: any) {
      showNotify('error', err.message || 'এডমিন ডেটা লোড হতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleTogglePublish = async (lessonId: string) => {
    try {
      const res = await api.adminTogglePublish(lessonId);
      setAllLessons(prev =>
        prev.map(l => (l.id === lessonId ? { ...l, isPublished: res.isPublished } : l))
      );
      showNotify('success', `লেসনটি ${res.isPublished ? 'পাবলিশ' : 'আনপাবলিশ'} করা হয়েছে।`);
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই লেসনটি মুছে ফেলতে চান?')) return;
    try {
      await api.adminDeleteLesson(lessonId);
      setAllLessons(prev => prev.filter(l => l.id !== lessonId));
      showNotify('success', 'লেসনটি সফলভাবে মুছে ফেলা হয়েছে।');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleOpenAddLesson = () => {
    setEditingLessonId(null);
    setLessonForm({
      title: '',
      titleBn: '',
      levelId: levels[0]?.id || '',
      lessonOrder: allLessons.length + 1,
      isPublished: true,
      banglaExplanation: '',
      englishDefinition: '',
      sentenceStructure: 'Subject + Verb + Object',
      grammarRules: '১. প্রথম নিয়ম\n২. দ্বিতীয় নিয়ম',
      specialRules: 'বিশেষ দ্রষ্টব্য',
      examples: 'I read a book. = আমি একটি বই পড়ি।\nHe plays cricket. = সে ক্রিকেট খেলে।',
      commonMistakes: 'He play cricket. | He plays cricket. | He-এর ক্ষেত্রে s যোগ হবে',
      lessonSummary: 'Master this grammar foundation.',
      lessonSummaryBn: 'এই পাঠের নিয়মগুলো নিয়মিত অনুশীলন করুন।',
    });
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = async (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    try {
      const full = await api.getLesson(lesson.id);
      const c = full.content;
      setLessonForm({
        title: full.title,
        titleBn: full.titleBn,
        levelId: full.levelId,
        lessonOrder: full.lessonOrder,
        isPublished: full.isPublished,
        banglaExplanation: c?.banglaExplanation || '',
        englishDefinition: c?.englishDefinition || '',
        sentenceStructure: c?.sentenceStructure || '',
        grammarRules: c?.grammarRules?.join('\n') || '',
        specialRules: c?.specialRules?.join('\n') || '',
        examples: c?.examples?.map(ex => `${ex.english} = ${ex.bangla}`).join('\n') || '',
        commonMistakes: c?.commonMistakes?.map(m => `${m.wrong} | ${m.correct} | ${m.explanationBn}`).join('\n') || '',
        lessonSummary: c?.lessonSummary || '',
        lessonSummaryBn: c?.lessonSummaryBn || '',
      });
      setIsLessonModalOpen(true);
    } catch (err: any) {
      showNotify('error', 'লেসন লোড করা যায়নি');
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedExamples = lessonForm.examples
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const parts = line.split('=');
          return {
            english: (parts[0] || '').trim(),
            bangla: (parts[1] || '').trim(),
          };
        });

      const parsedCommonMistakes = lessonForm.commonMistakes
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const parts = line.split('|');
          return {
            wrong: (parts[0] || '').trim(),
            correct: (parts[1] || '').trim(),
            explanationBn: (parts[2] || '').trim(),
          };
        });

      const lessonData = {
        title: lessonForm.title,
        titleBn: lessonForm.titleBn,
        levelId: lessonForm.levelId,
        lessonOrder: Number(lessonForm.lessonOrder),
        isPublished: lessonForm.isPublished,
      };

      const contentData = {
        banglaExplanation: lessonForm.banglaExplanation,
        englishDefinition: lessonForm.englishDefinition,
        sentenceStructure: lessonForm.sentenceStructure,
        grammarRules: lessonForm.grammarRules.split('\n').map(s => s.trim()).filter(Boolean),
        specialRules: lessonForm.specialRules.split('\n').map(s => s.trim()).filter(Boolean),
        examples: parsedExamples,
        commonMistakes: parsedCommonMistakes,
        practicalExamples: [],
        lessonSummary: lessonForm.lessonSummary,
        lessonSummaryBn: lessonForm.lessonSummaryBn,
      };

      if (editingLessonId) {
        await api.adminUpdateLesson(editingLessonId, { lesson: lessonData, content: contentData });
        showNotify('success', 'লেসন সফলভাবে আপডেট করা হয়েছে।');
      } else {
        await api.adminCreateLesson({ lesson: lessonData, content: contentData });
        showNotify('success', 'নতুন লেসন সফলভাবে তৈরি করা হয়েছে।');
      }

      setIsLessonModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotify('error', err.message || 'সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const opts = questionForm.options.split('\n').map(s => s.trim()).filter(Boolean);
      await api.adminCreateQuestion({
        levelId: questionForm.levelId || levels[0]?.id || 'lvl_1',
        lessonId: questionForm.lessonId || allLessons[0]?.id || 'lsn_1_1',
        type: questionForm.type as any,
        prompt: questionForm.prompt,
        promptBn: questionForm.promptBn,
        options: opts,
        correctAnswer: questionForm.correctAnswer,
        explanation: questionForm.explanation,
        explanationBn: questionForm.explanationBn,
      });
      showNotify('success', 'নতুন প্রশ্ন ডাটাবেজে যুক্ত করা হয়েছে।');
      setIsQuestionModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleToggleLockSettings = async () => {
    if (!siteSettings) return;
    try {
      const updated = await api.adminUpdateSettings({
        lockAdvancedLessons: !siteSettings.lockAdvancedLessons,
      });
      setSiteSettings(updated);
      showNotify('success', `পূর্বশর্ত লক সেটিংস ${updated.lockAdvancedLessons ? 'চালু' : 'বন্ধ'} করা হয়েছে।`);
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1570CD] font-bn">
            <span>প্রশাসনিক নিয়ন্ত্রণ প্যানেল</span>
            <span aria-hidden="true">·</span>
            <span>Admin Console</span>
          </div>
          <h1 className="font-classical text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight mt-1">
            GrammarPath Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bn mt-1">
            শিক্ষার্থীদের অগ্রগতি পর্যবেক্ষণ করুন, সম্পূর্ণ ডাইনামিক লেসন ও কুইজ পরিচালনা করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleOpenAddLesson}
            className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 text-xs font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>নতুন লেসন যুক্ত করুন</span>
          </button>
          <button
            onClick={() => {
              setQuestionForm({
                levelId: levels[0]?.id || '',
                lessonId: allLessons[0]?.id || '',
                type: 'mcq',
                prompt: '',
                promptBn: '',
                options: 'Option A\nOption B\nOption C\nOption D',
                correctAnswer: '',
                explanation: '',
                explanationBn: '',
              });
              setIsQuestionModalOpen(true);
            }}
            className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 text-xs font-semibold text-[#1570CD] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>প্রশ্ন তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-bn animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`min-h-[42px] whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'lessons'
              ? 'border-[#1E82E6] text-[#1570CD]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>লেসন ম্যানেজমেন্ট ({allLessons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`min-h-[42px] whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'students'
              ? 'border-[#1E82E6] text-[#1570CD]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>নিবন্ধিত শিক্ষার্থী ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`min-h-[42px] whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-[#1E82E6] text-[#1570CD]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>ওয়েবসাইট সেটিংস</span>
        </button>
      </div>

      {/* TAB 1: LESSONS MANAGEMENT */}
      {activeTab === 'lessons' && (
        <div className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-[0_2px_12px_rgba(30,130,230,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-sky-50/60 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider font-bn">
                  <th className="py-3.5 px-4">লেভেল</th>
                  <th className="py-3.5 px-4">লেসন শিরোনাম (English & Bengali)</th>
                  <th className="py-3.5 px-4">ক্রম</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allLessons.map(lesson => (
                  <tr key={lesson.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1570CD]">
                      Level {lesson.levelNumber || 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{lesson.title}</p>
                      <p className="text-slate-500 font-bn">{lesson.titleBn}</p>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-700">
                      #{lesson.lessonOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(lesson.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                          lesson.isPublished
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {lesson.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Unpublished</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditLesson(lesson)}
                        className="p-1.5 text-[#1570CD] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Lesson"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS LIST & PROGRESS */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-[0_2px_12px_rgba(30,130,230,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-sky-50/60 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider font-bn">
                  <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                  <th className="py-3.5 px-4">ইমেইল</th>
                  <th className="py-3.5 px-4">সম্পন্ন লেসন</th>
                  <th className="py-3.5 px-4">কুইজ প্রচেষ্টা</th>
                  <th className="py-3.5 px-4">সর্বশেষ সক্রিয়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student: any) => (
                  <tr key={student.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800 font-bn">
                      {student.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {student.email}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1570CD] tabular-nums">
                      {student.completedLessons || 0} টি
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 tabular-nums">
                      {student.quizAttempts || 0} বার
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] tabular-nums">
                      {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WEBSITE SETTINGS */}
      {activeTab === 'settings' && siteSettings && (
        <div className="bg-white rounded-2xl border border-slate-200/85 p-4 sm:p-6 lg:p-8 space-y-5 shadow-[0_2px_12px_rgba(30,130,230,0.04)] max-w-2xl">
          <h2 className="font-classical text-lg font-bold text-slate-800 font-bn">
            কোর্স নিয়ন্ত্রণ ও সেটিংস
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-sky-50/55 border border-sky-200/75">
            <div>
              <p className="text-sm font-semibold text-slate-800 font-bn">
                পূর্ববর্তী লেভেল সম্পন্ন না করা পর্যন্ত পরবর্তী লেভেল লক রাখুন
              </p>
              <p className="text-xs text-slate-500 font-bn mt-0.5">
                Lock advanced levels until previous level lessons are completed.
              </p>
            </div>

            <button
              onClick={handleToggleLockSettings}
              className={`self-start sm:self-auto min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                siteSettings.lockAdvancedLessons
                  ? 'bg-[#1E82E6] text-white hover:bg-[#1673D1]'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {siteSettings.lockAdvancedLessons ? 'লক চালু (Locked)' : 'উন্মুক্ত (Open)'}
            </button>
          </div>
        </div>
      )}

      {/* LESSON EDITOR MODAL (10 required fields) */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 sm:p-8 my-auto max-h-[92dvh] overflow-y-auto">
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setIsLessonModalOpen(false)}
              className="absolute top-3.5 right-3.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-sky-50 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-classical text-lg sm:text-xl font-bold text-slate-800 font-bn mb-1 pr-9">
              {editingLessonId ? 'লেসন সম্পাদনা করুন (Edit Lesson)' : 'নতুন লেসন তৈরি করুন (Add Lesson)'}
            </h2>
            <p className="text-xs text-slate-500 font-bn mb-5">
              সকল তথ্য ডাটাবেজে সংরক্ষিত হবে এবং শিক্ষার্থীদের স্ক্রিনে তাৎক্ষণিকভাবে দৃশ্যমান হবে।
            </p>

            <form onSubmit={handleSaveLesson} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lesson Title (English)</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.title}
                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lesson Title (বাংলা)</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.titleBn}
                    onChange={e => setLessonForm({ ...lessonForm, titleBn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Level</label>
                  <select
                    value={lessonForm.levelId}
                    onChange={e => setLessonForm({ ...lessonForm, levelId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {levels.map(l => (
                      <option key={l.id} value={l.id}>
                        Level {l.levelNumber}: {l.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lesson Order</label>
                  <input
                    type="number"
                    value={lessonForm.lessonOrder}
                    onChange={e => setLessonForm({ ...lessonForm, lessonOrder: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 border rounded-xl tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publish State</label>
                  <select
                    value={lessonForm.isPublished ? 'true' : 'false'}
                    onChange={e => setLessonForm({ ...lessonForm, isPublished: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft / Unpublished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  সহজ বাংলায় ব্যাখ্যা (Bengali Explanation)
                </label>
                <textarea
                  rows={3}
                  required
                  value={lessonForm.banglaExplanation}
                  onChange={e => setLessonForm({ ...lessonForm, banglaExplanation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-bn"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  English Definition (ইংরেজি সংজ্ঞা)
                </label>
                <textarea
                  rows={2}
                  required
                  value={lessonForm.englishDefinition}
                  onChange={e => setLessonForm({ ...lessonForm, englishDefinition: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sentence Structure / Formula (বাক্য গঠনের সূত্র)
                </label>
                <input
                  type="text"
                  value={lessonForm.sentenceStructure}
                  onChange={e => setLessonForm({ ...lessonForm, sentenceStructure: e.target.value })}
                  placeholder="Subject + Base Form of Verb + Object"
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  সহজ উদাহরণ ও বাংলা অনুবাদ (প্রতি লাইনে: English = বাংলা)
                </label>
                <textarea
                  rows={3}
                  value={lessonForm.examples}
                  onChange={e => setLessonForm({ ...lessonForm, examples: e.target.value })}
                  placeholder="I play football. = আমি ফুটবল খেলি।&#10;He reads a book. = সে একটি বই পড়ে।"
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  সাধারণ ভুলসমূহ (প্রতি লাইনে: ভুল | সঠিক | বাংলা ব্যাখ্যা)
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.commonMistakes}
                  onChange={e => setLessonForm({ ...lessonForm, commonMistakes: e.target.value })}
                  placeholder="He play cricket. | He plays cricket. | He হলো Third Person Singular তাই s যোগ হবে"
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="min-h-[42px] px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-6 py-2 bg-[#1E82E6] hover:bg-[#1673D1] text-white font-semibold rounded-xl cursor-pointer shadow-xs"
                >
                  সংরক্ষণ করুন (Save to DB)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUESTION CREATOR MODAL */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 sm:p-6 my-auto max-h-[92dvh] overflow-y-auto">
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setIsQuestionModalOpen(false)}
              className="absolute top-3.5 right-3.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-sky-50 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-classical text-lg font-bold text-slate-800 font-bn mb-4 pr-9">
              নতুন প্রশ্ন তৈরি করুন (Create Question)
            </h2>

            <form onSubmit={handleSaveQuestion} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Type</label>
                <select
                  value={questionForm.type}
                  onChange={e => setQuestionForm({ ...questionForm, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="mcq">MCQ (Multiple Choice)</option>
                  <option value="fill_in_the_blank">Fill in the blank</option>
                  <option value="choose_correct">Choose correct sentence</option>
                  <option value="correct_sentence">Correct the sentence</option>
                  <option value="translate_bn_to_en">Bengali to English</option>
                  <option value="translate_en_to_bn">English to Bengali</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Prompt (English)</label>
                <input
                  type="text"
                  required
                  value={questionForm.prompt}
                  onChange={e => setQuestionForm({ ...questionForm, prompt: e.target.value })}
                  placeholder="e.g. Choose the correct sentence in Present Indefinite"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Prompt (বাংলা)</label>
                <input
                  type="text"
                  required
                  value={questionForm.promptBn}
                  onChange={e => setQuestionForm({ ...questionForm, promptBn: e.target.value })}
                  placeholder="যেমন: Present Indefinite Tense এর সঠিক বাক্যটি নির্বাচন করুন"
                  className="w-full px-3 py-2 border rounded-xl font-bn"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Options (প্রতি লাইনে একটি অপশন)</label>
                <textarea
                  rows={4}
                  required
                  value={questionForm.options}
                  onChange={e => setQuestionForm({ ...questionForm, options: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correct Answer (হুবহু সঠিক অপশনটি লিখুন)</label>
                <input
                  type="text"
                  required
                  value={questionForm.correctAnswer}
                  onChange={e => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">উত্তর প্রদানের পর ব্যাখ্যা (বাংলা)</label>
                <textarea
                  rows={2}
                  value={questionForm.explanationBn}
                  onChange={e => setQuestionForm({ ...questionForm, explanationBn: e.target.value })}
                  placeholder="কেন এই উত্তরটি সঠিক তা শিক্ষার্থীদের বুঝিয়ে বলুন"
                  className="w-full px-3 py-2 border rounded-xl font-bn"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="min-h-[42px] px-4 py-2 border rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-5 py-2 bg-[#1E82E6] hover:bg-[#1673D1] text-white font-semibold rounded-xl cursor-pointer"
                >
                  প্রশ্ন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
