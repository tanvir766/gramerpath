import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';
import {
  generateToken,
  requireAuth,
  requireAdmin,
  authenticate,
  AuthenticatedRequest,
} from './src/server/auth.ts';
import {
  TUTOR_CURRICULUM,
  getCurriculumLesson,
} from './src/server/curriculum.ts';
import {
  generateStructuredLesson,
  evaluateTutorAnswers,
  identifySentencePartsOfSpeech,
  chatWithAiTeacher,
} from './src/server/aiTeacher.ts';
import { TutorDifficultyLevel } from './src/types/index.ts';

dotenv.config();

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
const rootDir =
  path.basename(currentDir) === 'dist'
    ? path.resolve(currentDir, '..')
    : currentDir;
const distDir = path.resolve(rootDir, 'dist');

const app = express();
// Use PORT env var in production (e.g. Cloud Run) and always 3000 in dev iframe
const PORT =
  process.env.NODE_ENV === 'production'
    ? Number(process.env.PORT) || 3000
    : 3000;

app.use(express.json());

// In-memory reset tokens for password recovery demonstration
const passwordResetTokens = new Map<string, { code: string; expiresAt: number }>();

// ----------------------------------------------------
// Public Platform Stats
// ----------------------------------------------------
app.get('/api/stats/public', (_req: Request, res: Response) => {
  try {
    const stats = db.getPublicStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSiteSettings());
});

// ----------------------------------------------------
// Authentication Endpoints
// ----------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !email || !password || !confirmPassword) {
    res.status(400).json({ error: 'সবগুলো ঘর পূরণ করা আবশ্যক (All fields are required).' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'পাসওয়ার্ড দুটি মেলেনি (Passwords do not match).' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters).' });
    return;
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    res.status(400).json({ error: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট আছে (An account with this email already exists).' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = db.createUser(fullName.trim(), email.trim(), hash, 'student');
  const token = generateToken(newUser);

  res.status(201).json({
    message: 'রেজিস্ট্রেশন সফল হয়েছে! (Registration successful)',
    user: newUser,
    token,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করুন (Please provide email and password).' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'ভুল ইমেইল বা পাসওয়ার্ড (Invalid email or password).' });
    return;
  }

  const match = bcrypt.compareSync(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'ভুল ইমেইল বা পাসওয়ার্ড (Invalid email or password).' });
    return;
  }

  const { passwordHash: _, ...cleanUser } = user;
  const token = generateToken(cleanUser);

  res.json({
    message: 'লগইন সফল হয়েছে (Login successful)',
    user: cleanUser,
    token,
  });
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'ইমেইল প্রদান করুন (Please provide email address).' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    // For privacy, still return success message
    res.json({
      message: 'আপনার ইমেইলে পাসওয়ার্ড রিসেট কোড পাঠানো হয়েছে (Reset code sent).',
      demoCode: '123456',
    });
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  passwordResetTokens.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
  });

  res.json({
    message: 'পাসওয়ার্ড রিসেট কোড তৈরি করা হয়েছে (Password reset code generated).',
    demoCode: code,
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, resetCode, newPassword, confirmPassword } = req.body;

  if (!email || !resetCode || !newPassword || !confirmPassword) {
    res.status(400).json({ error: 'সবগুলো তথ্য প্রদান করুন (All fields are required).' });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: 'পাসওয়ার্ড দুটি মেলেনি (Passwords do not match).' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters).' });
    return;
  }

  const stored = passwordResetTokens.get(email.toLowerCase());
  // Accept generated code or fallback demo code 123456
  const isValidCode = (stored && stored.code === resetCode && stored.expiresAt > Date.now()) || resetCode === '123456';

  if (!isValidCode) {
    res.status(400).json({ error: 'ভুল বা মেয়াদোত্তীর্ণ রিসেট কোড (Invalid or expired reset code).' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি (User not found).' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPassword, salt);
  db.updateUserPassword(user.id, newHash);
  passwordResetTokens.delete(email.toLowerCase());

  res.json({ message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! (Password reset successful).' });
});

// ----------------------------------------------------
// Courses & Levels
// ----------------------------------------------------
app.get('/api/courses', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const courses = db.getCourses(req.user?.id);
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/api/courses/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const course = db.getCourseById(req.params.id, req.user?.id);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  res.json(course);
});

app.get('/api/levels', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const levels = db.getLevels(req.user?.id);
    const settings = db.getSiteSettings();

    // Check lock status based on settings and prerequisites
    const processed = levels.map((lvl, index) => {
      let isLocked = lvl.isLocked;
      if (settings.lockAdvancedLessons && index > 0 && req.user?.role !== 'admin') {
        const prevLevel = levels[index - 1];
        if (prevLevel && (prevLevel.completedLessons || 0) < (prevLevel.totalLessons || 1)) {
          isLocked = true;
        }
      }
      return { ...lvl, isLocked };
    });

    res.json(processed);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch levels' });
  }
});

app.get('/api/levels/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const level = db.getLevelById(req.params.id);
  if (!level) {
    res.status(404).json({ error: 'Level not found' });
    return;
  }
  const lessons = db.getLessonsByLevel(level.id, req.user?.id, req.user?.role === 'admin');
  res.json({ level, lessons });
});

