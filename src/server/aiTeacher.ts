import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import {
  TutorCurriculumLesson,
  TutorDifficultyLevel,
  TutorStructuredLesson,
  TutorQuestion,
  TutorEvaluationResult,
  TutorEvaluationDetail,
  SentenceAnalysisResult,
  TutorChatMessage,
  TutorProgressState,
} from '../types/index.ts';
import { getStarterStructuredLesson } from './curriculum.ts';

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const GRAMMARPATH_SYSTEM_PROMPT = `You are GrammarPath Personal Tutor, an expert English Grammar instructor, curriculum designer, and friendly personal tutor for Bengali-speaking students who know little or no English grammar. Never mention AI models, prompts, or automated generation—speak naturally as a dedicated Bengali-English grammar teacher.

STRICT TEACHING STYLE & RULES:
- Explain every concept primarily in simple, natural Bengali.
- Use simple English examples with Bengali meanings.
- Explain difficult English words in Bengali.
- Use short sentences and familiar everyday examples (school, home, family, friends, books, food, animals).
- Be warm, patient, encouraging, and respectful. Never call a student weak, lazy, or unintelligent.
- Avoid unnecessary academic jargon. Teach one concept at a time.
- Explain word function in sentence context because the same word can act as different Parts of Speech in different contexts.
- Never fabricate grammar rules. Keep examples natural and accurate.
- For Level 1 (beginner): ultra-simple definitions, very easy words, short sentences, easy identification.
- For Level 2 (intermediate): more detailed rules, classifications, medium-length sentences, identification in context.
- For Level 3 (advanced): complex sentence analysis, exceptions, similar-looking structures, exam-oriented practice (labeled as practice).`;

// In-memory cache for standard lessons so repeated loads are instant
const lessonCache = new Map<string, TutorStructuredLesson>();

