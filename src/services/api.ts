import {
  User,
  Course,
  Level,
  Lesson,
  Question,
  QuizAttempt,
  DashboardSummary,
  PublicPlatformStats,
  SiteSettings,
  TutorCurriculumLesson,
  TutorProgressState,
  TutorDifficultyLevel,
  TutorStructuredLesson,
  TutorQuestion,
  TutorEvaluationResult,
  SentenceAnalysisResult,
  TutorChatMessage,
} from '../types/index.ts';

const TOKEN_KEY = 'grammarpath_token';

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await response.json();
      errorMsg = data.error || errorMsg;
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { fullName: string; email: string; password: string; confirmPassword: string }) =>
    request<{ message: string; user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ message: string; user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request<{ user: User }>('/api/auth/me'),

  forgotPassword: (email: string) =>
    request<{ message: string; demoCode?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (data: { email: string; resetCode: string; newPassword: string; confirmPassword: string }) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Public Stats
  getPublicStats: () => request<PublicPlatformStats>('/api/stats/public'),

  // Courses & Levels
  getCourses: () => request<Course[]>('/api/courses'),

  getCourse: (courseId: string) =>
    request<Course & { lessons: Lesson[]; level?: Level }>(`/api/courses/${courseId}`),

  getLevels: () => request<Level[]>('/api/levels'),

  getLevelWithLessons: (levelId: string) =>
    request<{ level: Level; lessons: Lesson[] }>(`/api/levels/${levelId}`),

  getLesson: (lessonId: string) => request<Lesson>(`/api/lessons/${lessonId}`),

  markLessonCompleted: (lessonId: string) =>
    request<{ message: string }>('/api/lessons/' + lessonId + '/complete', {
      method: 'POST',
    }),

  // Practice & Quizzes
  getLessonQuestions: (lessonId: string) =>
    request<Question[]>(`/api/lessons/${lessonId}/questions`),

  getQuizQuestions: (params: { levelId?: string; lessonId?: string; count?: number }) => {
    const q = new URLSearchParams();
    if (params.levelId) q.append('levelId', params.levelId);
    if (params.lessonId) q.append('lessonId', params.lessonId);
    if (params.count) q.append('count', params.count.toString());
    return request<Question[]>(`/api/quizzes/questions?${q.toString()}`);
  },

  submitQuiz: (data: {
    lessonId?: string;
    levelId?: string;
    quizTitle: string;
    userAnswers: { questionId: string; selectedAnswer: string }[];
    timeSpentSeconds: number;
  }) =>
    request<{
      attempt: QuizAttempt;
      summary: {
        totalQuestions: number;
        correctAnswers: number;
        wrongAnswers: number;
        scorePercentage: number;
        passed: boolean;
        details: any[];
      };
    }>('/api/quizzes/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getQuizHistory: () => request<QuizAttempt[]>('/api/quizzes/history'),

  // Student Dashboard
  getDashboardSummary: () => request<DashboardSummary>('/api/dashboard/summary'),

  // Admin APIs
  adminGetStudents: () =>
    request<(User & { completedLessons: number; quizAttempts: number; lastActive: string })[]>('/api/admin/students'),

  adminCreateLevel: (levelData: any) =>
    request<Level>('/api/admin/levels', {
      method: 'POST',
      body: JSON.stringify(levelData),
    }),

  adminUpdateLevel: (id: string, levelData: any) =>
    request<Level>(`/api/admin/levels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(levelData),
    }),

  adminCreateLesson: (payload: { lesson: any; content: any }) =>
    request<Lesson>('/api/admin/lessons', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminUpdateLesson: (id: string, payload: { lesson?: any; content?: any }) =>
    request<Lesson>(`/api/admin/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  adminDeleteLesson: (id: string) =>
    request<{ message: string }>(`/api/admin/lessons/${id}`, {
      method: 'DELETE',
    }),

  adminTogglePublish: (id: string) =>
    request<{ isPublished: boolean }>(`/api/admin/lessons/${id}/publish`, {
      method: 'PATCH',
    }),

  adminCreateQuestion: (question: Partial<Question>) =>
    request<Question>('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    }),

  adminUpdateQuestion: (id: string, question: Partial<Question>) =>
    request<Question>(`/api/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    }),

  adminDeleteQuestion: (id: string) =>
    request<{ message: string }>(`/api/admin/questions/${id}`, {
      method: 'DELETE',
    }),

  adminGetSettings: () => request<SiteSettings>('/api/admin/settings'),

  adminUpdateSettings: (settings: Partial<SiteSettings>) =>
    request<SiteSettings>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // GrammarPath AI Teacher
  getTutorCurriculum: () =>
    request<{ curriculum: TutorCurriculumLesson[]; progress: TutorProgressState | null }>(
      '/api/tutor/curriculum'
    ),

  getTutorProgress: () => request<TutorProgressState>('/api/tutor/progress'),

  generateTutorLesson: (payload: {
    lessonSlug: string;
    level: TutorDifficultyLevel;
    simpler?: boolean;
  }) =>
    request<TutorStructuredLesson>('/api/tutor/lesson', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  evaluateTutorAnswers: (payload: {
    mode: 'practice' | 'mini_test';
    lessonSlug: string;
    level: TutorDifficultyLevel;
    questions: TutorQuestion[];
    userAnswers: { questionId: string; answer: string }[];
  }) =>
    request<TutorEvaluationResult>('/api/tutor/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  identifySentencePOS: (sentence: string) =>
    request<SentenceAnalysisResult>('/api/tutor/identify-sentence', {
      method: 'POST',
      body: JSON.stringify({ sentence }),
    }),

  chatWithAiTeacher: (payload: {
    message: string;
    history: TutorChatMessage[];
    currentLessonTitle?: string;
  }) =>
    request<{ reply: string; timestamp: string }>('/api/tutor/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