// ----------------------------------------------------
// Lessons & Content
// ----------------------------------------------------
app.get('/api/lessons/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const lesson = db.getLessonById(req.params.id, req.user?.id);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }

  // Record that user opened/studied this lesson
  if (req.user) {
    db.recordLessonProgress(req.user.id, lesson.id, false);
  }

  res.json(lesson);
});

app.post('/api/lessons/:id/complete', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const progress = db.recordLessonProgress(req.user!.id, req.params.id, true);
  res.json({ message: 'লেসনটি সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে! (Lesson marked as completed)', progress });
});

// ----------------------------------------------------
// Practice & Quizzes
// ----------------------------------------------------
app.get('/api/lessons/:id/questions', (_req: Request, res: Response) => {
  const questions = db.getQuestionsByLesson(_req.params.id);
  res.json(questions);
});

app.get('/api/quizzes/questions', (_req: Request, res: Response) => {
  const levelId = _req.query.levelId as string | undefined;
  const lessonId = _req.query.lessonId as string | undefined;
  const count = parseInt((_req.query.count as string) || '10', 10);

  const questions = db.getQuestionsForQuiz(levelId, lessonId, count);
  res.json(questions);
});

app.post('/api/quizzes/submit', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { lessonId, levelId, quizTitle, userAnswers, timeSpentSeconds } = req.body;

  if (!userAnswers || !Array.isArray(userAnswers)) {
    res.status(400).json({ error: 'Invalid answers format' });
    return;
  }

  let correctCount = 0;
  const answersSummary = userAnswers.map((ua: { questionId: string; selectedAnswer: string }) => {
    const q = db.getQuestionsForQuiz().find(item => item.id === ua.questionId) ||
              db.getQuestionsByLesson(lessonId || '').find(item => item.id === ua.questionId);

    const isCorrect = q ? q.correctAnswer.trim().toLowerCase() === (ua.selectedAnswer || '').trim().toLowerCase() : false;
    if (isCorrect) correctCount++;

    return {
      questionId: ua.questionId,
      userAnswer: ua.selectedAnswer,
      isCorrect,
      correctAnswer: q ? q.correctAnswer : '',
      explanation: q ? q.explanation : '',
      explanationBn: q ? q.explanationBn : '',
    };
  });

  const totalQuestions = userAnswers.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const attempt = db.recordQuizAttempt({
    userId: req.user!.id,
    lessonId,
    levelId,
    quizTitle: quizTitle || 'Grammar Quiz',
    totalQuestions,
    correctAnswers: correctCount,
    scorePercentage,
    timeSpentSeconds: timeSpentSeconds || 60,
    answersSummary,
  });

  // If score is >= 70% and lessonId is present, also mark the lesson completed
  if (lessonId && scorePercentage >= 70) {
    db.recordLessonProgress(req.user!.id, lessonId, true);
  }

  res.json({
    attempt,
    summary: {
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: totalQuestions - correctCount,
      scorePercentage,
      passed: scorePercentage >= 60,
      details: answersSummary,
    },
  });
});

app.get('/api/quizzes/history', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const history = db.getUserQuizAttempts(req.user!.id);
  res.json(history);
});

// ----------------------------------------------------
// Learning Dashboard
// ----------------------------------------------------
app.get('/api/dashboard/summary', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const summary = db.getDashboardSummary(req.user!.id);
  if (!summary) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(summary);
});

// ----------------------------------------------------
// GrammarPath AI Teacher Endpoints
// ----------------------------------------------------
app.get('/api/tutor/curriculum', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const progress = req.user ? db.getTutorProgress(req.user.id) : null;
  res.json({
    curriculum: TUTOR_CURRICULUM,
    progress,
  });
});

app.get('/api/tutor/progress', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const progress = db.getTutorProgress(req.user!.id);
  res.json(progress);
});

app.post('/api/tutor/lesson', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { lessonSlug, level = 'beginner', simpler = false } = req.body as {
      lessonSlug?: string;
      level?: TutorDifficultyLevel;
      simpler?: boolean;
    };

    const targetSlug = lessonSlug || 'what-is-english-grammar';
    const meta = getCurriculumLesson(targetSlug);
    if (!meta) {
      res.status(404).json({ error: 'Curriculum lesson not found.' });
      return;
    }

    const progress = req.user ? db.getTutorProgress(req.user.id) : null;
    const lesson = await generateStructuredLesson(meta, level, {
      simpler,
      weakTopics: progress?.weakTopics || [],
    });

    res.json(lesson);
  } catch (err: any) {
    console.error('AI Teacher lesson generation error:', err);
    res.status(500).json({
      error: err?.message || 'লেসন তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
    });
  }
});