export async function generateStructuredLesson(
  lessonMeta: TutorCurriculumLesson,
  level: TutorDifficultyLevel,
  options?: { simpler?: boolean; weakTopics?: string[] }
): Promise<TutorStructuredLesson> {
  const cacheKey = `${lessonMeta.slug}::${level}`;
  if (!options?.simpler && lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey)!;
  }

  // Always offer fast deterministic zero-level lesson if beginner Lesson 1 and not requesting AI simpler variant
  if (!options?.simpler && lessonMeta.slug === 'what-is-english-grammar' && level === 'beginner') {
    const starter = getStarterStructuredLesson(lessonMeta.slug, level);
    if (starter) return starter;
  }

  const ai = getAiClient();
  if (!ai) {
    // Graceful fallback to starter lesson if available, else return clean Bengali notice
    const starter = getStarterStructuredLesson(lessonMeta.slug, level);
    if (starter) return starter;
    console.warn('[GrammarPath Tutor] Tutor credentials unavailable for dynamic lesson generation.');
    throw new Error(
      'দুঃখিত, এই পাঠের বিস্তারিত গাইড এই মুহূর্তে লোড করা সম্ভব হচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
    );
  }

  const levelGuidance =
    level === 'beginner'
      ? 'LEVEL 1 — BEGINNER: Use very easy definitions, simple Bengali, basic everyday words, short sentences, and easy questions.'
      : level === 'intermediate'
      ? 'LEVEL 2 — INTERMEDIATE: Teach detailed rules, classifications, medium sentences, and contextual identification.'
      : 'LEVEL 3 — ADVANCED: Teach complex sentence analysis, exception rules, similar-looking structures, and exam-oriented practice questions.';

  const simplerPrompt = options?.simpler
    ? '\nIMPORTANT: The student struggled earlier. Use EVEN SIMPLER Bengali, shorter everyday sentences, and extra clear step-by-step examples!'
    : '';

  const weakPrompt =
    options?.weakTopics && options.weakTopics.length > 0
      ? `\nStudent weak areas to reinforce gently: ${options.weakTopics.join(', ')}.`
      : '';

  const prompt = `Create a complete 13-Step GrammarPath lesson for:
Topic: ${lessonMeta.title} (${lessonMeta.titleBn})
Phase: ${lessonMeta.phase}
Category / Part of Speech: ${lessonMeta.partOfSpeech} (${lessonMeta.partOfSpeechBn})
Subtopics to cover appropriately for this level: ${lessonMeta.subtopics.join(', ')}
${levelGuidance}${simplerPrompt}${weakPrompt}

Requirements:
- step1_introBn: Warm, encouraging Bengali welcome explaining what this topic is and why it helps the student.
- step2_definitionEn: Clear standard English definition.
- step2_definitionBn: Very simple Bengali translation & word-by-word explanation of the English definition.
- step3_everydayExamplesBn: 3 everyday Bengali analogies/examples from home, school, family, food, or animals.
- step4_englishExamples: 5 beginner-friendly English examples with highlightedWord, banglaMeaning, and reasonBn.
- step5_identificationTrickBn: Practical trick in Bengali to identify this grammar point in any sentence.
- step5_contextWarningBn: Clear Bengali reminder that context determines a word's grammatical role.
- step6_importantRulesBn: 3 to 5 clear rules in simple Bengali, easiest first.
- step7_sentenceExamples: 5 complete English sentences with bangla translation and explanationBn.
- step8_commonMistakes: 3 common mistakes Bengali learners make (wrong, correct, whyBn).
- step9_quickRevisionBn: 4 to 6 short summary revision points in Bengali.
- step10_practiceQuestions: Exactly 4 varied practice questions based ONLY on what was taught in Steps 1-9. Mix formats from: mcq, fill_in_the_blank, identify_pos, correct_sentence, true_false, translate_bn_to_en, create_sentence, find_mistake. For MCQ/true_false/identify_pos/correct_sentence/find_mistake include 2-4 options. For translate_bn_to_en or create_sentence, omit options (or pass empty array) so the student writes their own answer. Include hintBn and explanationBn.
- step11_miniTestQuestions: Exactly 5 Mini Test questions to verify understanding (never repeat exact practice questions). Include 4 options for MCQ-style questions and clear explanationBn.`;

  const questionSchema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      format: {
        type: Type.STRING,
        description:
          'One of: mcq, fill_in_the_blank, identify_pos, correct_sentence, true_false, translate_bn_to_en, create_sentence, find_mistake',
      },
      promptEn: { type: Type.STRING },
      promptBn: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      correctAnswer: { type: Type.STRING },
      hintBn: { type: Type.STRING },
      explanationBn: { type: Type.STRING },
    },
    required: ['id', 'format', 'promptEn', 'promptBn', 'correctAnswer', 'explanationBn'],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: prompt,
    config: {
      systemInstruction: GRAMMARPATH_SYSTEM_PROMPT,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          step1_introBn: { type: Type.STRING },
          step2_definitionEn: { type: Type.STRING },
          step2_definitionBn: { type: Type.STRING },
          step3_everydayExamplesBn: { type: Type.ARRAY, items: { type: Type.STRING } },
          step4_englishExamples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                highlightedWord: { type: Type.STRING },
                banglaMeaning: { type: Type.STRING },
                reasonBn: { type: Type.STRING },
              },
              required: ['english', 'highlightedWord', 'banglaMeaning', 'reasonBn'],
            },
          },
          step5_identificationTrickBn: { type: Type.STRING },
          step5_contextWarningBn: { type: Type.STRING },
          step6_importantRulesBn: { type: Type.ARRAY, items: { type: Type.STRING } },
          step7_sentenceExamples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                bangla: { type: Type.STRING },
                explanationBn: { type: Type.STRING },
              },
              required: ['english', 'bangla', 'explanationBn'],
            },
          },
          step8_commonMistakes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                wrong: { type: Type.STRING },
                correct: { type: Type.STRING },
                whyBn: { type: Type.STRING },
              },
              required: ['wrong', 'correct', 'whyBn'],
            },
          },
          step9_quickRevisionBn: { type: Type.ARRAY, items: { type: Type.STRING } },
          step10_practiceQuestions: { type: Type.ARRAY, items: questionSchema },
          step11_miniTestQuestions: { type: Type.ARRAY, items: questionSchema },
        },
        required: [
          'step1_introBn',
          'step2_definitionEn',
          'step2_definitionBn',
          'step3_everydayExamplesBn',
          'step4_englishExamples',
          'step5_identificationTrickBn',
          'step5_contextWarningBn',
          'step6_importantRulesBn',
          'step7_sentenceExamples',
          'step8_commonMistakes',
          'step9_quickRevisionBn',
          'step10_practiceQuestions',
          'step11_miniTestQuestions',
        ],
      },
    },
  });

  const parsed = JSON.parse((response.text ?? '{}').trim());

  const structured: TutorStructuredLesson = {
    slug: lessonMeta.slug,
    phase: lessonMeta.phase,
    partOfSpeech: lessonMeta.partOfSpeech,
    title: lessonMeta.title,
    titleBn: lessonMeta.titleBn,
    level,
    generatedByAi: true,
    step1_introBn: parsed.step1_introBn,
    step2_definitionEn: parsed.step2_definitionEn,
    step2_definitionBn: parsed.step2_definitionBn,
    step3_everydayExamplesBn: parsed.step3_everydayExamplesBn || [],
    step4_englishExamples: parsed.step4_englishExamples || [],
    step5_identificationTrickBn: parsed.step5_identificationTrickBn,
    step5_contextWarningBn: parsed.step5_contextWarningBn,
    step6_importantRulesBn: parsed.step6_importantRulesBn || [],
    step7_sentenceExamples: parsed.step7_sentenceExamples || [],
    step8_commonMistakes: parsed.step8_commonMistakes || [],
    step9_quickRevisionBn: parsed.step9_quickRevisionBn || [],
    step10_practiceQuestions: (parsed.step10_practiceQuestions || []).map((q: TutorQuestion, idx: number) => ({
      ...q,
      id: q.id || `${lessonMeta.slug}_${level}_p_${idx + 1}`,
      options: q.options && q.options.length > 0 ? q.options : undefined,
    })),
    step11_miniTestQuestions: (parsed.step11_miniTestQuestions || []).map((q: TutorQuestion, idx: number) => ({
      ...q,
      id: q.id || `${lessonMeta.slug}_${level}_m_${idx + 1}`,
      options: q.options && q.options.length > 0 ? q.options : undefined,
    })),
  };

  if (!options?.simpler) {
    lessonCache.set(cacheKey, structured);
  }
  return structured;
}

