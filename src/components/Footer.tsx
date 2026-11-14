import React from 'react';
import { BookOpen, CheckCircle, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <span className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="font-classical">GrammarPath</span>
            </div>
            <p className="text-xs text-slate-400 font-bn leading-relaxed mb-4">
              বাংলাভাষী শিক্ষার্থীদের জন্য জিরো থেকে ইংরেজি গ্রামার সহজে ও আনন্দের সাথে শেখার একটি বিশেষায়িত অনলাইন প্ল্যাটফর্ম।
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Bengali First</span>
              <span aria-hidden="true">·</span>
              <span>Step-by-Step</span>
              <span aria-hidden="true">·</span>
              <span>100% Free Practice</span>
            </div>
          </div>

          {/* Col 2: Learning Levels */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Grammar Levels
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Level 1: English Basics (প্রাথমিক ভিত্তি)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Level 2: Parts of Speech (পদ প্রকরণ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Level 3: Sentence Structure (বাক্য গঠন)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Level 4: All 12 Tenses (কাল বা সময়)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Level 5: Advanced Topics (উচ্চতর নিয়ম)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practice & Quizzes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Practice & Assessment
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('practice')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Interactive MCQ Practice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quizzes')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Timed 5, 10 & 20 Question Quizzes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sentence Correction Exercises
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bangla to English Translation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Teaching Methodology */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Learning Principles
            </h4>
            <ul className="space-y-2 text-xs font-bn text-slate-400">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                <span>কোনো পূর্ব ধারণা ধরে না নিয়ে একেবারে জিরো থেকে ব্যাখ্যা।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                <span>প্রতিটি নিয়মের সাথে সহজ বাংলা অর্থ ও দৈনন্দিন বাস্তব উদাহরণ।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                <span>সাধারণ ভুল (Common Mistakes) আলাদাভাবে চিহ্নিতকরণ।</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} GrammarPath. All rights reserved. Made for Bengali learners.</p>
          <div className="flex items-center gap-4">
            <span className="font-bn">ইংরেজি ব্যাকরণ এখন সহজ সবার জন্য</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
