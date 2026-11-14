import React, { useState } from 'react';
import { PremiumRulebookIcon } from '../components/PremiumIcons.tsx';

export function RulebookPage() {
  const [filter, setFilter] = useState('all');

  const formulas = [
    {
      category: 'tense',
      title: 'Present Indefinite Tense',
      titleBn: 'সাধারণ বর্তমান কাল',
      formula: 'Subject + Base Form of Verb (V1) + (s/es if 3rd person singular) + Object',
      examples: 'I play football. / He reads a book.',
      ruleBn: 'নিয়মিত অভ্যাস ও চিরন্তন সত্য বোঝাতে ব্যবহৃত হয়। He/She/It এর ক্ষেত্রে ভার্বের সাথে s/es যোগ হবে।',
    },
    {
      category: 'tense',
      title: 'Present Continuous Tense',
      titleBn: 'ঘটমান বর্তমান কাল',
      formula: 'Subject + am/is/are + Verb-ing + Object',
      examples: 'I am learning English. / They are playing.',
      ruleBn: 'বর্তমানে যে কাজটি এই মুহূর্তে চলছে তা বোঝাতে ব্যবহৃত হয়।',
    },
    {
      category: 'tense',
      title: 'Present Perfect Tense',
      titleBn: 'পুরাঘটিত বর্তমান কাল',
      formula: 'Subject + have/has + Past Participle of Verb (V3) + Object',
      examples: 'I have done my homework. / She has gone home.',
      ruleBn: 'কাজটি কিছুক্ষণ আগে শেষ হয়েছে কিন্তু তার ফল এখনো বর্তমান রয়েছে।',
    },
    {
      category: 'tense',
      title: 'Past Indefinite Tense',
      titleBn: 'সাধারণ অতীত কাল',
      formula: 'Subject + Past Form of Verb (V2) + Object',
      examples: 'I went to school yesterday. / They played well.',
      ruleBn: 'অতীতে কোনো কাজ সাধারণভাবে ঘটেছিল বোঝালে Past Indefinite হয়।',
    },
    {
      category: 'tense',
      title: 'Future Indefinite Tense',
      titleBn: 'সাধারণ ভবিষ্যৎ কাল',
      formula: 'Subject + will/shall + Base Form of Verb (V1) + Object',
      examples: 'I will learn grammar. / We will visit Dhaka.',
      ruleBn: 'ভবিষ্যতে কোনো কাজ সাধারণভাবে হবে বোঝালে Future Indefinite হয়।',
    },
    {
      category: 'sentence',
      title: 'Negative Sentence Structure',
      titleBn: 'না-বোধক বাক্য গঠনের নিয়ম',
      formula: 'Subject + do not / does not / did not + Base Verb + Object',
      examples: 'He does not play cricket. / I do not eat meat.',
      ruleBn: 'Does not ব্যবহার করলে মূল Verb-এর সাথে s/es তুলে দিতে হয়।',
    },
    {
      category: 'sentence',
      title: 'Interrogative Question Structure',
      titleBn: 'প্রশ্নবোধক বাক্য গঠনের নিয়ম',
      formula: 'Do / Does / Did + Subject + Base Verb + Object + ?',
      examples: 'Do you speak English? / Does he read daily?',
      ruleBn: 'প্রশ্ন তৈরি করতে সাহায্যকারী ক্রিয়াটিকে Subject এর পূর্বে নিয়ে আসতে হয়।',
    },
    {
      category: 'articles',
      title: 'Articles (A, An, The)',
      titleBn: 'আর্টিকেল ব্যবহারের সহজ নিয়ম',
      formula: 'A + Consonant Sound | An + Vowel Sound | The + Specific / Unique',
      examples: 'A university, an honest man, the sun, the moon.',
      ruleBn: 'শব্দটি ভাওয়েল দিয়ে শুরু হলেও উচ্চারণ যদি "ইউ" বা "ওয়া" এর মতো হয় তবে an না বসে a বসে।',
    },
  ];

  const filtered = filter === 'all' ? formulas : formulas.filter(f => f.category === filter);

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1570CD] font-bn">
          <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#1E82E6] flex items-center justify-center shrink-0">
            <PremiumRulebookIcon active className="w-4 h-4" />
          </div>
          <span>ব্যাকরণ সূত্র ও রুলবুক</span>
        </div>
        <h1 className="font-classical text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
          Grammar Formulas &amp; Compendium (ব্যাকরণ সূত্র সংকলন)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-bn">
          সহজে স্মরণযোগ্য কাঠামোর মাধ্যমে ইংরেজি ব্যাকরণের মৌলিক সূত্র ও গঠনরীতি একত্রে সংকলিত করা হয়েছে।
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Formulas (সকল সূত্র)' },
          { id: 'tense', label: 'Tense Formulas (কালের সূত্র)' },
          { id: 'sentence', label: 'Sentence Structures (বাক্য গঠন)' },
          { id: 'articles', label: 'Articles (আর্টিকেল)' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`min-h-[38px] shrink-0 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === item.id
                ? 'bg-[#1E82E6] text-white shadow-xs'
                : 'bg-white border border-slate-200/85 text-slate-700 hover:bg-sky-50/80 hover:text-[#1570CD]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Formula Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/85 shadow-xs space-y-3 hover:border-sky-400 transition-colors"
          >
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1570CD]">
                {item.category}
              </span>
              <h3 className="font-classical text-base font-semibold text-slate-800">{item.title}</h3>
              <p className="text-xs font-semibold text-slate-700 font-bn">{item.titleBn}</p>
            </div>

            {/* Formula Block */}
            <div className="p-3.5 rounded-2xl bg-linear-to-r from-[#E5F2FF] to-[#F2F8FF] text-[#1570CD] font-mono text-xs font-semibold border border-sky-200/85 break-words overflow-x-auto">
              {item.formula}
            </div>

            <p className="text-xs text-slate-600 font-bn leading-relaxed">
              <span className="font-semibold text-slate-800">নিয়মাবলী:</span> {item.ruleBn}
            </p>

            <div className="pt-2 border-t border-slate-100 text-xs font-mono text-slate-700 break-words">
              <span className="font-sans font-semibold text-slate-500">উদাহরণ:</span> {item.examples}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