export async function evaluateTutorAnswers(params: {
  mode: 'practice' | 'mini_test';
  lessonSlug: string;
  level: TutorDifficultyLevel;
  questions: TutorQuestion[];
  userAnswers: { questionId: string; answer: string }[];
}): Promise<Omit<TutorEvaluationResult, 'progressSaved' | 'updatedProgress'>> {
  const { mode, lessonSlug, level, questions, userAnswers } = params;

  const answerMap = new Map<string, string>();
  userAnswers.forEach(ua => answerMap.set(ua.questionId, (ua.answer || '').trim()));

  // Separate open-ended questions (like create_sentence or translate without options) for AI evaluation
  const openEndedItems: { q: TutorQuestion; userAns: string }[] = [];
  const detailMap = new Map<string, TutorEvaluationDetail>();

  for (const q of questions) {
    const userAns = answerMap.get(q.id) || '';
    const isOpenEnded =
      q.format === 'create_sentence' ||
      (q.format === 'translate_bn_to_en' && (!q.options || q.options.length === 0)) ||
      (!q.options && userAns.length > 0 && q.correctAnswer.trim().toLowerCase() !== userAns.toLowerCase());

    if (isOpenEnded && userAns.length > 0) {
      openEndedItems.push({ q, userAns });
    } else {
      const normalizedUser = userAns.replace(/\s+/g, ' ').trim().toLowerCase();
      const normalizedCorrect = q.correctAnswer.replace(/\s+/g, ' ').trim().toLowerCase();
      const isCorrect = normalizedUser.length > 0 && normalizedUser === normalizedCorrect;

      detailMap.set(q.id, {
        questionId: q.id,
        promptEn: q.promptEn,
        userAnswer: userAns || '(উত্তর দেওয়া হয়নি)',
        correctAnswer: q.correctAnswer,
        isCorrect,
        feedbackBn: isCorrect
          ? `দারুণ! সঠিক উত্তর। ${q.explanationBn}`
          : `সঠিক উত্তর হলো "${q.correctAnswer}"। ${q.explanationBn}`,
      });
    }
  }

  // Evaluate open-ended student sentences/translations with Gemini AI if present
  if (openEndedItems.length > 0) {
    const ai = getAiClient();
    if (ai) {
      try {
        const evalPrompt = `Evaluate these beginner English grammar student answers gently in simple Bengali.
Accept valid equivalent English translations or grammatically sound sentences that follow the prompt.
Items:
${openEndedItems
  .map(
    (item, idx) =>
      `${idx + 1}. id="${item.q.id}", format="${item.q.format}", promptEn="${item.q.promptEn}", promptBn="${item.q.promptBn}", referenceAnswer="${item.q.correctAnswer}", studentAnswer="${item.userAns}"`
  )
  .join('\n')}`;

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: evalPrompt,
          config: {
            systemInstruction: GRAMMARPATH_SYSTEM_PROMPT,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN },
                  feedbackBn: { type: Type.STRING },
                },
                required: ['questionId', 'isCorrect', 'feedbackBn'],
              },
            },
          },
        });

        const evaluated: { questionId: string; isCorrect: boolean; feedbackBn: string }[] = JSON.parse(
          (response.text ?? '[]').trim()
        );
        evaluated.forEach(ev => {
          const matched = openEndedItems.find(o => o.q.id === ev.questionId);
          if (matched) {
            detailMap.set(ev.questionId, {
              questionId: ev.questionId,
              promptEn: matched.q.promptEn,
              userAnswer: matched.userAns,
              correctAnswer: matched.q.correctAnswer,
              isCorrect: ev.isCorrect,
              feedbackBn: ev.feedbackBn,
            });
          }
        });
      } catch (err) {
        console.warn('AI open-ended evaluation fallback used:', err);
      }
    }

    // Fallback for any open-ended items still unresolved
    for (const item of openEndedItems) {
      if (!detailMap.has(item.q.id)) {
        const cleanUser = item.userAns.replace(/[.!?]/g, '').trim().toLowerCase();
        const cleanRef = item.q.correctAnswer.replace(/[.!?]/g, '').trim().toLowerCase();
        const isCorrect =
          item.q.format === 'create_sentence' ? cleanUser.split(/\s+/).length >= 2 : cleanUser === cleanRef;
        detailMap.set(item.q.id, {
          questionId: item.q.id,
          promptEn: item.q.promptEn,
          userAnswer: item.userAns,
          correctAnswer: item.q.correctAnswer,
          isCorrect,
          feedbackBn: isCorrect
            ? `চমৎকার চেষ্টা! ${item.q.explanationBn}`
            : `নমুনা সঠিক উত্তর: "${item.q.correctAnswer}"। ${item.q.explanationBn}`,
        });
      }
    }
  }

  const details = questions.map(
    q =>
      detailMap.get(q.id) || {
        questionId: q.id,
        promptEn: q.promptEn,
        userAnswer: '(উত্তর দেওয়া হয়নি)',
        correctAnswer: q.correctAnswer,
        isCorrect: false,
        feedbackBn: q.explanationBn,
      }
  );

  const totalQuestions = details.length;
  const correctCount = details.filter(d => d.isCorrect).length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  let masteryBand: 'reteach' | 'weak_practice' | 'revision_needed' | 'mastered' = 'mastered';
  let encouragementBn = '';
  let adaptiveActionBn = '';

  if (scorePercentage < 40) {
    masteryBand = 'reteach';
    encouragementBn = 'একদম চিন্তা করবেন না! শুরুতে এমন ভুল হওয়া খুবই স্বাভাবিক। আপনি চেষ্টা করেছেন সেটাই সবচেয়ে বড় কথা।';
    adaptiveActionBn =
      'অ্যাডাপ্টিভ পরামর্শ (<৪০%): আসুন বিষয়টি আবার একদম সহজ বাংলায় প্রথম থেকে উদাহরণসহ পড়ি, তারপর আবার চেষ্টা করব।';
  } else if (scorePercentage < 60) {
    masteryBand = 'weak_practice';
    encouragementBn = 'ভালো চেষ্টা করেছেন! কিছু বিষয় আপনার বোঝা হয়েছে, আর মাত্র কয়েকটি জায়গা একটু ঝালিয়ে নিতে হবে।';
    adaptiveActionBn =
      'অ্যাডাপ্টিভ পরামর্শ (৪০–৫৯%): ভুল হওয়া প্রশ্নগুলোর ব্যাখ্যা মনোযোগ দিয়ে দেখে আরও কয়েকটি সহজ অনুশীলন সমাধান করুন।';
  } else if (scorePercentage < 80) {
    masteryBand = 'revision_needed';
    encouragementBn = 'দারুণ অগ্রগতি! আপনি মূল ধারণাটি বেশ ভালোভাবে ধরতে পেরেছেন।';
    adaptiveActionBn =
      'অ্যাডাপ্টিভ পরামর্শ (৬০–৭৯%): Quick Revision অংশটি একবার চোখ বুলিয়ে আরেকটি ছোট টেস্ট দিন যেন ৮০%+ আত্মবিশ্বাস আসে।';
  } else {
    masteryBand = 'mastered';
    encouragementBn = 'অসাধারণ! অভিনন্দন! আপনি অত্যন্ত সুন্দরভাবে এই লেসনটি আয়ত্ত করেছেন।';
    adaptiveActionBn =
      'অ্যাডাপ্টিভ পরামর্শ (৮০–১০০%): আপনি এখন পরবর্তী লেসন বা পরের ধাপে (Level) যাওয়ার জন্য সম্পূর্ণ প্রস্তুত!';
  }

  const lessonCompleted = mode === 'mini_test' && scorePercentage >= 80;

  return {
    mode,
    lessonSlug,
    level,
    totalQuestions,
    correctCount,
    scorePercentage,
    masteryBand,
    encouragementBn,
    adaptiveActionBn,
    lessonCompleted,
    details,
  };
}

