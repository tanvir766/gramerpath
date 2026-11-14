import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  UserSettings,
  Course,
  Level,
  Lesson,
  LessonContent,
  Question,
  QuizAttempt,
  LessonProgress,
  SiteSettings,
  TutorProgressState,
  TutorDifficultyLevel,
} from '../types/index.ts';
import { getCurriculumLesson, getNextCurriculumLessonSlug } from './curriculum.ts';

interface AdminUserRecord {
  id: string;
  userId: string;
  permissions: string[];
  grantedBy: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  courses: Course[];
  levels: Level[];
  lessons: Lesson[];
  lesson_contents: LessonContent[];
  questions: Question[];
  quiz_attempts: QuizAttempt[];
  lesson_progress: LessonProgress[];
  user_settings: UserSettings[];
  admin_users: AdminUserRecord[];
  site_settings: SiteSettings;
  tutor_progress?: TutorProgressState[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'grammarpath.json');

class RelationalDatabase {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    this.data = this.loadOrInitialize();
  }

  private save(): void {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  private loadOrInitialize(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.tutor_progress) parsed.tutor_progress = [];
        return parsed;
      } catch (err) {
        console.error('Database file corrupted, re-initializing seed data:', err);
      }
    }
    const initial = this.generateSeedData();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to create initial database file:', e);
    }
    return initial;
  }

  private generateSeedData(): DatabaseSchema {
    const salt = bcrypt.genSaltSync(10);
    const studentHash = bcrypt.hashSync('student123', salt);
    const adminHash = bcrypt.hashSync('admin123', salt);

    const users: (User & { passwordHash: string })[] = [
      {
        id: 'usr_student_1',
        fullName: 'তানভীর আহমেদ (Tanveer Ahmed)',
        email: 'student@grammarpath.com',
        role: 'student',
        passwordHash: studentHash,
        createdAt: '2026-10-01T08:00:00.000Z',
      },
      {
        id: 'usr_admin_1',
        fullName: 'প্রফেসর রফিকুল ইসলাম (Admin)',
        email: 'admin@grammarpath.com',
        role: 'admin',
        passwordHash: adminHash,
        createdAt: '2026-09-01T08:00:00.000Z',
      },
    ];

    const user_settings: UserSettings[] = [
      {
        id: 'set_1',
        userId: 'usr_student_1',
        preferredLanguage: 'bilingual',
        showBanglaTranslations: true,
        dailyGoalMinutes: 20,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'set_2',
        userId: 'usr_admin_1',
        preferredLanguage: 'bilingual',
        showBanglaTranslations: true,
        dailyGoalMinutes: 30,
        updatedAt: new Date().toISOString(),
      },
    ];

    const admin_users: AdminUserRecord[] = [
      {
        id: 'adm_1',
        userId: 'usr_admin_1',
        permissions: ['all', 'manage_content', 'manage_students', 'manage_quizzes'],
        grantedBy: 'system',
        createdAt: '2026-09-01T08:00:00.000Z',
      },
    ];

    const courses: Course[] = [
      {
        id: 'crs_basics',
        slug: 'english-grammar-basics',
        title: 'English Grammar Basics for Beginners',
        titleBn: 'ইংরেজি ব্যাকরণের প্রাথমিক ভিত্তি (A to Z)',
        category: 'basics',
        description: 'Master letters, vowels, consonants, words, sentences, and basic parts of speech from absolute zero.',
        descriptionBn: 'কোনো পূর্ব অভিজ্ঞতা ছাড়া ইংরেজি ব্যাকরণ শেখার প্রথম ধাপ। বর্ণ, স্বরবর্ণ, শব্দ ও বাক্যের মূল ভিত্তি সহজে বুঝুন।',
        levelId: 'lvl_1',
        levelOrder: 1,
        badge: '100% Free · শুরু করার জন্য সেরা',
        difficulty: 'Absolute Beginner (শুরুর পর্যায়)',
        durationHours: 3,
        highlightsBn: [
          'ইংরেজি ২৬টি অক্ষরের ভূমিকা ও উচ্চারণ',
          'Vowels এবং Consonants-এর সহজ ব্যবহার',
          'শব্দ ও বাক্য গঠনের মৌলিক নিয়ম',
          'ইংরেজি ব্যাকরণের প্রাথমিক ধারণা',
        ],
      },
      {
        id: 'crs_parts_of_speech',
        slug: 'parts-of-speech-mastery',
        title: 'Parts of Speech Mastery',
        titleBn: 'পার্টস অফ স্পিচ - ৮ প্রকার পদের পূর্ণাঙ্গ গাইড',
        category: 'parts_of_speech',
        description: 'Complete mastery of all 8 parts of speech: Noun, Pronoun, Adjective, Verb, Adverb, Preposition, Conjunction, and Interjection.',
        descriptionBn: 'ইংরেজি ভাষার ৮টি পদের পূর্ণাঙ্গ ব্যাখ্যা। Noun থেকে Interjection পর্যন্ত চেনার উপায়, সহজ নিয়ম ও প্রচুর বাস্তব উদাহরণ।',
        levelId: 'lvl_2',
        levelOrder: 2,
        badge: '100% Free · মোস্ট পপুলার',
        difficulty: 'Beginner to Intermediate (সহজ)',
        durationHours: 5,
        highlightsBn: [
          '৮ প্রকার পার্টস অফ স্পিচ চেনার জাদুকরী টেকনিক',
          'Noun ও Pronoun-এর প্রকারভেদ ও নিয়ম',
          'Verb-এর গুরুত্ব ও বাক্যে সঠিক রূপ',
          'Preposition ও Conjunction দিয়ে বাক্য সম্প্রসারণ',
        ],
      },
      {
        id: 'crs_sentence_structure',
        slug: 'sentence-structure-formation',
        title: 'Sentence Structure & Formation (S-V-O)',
        titleBn: 'সঠিক বাক্য গঠন ও রূপান্তর (Sentence Making)',
        category: 'sentence',
        description: 'Learn how to construct correct English sentences with Subject, Predicate, Object, Helping Verbs, Negatives, and Questions.',
        descriptionBn: 'Subject, Helping Verb ও Object চেনার উপায়। সাধারণ বাক্য থেকে না-বোধক ও প্রশ্নবোধক বাক্য তৈরির সহজ নিয়মাবলী।',
        levelId: 'lvl_3',
        levelOrder: 3,
        badge: '100% Free · প্র্যাকটিক্যাল',
        difficulty: 'Beginner (সহজ)',
        durationHours: 4,
        highlightsBn: [
          'S + V + O স্ট্রাকচারের নিখুঁত প্রয়োগ',
          'Helping Verb ও Main Verb-এর পার্থক্য',
          'হ্যাঁ-বোধক থেকে না-বোধক বাক্য রূপান্তর',
          'দৈনন্দিন প্রশ্নবোধক বাক্য তৈরির কৌশল',
        ],
      },
      {
        id: 'crs_tense_mastery',
        slug: 'complete-tense-masterclass',
        title: 'Complete Tense Masterclass (All 12 Tenses)',
        titleBn: 'টেন্সের সম্পূর্ণ মাস্টারক্লাস (১২টি কালের সহজ সমাধান)',
        category: 'tense',
        description: 'Master all 12 tenses with mathematical formulas, Bengali identification rules, common mistakes, and everyday conversational examples.',
        descriptionBn: 'টেন্স নিয়ে আর কোনো ভয় নেই! বর্তমান, অতীত ও ভবিষ্যৎ কালের ১২টি টেন্সের সহজ সূত্র, বাংলা চেনার সহজ উপায় এবং সাধারণ ভুলের বিশ্লেষণ।',
        levelId: 'lvl_4',
        levelOrder: 4,
        badge: '100% Free · সবচেয়ে গুরুত্বপূর্ণ',
        difficulty: 'All Levels (সকলের জন্য)',
        durationHours: 6,
        highlightsBn: [
          '১২টি টেন্সের সহজ গাণিতিক সূত্র',
          'বাংলা ক্রিয়ার রূপ দেখে টেন্স চেনার শর্টকাট',
          'He, She, It-এর ক্ষেত্রে s/es ব্যবহারের নিয়ম',
          'বাস্তব জীবনে টেন্সের সঠিক কথোপকথন',
        ],
      },
      {
        id: 'crs_advanced_topics',
        slug: 'applied-advanced-grammar',
        title: 'Applied Grammar & Advanced Topics',
        titleBn: 'উচ্চতর ব্যাকরণ ও ব্যবহারিক ইংরেজি',
        category: 'advanced',
        description: 'Master Articles (A, An, The), Prepositions in detail, Modals, Voice Change, and Subject-Verb Agreement with practice.',
        descriptionBn: 'পরীক্ষা ও বাস্তব জীবনের জন্য অত্যন্ত প্রয়োজনীয় বিষয়সমূহ: আর্টিকেল, স্থান ও সময়ের প্রেপোজিশন, ভয়েস চেঞ্জ ও সাবজেক্ট-ভার্ব এগ্রিমেন্ট।',
        levelId: 'lvl_5',
        levelOrder: 5,
        badge: '100% Free · অ্যাডভান্সড',
        difficulty: 'Intermediate (মধ্যম)',
        durationHours: 5,
        highlightsBn: [
          'A, An, The ব্যবহারের অব্যর্থ নিয়ম ও ব্যতিক্রম',
          'In, On, At-এর অবস্থানগত ও সময়গত ব্যবহার',
          'Can, Could, Should, Must-এর ব্যবহারিক নিয়ম',
          'Active থেকে Passive Voice রূপান্তরের সহজ নিয়ম',
        ],
      },
    ];

    const levels: Level[] = [
      {
        id: 'lvl_1',
        levelNumber: 1,
        title: 'English Grammar Basics',
        titleBn: 'ইংরেজি ব্যাকরণের প্রাথমিক ভিত্তি',
        description: 'Understand what grammar is, letters, vowels, words, sentences and basic parts of speech.',
        descriptionBn: 'গ্রামার কী, বর্ণ, স্বরবর্ণ-ব্যঞ্জনবর্ণ, শব্দ, বাক্য ও প্রাথমিক পদ প্রকরণ বুঝুন।',
        isLocked: false,
      },
      {
        id: 'lvl_2',
        levelNumber: 2,
        title: 'Parts of Speech',
        titleBn: 'পার্টস অফ স্পিচ (পদ প্রকরণ)',
        description: 'Master all 8 parts of speech with Bengali explanations, rules, and everyday examples.',
        descriptionBn: 'Noun থেকে Interjection পর্যন্ত ৮ প্রকার পার্টস অফ স্পিচের সহজ বাংলা নিয়ম ও প্রয়োগ।',
        isLocked: false,
      },
      {
        id: 'lvl_3',
        levelNumber: 3,
        title: 'Basic Sentence Structure',
        titleBn: 'মৌলিক বাক্য গঠন ও কাঠামো',
        description: 'Learn subject, predicate, object, helping verbs, negative and interrogative sentences.',
        descriptionBn: 'Subject, Predicate, Helping Verb চেনার উপায় এবং হ্যাঁ-সূচক, না-সূচক ও প্রশ্নবোধক বাক্য গঠন।',
        isLocked: false,
      },
      {
        id: 'lvl_4',
        levelNumber: 4,
        title: 'Tense (কাল বা সময়)',
        titleBn: 'টেন্স (Tense) - কাল বা সময়',
        description: 'Master all 12 tenses with structures, Bengali rules, common mistakes, and real-life examples.',
        descriptionBn: 'বর্তমান, অতীত ও ভবিষ্যৎ কালের ১২টি টেন্সের সহজ সূত্র, বাংলা চেনার উপায় এবং বাস্তব উদাহরণ।',
        isLocked: false,
      },
      {
        id: 'lvl_5',
        levelNumber: 5,
        title: 'More Grammar Topics',
        titleBn: 'উচ্চতর গ্রামার টপিকস',
        description: 'Articles, Prepositions in detail, Modals, Voice Change, Narration, Subject-Verb Agreement, and Tag Questions.',
        descriptionBn: 'আর্টিকেল, প্রেপোজিশন, ভয়েস চেঞ্জ, ন্যারেশন ও সাবজেক্ট-ভার্ব এগ্রিমেন্টের বিস্তারিত নিয়ম।',
        isLocked: false,
      },
    ];

    // Seed lessons for all 5 levels matching prompt curriculum
    const lessons: Lesson[] = [
      // LEVEL 1
      {
        id: 'lsn_1_1',
        levelId: 'lvl_1',
        lessonOrder: 1,
        title: 'What is English Grammar?',
        titleBn: 'ইংরেজি ব্যাকরণ (English Grammar) কী?',
        slug: 'what-is-english-grammar',
        isPublished: true,
        createdAt: '2026-10-01T08:00:00.000Z',
      },
      {
        id: 'lsn_1_2',
        levelId: 'lvl_1',
        lessonOrder: 2,
        title: 'What is a Sentence?',
        titleBn: 'বাক্য (Sentence) কাকে বলে?',
        slug: 'what-is-a-sentence',
        isPublished: true,
        createdAt: '2026-10-01T08:10:00.000Z',
      },
      {
        id: 'lsn_1_3',
        levelId: 'lvl_1',
        lessonOrder: 3,
        title: 'What is a Word?',
        titleBn: 'শব্দ (Word) কাকে বলে?',
        slug: 'what-is-a-word',
        isPublished: true,
        createdAt: '2026-10-01T08:20:00.000Z',
      },
      {
        id: 'lsn_1_4',
        levelId: 'lvl_1',
        lessonOrder: 4,
        title: 'What is a Letter?',
        titleBn: 'বর্ণ বা অক্ষর (Letter) কী?',
        slug: 'what-is-a-letter',
        isPublished: true,
        createdAt: '2026-10-01T08:30:00.000Z',
      },
      {
        id: 'lsn_1_5',
        levelId: 'lvl_1',
        lessonOrder: 5,
        title: 'Vowels and Consonants',
        titleBn: 'ভাওয়েল (Vowel) ও কনসোনেন্ট (Consonant)',
        slug: 'vowels-and-consonants',
        isPublished: true,
        createdAt: '2026-10-01T08:40:00.000Z',
      },
      {
        id: 'lsn_1_6',
        levelId: 'lvl_1',
        lessonOrder: 6,
        title: 'Parts of Speech Introduction',
        titleBn: 'পার্টস অফ স্পিচ পরিচিতি',
        slug: 'parts-of-speech-intro',
        isPublished: true,
        createdAt: '2026-10-01T08:50:00.000Z',
      },

      // LEVEL 2
      {
        id: 'lsn_2_1',
        levelId: 'lvl_2',
        lessonOrder: 1,
        title: 'Noun (বিশেষ্য)',
        titleBn: 'Noun - যে কোনো কিছুর নাম',
        slug: 'noun',
        isPublished: true,
        createdAt: '2026-10-02T08:00:00.000Z',
      },
      {
        id: 'lsn_2_2',
        levelId: 'lvl_2',
        lessonOrder: 2,
        title: 'Pronoun (সর্বনাম)',
        titleBn: 'Pronoun - নামের পরিবর্তে ব্যবহৃত শব্দ',
        slug: 'pronoun',
        isPublished: true,
        createdAt: '2026-10-02T08:10:00.000Z',
      },
      {
        id: 'lsn_2_3',
        levelId: 'lvl_2',
        lessonOrder: 3,
        title: 'Adjective (নাম বিশেষণ)',
        titleBn: 'Adjective - দোষ, গুণ, অবস্থা ও সংখ্যা',
        slug: 'adjective',
        isPublished: true,
        createdAt: '2026-10-02T08:20:00.000Z',
      },
      {
        id: 'lsn_2_4',
        levelId: 'lvl_2',
        lessonOrder: 4,
        title: 'Verb (ক্রিয়া বা কাজ)',
        titleBn: 'Verb - বাক্যের প্রাণ এবং কাজের শব্দ',
        slug: 'verb',
        isPublished: true,
        createdAt: '2026-10-02T08:30:00.000Z',
      },
      {
        id: 'lsn_2_5',
        levelId: 'lvl_2',
        lessonOrder: 5,
        title: 'Adverb (ভাব বিশেষণ)',
        titleBn: 'Adverb - কাজটি কীভাবে, কখন বা কোথায় হয়',
        slug: 'adverb',
        isPublished: true,
        createdAt: '2026-10-02T08:40:00.000Z',
      },
      {
        id: 'lsn_2_6',
        levelId: 'lvl_2',
        lessonOrder: 6,
        title: 'Preposition (পদান্বয়ী অব্যয়)',
        titleBn: 'Preposition - অবস্থান ও সংযোগ নির্দেশক',
        slug: 'preposition',
        isPublished: true,
        createdAt: '2026-10-02T08:50:00.000Z',
      },
      {
        id: 'lsn_2_7',
        levelId: 'lvl_2',
        lessonOrder: 7,
        title: 'Conjunction (সংযোজক অব্যয়)',
        titleBn: 'Conjunction - দুটি শব্দ বা বাক্যকে জোড়া লাগানোর শব্দ',
        slug: 'conjunction',
        isPublished: true,
        createdAt: '2026-10-02T09:00:00.000Z',
      },
      {
        id: 'lsn_2_8',
        levelId: 'lvl_2',
        lessonOrder: 8,
        title: 'Interjection (আবেগসূচক অব্যয়)',
        titleBn: 'Interjection - মনের তীব্র অনুভূতি ও আবেগ',
        slug: 'interjection',
        isPublished: true,
        createdAt: '2026-10-02T09:10:00.000Z',
      },

      // LEVEL 3
      {
        id: 'lsn_3_1',
        levelId: 'lvl_3',
        lessonOrder: 1,
        title: 'Subject and Predicate',
        titleBn: 'Subject (উদ্দেশ্য) এবং Predicate (বিধেয়)',
        slug: 'subject-and-predicate',
        isPublished: true,
        createdAt: '2026-10-03T08:00:00.000Z',
      },
      {
        id: 'lsn_3_2',
        levelId: 'lvl_3',
        lessonOrder: 2,
        title: 'Object (কর্ম)',
        titleBn: 'Object চেনার সহজ উপায়',
        slug: 'object-in-sentence',
        isPublished: true,
        createdAt: '2026-10-03T08:10:00.000Z',
      },
      {
        id: 'lsn_3_3',
        levelId: 'lvl_3',
        lessonOrder: 3,
        title: 'Helping Verb vs Main Verb',
        titleBn: 'সাহায্যকারী ক্রিয়া বনাম মূল ক্রিয়া',
        slug: 'helping-verb-vs-main-verb',
        isPublished: true,
        createdAt: '2026-10-03T08:20:00.000Z',
      },
      {
        id: 'lsn_3_4',
        levelId: 'lvl_3',
        lessonOrder: 4,
        title: 'Sentence Formation (S + V + O)',
        titleBn: 'ইংরেজি বাক্য গঠনের মৌলিক নিয়ম',
        slug: 'sentence-formation',
        isPublished: true,
        createdAt: '2026-10-03T08:30:00.000Z',
      },
      {
        id: 'lsn_3_5',
        levelId: 'lvl_3',
        lessonOrder: 5,
        title: 'Positive and Negative Sentences',
        titleBn: 'হ্যাঁ-বোধক এবং না-বোধক বাক্য গঠন',
        slug: 'positive-negative-sentences',
        isPublished: true,
        createdAt: '2026-10-03T08:40:00.000Z',
      },
      {
        id: 'lsn_3_6',
        levelId: 'lvl_3',
        lessonOrder: 6,
        title: 'Interrogative Sentences (Questions)',
        titleBn: 'প্রশ্নবোধক বাক্য তৈরির সহজ নিয়ম',
        slug: 'interrogative-sentences',
        isPublished: true,
        createdAt: '2026-10-03T08:50:00.000Z',
      },

      // LEVEL 4
      {
        id: 'lsn_4_1',
        levelId: 'lvl_4',
        lessonOrder: 1,
        title: 'What is Tense?',
        titleBn: 'Tense (কাল বা সময়) কী এবং কত প্রকার?',
        slug: 'what-is-tense',
        isPublished: true,
        createdAt: '2026-10-04T08:00:00.000Z',
      },
      {
        id: 'lsn_4_2',
        levelId: 'lvl_4',
        lessonOrder: 2,
        title: 'Present Indefinite Tense',
        titleBn: 'Present Indefinite Tense (সাধারণ বর্তমান কাল)',
        slug: 'present-indefinite-tense',
        isPublished: true,
        createdAt: '2026-10-04T08:10:00.000Z',
      },
      {
        id: 'lsn_4_3',
        levelId: 'lvl_4',
        lessonOrder: 3,
        title: 'Present Continuous Tense',
        titleBn: 'Present Continuous Tense (ঘটমান বর্তমান কাল)',
        slug: 'present-continuous-tense',
        isPublished: true,
        createdAt: '2026-10-04T08:20:00.000Z',
      },
      {
        id: 'lsn_4_4',
        levelId: 'lvl_4',
        lessonOrder: 4,
        title: 'Present Perfect Tense',
        titleBn: 'Present Perfect Tense (পুরাঘটিত বর্তমান কাল)',
        slug: 'present-perfect-tense',
        isPublished: true,
        createdAt: '2026-10-04T08:30:00.000Z',
      },
      {
        id: 'lsn_4_5',
        levelId: 'lvl_4',
        lessonOrder: 5,
        title: 'Past Indefinite Tense',
        titleBn: 'Past Indefinite Tense (সাধারণ অতীত কাল)',
        slug: 'past-indefinite-tense',
        isPublished: true,
        createdAt: '2026-10-04T08:40:00.000Z',
      },
      {
        id: 'lsn_4_6',
        levelId: 'lvl_4',
        lessonOrder: 6,
        title: 'Future Indefinite Tense',
        titleBn: 'Future Indefinite Tense (সাধারণ ভবিষ্যৎ কাল)',
        slug: 'future-indefinite-tense',
        isPublished: true,
        createdAt: '2026-10-04T08:50:00.000Z',
      },

      // LEVEL 5
      {
        id: 'lsn_5_1',
        levelId: 'lvl_5',
        lessonOrder: 1,
        title: 'Articles (A, An, The)',
        titleBn: 'Articles (A, An, The) ব্যবহারের সহজ নিয়ম',
        slug: 'articles-a-an-the',
        isPublished: true,
        createdAt: '2026-10-05T08:00:00.000Z',
      },
      {
        id: 'lsn_5_2',
        levelId: 'lvl_5',
        lessonOrder: 2,
        title: 'Prepositions in Detail (In, On, At)',
        titleBn: 'স্থান ও সময়ের Preposition (In, On, At)',
        slug: 'prepositions-in-on-at',
        isPublished: true,
        createdAt: '2026-10-05T08:10:00.000Z',
      },
      {
        id: 'lsn_5_3',
        levelId: 'lvl_5',
        lessonOrder: 3,
        title: 'Modals (Can, Could, May, Should, Must)',
        titleBn: 'মডাল অক্সিলিয়ারি (Modals) ব্যবহারের নিয়ম',
        slug: 'modal-verbs',
        isPublished: true,
        createdAt: '2026-10-05T08:20:00.000Z',
      },
      {
        id: 'lsn_5_4',
        levelId: 'lvl_5',
        lessonOrder: 4,
        title: 'Voice Change (Active to Passive)',
        titleBn: 'ভয়েস চেঞ্জ (Active থেকে Passive)',
        slug: 'voice-change-intro',
        isPublished: true,
        createdAt: '2026-10-05T08:30:00.000Z',
      },
      {
        id: 'lsn_5_5',
        levelId: 'lvl_5',
        lessonOrder: 5,
        title: 'Subject-Verb Agreement',
        titleBn: 'সাবজেক্ট অনুযায়ী সঠিক ভার্ব নির্বাচন',
        slug: 'subject-verb-agreement',
        isPublished: true,
        createdAt: '2026-10-05T08:40:00.000Z',
      },
    ];

    // Seed comprehensive lesson contents covering all 10 required pedagogical points
    const lesson_contents: LessonContent[] = [
      {
        id: 'cnt_1_1',
        lessonId: 'lsn_1_1',
        englishDefinition: 'English Grammar is the system of rules that allows us to combine letters into words, and words into correct sentences to communicate clearly.',
        banglaExplanation: 'সহজ কথায়, যে নিয়মগুলো জানা থাকলে ইংরেজি ভাষা সঠিকভাবে পড়তে, লিখতে ও বলতে পারা যায়, তাকে English Grammar বা ইংরেজি ব্যাকরণ বলে। ব্যাকরণ হলো ভাষার ট্রাফিক নিয়ম—নিয়ম মানলে ভাষা সুন্দর ও স্পষ্ট হয়।',
        sentenceStructure: 'Letters (বর্ণ) ➔ Words (শব্দ) ➔ Sentences (বাক্য)',
        grammarRules: [
          'ইংরেজি ভাষায় মোট ২৬টি Letter বা বর্ণ আছে।',
          'কয়েকটি Letter পাশাপাশি বসে অর্থপূর্ণ শব্দ (Word) তৈরি করে।',
          'কয়েকটি Word সঠিক নিয়মে বসে মনের পূর্ণ ভাব প্রকাশ করলে তাকে Sentence বা বাক্য বলে।',
        ],
        specialRules: [
          'ইংরেজি বাক্য সবসময় Capital Letter (বড় হাতের অক্ষর) দিয়ে শুরু করতে হয়।',
          'বাক্য শেষ হলে ফুল স্টপ (.), প্রশ্নবোধক চিহ্ন (?), বা বিস্ময়বোধক চিহ্ন (!) দিতে হয়।',
        ],
        commonMistakes: [
          {
            wrong: 'i am a student',
            correct: 'I am a student.',
            explanationBn: 'ইংরেজিতে "I" (আমি) যেখানেই বসুক না কেন, সবসময় ক্যাপিটাল লেটার বা বড় হাতের হয় এবং বাক্যের শেষে ফুলস্টপ জরুরি।',
          },
          {
            wrong: 'Book a this is.',
            correct: 'This is a book.',
            explanationBn: 'শব্দগুলো এলোমেলো বসলে বাক্য হয় না; সঠিক ক্রম (Word Order) বজায় রাখতে হবে।',
          },
        ],
        examples: [
          { english: 'I read a book.', bangla: 'আমি একটি বই পড়ি।', note: 'Subject + Verb + Object ক্রমানুসারে বসেছে' },
          { english: 'English is easy.', bangla: 'ইংরেজি সহজ।', note: 'সহজ ও স্পষ্ট নিয়ম' },
          { english: 'Grammar helps us learn.', bangla: 'ব্যাকরণ আমাদের শিখতে সাহায্য করে।' },
        ],
        practicalExamples: [
          {
            scenario: 'Self introduction to a friend',
            scenarioBn: 'বন্ধুর কাছে নিজের পরিচয় দেওয়া',
            dialogueEn: 'Hello! I am Karim. I am learning English grammar.',
            dialogueBn: 'হ্যালো! আমি করিম। আমি ইংরেজি গ্রামার শিখছি।',
          },
        ],
        lessonSummary: 'Grammar gives structure to language. Remember: Letters build Words, and Words build Sentences. Always start a sentence with a capital letter and end with punctuation.',
        lessonSummaryBn: 'গ্রামার হলো ভাষার ভিত্তি। বর্ণ মিলে শব্দ তৈরি হয়, আর শব্দ মিলে বাক্য গঠিত হয়। সবসময় বড় হাতের অক্ষর দিয়ে বাক্য শুরু করবেন এবং ফুলস্টপ দিয়ে শেষ করবেন।',
      },

      {
        id: 'cnt_1_2',
        lessonId: 'lsn_1_2',
        englishDefinition: 'A sentence is a group of words that are put together to mean something complete. It expresses a complete thought.',
        banglaExplanation: 'এক বা একাধিক শব্দ পাশাপাশি বসে যদি মনের ভাব সম্পূর্ণ ও পরিষ্কারভাবে প্রকাশ করে, তবে তাকে Sentence বা বাক্য বলে। যদি মনের ভাব অপূর্ণ থেকে যায়, তবে তা বাক্য নয়।',
        sentenceStructure: 'Subject (কর্তা) + Verb (ক্রিয়া) + Object/Extension (কর্ম বা বাকি অংশ)',
        grammarRules: [
          'একটি পূর্ণাঙ্গ বাক্যে অবশ্যই অন্তত একটি Subject (যে কাজ করে) এবং একটি Verb (কাজ) থাকতে হবে।',
          'বাংলা বাক্যে সাধারণত ক্রিয়া (Verb) সবার শেষে থাকে (যেমন: আমি ভাত খাই), কিন্তু ইংরেজি বাক্যে ক্রিয়া সবসময় মাঝে বসে (I eat rice)।',
        ],
        specialRules: [
          'আদেশ বা অনুরোধের বাক্যে (Imperative Sentence) Subject "You" উজ্জ্বল বা গোপন থাকে (যেমন: Come here = You come here)।',
        ],
        commonMistakes: [
          {
            wrong: 'I water.',
            correct: 'I drink water.',
            explanationBn: 'এখানে কোনো ক্রিয়া (Verb) নেই; কেবল নাম বা অবজেক্ট রয়েছে, তাই বাক্যটি সম্পূর্ণ হয়নি।',
          },
          {
            wrong: 'Go to school.',
            correct: 'They go to school. / Go to school!',
            explanationBn: 'কার কথা বলা হচ্ছে তা স্পষ্ট থাকতে হবে।',
          },
        ],
        examples: [
          { english: 'The sun rises in the east.', bangla: 'সূর্য পূর্ব দিকে ওঠে।' },
          { english: 'We learn English every day.', bangla: 'আমরা প্রতিদিন ইংরেজি শিখি।' },
          { english: 'She sings sweetly.', bangla: 'সে মিষ্টি সুরে গান গায়।' },
        ],
        practicalExamples: [
          {
            scenario: 'In the classroom',
            scenarioBn: 'শ্রেণিকক্ষে শিক্ষকের সাথে কথা বলা',
            dialogueEn: 'Teacher: Open your book. Student: I am opening my book, sir.',
            dialogueBn: 'শিক্ষক: তোমার বই খোলো। শিক্ষার্থী: আমি বই খুলছি, স্যার।',
          },
        ],
        lessonSummary: 'A Sentence must have a subject, a verb, and make complete sense. English structure is Subject + Verb + Object (SVO).',
        lessonSummaryBn: 'Sentence হতে হলে মনের সম্পূর্ণ ভাব প্রকাশ পেতে হবে। ইংরেজি বাক্যের মৌলিক গঠন হলো Subject + Verb + Object (S-V-O)।',
      },

      {
        id: 'cnt_2_1',
        lessonId: 'lsn_2_1',
        englishDefinition: 'A Noun is a word that names a person, place, animal, thing, quality, or idea.',
        banglaExplanation: 'সহজ কথায়, যে শব্দ দিয়ে যে কোনো কিছুর নাম বোঝায়—কোনো ব্যক্তি, স্থান, বস্তু, প্রাণী বা গুণের নাম—তাকেই Noun (বিশেষ্য) বলে। চোখে যা দেখেন আর যার একটি নাম আছে, সেটাই Noun!',
        sentenceStructure: 'Noun as Subject: [Noun] + Verb + Object | Noun as Object: Subject + Verb + [Noun]',
        grammarRules: [
          'Proper Noun (নির্দিষ্ট নাম যেমন: Dhaka, Hasan) সবসময় Capital Letter দিয়ে শুরু হবে।',
          'Common Noun (সাধারণ নাম যেমন: boy, city, river) ছোট হাতের অক্ষরে লেখা যায় যদি না বাক্যের প্রথমে বসে।',
          'গণনা করা যায় এমন Noun-কে Countable Noun (যেমন: pen, book) এবং গণনা করা যায় না এমন Noun-কে Uncountable Noun (যেমন: water, milk, rice) বলে।',
        ],
        specialRules: [
          'Uncountable Noun-এর পূর্বে সরাসরি a বা an বসে না (a water হবে না, a glass of water হতে পারে)।',
        ],
        commonMistakes: [
          {
            wrong: 'I live in dhaka.',
            correct: 'I live in Dhaka.',
            explanationBn: 'Dhaka একটি নির্দিষ্ট শহরের নাম (Proper Noun), তাই প্রথম অক্ষর বড় হাতের "D" হবে।',
          },
          {
            wrong: 'I bought two milks.',
            correct: 'I bought two glasses of milk. / I bought milk.',
            explanationBn: 'Milk গণনা করা যায় না (Uncountable), তাই সরাসরি বহুবচন (milks) হয় না।',
          },
        ],
        examples: [
          { english: 'Rahim is a good student.', bangla: 'রহিম একজন ভালো ছাত্র। (Rahim ও student হলো Noun)' },
          { english: 'Dhaka is a big city.', bangla: 'ঢাকা একটি বড় শহর। (Dhaka ও city হলো Noun)' },
          { english: 'Honesty is the best policy.', bangla: 'সততা সর্বোৎকৃষ্ট পন্থা। (Honesty ও policy হলো Noun)' },
        ],
        practicalExamples: [
          {
            scenario: 'At a grocery shop',
            scenarioBn: 'মুদির দোকানে কেনাকাটা',
            dialogueEn: 'Customer: Do you have sugar and apples? Shopkeeper: Yes, we have fresh apples.',
            dialogueBn: 'ক্রেতা: আপনার কাছে কি চিনি এবং আপেল আছে? দোকানদার: হ্যাঁ, আমাদের তাজা আপেল আছে।',
          },
        ],
        lessonSummary: 'Nouns are naming words. They can name people, places, things, or ideas. Always capitalize Proper Nouns.',
        lessonSummaryBn: 'Noun মানেই যে কোনো কিছুর নাম। নির্দিষ্ট নাম হলে সবসময় বড় হাতের অক্ষর দিয়ে শুরু করবেন।',
      },

      {
        id: 'cnt_2_4',
        lessonId: 'lsn_2_4',
        englishDefinition: 'A Verb is a word that describes an action, state of being, or occurrence in a sentence. Without a verb, an English sentence cannot exist.',
        banglaExplanation: 'যে শব্দ দ্বারা কোনো কিছু করা, হওয়া, যাওয়া, খাওয়া বা অবস্থান করা বোঝায়, তাকে Verb (ক্রিয়া) বলে। Verb হলো বাক্যের হৃৎপিণ্ড—Verb ছাড়া কোনো ইংরেজি বাক্য তৈরি হতে পারে না।',
        sentenceStructure: 'Subject + Verb + Object (যেমন: I play football)',
        grammarRules: [
          'Verb মূলত দুই প্রকার: Main Verb বা Principal Verb (যেমন: eat, run, play) এবং Auxiliary Verb বা Helping Verb (যেমন: am, is, are, was, were, have, has)।',
          'Subject অনুযায়ী Verb পরিবর্তিত হয় (যেমন: I play, কিন্তু He plays)।',
          'Verb-এর তিনটি প্রধান রূপ থাকে: Present (V1), Past (V2), Past Participle (V3)। যেমন: go - went - gone।',
        ],
        specialRules: [
          'Subject যদি Third Person Singular (He, She, It বা যে কোনো একক নাম) হয়, তবে Present Indefinite-এ Verb-এর শেষে s বা es যোগ করতে হয়।',
        ],
        commonMistakes: [
          {
            wrong: 'He go to school.',
            correct: 'He goes to school.',
            explanationBn: 'He হলো Third Person Singular, তাই go এর সাথে es যোগ হয়ে goes হবে।',
          },
          {
            wrong: 'I am agree with you.',
            correct: 'I agree with you.',
            explanationBn: 'Agree নিজেই একটি পূর্ণাঙ্গ Verb, তাই আলাদা করে "am" বসবে না।',
          },
        ],
        examples: [
          { english: 'Birds fly in the sky.', bangla: 'পাখিরা আকাশে ওড়ে। (fly হলো কাজ বা Verb)' },
          { english: 'She is a doctor.', bangla: 'সে একজন ডাক্তার। (is হলো হওয়া বা Verb)' },
          { english: 'We write letters.', bangla: 'আমরা চিঠি লিখি। (write হলো Verb)' },
        ],
        practicalExamples: [
          {
            scenario: 'Asking about daily routine',
            scenarioBn: 'দৈনন্দিন রুটিন সম্পর্কে জানতে চাওয়া',
            dialogueEn: 'A: What do you do in the morning? B: I walk and read newspapers.',
            dialogueBn: 'A: সকালে তুমি কী করো? B: আমি হাঁটি এবং পত্রিকা পড়ি।',
          },
        ],
        lessonSummary: 'The Verb is the action word or state of being. Remember to adjust the verb form according to the subject (He/She adds s/es in simple present).',
        lessonSummaryBn: 'Verb হলো যে কোনো কাজ বা অবস্থার নাম। Verb ছাড়া বাক্য অসম্ভব। He/She এর ক্ষেত্রে ভার্বের শেষে s/es যোগ করার বিষয়টি মনে রাখুন।',
      },

      {
        id: 'cnt_4_2',
        lessonId: 'lsn_4_2',
        englishDefinition: 'We use the Present Indefinite Tense (Simple Present) to describe habits, regular daily actions, universal truths, and general facts.',
        banglaExplanation: 'যে কাজ বর্তমানে সাধারণত বা প্রতিদিন করা হয়, নিয়মিত অভ্যাস বোঝায়, অথবা কোনো চিরন্তন সত্য (যা কখনো বদলায় না) প্রকাশ করে, তাকে Present Indefinite Tense বলে। বাংলা ক্রিয়ার শেষে সাধারণত ই, অ, এ, ও ইত্যাদি থাকে (যাই, খায়, পড়ে, খেলে)।',
        sentenceStructure: 'Subject + Base Form of Verb (V1) + (s/es if 3rd person singular) + Object/Extension',
        grammarRules: [
          'Subject যদি I, We, You, They বা Plural (বহুবচন) হয়, তবে Verb-এর মূল রূপ (V1) সরাসরি বসে।',
          'Subject যদি He, She, It বা Singular (একবচন নাম) হয়, তবে Verb-এর সাথে s বা es যুক্ত হয়।',
          'যেসব Verb-এর শেষে o, ch, sh, ss, x থাকে, সেগুলোর সাথে es যুক্ত হয় (যেমন: go ➔ goes, watch ➔ watches)।',
        ],
        specialRules: [
          'Negative (না-বোধক) বাক্যের নিয়ম: Subject + do not / does not + মূল Verb (base form) + Object। দ্রষ্টব্য: does not বসলে Verb-এর s/es উঠে যায়!',
          'Interrogative (প্রশ্নবোধক) বাক্যের নিয়ম: Do / Does + Subject + মূল Verb + Object + ?',
        ],
        commonMistakes: [
          {
            wrong: 'He play cricket.',
            correct: 'He plays cricket.',
            explanationBn: 'He হলো Third Person Singular, তাই play এর সাথে s যুক্ত হয়ে plays হবে।',
          },
          {
            wrong: 'He does not plays cricket.',
            correct: 'He does not play cricket.',
            explanationBn: 'Does not ব্যবহার করলে মূল Verb-এর s/es তুলে দিতে হবে।',
          },
        ],
        examples: [
          { english: 'I drink tea every morning.', bangla: 'আমি প্রতিদিন সকালে চা খাই।', note: 'নিয়মিত অভ্যাস' },
          { english: 'The sun rises in the east.', bangla: 'সূর্য পূর্ব দিকে ওঠে।', note: 'চিরন্তন সত্য' },
          { english: 'He reads the Quran daily.', bangla: 'সে প্রতিদিন কোরআন পড়ে।' },
          { english: 'Water boils at 100 degrees Celsius.', bangla: 'পানি ১০০ ডিগ্রি সেলসিয়াসে ফোটে।', note: 'বৈজ্ঞানিক সত্য' },
        ],
        practicalExamples: [
          {
            scenario: 'Talking about daily routine',
            scenarioBn: 'দৈনন্দিন জীবন নিয়ে কথা বলা',
            dialogueEn: 'Teacher: When do you wake up? Student: I wake up at 6 AM every day.',
            dialogueBn: 'শিক্ষক: তুমি কখন ঘুম থেকে ওঠো? শিক্ষার্থী: আমি প্রতিদিন সকাল ৬টায় ঘুম থেকে উঠি।',
          },
        ],
        lessonSummary: 'Present Indefinite expresses daily routines, habits, and eternal truths. Formula: Subject + Verb(s/es) + Object. Use does not for negatives with singular subjects.',
        lessonSummaryBn: 'Present Indefinite প্রতিদিনের অভ্যাস ও চিরন্তন সত্য বোঝায়। সূত্র: Subject + Verb (s/es) + Object। He/She/It এর ক্ষেত্রে ভার্বে s/es যুক্ত হবে।',
      },

      {
        id: 'cnt_4_3',
        lessonId: 'lsn_4_3',
        englishDefinition: 'The Present Continuous Tense is used to describe an action that is happening right now at the time of speaking or currently in progress.',
        banglaExplanation: 'বর্তমানে কোনো কাজ এই মুহূর্তে চলছে বা হচ্ছে বোঝাতে Present Continuous Tense ব্যবহৃত হয়। যেমন: আমি এখন পড়ছি, সে ফুটবল খেলছে। বাংলা ক্রিয়ার শেষে তেছি, তেছে, তেছ বা চ্ছি, চ্ছে থাকে।',
        sentenceStructure: 'Subject + am/is/are + Verb-এর সাথে ing + Object',
        grammarRules: [
          'I এর সাথে am বসে।',
          'He, She, It ও Singular Subject এর সাথে is বসে।',
          'We, You, They ও Plural Subject এর সাথে are বসে।',
          'মূল Verb এর শেষে ing যোগ করতে হবে (যেমন: read + ing = reading)।',
        ],
        specialRules: [
          'অনুভূতি বা ইন্দ্রিয়গত কিছু Verb যেমন see, hear, feel, love, like সাধারণত Continuous টেন্সে ব্যবহার হয় না (যেমন: I see a bird, I am seeing a bird হবে না)।',
        ],
        commonMistakes: [
          {
            wrong: 'I reading a book now.',
            correct: 'I am reading a book now.',
            explanationBn: 'Continuous টেন্সে Helping verb (am/is/are) ছাড়া কখনোই শুধু ing verb বসে না।',
          },
          {
            wrong: 'They is playing football.',
            correct: 'They are playing football.',
            explanationBn: 'They হলো বহুবচন (Plural), তাই are বসবে।',
          },
        ],
        examples: [
          { english: 'I am learning English right now.', bangla: 'আমি এখন ইংরেজি শিখছি।' },
          { english: 'Mother is cooking dinner.', bangla: 'মা রাতের খাবার রান্না করছেন।' },
          { english: 'They are playing in the field.', bangla: 'তারা মাঠে খেলছে।' },
        ],
        practicalExamples: [
          {
            scenario: 'Phone call conversation',
            scenarioBn: 'ফোনে কথা বলার সময় কী করছেন জানানো',
            dialogueEn: 'Friend: What are you doing? You: I am solving grammar quizzes on GrammarPath!',
            dialogueBn: 'বন্ধু: তুমি কী করছ? তুমি: আমি গ্রামারপাথে গ্রামার কুইজ সমাধান করছি!',
          },
        ],
        lessonSummary: 'Formula: Subject + am/is/are + Verb+ing + Object. Used for actions happening at this very moment.',
        lessonSummaryBn: 'সূত্র: Subject + am/is/are + Verb+ing + Object। এই মুহূর্তে যা ঘটছে তা বোঝাতে এই টেন্স ব্যবহার করুন।',
      },

      {
        id: 'cnt_5_1',
        lessonId: 'lsn_5_1',
        englishDefinition: 'Articles are words (A, An, The) that define whether a noun is specific or unspecific.',
        banglaExplanation: 'A, An এবং The-কে ইংরেজিতে Articles বলে। কোনো ব্যক্তি বা বস্তুকে অনির্দিষ্ট করে বোঝাতে A বা An (Indefinite Article) এবং নির্দিষ্ট করে বোঝাতে The (Definite Article) ব্যবহৃত হয়।',
        sentenceStructure: 'A/An/The + (Adjective) + Noun (যেমন: a boy, an apple, the sun)',
        grammarRules: [
          'শব্দ যদি Consonant সাউন্ড দিয়ে শুরু হয়, তবে তার আগে A বসে (যেমন: a cat, a book)।',
          'শব্দ যদি Vowel সাউন্ড (a, e, i, o, u) দিয়ে শুরু হয়, তবে তার আগে An বসে (যেমন: an egg, an orange)।',
          'নির্দিষ্ট কোনো ব্যক্তি বা বস্তু বোঝাতে The বসে (যেমন: The boy in the blue shirt)।',
          'বিশ্বে যা একটিই আছে (যেমন: The sun, The moon, The earth) তার পূর্বে The বসে।',
        ],
        specialRules: [
          'H যদি অনুচ্চারিত থাকে তবে an বসে (যেমন: an honest man, an hour)।',
          'Vowel দিয়ে শুরু হলেও উচ্চারণ যদি "ইউ" (you) বা "ওয়া" (wa) এর মতো হয়, তবে an না বসে a বসে (যেমন: a university, a one-taka note)।',
        ],
        commonMistakes: [
          {
            wrong: 'He is a honest boy.',
            correct: 'He is an honest boy.',
            explanationBn: 'Honest শব্দের H অনুচ্চারিত থাকে, উচ্চারণ শুরু হয় ভাওয়েল সাউন্ড (অ) দিয়ে, তাই an বসবে।',
          },
          {
            wrong: 'Sun rises in the east.',
            correct: 'The sun rises in the east.',
            explanationBn: 'সূর্য পৃথিবীতে একটিই, তাই তার পূর্বে The আবশ্যক।',
          },
        ],
        examples: [
          { english: 'I have a pen and an umbrella.', bangla: 'আমার একটি কলম এবং একটি ছাতা আছে।' },
          { english: 'The Padma is a big river.', bangla: 'পদ্মা একটি বড় নদী। (নদীর নামের আগে The বসে)' },
          { english: 'He is a European.', bangla: 'তিনি একজন ইউরোপীয়। (উচ্চারণ "ইউ" তাই a European)' },
        ],
        practicalExamples: [
          {
            scenario: 'Ordering food at a counter',
            scenarioBn: 'রেস্তোরাঁয় খাবারের অর্ডার দেওয়া',
            dialogueEn: 'Customer: Can I have an apple and a sandwich, please?',
            dialogueBn: 'ক্রেতা: আমি কি একটি আপেল এবং একটি স্যান্ডউইচ পেতে পারি, দয়া করে?',
          },
        ],
        lessonSummary: 'Use A before consonant sounds, An before vowel sounds, and The for specific or unique things.',
        lessonSummaryBn: 'কনসোনেন্ট শব্দের আগে A, ভাওয়েল শব্দের আগে An এবং নির্দিষ্ট বা অনন্য জিনিসের আগে The ব্যবহার করুন।',
      },
    ];

    // Seed questions for practice and quizzes covering all question types
    const questions: Question[] = [
      // Questions for Lesson 1_1 (What is Grammar)
      {
        id: 'q_1_1_1',
        lessonId: 'lsn_1_1',
        levelId: 'lvl_1',
        type: 'mcq',
        prompt: 'How many letters are there in the English alphabet?',
        promptBn: 'ইংরেজি বর্ণমালায় মোট কয়টি বর্ণ (Letter) রয়েছে?',
        options: ['24', '25', '26', '28'],
        correctAnswer: '26',
        explanation: 'The English alphabet consists of 26 letters (A to Z).',
        explanationBn: 'ইংরেজি বর্ণমালায় মোট ২৬টি লেটার বা বর্ণ আছে (A থেকে Z)।',
      },
      {
        id: 'q_1_1_2',
        lessonId: 'lsn_1_1',
        levelId: 'lvl_1',
        type: 'fill_in_the_blank',
        prompt: 'Every English sentence must begin with a _______ letter.',
        promptBn: 'প্রতিটি ইংরেজি বাক্য অবশ্যই একটি _______ লেটার দিয়ে শুরু হতে হবে।',
        options: ['small', 'capital', 'italic', 'bold'],
        correctAnswer: 'capital',
        explanation: 'Sentences always begin with a capital letter.',
        explanationBn: 'ইংরেজি বাক্য সবসময় Capital (বড় হাতের) লেটার দিয়ে শুরু হয়।',
      },
      {
        id: 'q_1_1_3',
        lessonId: 'lsn_1_1',
        levelId: 'lvl_1',
        type: 'translate_bn_to_en',
        prompt: 'Translate to English: "আমি বই পড়ি।"',
        promptBn: '"আমি বই পড়ি।" - সঠিক ইংরেজি অনুবাদ নির্বাচন করুন:',
        options: ['I read book.', 'I read a book.', 'I a book read.', 'Me read book.'],
        correctAnswer: 'I read a book.',
        explanation: 'In English, Subject (I) + Verb (read) + Object (a book).',
        explanationBn: 'ইংরেজিতে বাক্য গঠন হলো: Subject (I) + Verb (read) + Object (a book)।',
      },

      // Questions for Lesson 1_2 (What is a Sentence)
      {
        id: 'q_1_2_1',
        lessonId: 'lsn_1_2',
        levelId: 'lvl_1',
        type: 'mcq',
        prompt: 'What is the correct order of a basic English sentence?',
        promptBn: 'মৌলিক ইংরেজি বাক্য গঠনের সঠিক ক্রম কোনটি?',
        options: [
          'Subject + Object + Verb',
          'Subject + Verb + Object',
          'Verb + Subject + Object',
          'Object + Verb + Subject',
        ],
        correctAnswer: 'Subject + Verb + Object',
        explanation: 'English basic sentence structure follows SVO (Subject + Verb + Object).',
        explanationBn: 'ইংরেজি বাক্যের সাধারণ গঠন হলো: Subject + Verb + Object (SVO)।',
      },
      {
        id: 'q_1_2_2',
        lessonId: 'lsn_1_2',
        levelId: 'lvl_1',
        type: 'choose_correct',
        prompt: 'Which of the following is a complete, correct sentence?',
        promptBn: 'নিচের কোনটি একটি অর্থপূর্ণ ও সঠিক বাক্য?',
        options: [
          'Water drink cold.',
          'They play football.',
          'Going to school he.',
          'A big tree in.',
        ],
        correctAnswer: 'They play football.',
        explanation: '"They play football" has a subject, a verb, and an object forming a complete thought.',
        explanationBn: '"They play football" বাক্যে Subject (They), Verb (play) এবং Object (football) রয়েছে এবং এটি মনের ভাব প্রকাশ করে।',
      },
      {
        id: 'q_1_2_3',
        lessonId: 'lsn_1_2',
        levelId: 'lvl_1',
        type: 'correct_sentence',
        prompt: 'Correct the sentence: "i love my country"',
        promptBn: '"i love my country" বাক্যটির ভুল সংশোধন করুন:',
        options: [
          'I love my country.',
          'i Love My country.',
          'I love my Country',
          'me love country.',
        ],
        correctAnswer: 'I love my country.',
        explanation: 'The letter "I" must be capitalized and the sentence must end with a period.',
        explanationBn: '"I" সবসময় বড় হাতের হতে হবে এবং শেষে ফুলস্টপ থাকতে হবে।',
      },

      // Questions for Lesson 2_1 (Noun)
      {
        id: 'q_2_1_1',
        lessonId: 'lsn_2_1',
        levelId: 'lvl_2',
        type: 'mcq',
        prompt: 'Identify the Noun in this sentence: "Dhaka is a beautiful city."',
        promptBn: '"Dhaka is a beautiful city." বাক্যে Noun কোনগুলো?',
        options: ['is, beautiful', 'Dhaka, city', 'a, beautiful', 'is, city'],
        correctAnswer: 'Dhaka, city',
        explanation: 'Dhaka (place name) and city (common name) are both nouns.',
        explanationBn: 'Dhaka (শহরের নাম) এবং city (সাধারণ নাম) দুটোই Noun।',
      },
      {
        id: 'q_2_1_2',
        lessonId: 'lsn_2_1',
        levelId: 'lvl_2',
        type: 'choose_correct',
        prompt: 'Which of the following is an Uncountable Noun?',
        promptBn: 'নিচের কোনটি Uncountable Noun (যা গুনে শেষ করা যায় না)?',
        options: ['Pen', 'Book', 'Water', 'Apple'],
        correctAnswer: 'Water',
        explanation: 'Water cannot be counted individually, so it is an uncountable noun.',
        explanationBn: 'Water (পানি) সরাসরি ১, ২, ৩ করে গণনা করা যায় না, তাই এটি Uncountable Noun।',
      },
      {
        id: 'q_2_1_3',
        lessonId: 'lsn_2_1',
        levelId: 'lvl_2',
        type: 'translate_en_to_bn',
        prompt: 'Translate to Bengali: "Honesty is a noble virtue."',
        promptBn: '"Honesty is a noble virtue." এর সঠিক বাংলা অর্থ কী?',
        options: [
          'সততা একটি মহৎ গুণ।',
          'সততা খুব ভালো জিনিস।',
          'সত্যবাদী হওয়া দরকার।',
          'সততা একটি সাধারণ বিষয়।',
        ],
        correctAnswer: 'সততা একটি মহৎ গুণ।',
        explanation: 'Honesty = সততা, noble virtue = মহৎ গুণ।',
        explanationBn: 'Honesty (সততা) একটি Abstract Noun।',
      },

      // Questions for Lesson 2_4 (Verb)
      {
        id: 'q_2_4_1',
        lessonId: 'lsn_2_4',
        levelId: 'lvl_2',
        type: 'mcq',
        prompt: 'Which word is the Verb in: "The boy writes a letter."',
        promptBn: '"The boy writes a letter." বাক্যে Verb কোনটি?',
        options: ['The', 'boy', 'writes', 'letter'],
        correctAnswer: 'writes',
        explanation: '"Writes" describes the action being performed.',
        explanationBn: '"Writes" (লেখে) হলো কাজ বোঝানো শব্দ, তাই এটি Verb।',
      },
      {
        id: 'q_2_4_2',
        lessonId: 'lsn_2_4',
        levelId: 'lvl_2',
        type: 'fill_in_the_blank',
        prompt: 'She _______ to school every day by bus.',
        promptBn: 'সঠিক Verb রূপটি বসান: She _______ to school every day by bus.',
        options: ['go', 'goes', 'going', 'gone'],
        correctAnswer: 'goes',
        explanation: 'With third-person singular "She", the verb "go" takes "es" to become "goes".',
        explanationBn: 'She হলো Third Person Singular, তাই go এর সাথে es যুক্ত হয়ে goes হবে।',
      },

      // Questions for Lesson 4_2 (Present Indefinite Tense)
      {
        id: 'q_4_2_1',
        lessonId: 'lsn_4_2',
        levelId: 'lvl_4',
        type: 'mcq',
        prompt: 'Choose the correct sentence in Present Indefinite Tense:',
        promptBn: 'Present Indefinite Tense-এর সঠিক বাক্য কোনটি?',
        options: [
          'He read a book.',
          'He reads a book.',
          'He is read a book.',
          'He reading a book.',
        ],
        correctAnswer: 'He reads a book.',
        explanation: 'Singular subject "He" takes "s" added to the base verb "read" (reads).',
        explanationBn: 'He হলো Third Person Singular Subject, তাই read-এর শেষে s যোগ হয়ে reads হবে।',
      },
      {
        id: 'q_4_2_2',
        lessonId: 'lsn_4_2',
        levelId: 'lvl_4',
        type: 'choose_correct',
        prompt: 'What is the correct negative form of "He plays football"?',
        promptBn: '"He plays football" এর সঠিক না-বোধক (Negative) রূপ কোনটি?',
        options: [
          'He not plays football.',
          'He does not play football.',
          'He do not play football.',
          'He does not plays football.',
        ],
        correctAnswer: 'He does not play football.',
        explanation: 'With "does not", the verb reverts to base form "play" without s.',
        explanationBn: 'Does not বসালে Verb-এর s উঠে যায়, তাই সঠিক রূপ "He does not play football"।',
      },
      {
        id: 'q_4_2_3',
        lessonId: 'lsn_4_2',
        levelId: 'lvl_4',
        type: 'translate_bn_to_en',
        prompt: 'Translate to English: "তারা প্রতিদিন স্কুলে যায়।"',
        promptBn: '"তারা প্রতিদিন স্কুলে যায়।" - সঠিক ইংরেজি অনুবাদ কোনটি?',
        options: [
          'They goes to school every day.',
          'They go to school every day.',
          'They are go to school every day.',
          'They going to school every day.',
        ],
        correctAnswer: 'They go to school every day.',
        explanation: '"They" is plural, so it uses the base verb "go" without s/es.',
        explanationBn: '"They" হলো Plural Subject, তাই Verb-এর মূল রূপ "go" বসবে (s/es বসবে না)।',
      },
      {
        id: 'q_4_2_4',
        lessonId: 'lsn_4_2',
        levelId: 'lvl_4',
        type: 'mcq',
        prompt: 'Why does "The sun rises in the east" use Present Indefinite Tense?',
        promptBn: '"The sun rises in the east" কেন Present Indefinite Tense?',
        options: [
          'It is happening only today.',
          'It is a universal truth (চিরন্তন সত্য).',
          'It is a past story.',
          'It will happen in the future.',
        ],
        correctAnswer: 'It is a universal truth (চিরন্তন সত্য).',
        explanation: 'Universal scientific truths are always expressed in Present Indefinite Tense.',
        explanationBn: 'চিরন্তন সত্য বা বৈজ্ঞানিক সত্য সবসময় Present Indefinite Tense-এ লিখতে হয়।',
      },

      // Questions for Lesson 4_3 (Present Continuous Tense)
      {
        id: 'q_4_3_1',
        lessonId: 'lsn_4_3',
        levelId: 'lvl_4',
        type: 'fill_in_the_blank',
        prompt: 'Listen! The baby _______ now.',
        promptBn: 'Listen! The baby _______ now. (সঠিক রূপ নির্বাচন করুন)',
        options: ['cries', 'is crying', 'are crying', 'was cry'],
        correctAnswer: 'is crying',
        explanation: 'For actions occurring at the present moment with singular "baby", use "is crying".',
        explanationBn: 'এখন ঘটছে এমন কাজ এবং The baby একবচন হওয়ায় "is crying" হবে।',
      },
      {
        id: 'q_4_3_2',
        lessonId: 'lsn_4_3',
        levelId: 'lvl_4',
        type: 'translate_bn_to_en',
        prompt: 'Translate to English: "আমরা এখন একটি ছবি দেখছি।"',
        promptBn: '"আমরা এখন একটি ছবি দেখছি।" - সঠিক ইংরেজি অনুবাদ নির্বাচন করুন:',
        options: [
          'We are watching a movie now.',
          'We watch a movie now.',
          'We is watching a movie now.',
          'We watching movie now.',
        ],
        correctAnswer: 'We are watching a movie now.',
        explanation: 'We + are + verb-ing + object.',
        explanationBn: 'Subject (We) + are + watching + a movie now.',
      },

      // Questions for Lesson 5_1 (Articles)
      {
        id: 'q_5_1_1',
        lessonId: 'lsn_5_1',
        levelId: 'lvl_5',
        type: 'fill_in_the_blank',
        prompt: 'Mr. Rahman is _______ honest officer.',
        promptBn: 'Mr. Rahman is _______ honest officer. (সঠিক Article নির্বাচন করুন)',
        options: ['a', 'an', 'the', 'no article'],
        correctAnswer: 'an',
        explanation: '"Honest" begins with a silent "h" and a vowel sound "o", so we use "an".',
        explanationBn: '"Honest" শব্দের H অনুচ্চারিত থাকায় ভাওয়েল সাউন্ড দিয়ে শুরু হয়, তাই "an" বসবে।',
      },
      {
        id: 'q_5_1_2',
        lessonId: 'lsn_5_1',
        levelId: 'lvl_5',
        type: 'choose_correct',
        prompt: 'Which article is used before unique things like "moon" or "sun"?',
        promptBn: 'পৃথিবীতে যা একটিই আছে যেমন moon বা sun এর পূর্বে কোন Article বসে?',
        options: ['A', 'An', 'The', 'None'],
        correctAnswer: 'The',
        explanation: 'The definite article "The" is used before unique natural bodies (The Sun, The Moon).',
        explanationBn: 'বিশ্বে যা একক ও অনন্য তার পূর্বে "The" বসে (The sun, The earth)।',
      },
      {
        id: 'q_5_1_3',
        lessonId: 'lsn_5_1',
        levelId: 'lvl_5',
        type: 'fill_in_the_blank',
        prompt: 'He studies at _______ university in Dhaka.',
        promptBn: 'He studies at _______ university in Dhaka. (সঠিক Article কোনটি?)',
        options: ['a', 'an', 'the', 'no article'],
        correctAnswer: 'a',
        explanation: 'Even though "university" starts with the vowel U, it sounds like "you", so we use "a".',
        explanationBn: 'University শব্দের U এর উচ্চারণ "ইউ" এর মতো হওয়ায় an না বসে a বসবে।',
      },
    ];

    // Seed realistic student progress and quiz attempts for Tanveer
    const lesson_progress: LessonProgress[] = [
      {
        id: 'prg_1',
        userId: 'usr_student_1',
        lessonId: 'lsn_1_1',
        isCompleted: true,
        lastStudiedAt: '2026-11-04T14:20:00.000Z',
        completedAt: '2026-11-04T14:35:00.000Z',
      },
      {
        id: 'prg_2',
        userId: 'usr_student_1',
        lessonId: 'lsn_1_2',
        isCompleted: true,
        lastStudiedAt: '2026-11-05T09:10:00.000Z',
        completedAt: '2026-11-05T09:30:00.000Z',
      },
      {
        id: 'prg_3',
        userId: 'usr_student_1',
        lessonId: 'lsn_2_1',
        isCompleted: true,
        lastStudiedAt: '2026-11-05T16:00:00.000Z',
        completedAt: '2026-11-05T16:25:00.000Z',
      },
      {
        id: 'prg_4',
        userId: 'usr_student_1',
        lessonId: 'lsn_4_2',
        isCompleted: false,
        lastStudiedAt: '2026-11-06T08:15:00.000Z',
      },
    ];

    const quiz_attempts: QuizAttempt[] = [
      {
        id: 'att_1',
        userId: 'usr_student_1',
        lessonId: 'lsn_1_1',
        levelId: 'lvl_1',
        quizTitle: 'English Grammar Basics Check',
        totalQuestions: 5,
        correctAnswers: 5,
        scorePercentage: 100,
        timeSpentSeconds: 68,
        completedAt: '2026-11-04T14:40:00.000Z',
      },
      {
        id: 'att_2',
        userId: 'usr_student_1',
        lessonId: 'lsn_2_1',
        levelId: 'lvl_2',
        quizTitle: 'Parts of Speech: Nouns Practice',
        totalQuestions: 5,
        correctAnswers: 4,
        scorePercentage: 80,
        timeSpentSeconds: 84,
        completedAt: '2026-11-05T16:30:00.000Z',
      },
    ];

    const site_settings: SiteSettings = {
      lockAdvancedLessons: false,
      siteName: 'GrammarPath',
      supportEmail: 'support@grammarpath.com',
      announcementBn: 'স্বাগতম গ্রামারপাথে! জিরো থেকে ইংরেজি ব্যাকরণ শেখার আপনার যাত্রা সফল হোক।',
    };

    return {
      users,
      courses,
      levels,
      lessons,
      lesson_contents,
      questions,
      quiz_attempts,
      lesson_progress,
      user_settings,
      admin_users,
      site_settings,
      tutor_progress: [],
    };
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return undefined;
    const { passwordHash, ...cleanUser } = user;
    return cleanUser;
  }

  public createUser(fullName: string, email: string, passwordHash: string, role: 'student' | 'admin' = 'student'): User {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newUser = {
      id,
      fullName,
      email: email.toLowerCase(),
      role,
      passwordHash,
      createdAt: now,
    };
    this.data.users.push(newUser);

    // Create default settings
    this.data.user_settings.push({
      id: `set_${id}`,
      userId: id,
      preferredLanguage: 'bilingual',
      showBanglaTranslations: true,
      dailyGoalMinutes: 20,
      updatedAt: now,
    });

    if (role === 'admin') {
      this.data.admin_users.push({
        id: `adm_${id}`,
        userId: id,
        permissions: ['all'],
        grantedBy: 'system',
        createdAt: now,
      });
    }

    this.save();
    const { passwordHash: _, ...clean } = newUser;
    return clean;
  }

  public updateUserPassword(userId: string, newPasswordHash: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    this.save();
    return true;
  }

  public getAllStudents(): (User & { completedLessons: number; quizAttempts: number; lastActive: string })[] {
    return this.data.users
      .filter(u => u.role === 'student')
      .map(u => {
        const studentProgress = this.data.lesson_progress.filter(p => p.userId === u.id && p.isCompleted);
        const studentAttempts = this.data.quiz_attempts.filter(q => q.userId === u.id);
        const latestProgress = this.data.lesson_progress
          .filter(p => p.userId === u.id)
          .sort((a, b) => new Date(b.lastStudiedAt).getTime() - new Date(a.lastStudiedAt).getTime())[0];

        const { passwordHash, ...cleanUser } = u;
        return {
          ...cleanUser,
          completedLessons: studentProgress.length,
          quizAttempts: studentAttempts.length,
          lastActive: latestProgress ? latestProgress.lastStudiedAt : u.createdAt,
        };
      });
  }

  // --- Levels & Courses ---
  public getCourses(userId?: string): Course[] {
    const completedLessonIds = new Set(
      userId ? this.data.lesson_progress.filter(p => p.userId === userId && p.isCompleted).map(p => p.lessonId) : []
    );

    return this.data.courses
      .sort((a, b) => a.levelOrder - b.levelOrder)
      .map(course => {
        const courseLessons = this.data.lessons.filter(l => l.levelId === course.levelId && l.isPublished);
        const total = courseLessons.length;
        const completed = courseLessons.filter(l => completedLessonIds.has(l.id)).length;
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          ...course,
          totalLessons: total,
          completedLessons: completed,
          progressPercentage,
        };
      });
  }

  public getCourseById(idOrSlug: string, userId?: string): (Course & { lessons: Lesson[]; level?: Level }) | undefined {
    const course = this.data.courses.find(c => c.id === idOrSlug || c.slug === idOrSlug);
    if (!course) return undefined;

    const completedLessonIds = new Set(
      userId ? this.data.lesson_progress.filter(p => p.userId === userId && p.isCompleted).map(p => p.lessonId) : []
    );

    const lessons = this.data.lessons
      .filter(l => l.levelId === course.levelId && l.isPublished)
      .sort((a, b) => a.lessonOrder - b.lessonOrder)
      .map(l => ({
        ...l,
        isCompleted: completedLessonIds.has(l.id),
      }));

    const total = lessons.length;
    const completed = lessons.filter(l => l.isCompleted).length;
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const level = this.data.levels.find(l => l.id === course.levelId);

    return {
      ...course,
      totalLessons: total,
      completedLessons: completed,
      progressPercentage,
      lessons,
      level,
    };
  }

  public getLevels(userId?: string): Level[] {
    const completedLessonIds = new Set(
      userId ? this.data.lesson_progress.filter(p => p.userId === userId && p.isCompleted).map(p => p.lessonId) : []
    );

    return this.data.levels
      .sort((a, b) => a.levelNumber - b.levelNumber)
      .map(lvl => {
        const lvlLessons = this.data.lessons.filter(l => l.levelId === lvl.id && l.isPublished);
        const total = lvlLessons.length;
        const completed = lvlLessons.filter(l => completedLessonIds.has(l.id)).length;
        return {
          ...lvl,
          totalLessons: total,
          completedLessons: completed,
        };
      });
  }

  public getLevelById(id: string): Level | undefined {
    return this.data.levels.find(l => l.id === id);
  }

  public createLevel(data: Omit<Level, 'id'>): Level {
    const id = `lvl_${Date.now()}`;
    const newLevel: Level = { id, ...data };
    this.data.levels.push(newLevel);
    this.save();
    return newLevel;
  }

  public updateLevel(id: string, updates: Partial<Level>): Level | undefined {
    const idx = this.data.levels.findIndex(l => l.id === id);
    if (idx === -1) return undefined;
    this.data.levels[idx] = { ...this.data.levels[idx], ...updates };
    this.save();
    return this.data.levels[idx];
  }

  // --- Lessons & Contents ---
  public getLessonsByLevel(levelId: string, userId?: string, includeUnpublished = false): Lesson[] {
    const completedLessonIds = new Set(
      userId ? this.data.lesson_progress.filter(p => p.userId === userId && p.isCompleted).map(p => p.lessonId) : []
    );

    return this.data.lessons
      .filter(l => l.levelId === levelId && (includeUnpublished || l.isPublished))
      .sort((a, b) => a.lessonOrder - b.lessonOrder)
      .map(l => ({
        ...l,
        isCompleted: completedLessonIds.has(l.id),
      }));
  }

  public getLessonById(id: string, userId?: string): Lesson | undefined {
    const lesson = this.data.lessons.find(l => l.id === id || l.slug === id);
    if (!lesson) return undefined;

    const content = this.data.lesson_contents.find(c => c.lessonId === lesson.id);
    const level = this.data.levels.find(lvl => lvl.id === lesson.levelId);

    let isCompleted = false;
    if (userId) {
      const prog = this.data.lesson_progress.find(p => p.userId === userId && p.lessonId === lesson.id);
      isCompleted = prog?.isCompleted ?? false;
    }

    return {
      ...lesson,
      levelNumber: level?.levelNumber,
      content,
      isCompleted,
    };
  }

  public createLesson(lessonData: Omit<Lesson, 'id' | 'createdAt'>, contentData?: Omit<LessonContent, 'id' | 'lessonId'>): Lesson {
    const id = `lsn_${Date.now()}`;
    const newLesson: Lesson = {
      id,
      ...lessonData,
      createdAt: new Date().toISOString(),
    };
    this.data.lessons.push(newLesson);

    if (contentData) {
      const contentId = `cnt_${Date.now()}`;
      const newContent: LessonContent = {
        id: contentId,
        lessonId: id,
        ...contentData,
      };
      this.data.lesson_contents.push(newContent);
      newLesson.content = newContent;
    }

    this.save();
    return newLesson;
  }

  public updateLesson(id: string, lessonUpdates: Partial<Lesson>, contentUpdates?: Partial<LessonContent>): Lesson | undefined {
    const idx = this.data.lessons.findIndex(l => l.id === id);
    if (idx === -1) return undefined;

    this.data.lessons[idx] = { ...this.data.lessons[idx], ...lessonUpdates };

    if (contentUpdates) {
      const cIdx = this.data.lesson_contents.findIndex(c => c.lessonId === id);
      if (cIdx !== -1) {
        this.data.lesson_contents[cIdx] = { ...this.data.lesson_contents[cIdx], ...contentUpdates };
      } else {
        this.data.lesson_contents.push({
          id: `cnt_${Date.now()}`,
          lessonId: id,
          englishDefinition: '',
          banglaExplanation: '',
          sentenceStructure: '',
          grammarRules: [],
          specialRules: [],
          commonMistakes: [],
          examples: [],
          practicalExamples: [],
          lessonSummary: '',
          lessonSummaryBn: '',
          ...contentUpdates,
        });
      }
    }

    this.save();
    return this.getLessonById(id);
  }

  public deleteLesson(id: string): boolean {
    const initialLen = this.data.lessons.length;
    this.data.lessons = this.data.lessons.filter(l => l.id !== id);
    this.data.lesson_contents = this.data.lesson_contents.filter(c => c.lessonId !== id);
    this.data.questions = this.data.questions.filter(q => q.lessonId !== id);
    this.data.lesson_progress = this.data.lesson_progress.filter(p => p.lessonId !== id);
    this.save();
    return this.data.lessons.length < initialLen;
  }

  public toggleLessonPublish(id: string): boolean {
    const lesson = this.data.lessons.find(l => l.id === id);
    if (!lesson) return false;
    lesson.isPublished = !lesson.isPublished;
    this.save();
    return lesson.isPublished;
  }

  // --- Progress Tracking ---
  public recordLessonProgress(userId: string, lessonId: string, markCompleted = true): LessonProgress {
    const now = new Date().toISOString();
    let prog = this.data.lesson_progress.find(p => p.userId === userId && p.lessonId === lessonId);

    if (prog) {
      prog.lastStudiedAt = now;
      if (markCompleted) {
        prog.isCompleted = true;
        prog.completedAt = prog.completedAt || now;
      }
    } else {
      prog = {
        id: `prg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId,
        lessonId,
        isCompleted: markCompleted,
        lastStudiedAt: now,
        completedAt: markCompleted ? now : undefined,
      };
      this.data.lesson_progress.push(prog);
    }

    this.save();
    return prog;
  }

  // --- Questions & Quizzes ---
  public getQuestionsByLesson(lessonId: string): Question[] {
    return this.data.questions.filter(q => q.lessonId === lessonId);
  }

  public getQuestionsForQuiz(levelId?: string, lessonId?: string, count = 10): Question[] {
    let pool = this.data.questions;
    if (lessonId) {
      pool = pool.filter(q => q.lessonId === lessonId);
    } else if (levelId && levelId !== 'all') {
      pool = pool.filter(q => q.levelId === levelId);
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  public createQuestion(q: Omit<Question, 'id'>): Question {
    const id = `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newQuestion: Question = { id, ...q };
    this.data.questions.push(newQuestion);
    this.save();
    return newQuestion;
  }

  public updateQuestion(id: string, updates: Partial<Question>): Question | undefined {
    const idx = this.data.questions.findIndex(q => q.id === id);
    if (idx === -1) return undefined;
    this.data.questions[idx] = { ...this.data.questions[idx], ...updates };
    this.save();
    return this.data.questions[idx];
  }

  public deleteQuestion(id: string): boolean {
    const initialLen = this.data.questions.length;
    this.data.questions = this.data.questions.filter(q => q.id !== id);
    this.save();
    return this.data.questions.length < initialLen;
  }

  public recordQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): QuizAttempt {
    const id = `att_${Date.now()}`;
    const newAttempt: QuizAttempt = {
      id,
      ...attempt,
      completedAt: new Date().toISOString(),
    };
    this.data.quiz_attempts.push(newAttempt);
    this.save();
    return newAttempt;
  }

  public getUserQuizAttempts(userId: string): QuizAttempt[] {
    return this.data.quiz_attempts
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  // --- Real Stats & Dashboard Aggregates ---
  public getPublicStats() {
    const publishedLessons = this.data.lessons.filter(l => l.isPublished);
    const totalStudents = this.data.users.filter(u => u.role === 'student').length;
    const totalQuizzesTaken = this.data.quiz_attempts.length;

    let averageMasteryRate = 85;
    if (totalQuizzesTaken > 0) {
      const sum = this.data.quiz_attempts.reduce((acc, q) => acc + q.scorePercentage, 0);
      averageMasteryRate = Math.round(sum / totalQuizzesTaken);
    }

    return {
      totalStudents,
      totalLessons: publishedLessons.length,
      totalQuizzesTaken,
      averageMasteryRate,
    };
  }

  public getDashboardSummary(userId: string) {
    const user = this.findUserById(userId);
    if (!user) return null;

    const publishedLessons = this.data.lessons.filter(l => l.isPublished);
    const userProgress = this.data.lesson_progress.filter(p => p.userId === userId);
    const completedProgress = userProgress.filter(p => p.isCompleted);
    const completedSet = new Set(completedProgress.map(p => p.lessonId));

    const totalLessons = publishedLessons.length;
    const completedLessons = completedProgress.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Recently studied
    const recentlyStudied = userProgress
      .sort((a, b) => new Date(b.lastStudiedAt).getTime() - new Date(a.lastStudiedAt).getTime())
      .slice(0, 4)
      .map(p => {
        const lsn = this.data.lessons.find(l => l.id === p.lessonId);
        return lsn ? { ...lsn, isCompleted: p.isCompleted, lastStudiedAt: p.lastStudiedAt } : null;
      })
      .filter(Boolean) as (Lesson & { lastStudiedAt: string })[];

    // Continue lesson (latest incomplete or latest studied)
    let continueLesson: Lesson | null = null;
    if (recentlyStudied.length > 0) {
      const activeRecent = recentlyStudied.find(l => !l.isCompleted) || recentlyStudied[0];
      continueLesson = this.getLessonById(activeRecent.id, userId) || null;
    }
    if (!continueLesson && publishedLessons.length > 0) {
      const firstIncomplete = publishedLessons.find(l => !completedSet.has(l.id)) || publishedLessons[0];
      continueLesson = this.getLessonById(firstIncomplete.id, userId) || null;
    }

    // Recommended next lessons
    const recommendedNextLessons = publishedLessons
      .filter(l => !completedSet.has(l.id) && l.id !== continueLesson?.id)
      .slice(0, 3)
      .map(l => ({ ...l, isCompleted: false }));

    // Current level
    const currentLevelId = continueLesson?.levelId || 'lvl_1';
    const currentLevel = this.data.levels.find(l => l.id === currentLevelId) || this.data.levels[0];

    // Quiz performance & real milestone counts
    const userAttempts = this.getUserQuizAttempts(userId);
    const quizzesTaken = userAttempts.length;
    const avgQuizScore = quizzesTaken > 0
      ? Math.round(userAttempts.reduce((acc, q) => acc + q.scorePercentage, 0) / quizzesTaken)
      : 0;
    const questionsAnswered = userAttempts.reduce((acc, q) => acc + (q.totalQuestions || 0), 0);
    const perfectQuizzes = userAttempts.filter(q => q.scorePercentage === 100).length;

    // Distinct active study days from lesson progress and quiz attempts
    const activeDays = new Set<string>();
    userProgress.forEach(p => {
      if (p.lastStudiedAt) activeDays.add(p.lastStudiedAt.slice(0, 10));
      if (p.completedAt) activeDays.add(p.completedAt.slice(0, 10));
    });
    userAttempts.forEach(a => {
      if (a.completedAt) activeDays.add(a.completedAt.slice(0, 10));
    });
    const studyStreakDays = activeDays.size;

    return {
      user,
      totalLessons,
      completedLessons,
      progressPercentage,
      currentLevel,
      continueLesson,
      recommendedNextLessons,
      recentlyStudiedLessons: recentlyStudied,
      recentQuizAttempts: userAttempts.slice(0, 5),
      stats: {
        quizzesTaken,
        avgQuizScore,
        studyStreakDays,
        questionsAnswered,
        perfectQuizzes,
      },
    };
  }

  // --- Site Settings ---
  public getSiteSettings(): SiteSettings {
    return this.data.site_settings;
  }

  public updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.data.site_settings = { ...this.data.site_settings, ...settings };
    this.save();
    return this.data.site_settings;
  }

  // --- AI Grammar Teacher Progress Tracking ---
  public getTutorProgress(userId: string): TutorProgressState {
    if (!this.data.tutor_progress) {
      this.data.tutor_progress = [];
    }
    let existing = this.data.tutor_progress.find(tp => tp.userId === userId);
    if (!existing) {
      existing = {
        userId,
        currentPhase: 'phase_0',
        currentPartOfSpeech: 'Pre-Grammar Foundation',
        currentLessonSlug: 'what-is-english-grammar',
        currentLevel: 'beginner',
        completedLessons: [],
        lessonRecords: [],
        weakTopics: [],
        masteredTopics: [],
        recommendedNextLessonSlug: 'what-is-english-grammar',
        updatedAt: new Date().toISOString(),
      };
      this.data.tutor_progress.push(existing);
      this.save();
    }
    return existing;
  }

  public recordTutorEvaluation(params: {
    userId: string;
    lessonSlug: string;
    level: TutorDifficultyLevel;
    mode: 'practice' | 'mini_test';
    scorePercentage: number;
    totalQuestions: number;
    correctCount: number;
  }): TutorProgressState {
    const progress = this.getTutorProgress(params.userId);
    const meta = getCurriculumLesson(params.lessonSlug);
    const title = meta?.title || params.lessonSlug;
    const partOfSpeech = meta?.partOfSpeech || 'Grammar';
    const now = new Date().toISOString();

    if (meta) {
      progress.currentPhase = meta.phase;
      progress.currentPartOfSpeech = meta.partOfSpeech;
    }
    progress.currentLessonSlug = params.lessonSlug;
    progress.currentLevel = params.level;

    // Update lesson record
    let record = progress.lessonRecords.find(
      r => r.lessonSlug === params.lessonSlug && r.level === params.level
    );
    const isMasteredNow = params.mode === 'mini_test' && params.scorePercentage >= 80;

    if (!record) {
      record = {
        lessonSlug: params.lessonSlug,
        title,
        partOfSpeech,
        level: params.level,
        bestScore: params.scorePercentage,
        attempts: 1,
        isMastered: isMasteredNow,
        lastStudiedAt: now,
      };
      progress.lessonRecords.push(record);
    } else {
      record.bestScore = Math.max(record.bestScore, params.scorePercentage);
      record.attempts += 1;
      record.isMastered = record.isMastered || isMasteredNow;
      record.lastStudiedAt = now;
    }

    // Track weak vs mastered topics based on real scores
    if (params.scorePercentage < 60) {
      if (!progress.weakTopics.includes(title)) {
        progress.weakTopics.push(title);
      }
      progress.recommendedNextLessonSlug = params.lessonSlug;
    } else if (isMasteredNow) {
      progress.weakTopics = progress.weakTopics.filter(t => t !== title);
      if (!progress.masteredTopics.includes(title)) {
        progress.masteredTopics.push(title);
      }
      if (!progress.completedLessons.includes(params.lessonSlug)) {
        progress.completedLessons.push(params.lessonSlug);
      }
      progress.recommendedNextLessonSlug = getNextCurriculumLessonSlug(params.lessonSlug);
    } else {
      progress.recommendedNextLessonSlug = params.lessonSlug;
    }

    // Also log into quiz_attempts if it's a mini_test so Badges & Dashboard stay synced!
    if (params.mode === 'mini_test') {
      this.data.quiz_attempts.push({
        id: `att_ai_${Date.now()}`,
        userId: params.userId,
        quizTitle: `Guided Lesson Mini Test: ${title} (${params.level})`,
        totalQuestions: params.totalQuestions,
        correctAnswers: params.correctCount,
        scorePercentage: params.scorePercentage,
        timeSpentSeconds: 90,
        completedAt: now,
      });
    }

    progress.updatedAt = now;
    this.save();
    return progress;
  }
}

export const db = new RelationalDatabase();
