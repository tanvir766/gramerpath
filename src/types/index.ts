export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  preferredLanguage: 'bn' | 'en' | 'bilingual';
  showBanglaTranslations: boolean;
  dailyGoalMinutes: number;
  updatedAt: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  category: string;
  description: string;
  descriptionBn: string;
  levelId: string;
  levelOrder: number;
  badge: string;
  difficulty: string;
  durationHours: number;
  highlightsBn: string[];
  totalLessons?: number;
  completedLessons?: number;
  progressPercentage?: number;
}

export interface Level {
  id: string;
  levelNumber: number;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  isLocked: boolean;
  totalLessons?: number;
  completedLessons?: number;
}

export interface LessonExample {
  english: string;
  bangla: string;
  note?: string;
}

export interface PracticalExample {
  scenario: string;
  scenarioBn: string;
  dialogueEn: string;
  dialogueBn: string;
}

export interface LessonContent {
  id: string;
  lessonId: string;
  englishDefinition: string;
  banglaExplanation: string;
  sentenceStructure: string;
  grammarRules: string[];
  specialRules: string[];
  commonMistakes: {
    wrong: string;
    correct: string;
    explanationBn: string;
  }[];
  examples: LessonExample[];
  practicalExamples: PracticalExample[];
  lessonSummary: string;
  lessonSummaryBn: string;
}

export interface Lesson {
  id: string;
  levelId: string;
  levelNumber?: number;
  lessonOrder: number;
  title: string;
  titleBn: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  content?: LessonContent;
  isCompleted?: boolean;
}

export type QuestionType =
  | 'mcq'
  | 'fill_in_the_blank'
  | 'choose_correct'
  | 'correct_sentence'
  | 'translate_bn_to_en'
  | 'translate_en_to_bn';

export interface Question {
  id: string;
  lessonId: string;
  levelId: string;
  type: QuestionType;
  prompt: string;
  promptBn: string;
  options?: string[]; // For MCQ or choose correct
  correctAnswer: string;
  acceptableAnswers?: string[]; // For translations or flexible blanks
  explanation: string;
  explanationBn: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  lessonId?: string;
  levelId?: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  answersSummary?: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  lastStudiedAt: string;
  completedAt?: string;
}

export interface DashboardSummary {
  user: User;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  currentLevel: Level | null;
  continueLesson: Lesson | null;
  recommendedNextLessons: Lesson[];
  recentlyStudiedLessons: (Lesson & { lastStudiedAt: string })[];
  recentQuizAttempts: QuizAttempt[];
  stats: {
    quizzesTaken: number;
    avgQuizScore: number;
    studyStreakDays: number;
    questionsAnswered: number;
    perfectQuizzes: number;
  };
}

export interface PublicPlatformStats {
  totalStudents: number;
  totalLessons: number;
  totalQuizzesTaken: number;
  averageMasteryRate: number;
}

export interface SiteSettings {
  lockAdvancedLessons: boolean;
  siteName: string;
  supportEmail: string;
  announcementBn: string;
}

// ----------------------------------------------------
// GrammarPath AI Teaching System Types
// ----------------------------------------------------
export type TutorDifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type TutorPhase = 'phase_0' | 'phase_1' | 'phase_2_exams';

export type TutorQuestionFormat =
  | 'mcq'
  | 'fill_in_the_blank'
  | 'identify_pos'
  | 'correct_sentence'
  | 'match_following'
  | 'true_false'
  | 'translate_bn_to_en'
  | 'create_sentence'
  | 'find_mistake'
  | 'mixed';

export interface TutorCurriculumLesson {
  slug: string;
  phase: TutorPhase;
  partOfSpeech: string;
  partOfSpeechBn: string;
  order: number;
  title: string;
  titleBn: string;
  summaryBn: string;
  subtopics: string[];
  availableLevels: TutorDifficultyLevel[];
}

export interface TutorQuestion {
  id: string;
  format: TutorQuestionFormat;
  promptEn: string;
  promptBn: string;
  options?: string[];
  matchPairs?: { left: string; right: string }[];
  correctAnswer: string;
  hintBn?: string;
  explanationBn: string;
}

export interface TutorStructuredLesson {
  slug: string;
  phase: TutorPhase;
  partOfSpeech: string;
  title: string;
  titleBn: string;
  level: TutorDifficultyLevel;
  generatedByAi: boolean;
  step1_introBn: string;
  step2_definitionEn: string;
  step2_definitionBn: string;
  step3_everydayExamplesBn: string[];
  step4_englishExamples: {
    english: string;
    highlightedWord: string;
    banglaMeaning: string;
    reasonBn: string;
  }[];
  step5_identificationTrickBn: string;
  step5_contextWarningBn: string;
  step6_importantRulesBn: string[];
  step7_sentenceExamples: {
    english: string;
    bangla: string;
    explanationBn: string;
  }[];
  step8_commonMistakes: {
    wrong: string;
    correct: string;
    whyBn: string;
  }[];
  step9_quickRevisionBn: string[];
  step10_practiceQuestions: TutorQuestion[];
  step11_miniTestQuestions: TutorQuestion[];
}

export interface TutorEvaluationDetail {
  questionId: string;
  promptEn: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  feedbackBn: string;
}

export interface TutorEvaluationResult {
  mode: 'practice' | 'mini_test';
  lessonSlug: string;
  level: TutorDifficultyLevel;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  masteryBand: 'reteach' | 'weak_practice' | 'revision_needed' | 'mastered';
  encouragementBn: string;
  adaptiveActionBn: string;
  lessonCompleted: boolean;
  progressSaved: boolean;
  details: TutorEvaluationDetail[];
  updatedProgress?: TutorProgressState;
}

export interface WordPosBreakdown {
  word: string;
  partOfSpeech: string;
  partOfSpeechBn: string;
  roleInSentenceBn: string;
}

export interface SentenceAnalysisResult {
  sentence: string;
  translationBn: string;
  summaryBn: string;
  contextNoteBn: string;
  words: WordPosBreakdown[];
}

export interface TutorLessonRecord {
  lessonSlug: string;
  title: string;
  partOfSpeech: string;
  level: TutorDifficultyLevel;
  bestScore: number;
  attempts: number;
  isMastered: boolean;
  lastStudiedAt: string;
}

export interface TutorProgressState {
  userId: string;
  currentPhase: TutorPhase;
  currentPartOfSpeech: string;
  currentLessonSlug: string;
  currentLevel: TutorDifficultyLevel;
  completedLessons: string[];
  lessonRecords: TutorLessonRecord[];
  weakTopics: string[];
  masteredTopics: string[];
  recommendedNextLessonSlug: string;
  updatedAt: string;
}

export interface TutorChatMessage {
  role: 'user' | 'teacher';
  text: string;
  timestamp: string;
}