export async function identifySentencePartsOfSpeech(sentence: string): Promise<SentenceAnalysisResult> {
  const trimmed = sentence.trim();

  // Instant built-in accurate breakdown for the classic teaching example
  if (trimmed.toLowerCase().replace(/[.!?]/g, '') === 'rahim reads a good book') {
    return {
      sentence: 'Rahim reads a good book.',
      translationBn: 'রহিম একটি ভালো বই পড়ে।',
      summaryBn:
        'এই বাক্যে প্রতিটি শব্দের নিজস্ব একটি কাজ আছে। মুখস্থ নয়, বাক্যের ভেতর শব্দটি কী কাজ করছে তা দেখে পদ চিনতে হয়।',
      contextNoteBn:
        'লক্ষ্য করুন: এখানে "book" একটি বস্তুর নাম তাই Noun; কিন্তু যদি বলি "I book a ticket", তখন "book" মানে সংরক্ষণ করা বা কাজ—তাই তখন সেটি Verb হবে!',
      words: [
        {
          word: 'Rahim',
          partOfSpeech: 'Noun',
          partOfSpeechBn: 'বিশেষ্য (Proper Noun)',
          roleInSentenceBn: 'একজন ব্যক্তির নাম এবং বাক্যের কর্তা (Subject)।',
        },
        {
          word: 'reads',
          partOfSpeech: 'Verb',
          partOfSpeechBn: 'ক্রিয়া (Main Verb)',
          roleInSentenceBn: 'রহিম কী কাজ করছে ("পড়া") তা বোঝাচ্ছে।',
        },
        {
          word: 'a',
          partOfSpeech: 'Article / Adjective',
          partOfSpeechBn: 'নির্দেশক বিশেষণ (Determiner)',
          roleInSentenceBn: '"একটি" বই নির্দিষ্ট করে সংখ্যা বোঝাচ্ছে।',
        },
        {
          word: 'good',
          partOfSpeech: 'Adjective',
          partOfSpeechBn: 'বিশেষণ (Adjective)',
          roleInSentenceBn: 'বইটি কেমন ("ভালো") তা বর্ণনা করছে।',
        },
        {
          word: 'book',
          partOfSpeech: 'Noun',
          partOfSpeechBn: 'বিশেষ্য (Common Noun)',
          roleInSentenceBn: 'একটি বস্তুর নাম বোঝাচ্ছে।',
        },
      ],
    };
  }

  const ai = getAiClient();
  if (!ai) {
    console.warn('[GrammarPath Tutor] Tutor credentials unavailable for dynamic sentence analysis.');
    throw new Error(
      'বাক্য বিশ্লেষণ সেবাটি এই মুহূর্তে ব্যস্ত রয়েছে। অনুগ্রহ করে উদাহরণ হিসেবে "Rahim reads a good book." লিখে চেষ্টা করুন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।'
    );
  }

  const prompt = `Analyze every word of this English sentence for a Bengali beginner student:
Sentence: "${trimmed}"

Explain each word's Part of Speech and its exact FUNCTION in this sentence context in simple Bengali.
Also explain in contextNoteBn how one of these words could act as a different Part of Speech in another sentence.`;

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: prompt,
    config: {
      systemInstruction: GRAMMARPATH_SYSTEM_PROMPT,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentence: { type: Type.STRING },
          translationBn: { type: Type.STRING },
          summaryBn: { type: Type.STRING },
          contextNoteBn: { type: Type.STRING },
          words: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                partOfSpeech: { type: Type.STRING },
                partOfSpeechBn: { type: Type.STRING },
                roleInSentenceBn: { type: Type.STRING },
              },
              required: ['word', 'partOfSpeech', 'partOfSpeechBn', 'roleInSentenceBn'],
            },
          },
        },
        required: ['sentence', 'translationBn', 'summaryBn', 'contextNoteBn', 'words'],
      },
    },
  });

  return JSON.parse((response.text ?? '{}').trim()) as SentenceAnalysisResult;
}

