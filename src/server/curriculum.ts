import {
  TutorCurriculumLesson,
  TutorStructuredLesson,
  TutorDifficultyLevel,
} from '../types/index.ts';

export const TUTOR_CURRICULUM: TutorCurriculumLesson[] = [
  // =========================================================================
  // PHASE 0: PRE-GRAMMAR FOUNDATION
  // =========================================================================
  {
    slug: 'what-is-english-grammar',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 1,
    title: 'Lesson 1: What is English Grammar?',
    titleBn: 'ইংরেজি ব্যাকরণ (English Grammar) কী?',
    summaryBn: 'ব্যাকরণ কী, কেন জরুরি এবং সঠিক বনাম ভুল বাক্যের পার্থক্য।',
    subtopics: ['Definition of Grammar', 'Why Grammar Matters', 'Correct vs Incorrect Sentences'],
    availableLevels: ['beginner'],
  },
  {
    slug: 'letter-and-alphabet',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 2,
    title: 'Lesson 2: What is a Letter and Alphabet?',
    titleBn: 'বর্ণ (Letter) ও বর্ণমালা (Alphabet) কী?',
    summaryBn: '২৬টি ইংরেজি বর্ণ, Capital ও Small letter এবং Vowel-Consonant পরিচয়।',
    subtopics: ['26 Letters', 'Capital vs Small', 'Vowels (A, E, I, O, U) & Consonants'],
    availableLevels: ['beginner'],
  },
  {
    slug: 'what-is-a-word',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 3,
    title: 'Lesson 3: What is a Word?',
    titleBn: 'শব্দ (Word) কাকে বলে?',
    summaryBn: 'বর্ণ মিলে কীভাবে অর্থপূর্ণ শব্দ তৈরি হয় এবং অর্থহীন বর্ণগুচ্ছের পার্থক্য।',
    subtopics: ['Meaningful Letter Groups', 'Everyday Vocabulary', 'Word Building'],
    availableLevels: ['beginner'],
  },
  {
    slug: 'basic-english-vocabulary',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 4,
    title: 'Lesson 4: Basic English Vocabulary',
    titleBn: 'দৈনন্দিন প্রয়োজনীয় ইংরেজি শব্দভাণ্ডার',
    summaryBn: 'পরিবার, স্কুল, খাবার, প্রাণী ও কাজের সাধারণ ইংরেজি শব্দ শেখা।',
    subtopics: ['Family & Home Words', 'School & Book Words', 'Common Action Words'],
    availableLevels: ['beginner'],
  },
  {
    slug: 'what-is-a-sentence',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 5,
    title: 'Lesson 5: What is a Sentence?',
    titleBn: 'বাক্য (Sentence) কাকে বলে?',
    summaryBn: 'সম্পূর্ণ মনের ভাব প্রকাশ করে এমন শব্দগুচ্ছ এবং বড় হাতের অক্ষর ও ফুল-স্টপের নিয়ম।',
    subtopics: ['Complete Thought', 'Capital Letter & Full Stop', 'Word vs Sentence'],
    availableLevels: ['beginner'],
  },
  {
    slug: 'word-vs-sentence',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 6,
    title: 'Lesson 6: Difference Between a Word and a Sentence',
    titleBn: 'শব্দ (Word) ও বাক্য (Sentence)-এর পার্থক্য',
    summaryBn: 'একটি একা শব্দ আর পূর্ণাঙ্গ বাক্যের মধ্যে স্পষ্ট তুলনা।',
    subtopics: ['Single Meaning vs Complete Thought', 'Sentence Transformation'],
    availableLevels: ['beginner'],
  },
  {
    slug: 'what-is-a-subject',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 7,
    title: 'Lesson 7: What is a Subject?',
    titleBn: 'বাক্যের কর্তা (Subject) কী?',
    summaryBn: 'বাক্যে যার সম্পর্কে কথা বলা হয় বা যে কাজটি করে তাকে চেনার সহজ উপায়।',
    subtopics: ['Who does the action', 'Finding Subject with Who/What'],
    availableLevels: ['beginner'],
  },
  {
    slug: 'what-is-a-predicate',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 8,
    title: 'Lesson 8: What is a Predicate?',
    titleBn: 'বিধেয় (Predicate) কী?',
    summaryBn: 'Subject সম্পর্কে যা বলা হয় তা-ই Predicate — Verb থেকে বাক্যের বাকি অংশ চেনা।',
    subtopics: ['Subject + Predicate Split', 'Action & Information Part'],
    availableLevels: ['beginner'],
  },
  {
    slug: 'basic-sentence-reading',
    phase: 'phase_0',
    partOfSpeech: 'Pre-Grammar Foundation',
    partOfSpeechBn: 'প্রাথমিক ভিত্তি',
    order: 9,
    title: 'Lesson 9: Basic Sentence Reading & Understanding',
    titleBn: 'সহজ ইংরেজি বাক্য পড়া ও অর্থ বোঝা',
    summaryBn: 'ছোট ছোট ইংরেজি বাক্য পড়ে তার বাংলা অর্থ ও Subject-Predicate আলাদা করা।',
    subtopics: ['Reading Short Sentences', 'Word-by-Word Understanding'],
    availableLevels: ['beginner', 'intermediate'],
  },

  // =========================================================================
  // PHASE 1: PARTS OF SPEECH — BASIC TO ADVANCED
  // =========================================================================
  {
    slug: 'noun-introduction',
    phase: 'phase_1',
    partOfSpeech: 'Noun',
    partOfSpeechBn: 'বিশেষ্য (Noun)',
    order: 10,
    title: 'Noun: Definition, Identification & Types',
    titleBn: 'Noun (বিশেষ্য): সংজ্ঞা, চেনার উপায় ও প্রকারভেদ',
    summaryBn: 'ব্যক্তি, বস্তু, স্থান ও গুণের নাম; Common, Proper, Collective, Material ও Abstract Noun।',
    subtopics: [
      'Definition & Identification',
      'Common & Proper Noun',
      'Collective, Material & Abstract Noun',
      'Countable & Uncountable',
      'Singular & Plural, Gender, Possessive Nouns',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    slug: 'noun-number-gender-possessive',
    phase: 'phase_1',
    partOfSpeech: 'Noun',
    partOfSpeechBn: 'বিশেষ্য (Noun)',
    order: 11,
    title: 'Noun: Countable, Singular/Plural, Gender & Possessive',
    titleBn: 'Noun-এর বচন, লিঙ্গ, গণনা ও অধিকারবোধক রূপ',
    summaryBn: 'Countable vs Uncountable, Singular থেকে Plural করার নিয়ম, Gender ও Apostrophe-s।',
    subtopics: ['Countable & Uncountable', 'Singular & Plural Rules', 'Gender', 'Possessive Nouns', 'Noun Formation'],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    slug: 'pronoun-mastery',
    phase: 'phase_1',
    partOfSpeech: 'Pronoun',
    partOfSpeechBn: 'সর্বনাম (Pronoun)',
    order: 12,
    title: 'Pronoun: Definition, Personal, Subject/Object & Possessive',
    titleBn: 'Pronoun (সর্বনাম): নামের পরিবর্তে বসা শব্দ ও প্রকারভেদ',
    summaryBn: 'Personal, Subject/Object, Reflexive, Emphatic, Demonstrative, Interrogative, Relative, Indefinite ও Antecedent agreement।',
    subtopics: [
      'Personal, Subject & Object Pronouns',
      'Possessive Pronouns vs Possessive Adjectives',
      'Reflexive & Emphatic Pronouns',
      'Demonstrative, Interrogative & Relative Pronouns',
      'Indefinite, Distributive, Reciprocal & Antecedent Agreement',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    slug: 'adjective-mastery',
    phase: 'phase_1',
    partOfSpeech: 'Adjective',
    partOfSpeechBn: 'বিশেষণ (Adjective)',
    order: 13,
    title: 'Adjective: Quality, Quantity, Number & Degrees of Comparison',
    titleBn: 'Adjective (বিশেষণ): দোষ-গুণ-সংখ্যা ও তুলনার ডিগ্রি',
    summaryBn: 'Quality, Quantity, Number, Demonstrative/Possessive/Interrogative/Distributive Adjective ও Positive-Comparative-Superlative।',
    subtopics: [
      'Adjective of Quality, Quantity & Number',
      'Demonstrative, Possessive, Interrogative & Distributive Adjectives',
      'Positive, Comparative & Superlative Degrees',
      'Regular & Irregular Comparison + Order of Adjectives',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    slug: 'verb-mastery',
    phase: 'phase_1',
    partOfSpeech: 'Verb',
    partOfSpeechBn: 'ক্রিয়া (Verb)',
    order: 14,
    title: 'Verb: Main, Helping, Modal, Transitive & Verb Forms (V1–V5)',
    titleBn: 'Verb (ক্রিয়া): মূল ক্রিয়া, সাহায্যকারী ক্রিয়া ও রূপসমূহ',
    summaryBn: 'Action, Linking, Main, Helping/Auxiliary, Modal, Transitive/Intransitive, Finite/Non-finite, V1-V5 এবং Subject-Verb Agreement।',
    subtopics: [
      'Main, Helping, Auxiliary & Modal Verbs',
      'Action vs Linking & Transitive vs Intransitive',
      'Regular vs Irregular & Finite vs Non-finite',
      'V1, V2, V3, V4, V5 Forms & Subject-Verb Agreement',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    slug: 'adverb-mastery',
    phase: 'phase_1',
    partOfSpeech: 'Adverb',
    partOfSpeechBn: 'ক্রিয়া-বিশেষণ (Adverb)',
    order: 15,
    title: 'Adverb: Manner, Time, Place, Frequency & Adjective vs Adverb',
    titleBn: 'Adverb (ক্রিয়া-বিশেষণ): প্রকারভেদ, অবস্থান ও Adjective-এর সাথে পার্থক্য',
    summaryBn: 'Manner, Time, Place, Frequency, Degree, Reason, Interrogative ও Relative Adverb।',
    subtopics: [
      'Adverb of Manner, Time & Place',
      'Adverb of Frequency, Degree & Reason',
      'Interrogative & Relative Adverbs',
      'Position of Adverbs & Adjective vs Adverb',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    slug: 'preposition-mastery',
    phase: 'phase_1',
    partOfSpeech: 'Preposition',
    partOfSpeechBn: 'পদান্বয়ী অব্যয় (Preposition)',
    order: 16,
    title: 'Preposition: Time, Place, Direction, In/On/At & Usage',
    titleBn: 'Preposition: সময়, স্থান, দিক ও In/On/At-এর সঠিক ব্যবহার',
    summaryBn: 'In, On, At, By, With, From, To, For, Of এবং Appropriate Prepositions।',
    subtopics: [
      'Time, Place, Direction & Movement',
      'Agent & Instrument (By vs With)',
      'In, On, At & By, With, From, To, For, Of',
      'Prepositional Phrases & Appropriate Prepositions',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    slug: 'conjunction-mastery',
    phase: 'phase_1',
    partOfSpeech: 'Conjunction',
    partOfSpeechBn: 'সংযোজক অব্যয় (Conjunction)',
    order: 17,
    title: 'Conjunction: Coordinating, Subordinating & Correlative',
    titleBn: 'Conjunction (সংযোজক অব্যয়): শব্দ ও বাক্য জোড়া লাগানোর নিয়ম',
    summaryBn: 'And, But, Or, Because, Although, If, Unless এবং তিন প্রকার Conjunction।',
    subtopics: [
      'Coordinating Conjunctions (FANBOYS)',
      'Subordinating Conjunctions (Because, Although, If, Unless)',
      'Correlative Conjunctions (Either...or, Neither...nor)',
      'Joining Words and Sentences cleanly',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    slug: 'interjection-mastery',
    phase: 'phase_1',
    partOfSpeech: 'Interjection',
    partOfSpeechBn: 'আবেগসূচক অব্যয় (Interjection)',
    order: 18,
    title: 'Interjection: Emotions, Expressions & Punctuation (!)',
    titleBn: 'Interjection: আনন্দ, দুঃখ ও বিস্ময়ের প্রকাশ ও বিরামচিহ্ন',
    summaryBn: 'Joy, Sorrow, Surprise, Approval, Greeting ও Attention প্রকাশক শব্দ এবং (!) ব্যবহার।',
    subtopics: [
      'Joy, Sorrow & Surprise',
      'Approval, Greeting & Attention',
      'Exclamation Mark (!) & Comma Usage',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },

  // =========================================================================
  // PHASE 2: COMPLETE REVISION & EXAM PREPARATION
  // =========================================================================
  {
    slug: 'full-pos-revision-exam',
    phase: 'phase_2_exams',
    partOfSpeech: 'Revision & Exams',
    partOfSpeechBn: 'পুনরালোচনা ও পরীক্ষা',
    order: 19,
    title: 'Complete Parts of Speech Revision & Comprehensive Exam',
    titleBn: '৮ প্রকার Parts of Speech সম্পূর্ণ পুনরালোচনা ও পরীক্ষা',
    summaryBn: 'মিশ্র বাক্য বিশ্লেষণ, কাছাকাছি পদের তুলনা এবং Beginner, Intermediate ও Advanced পরীক্ষা।',
    subtopics: [
      'Comparison Between Similar Categories',
      'Mixed Sentence Identification Analysis',
      'Comprehensive Level Examination',
    ],
    availableLevels: ['beginner', 'intermediate', 'advanced'],
  },
];

export function getCurriculumLesson(slug: string): TutorCurriculumLesson | undefined {
  return TUTOR_CURRICULUM.find(l => l.slug === slug);
}

export function getNextCurriculumLessonSlug(currentSlug: string): string {
  const idx = TUTOR_CURRICULUM.findIndex(l => l.slug === currentSlug);
  if (idx >= 0 && idx + 1 < TUTOR_CURRICULUM.length) {
    return TUTOR_CURRICULUM[idx + 1].slug;
  }
  return TUTOR_CURRICULUM[0].slug;
}

/**
 * Deterministic, ultra-gentle 13-step starter lesson for Phase 0 Lesson 1 ("What is English Grammar?")
 * and clean fallback builder so zero-level students always get immediate, accurate instruction.
 */
export function getStarterStructuredLesson(
  slug: string,
  level: TutorDifficultyLevel = 'beginner'
): TutorStructuredLesson | null {
  if (slug === 'what-is-english-grammar') {
    return {
      slug: 'what-is-english-grammar',
      phase: 'phase_0',
      partOfSpeech: 'Pre-Grammar Foundation',
      title: 'Lesson 1: What is English Grammar?',
      titleBn: 'ইংরেজি ব্যাকরণ (English Grammar) কী?',
      level: 'beginner',
      generatedByAi: false,
      step1_introBn:
        'স্বাগতম প্রিয় শিক্ষার্থী! ইংরেজি ব্যাকরণ নিয়ে একদম ভয় পাবেন না। আজ আমরা শূন্য (Zero) থেকে শুরু করছি। ভাবুন তো, আপনি যদি ক্রিকেট বা ফুটবল খেলতে চান, তবে খেলার কয়েকটি সহজ নিয়ম জানতে হয়—তাই না? ঠিক তেমনি, ইংরেজি সঠিকভাবে পড়তে, লিখতে ও বলতে যে সহজ নিয়মগুলো মানতে হয়, তাকেই English Grammar বলে।',
      step2_definitionEn:
        'English Grammar is the set of simple rules that helps us put words in the right order to make clear and meaningful English sentences.',
      step2_definitionBn:
        'সহজ বাংলায়: যে নিয়মকানুন মেনে চললে আমরা ইংরেজি শব্দগুলোকে সঠিক জায়গায় বসিয়ে শুদ্ধ ও অর্থপূর্ণ বাক্য তৈরি করতে পারি, তাকেই ইংরেজি ব্যাকরণ (English Grammar) বলে। এখানে "set of rules" মানে নিয়মের সমষ্টি, আর "right order" মানে সঠিক ধারাবাহিকতা।',
      step3_everydayExamplesBn: [
        'ঘরে খাবার রান্নার সময় যেমন লবণ, তেল ও মসলা সঠিক নিয়মে দিতে হয়, নইলে খাবার মজা হয় না; বাক্য তৈরিতেও শব্দের সঠিক নিয়ম হলো Grammar।',
        'স্কুলের লাইনে দাঁড়াতে হলে ছোট থেকে বড় সারিবদ্ধ হয়ে দাঁড়াতে হয়—বাক্যের শব্দগুলোকেও ঠিক সেভাবে সাজাতে হয়।',
        'বন্ধুদের সাথে কথা বলার সময় "আমি ভাত খাই" না বলে যদি বলি "খাই আমি ভাত", শুনতে অদ্ভুত লাগে। ইংরেজিতেও সঠিক সাজানোই হলো Grammar।',
      ],
      step4_englishExamples: [
        {
          english: 'I eat rice.',
          highlightedWord: 'I eat rice.',
          banglaMeaning: 'আমি ভাত খাই।',
          reasonBn: 'এখানে প্রথমে কাজ করা ব্যক্তি (I), তারপর কাজ (eat), শেষে বস্তু (rice) বসেছে—তাই এটি শুদ্ধ বাক্য।',
        },
        {
          english: 'Rice eat I. (ভুল)',
          highlightedWord: 'Rice eat I.',
          banglaMeaning: 'অর্থ এলোমেলো (ভুল ক্রম)',
          reasonBn: 'শব্দগুলো এলোমেলো থাকায় এটি ব্যাকরণ অনুযায়ী সঠিক ইংরেজি বাক্য হয়নি।',
        },
        {
          english: 'She reads a book.',
          highlightedWord: 'reads',
          banglaMeaning: 'সে একটি বই পড়ে।',
          reasonBn: 'She (একজন) বোঝানোয় verb-এর সাথে s যোগ হয়ে reads হয়েছে—এটাই Grammar-এর নিয়ম।',
        },
        {
          english: 'We love our family.',
          highlightedWord: 'love',
          banglaMeaning: 'আমরা আমাদের পরিবারকে ভালোবাসি।',
          reasonBn: 'We (অনেকজন) থাকায় মূল শব্দ love বসেছে এবং বাক্যটি সম্পূর্ণ অর্থ দিচ্ছে।',
        },
        {
          english: 'The cat drinks milk.',
          highlightedWord: 'milk',
          banglaMeaning: 'বিড়ালটি দুধ পান করে।',
          reasonBn: 'প্রতিটি শব্দ সঠিক স্থানে বসাতে সহজ একটি বাস্তব বাক্য তৈরি হয়েছে।',
        },
      ],
      step5_identificationTrickBn:
        'কোনো ইংরেজি বাক্য ব্যাকরণ মেনে তৈরি হয়েছে কি না তা বুঝতে ২টি সহজ প্রশ্ন করুন: (১) কে কাজটি করছে সে কি প্রথমে আছে? (২) বাক্যটি পড়ে কি পরিষ্কার একটি সম্পূর্ণ অর্থ পাওয়া যাচ্ছে?',
      step5_contextWarningBn:
        'মনে রাখবেন: শুধু ইংরেজি শব্দের অর্থ জানলেই হবে না, শব্দটি বাক্যের কোন জায়গায় এবং কী কাজে বসছে তা দেখা জরুরি। একই শব্দ ভিন্ন বাক্যে ভিন্ন ভূমিকা পালন করতে পারে।',
      step6_importantRulesBn: [
        'নিয়ম ১: ইংরেজি সাধারণ বাক্যে প্রথমে Subject (যে কাজ করে) এবং তার পরেই Verb (কাজ) বসে।',
        'নিয়ম ২: প্রতিটি ইংরেজি বাক্যের প্রথম অক্ষর সবসময় বড় হাতের (Capital Letter) হয়।',
        'নিয়ম ৩: সাধারণ বর্ণনামূলক বাক্যের শেষে একটি ফুল-স্টপ (.) বসাতে হয়।',
      ],
      step7_sentenceExamples: [
        {
          english: 'Rahim goes to school.',
          bangla: 'রহিম স্কুলে যায়।',
          explanationBn: 'Rahim শুরুতে Capital letter, goes কাজ বোঝাচ্ছে এবং শেষে (.) আছে।',
        },
        {
          english: 'My mother cooks food.',
          bangla: 'আমার মা খাবার রান্না করেন।',
          explanationBn: 'পরিচিত দৈনন্দিন কাজের শুদ্ধ গঠন: কে (My mother) + কী করেন (cooks) + কী (food)।',
        },
        {
          english: 'Birds fly in the sky.',
          bangla: 'পাখিরা আকাশে ওড়ে।',
          explanationBn: 'অর্থপূর্ণ ও শুদ্ধ ক্রম মেনে তৈরি বাক্য।',
        },
        {
          english: 'This is my pen.',
          bangla: 'এটি আমার কলম।',
          explanationBn: 'ছোট ও সহজ পরিচিতি বাক্য, যেখানে কোনো এলোমেলো শব্দ নেই।',
        },
        {
          english: 'I am a student.',
          bangla: 'আমি একজন ছাত্র/ছাত্রী।',
          explanationBn: 'I-এর সাথে সবসময় am বসে—এটি ব্যাকরণের একটি মৌলিক নিয়ম।',
        },
      ],
      step8_commonMistakes: [
        {
          wrong: 'I rice eat.',
          correct: 'I eat rice.',
          whyBn: 'বাংলায় ক্রিয়া (খাই) শেষে বসে বলে অনেকে ইংরেজিতেও Verb শেষে বসিয়ে ফেলেন। ইংরেজিতে Verb-টি Subject-এর ঠিক পরে বসে।',
        },
        {
          wrong: 'i am happy',
          correct: 'I am happy.',
          whyBn: 'বাক্যের শুরুতে ছোট হাতের "i" হয়েছে এবং শেষে ফুল-স্টপ (.) বাদ পড়েছে।',
        },
        {
          wrong: 'He go to home.',
          correct: 'He goes home.',
          whyBn: 'He একা একজন বোঝায়, তাই বর্তমান কালে go না হয়ে goes হবে এবং home-এর আগে সাধারণত to বসে না।',
        },
      ],
      step9_quickRevisionBn: [
        '১. English Grammar হলো শুদ্ধভাবে ইংরেজি পড়া, লেখা ও বলার সহজ নিয়ম।',
        '২. শব্দ এলোমেলো করে বসালে অর্থ পরিষ্কার হয় না।',
        '৩. ইংরেজি বাক্যে সাধারণত প্রথমে কর্তা (Subject), তারপর কাজ (Verb) বসে।',
        '৪. বাক্য শুরু হয় Capital Letter দিয়ে এবং শেষ হয় (.) বা (?) দিয়ে।',
      ],
      step10_practiceQuestions: [
        {
          id: 'p0_l1_q1',
          format: 'mcq',
          promptEn: 'Which sentence is grammatically correct?',
          promptBn: 'নিচের কোন বাক্যটি গ্রামারের নিয়ম অনুযায়ী সঠিক?',
          options: ['I eat rice.', 'Rice eat I.', 'I rice eat.', 'eat I rice.'],
          correctAnswer: 'I eat rice.',
          hintBn: 'প্রথমে যে কাজ করে (I), তারপর কাজ (eat), শেষে বস্তু (rice) বসবে।',
          explanationBn: 'সঠিক উত্তর "I eat rice." — কারণ এখানে Subject (I) + Verb (eat) + Object (rice) সঠিক ক্রমে আছে এবং Capital letter ও ফুল-স্টপ রয়েছে।',
        },
        {
          id: 'p0_l1_q2',
          format: 'correct_sentence',
          promptEn: 'Arrange and correct this sentence: "school / goes / to / she"',
          promptBn: 'সঠিক ক্রমে ও শুদ্ধভাবে বাক্যটি লিখুন: "school / goes / to / she"',
          options: [
            'She goes to school.',
            'School goes to she.',
            'she to school goes.',
            'Goes she to school.',
          ],
          correctAnswer: 'She goes to school.',
          hintBn: 'She দিয়ে শুরু করুন এবং শেষে ফুল-স্টপ দিন।',
          explanationBn: '"She goes to school." সঠিক, কারণ বাক্যের শুরুতে Capital S এবং Subject + Verb ক্রম মানা হয়েছে।',
        },
        {
          id: 'p0_l1_q3',
          format: 'true_false',
          promptEn: 'True or False: Every English sentence should start with a Capital Letter.',
          promptBn: 'সত্য না মিথ্যা: প্রতিটি ইংরেজি বাক্য বড় হাতের অক্ষর (Capital Letter) দিয়ে শুরু হওয়া উচিত।',
          options: ['True (সত্য)', 'False (মিথ্যা)'],
          correctAnswer: 'True (সত্য)',
          hintBn: 'নিয়ম ২ মনে করে দেখুন!',
          explanationBn: 'সত্য (True)! ইংরেজি ব্যাকরণ অনুযায়ী প্রতিটি বাক্যের প্রথম অক্ষর Capital Letter হয়।',
        },
      ],
      step11_miniTestQuestions: [
        {
          id: 'p0_l1_m1',
          format: 'mcq',
          promptEn: 'What does English Grammar teach us?',
          promptBn: 'English Grammar আমাদের কী শেখায়?',
          options: [
            'Rules to make correct and meaningful sentences',
            'Only math formulas',
            'Random meaningless words',
            'How to draw pictures',
          ],
          correctAnswer: 'Rules to make correct and meaningful sentences',
          explanationBn: 'English Grammar আমাদের শব্দকে সঠিক ক্রমে সাজিয়ে শুদ্ধ ও অর্থপূর্ণ বাক্য তৈরি করতে শেখায়।',
        },
        {
          id: 'p0_l1_m2',
          format: 'mcq',
          promptEn: 'Choose the correct English sentence for "আমি একজন ছাত্র।":',
          promptBn: '"আমি একজন ছাত্র।" এর সঠিক ইংরেজি বাক্য কোনটি?',
          options: ['I am a student.', 'I student am a.', 'am I a student.', 'i am student'],
          correctAnswer: 'I am a student.',
          explanationBn: '"I am a student." সঠিক কারণ এটি Capital letter দিয়ে শুরু, সঠিক ক্রমে সাজানো এবং শেষে ফুল-স্টপ রয়েছে।',
        },
        {
          id: 'p0_l1_m3',
          format: 'find_mistake',
          promptEn: 'Find what is wrong in: "books read I."',
          promptBn: '"books read I." বাক্যটিতে কী ভুল আছে?',
          options: [
            'Word order is wrong and first letter is small',
            'No mistake at all',
            'The word "books" is misspelled',
            'There should be no full stop',
          ],
          correctAnswer: 'Word order is wrong and first letter is small',
          explanationBn: 'সঠিক রূপ হবে "I read books." — এখানে শব্দের ক্রম ভুল ছিল এবং প্রথম অক্ষর ছোট হাতের ছিল।',
        },
        {
          id: 'p0_l1_m4',
          format: 'fill_in_the_blank',
          promptEn: 'Complete the sentence in the right order: "The cat ___ milk."',
          promptBn: 'শূন্যস্থানে সঠিক শব্দ বসিয়ে বাক্যটি সম্পূর্ণ করুন: "The cat ___ milk."',
          options: ['drinks', 'sky', 'pen', 'table'],
          correctAnswer: 'drinks',
          explanationBn: 'Subject "The cat"-এর পরে কাজ বোঝাতে Verb "drinks" বসলে অর্থ হয় "বিড়ালটি দুধ পান করে।"',
        },
        {
          id: 'p0_l1_m5',
          format: 'true_false',
          promptEn: 'True or False: In English, the verb usually comes after the subject (e.g., "I eat").',
          promptBn: 'সত্য না মিথ্যা: সাধারণ ইংরেজি বাক্যে কাজ (Verb) সাধারণত কর্তার (Subject) পরে বসে।',
          options: ['True (সত্য)', 'False (মিথ্যা)'],
          correctAnswer: 'True (সত্য)',
          explanationBn: 'সত্য! ইংরেজিতে "I eat" (আমি খাই) গঠনে প্রথমে Subject (I) ও পরে Verb (eat) বসে।',
        },
      ],
    };
  }

  return null;
}
