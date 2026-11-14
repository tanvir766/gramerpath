import React from 'react';
import { Volume2 } from 'lucide-react';

export type CatnivoPose =
  | 'welcome'
  | 'hero'
  | 'standing'
  | 'reading'
  | 'excited'
  | 'thinking'
  | 'laptop'
  | 'waving'
  | 'happy'
  | 'excited_face'
  | 'wink'
  | 'surprised'
  | 'sad'
  | 'angry';

export interface CatnivoProps {
  pose?: CatnivoPose;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  speech?: string;
  speechBn?: string;
  showSpeaker?: boolean;
  interactive?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

// Pixel bounding boxes mapped from /public/assets/aistudio/image_792511e9.png (1254 x 1254)
const CROPS: Record<Exclude<CatnivoPose, 'welcome' | 'hero'>, { x: number; y: number; w: number; h: number }> = {
  standing: { x: 670, y: 75, w: 165, h: 245 },
  reading: { x: 840, y: 105, w: 185, h: 225 },
  excited: { x: 1030, y: 65, w: 185, h: 245 },
  thinking: { x: 650, y: 370, w: 175, h: 225 },
  laptop: { x: 845, y: 395, w: 190, h: 200 },
  waving: { x: 1055, y: 370, w: 175, h: 225 },
  happy: { x: 670, y: 690, w: 155, h: 160 },
  excited_face: { x: 860, y: 690, w: 155, h: 160 },
  wink: { x: 1050, y: 690, w: 155, h: 160 },
  surprised: { x: 670, y: 880, w: 155, h: 160 },
  sad: { x: 860, y: 880, w: 155, h: 160 },
  angry: { x: 1050, y: 880, w: 155, h: 160 },
};

const SIZE_CLASSES = {
  xs: 'w-8 h-8',
  sm: 'w-11 h-11',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-36 h-36',
  '2xl': 'w-48 h-48',
  hero: 'w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64',
};

export function CatnivoCharacter({
  pose = 'welcome',
  size = 'md',
  className = '',
  speech,
  speechBn,
  showSpeaker = false,
  interactive = false,
  animate = false,
  onClick,
}: CatnivoProps) {
  const isWelcomeAsset = pose === 'welcome' || pose === 'hero';
  const crop = !isWelcomeAsset ? CROPS[pose] || CROPS.standing : null;

  const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`relative inline-flex items-center gap-3 select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Catnivo Sprite Frame */}
      <div
        className={`relative shrink-0 ${
          isWelcomeAsset ? '' : 'overflow-hidden rounded-2xl'
        } transition-transform duration-300 ${
          SIZE_CLASSES[size]
        } ${animate ? 'animate-bounce-subtle' : ''} ${
          interactive ? 'group-hover:scale-[1.03]' : ''
        }`}
      >
        {isWelcomeAsset ? (
          <img
            src="/assets/aistudio/catnivo_blue_hi_af499fb0.png"
            alt="GrammarPath mascot welcoming students"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-[0_14px_24px_rgba(30,130,230,0.16)] pointer-events-none"
          />
        ) : (
          <svg
            viewBox={`${crop!.x} ${crop!.y} ${crop!.w} ${crop!.h}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full drop-shadow-sm pointer-events-none"
          >
            <image
              href="/assets/aistudio/image_792511e9.png"
              x="0"
              y="0"
              width="1254"
              height="1254"
            />
          </svg>
        )}
      </div>

      {/* Optional Speech Bubble */}
      {(speech || speechBn) && (
        <div className="relative max-w-xs sm:max-w-md p-3.5 bg-white border border-sky-200/80 rounded-2xl shadow-sm text-left">
          {/* Bubble Pointer */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-sky-200/80 rotate-45"></div>

          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              {speech && (
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  {speech}
                </p>
              )}
              {speechBn && (
                <p className="text-[11px] sm:text-xs text-[#1570CD] font-bn font-medium">
                  {speechBn}
                </p>
              )}
            </div>

            {showSpeaker && speech && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  playVoice(speech);
                }}
                className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
                title="উচ্চারণ শুনুন (Listen)"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