export async function chatWithAiTeacher(params: {
  message: string;
  history: TutorChatMessage[];
  currentLessonTitle?: string;
  progress?: TutorProgressState | null;
}): Promise<string> {
  const ai = getAiClient();
  if (!ai) {
    console.warn('[GrammarPath Tutor] Tutor credentials unavailable for tutor chat.');
    throw new Error(
      'পার্সোনাল টিউটর সেবায় এই মুহূর্তে সংযোগ পাওয়া যাচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
    );
  }

  const progressContext = params.progress
    ? `Student Progress Context:
- Current Phase: ${params.progress.currentPhase}
- Current Part of Speech: ${params.progress.currentPartOfSpeech}
- Current Lesson: ${params.progress.currentLessonSlug} (Level: ${params.progress.currentLevel})
- Completed Lessons Count: ${params.progress.completedLessons.length}
- Weak Topics: ${params.progress.weakTopics.join(', ') || 'None recorded yet'}
- Mastered Topics: ${params.progress.masteredTopics.join(', ') || 'None yet'}`
    : 'Student is a beginner learner (guest or just starting).';

  const recentHistory = params.history
    .slice(-8)
    .map(m => `${m.role === 'user' ? 'Student' : 'GrammarPath Tutor'}: ${m.text}`)
    .join('\n');

  const fullPrompt = `${progressContext}
Active Lesson in UI: ${params.currentLessonTitle || 'Lesson 1: What is English Grammar?'}

Conversation so far:
${recentHistory}

Student's new message:
"${params.message}"

Respond as GrammarPath Personal Tutor in warm, patient, simple Bengali with clear English examples (and Bengali meanings).
If the student wrote an English sentence to practice, gently praise the effort, correct any mistakes politely, and explain WHY in simple Bengali.
If the student asks for an answer to an active Mini Test before submitting, gently remind them to submit first and offer a helpful hint instead.
Never claim progress was saved unless the website application confirms it.`;

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: fullPrompt,
    config: {
      systemInstruction: GRAMMARPATH_SYSTEM_PROMPT,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });

  return response.text || 'দুঃখিত, এই মুহূর্তে উত্তর তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
}