app.post('/api/tutor/evaluate', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mode, lessonSlug, level, questions, userAnswers } = req.body;
    if (!lessonSlug || !Array.isArray(questions) || !Array.isArray(userAnswers)) {
      res.status(400).json({ error: 'Invalid evaluation payload.' });
      return;
    }

    const evaluation = await evaluateTutorAnswers({
      mode: mode === 'mini_test' ? 'mini_test' : 'practice',
      lessonSlug,
      level: level || 'beginner',
      questions,
      userAnswers,
    });

    let progressSaved = false;
    let updatedProgress = undefined;
    if (req.user) {
      updatedProgress = db.recordTutorEvaluation({
        userId: req.user.id,
        lessonSlug,
        level: level || 'beginner',
        mode: evaluation.mode,
        scorePercentage: evaluation.scorePercentage,
        totalQuestions: evaluation.totalQuestions,
        correctCount: evaluation.correctCount,
      });
      progressSaved = true;
    }

    res.json({
      ...evaluation,
      progressSaved,
      updatedProgress,
    });
  } catch (err: any) {
    console.error('AI Teacher evaluation error:', err);
    res.status(500).json({
      error: err?.message || 'উত্তর মূল্যায়ন করতে সমস্যা হয়েছে।',
    });
  }
});

app.post('/api/tutor/identify-sentence', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body as { sentence?: string };
    if (!sentence || !sentence.trim()) {
      res.status(400).json({ error: 'অনুগ্রহ করে একটি ইংরেজি বাক্য লিখুন।' });
      return;
    }
    const analysis = await identifySentencePartsOfSpeech(sentence);
    res.json(analysis);
  } catch (err: any) {
    console.error('Sentence analysis error:', err);
    res.status(500).json({
      error: err?.message || 'বাক্যটি বিশ্লেষণ করতে সমস্যা হয়েছে।',
    });
  }
});

app.post('/api/tutor/chat', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, history = [], currentLessonTitle } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Please write a message.' });
      return;
    }
    const progress = req.user ? db.getTutorProgress(req.user.id) : null;
    const reply = await chatWithAiTeacher({
      message,
      history,
      currentLessonTitle,
      progress,
    });
    res.json({
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('AI Teacher chat error:', err);
    res.status(500).json({
      error: err?.message || 'AI শিক্ষকের সাথে যোগাযোগ করতে সমস্যা হয়েছে।',
    });
  }
});

// ----------------------------------------------------
// Admin Endpoints
// ----------------------------------------------------
app.get('/api/admin/students', requireAdmin, (_req: Request, res: Response) => {
  const students = db.getAllStudents();
  res.json(students);
});

app.post('/api/admin/levels', requireAdmin, (req: Request, res: Response) => {
  const { levelNumber, title, titleBn, description, descriptionBn, isLocked } = req.body;
  if (!title || !titleBn) {
    res.status(400).json({ error: 'Title and Title (Bengali) are required' });
    return;
  }
  const level = db.createLevel({
    levelNumber: parseInt(levelNumber, 10) || 1,
    title,
    titleBn,
    description: description || '',
    descriptionBn: descriptionBn || '',
    isLocked: Boolean(isLocked),
  });
  res.status(201).json(level);
});

app.put('/api/admin/levels/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateLevel(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Level not found' });
    return;
  }
  res.json(updated);
});

app.post('/api/admin/lessons', requireAdmin, (req: Request, res: Response) => {
  const { lesson, content } = req.body;
  if (!lesson || !lesson.title || !lesson.levelId) {
    res.status(400).json({ error: 'Lesson title and level ID are required' });
    return;
  }

  const slug = lesson.slug || lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newLesson = db.createLesson({ ...lesson, slug }, content);
  res.status(201).json(newLesson);
});

app.put('/api/admin/lessons/:id', requireAdmin, (req: Request, res: Response) => {
  const { lesson, content } = req.body;
  const updated = db.updateLesson(req.params.id, lesson || {}, content);
  if (!updated) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/lessons/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteLesson(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json({ message: 'Lesson deleted successfully' });
});

app.patch('/api/admin/lessons/:id/publish', requireAdmin, (req: Request, res: Response) => {
  const isPublished = db.toggleLessonPublish(req.params.id);
  res.json({ isPublished });
});

app.post('/api/admin/questions', requireAdmin, (req: Request, res: Response) => {
  const q = db.createQuestion(req.body);
  res.status(201).json(q);
});

app.put('/api/admin/questions/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateQuestion(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/questions/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteQuestion(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json({ message: 'Question deleted' });
});

app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getSiteSettings());
});

app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSiteSettings(req.body);
  res.json(updated);
});

// ----------------------------------------------------
// Vite dev middleware or static serving in production
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    let viteInstance: Awaited<ReturnType<(typeof import('vite'))['createServer']>> | null = null;
    const viteReady = import('vite')
      .then(({ createServer: createViteServer }) =>
        createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        })
      )
      .then(vite => {
        viteInstance = vite;
        return vite;
      });
    viteReady.catch(err => {
      console.error('Failed to initialize Vite dev server:', err);
    });

    app.use(async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const vite = viteInstance ?? (await viteReady);
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      const url = req.originalUrl;
      let vite: Awaited<ReturnType<(typeof import('vite'))['createServer']>> | null = null;
      try {
        vite = viteInstance ?? (await viteReady);
        let template = fs.readFileSync(path.resolve(rootDir, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        if (vite?.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`GrammarPath server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server failed to bind port:', err);
    process.exit(1);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
