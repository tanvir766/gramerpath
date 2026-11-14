import React, { useId } from 'react';

export interface PremiumIconProps {
  className?: string;
  active?: boolean;
}

export function PremiumFlameIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-outer`} x1="16" y1="3" x2="16" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="55%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="16" y1="12" x2="16" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <path
        d="M16.9 3.2C17.4 7.4 13.8 9.9 12.7 13.3C11.9 11.4 11.4 9.9 11.6 8.2C8.3 10.6 6.2 14.4 6.2 18.4C6.2 24.1 10.6 28.8 16 28.8C21.4 28.8 25.8 24.1 25.8 18.4C25.8 12.1 21.5 6.8 16.9 3.2Z"
        fill={`url(#${id}-outer)`}
      />
      <path
        d="M16.2 13.6C14.1 16 12.3 18.2 12.3 21.1C12.3 24.2 14 26.6 16.1 26.6C18.5 26.6 20.3 24.3 20.3 21.2C20.3 18.4 18.3 15.8 16.2 13.6Z"
        fill={`url(#${id}-inner)`}
      />
      <ellipse cx="12" cy="14.5" rx="1.2" ry="2.4" transform="rotate(-18 12 14.5)" fill="#FFFFFF" fillOpacity="0.35" />
    </svg>
  );
}

export function PremiumDiamondIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-top`} x1="8" y1="5" x2="24" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="6" y1="12" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3898F0" />
          <stop offset="55%" stopColor="#2185E5" />
          <stop offset="100%" stopColor="#1673D1" />
        </linearGradient>
      </defs>
      <path d="M9.2 5.5H22.8L28 12.4L16 27.5L4 12.4L9.2 5.5Z" fill={`url(#${id}-body)`} />
      <path d="M9.2 5.5H22.8L28 12.4H4L9.2 5.5Z" fill={`url(#${id}-top)`} />
      <path d="M11.6 5.5L16 12.4L20.4 5.5H11.6Z" fill="#F0F9FF" />
      <path d="M11 12.4L16 27.5L21 12.4H11Z" fill="#7DD3FC" fillOpacity="0.4" />
      <path d="M9.2 5.5L6.5 9.2L10.2 11.2L12 7.2L9.2 5.5Z" fill="#FFFFFF" fillOpacity="0.55" />
    </svg>
  );
}

export function PremiumCrownIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-gold`} x1="5" y1="7" x2="27" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E7C873" />
          <stop offset="50%" stopColor="#B48332" />
          <stop offset="100%" stopColor="#785319" />
        </linearGradient>
      </defs>
      <path
        d="M4.5 11.2L10.2 16L16 7.5L21.8 16L27.5 11.2L25.2 23.2C25 24.2 24.1 25 23 25H9C7.9 25 7 24.2 6.8 23.2L4.5 11.2Z"
        fill={`url(#${id}-gold)`}
      />
      <rect x="6.8" y="22.4" width="18.4" height="3.2" rx="1.6" fill="#451A03" fillOpacity="0.35" />
      <circle cx="16" cy="6.8" r="2.1" fill="#E7C873" />
      <circle cx="4.6" cy="10.6" r="1.8" fill="#C89B4B" />
      <circle cx="27.4" cy="10.6" r="1.8" fill="#C89B4B" />
      <circle cx="16" cy="18.2" r="1.8" fill="#1E82E6" />
      <circle cx="10.6" cy="19.2" r="1.3" fill="#60A5FA" />
      <circle cx="21.4" cy="19.2" r="1.3" fill="#60A5FA" />
    </svg>
  );
}

export function PremiumGiftIcon({ className = 'w-7 h-7' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-box`} x1="6" y1="14" x2="30" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3898F0" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
        <linearGradient id={`${id}-lid`} x1="4" y1="10" x2="32" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2589F5" />
        </linearGradient>
        <linearGradient id={`${id}-ribbon`} x1="15" y1="5" x2="21" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
      </defs>
      <rect x="6.5" y="15.5" width="23" height="15.5" rx="3.2" fill={`url(#${id}-box)`} />
      <rect x="4.5" y="11" width="27" height="5.5" rx="2.2" fill={`url(#${id}-lid)`} />
      <rect x="15.8" y="11" width="4.4" height="20" fill={`url(#${id}-ribbon)`} />
      <path d="M18 11C18 11 11.5 11 10.2 8.2C9.3 6.2 11.3 4.4 13.4 5.3C15.5 6.2 18 11 18 11Z" fill="#E0F2FE" />
      <path d="M18 11C18 11 24.5 11 25.8 8.2C26.7 6.2 24.7 4.4 22.6 5.3C20.5 6.2 18 11 18 11Z" fill="#BAE6FD" />
      <rect x="6.5" y="16.5" width="23" height="1.4" fill="#1570CD" fillOpacity="0.24" />
    </svg>
  );
}

export function PremiumTrophyIcon({ className = 'w-6 h-6' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-cup`} x1="8" y1="5" x2="24" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D6B76E" />
          <stop offset="50%" stopColor="#A67C37" />
          <stop offset="100%" stopColor="#785319" />
        </linearGradient>
      </defs>
      <path d="M9 7H5.8C5 7 4.4 7.7 4.5 8.5C4.9 12.2 6.8 14.8 9.8 15.2" stroke="#9A7332" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M23 7H26.2C27 7 27.6 7.7 27.5 8.5C27.1 12.2 25.2 14.8 22.2 15.2" stroke="#785319" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M9 5.5H23V13.2C23 17.2 19.9 20.5 16 20.5C12.1 20.5 9 17.2 9 13.2V5.5Z" fill={`url(#${id}-cup)`} />
      <rect x="14.2" y="20" width="3.6" height="4.5" fill="#785319" />
      <rect x="10.2" y="24.2" width="11.6" height="3.2" rx="1.6" fill="#475569" />
      <path d="M11.8 8H14V14.5C12.6 13.8 11.8 12.2 11.8 10.2V8Z" fill="#FFFFFF" fillOpacity="0.35" />
    </svg>
  );
}

export function PremiumStarIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-star`} x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>
      <path
        d="M16 3.5L19.7 11.1L28 12.3L22 18.1L23.4 26.4L16 22.5L8.6 26.4L10 18.1L4 12.3L12.3 11.1L16 3.5Z"
        fill={`url(#${id}-star)`}
      />
    </svg>
  );
}

export function PremiumHeartIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-heart`} x1="6" y1="6" x2="26" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="55%" stopColor="#3898F0" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
      </defs>
      <path
        d="M16 27.2C16 27.2 4.5 20 4.5 11.8C4.5 8.2 7.3 5.5 10.7 5.5C12.9 5.5 14.8 6.6 16 8.3C17.2 6.6 19.1 5.5 21.3 5.5C24.7 5.5 27.5 8.2 27.5 11.8C27.5 20 16 27.2 16 27.2Z"
        fill={`url(#${id}-heart)`}
      />
      <ellipse cx="10.2" cy="10.5" rx="2.1" ry="1.2" transform="rotate(-30 10.2 10.5)" fill="#FFFFFF" fillOpacity="0.45" />
    </svg>
  );
}

export function PremiumBellIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bell`} x1="6" y1="4" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
      </defs>
      <path
        d="M14 4C9.8 4 6.8 7.1 6.8 11.3V15.5L5 18.3C4.6 18.9 5.1 19.7 5.8 19.7H22.2C22.9 19.7 23.4 18.9 23 18.3L21.2 15.5V11.3C21.2 7.1 18.2 4 14 4Z"
        fill={`url(#${id}-bell)`}
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M11.2 21.8C11.7 23.1 12.8 24 14 24C15.2 24 16.3 23.1 16.8 21.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ============ NAVIGATION & SKILL PREMIUM ICONS ============ */

export function PremiumHomeIcon({ className = 'w-5 h-5', active = false }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 10.3L12 3.4L20.5 10.3V19.2C20.5 20.1 19.8 20.8 18.9 20.8H5.1C4.2 20.8 3.5 20.1 3.5 19.2V10.3Z"
        fill={active ? 'currentColor' : 'currentColor'}
        fillOpacity={active ? 0.2 : 0.08}
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.85}
        strokeLinejoin="round"
      />
      <path
        d="M9.5 20.8V14.4C9.5 13.8 10 13.3 10.6 13.3H13.4C14 13.3 14.5 13.8 14.5 14.4V20.8"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.28 : 0}
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PremiumLearnIcon({ className = 'w-5 h-5', active = false }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 5.4C3.5 4.6 4.1 4 4.9 4H9.4C10.8 4 12 5.2 12 6.6V19.6C12 18.6 11.1 17.8 10.1 17.8H4.9C4.1 17.8 3.5 17.2 3.5 16.4V5.4Z"
        fill="currentColor"
        fillOpacity={active ? 0.22 : 0.08}
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.8}
        strokeLinejoin="round"
      />
      <path
        d="M20.5 5.4C20.5 4.6 19.9 4 19.1 4H14.6C13.2 4 12 5.2 12 6.6V19.6C12 18.6 12.9 17.8 13.9 17.8H19.1C19.9 17.8 20.5 17.2 20.5 16.4V5.4Z"
        fill="currentColor"
        fillOpacity={active ? 0.14 : 0.04}
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PremiumPracticeIcon({ className = 'w-5 h-5', active = false }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15.6 4.4C16.4 3.6 17.7 3.6 18.5 4.4L19.6 5.5C20.4 6.3 20.4 7.6 19.6 8.4L9.3 18.7L4.4 19.6L5.3 14.7L15.6 4.4Z"
        fill="currentColor"
        fillOpacity={active ? 0.22 : 0.08}
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.8}
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5L17.5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PremiumProgressIcon({ className = 'w-5 h-5', active = false }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="13" width="3.8" height="7" rx="1.4" fill="currentColor" fillOpacity={active ? 0.35 : 0.12} stroke="currentColor" strokeWidth="1.8" />
      <rect x="10.1" y="8.5" width="3.8" height="11.5" rx="1.4" fill="currentColor" fillOpacity={active ? 0.55 : 0.15} stroke="currentColor" strokeWidth="1.8" />
      <rect x="16.2" y="4.5" width="3.8" height="15.5" rx="1.4" fill="currentColor" fillOpacity={active ? 0.85 : 0.2} stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function PremiumProfileIcon({ className = 'w-5 h-5', active = false }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.8" fill="currentColor" fillOpacity={active ? 0.28 : 0.1} stroke="currentColor" strokeWidth={active ? 2.1 : 1.8} />
      <path
        d="M5 19.8C5.4 16.4 8.3 14.2 12 14.2C15.7 14.2 18.6 16.4 19 19.8"
        fill="currentColor"
        fillOpacity={active ? 0.18 : 0.06}
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PremiumTutorIcon({ className = 'w-5 h-5', active = false }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4L2.5 8.8L12 13.6L21.5 8.8L12 4Z"
        fill="currentColor"
        fillOpacity={active ? 0.28 : 0.12}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 11.4V16.4C6.2 18 8.8 19.5 12 19.5C15.2 19.5 17.8 18 17.8 16.4V11.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 9.5V15.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function PremiumGamepadIcon({ className = 'w-5 h-5', active = false }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="2.8"
        y="6.8"
        width="18.4"
        height="10.8"
        rx="5.4"
        fill="currentColor"
        fillOpacity={active ? 0.24 : 0.1}
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path d="M8.5 10.2V14.2M6.5 12.2H10.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="15.8" cy="11.2" r="1.1" fill="currentColor" />
      <circle cx="17.8" cy="13.2" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function PremiumRulebookIcon({ className = 'w-5 h-5', active = false }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 4.8C5 4 5.6 3.4 6.4 3.4H17.6C18.4 3.4 19 4 19 4.8V19.6C19 20.3 18.2 20.8 17.6 20.4L12 17.1L6.4 20.4C5.8 20.8 5 20.3 5 19.6V4.8Z"
        fill="currentColor"
        fillOpacity={active ? 0.25 : 0.1}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M8.8 8.2H15.2M8.8 11.4H13.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ============ RICH FULL-COLOR 3D ACTIVITY & TOPIC ICONS ============ */

export function PremiumPuzzleIcon({ className = 'w-7 h-7' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-puz`} x1="5" y1="5" x2="27" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
      </defs>
      <path
        d="M12.5 5.5C12.5 4.1 13.7 3 15.1 3C16.5 3 17.7 4.1 17.7 5.5V7H22.2C23.4 7 24.4 8 24.4 9.2V13.6H26C27.4 13.6 28.5 14.8 28.5 16.2C28.5 17.6 27.4 18.8 26 18.8H24.4V23.8C24.4 25 23.4 26 22.2 26H17.6V24.4C17.6 23 16.4 21.9 15 21.9C13.6 21.9 12.4 23 12.4 24.4V26H7.8C6.6 26 5.6 25 5.6 23.8V18.8H7.2C8.6 18.8 9.7 17.6 9.7 16.2C9.7 14.8 8.6 13.6 7.2 13.6H5.6V9.2C5.6 8 6.6 7 7.8 7H12.5V5.5Z"
        fill={`url(#${id}-puz)`}
      />
      <circle cx="15.1" cy="5.8" r="1.1" fill="#FFFFFF" fillOpacity="0.45" />
    </svg>
  );
}

export function PremiumTargetIcon({ className = 'w-7 h-7' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-ring`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E82E6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="12" fill={`url(#${id}-ring)`} />
      <circle cx="16" cy="16" r="8.2" fill="#FFFFFF" />
      <circle cx="16" cy="16" r="4.8" fill="#3898F0" />
      <circle cx="16" cy="16" r="1.9" fill="#B48332" />
      <path d="M25.5 6.5L17.2 14.8" stroke="#1E82E6" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M23.5 5.5L26.5 6.5L25.5 9.5L23.5 5.5Z" fill="#B48332" />
    </svg>
  );
}

export function PremiumTimerIcon({ className = 'w-7 h-7' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-watch`} x1="6" y1="7" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
      </defs>
      <rect x="13" y="3.5" width="6" height="2.4" rx="1.2" fill="#3898F0" />
      <circle cx="16" cy="17.5" r="10.5" fill={`url(#${id}-watch)`} />
      <circle cx="16" cy="17.5" r="7.5" fill="#F8FAFC" />
      <path d="M16 13V17.6L19.4 19.6" stroke="#1E82E6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="17.5" r="1.3" fill="#1570CD" />
    </svg>
  );
}

export function PremiumZapIcon({ className = 'w-6 h-6' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-zap`} x1="8" y1="3" x2="24" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="55%" stopColor="#3898F0" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
      </defs>
      <path
        d="M17.8 3.2L6.8 17.5H15.2L13.5 28.8L25.2 14H16.6L17.8 3.2Z"
        fill={`url(#${id}-zap)`}
        stroke="#F0F9FF"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PremiumBooksIcon({ className = 'w-6 h-6' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-b1`} x1="5" y1="6" x2="27" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#3898F0" />
        </linearGradient>
        <linearGradient id={`${id}-b2`} x1="5" y1="12" x2="27" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3898F0" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
        <linearGradient id={`${id}-b3`} x1="5" y1="18" x2="27" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#2589F5" />
        </linearGradient>
      </defs>
      <rect x="6" y="5.5" width="20" height="6.2" rx="2" fill={`url(#${id}-b1)`} />
      <rect x="7.5" y="12.5" width="19" height="6.2" rx="2" fill={`url(#${id}-b2)`} />
      <rect x="5.5" y="19.5" width="20.5" height="6.5" rx="2" fill={`url(#${id}-b3)`} />
      <rect x="9" y="7.5" width="12" height="1.8" rx="0.9" fill="#FFFFFF" fillOpacity="0.6" />
      <rect x="10.5" y="14.5" width="11" height="1.8" rx="0.9" fill="#FFFFFF" fillOpacity="0.6" />
      <rect x="9" y="21.5" width="12" height="1.8" rx="0.9" fill="#FFFFFF" fillOpacity="0.6" />
    </svg>
  );
}

export function PremiumPenIcon({ className = 'w-6 h-6' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-pen`} x1="6" y1="5" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
      </defs>
      <path d="M21.2 4.8L27.2 10.8L12.6 25.4L5.5 26.5L6.6 19.4L21.2 4.8Z" fill={`url(#${id}-pen)`} />
      <path d="M18.6 7.4L24.6 13.4" stroke="#B48332" strokeWidth="2.2" />
      <path d="M6.6 19.4L12.6 25.4L5.5 26.5L6.6 19.4Z" fill="#B48332" />
    </svg>
  );
}

export function PremiumArticlesIcon({ className = 'w-6 h-6' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-tile`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" rx="7" fill={`url(#${id}-tile)`} />
      <path d="M9.6 21L13.1 11H15.1L18.6 21H16.5L15.7 18.6H12.5L11.7 21H9.6ZM13 16.9H15.2L14.1 13.4L13 16.9Z" fill="#FFFFFF" />
      <circle cx="22.3" cy="18.2" r="2.6" stroke="#E0F2FE" strokeWidth="2" />
    </svg>
  );
}

export function PremiumVoiceIcon({ className = 'w-6 h-6' }: PremiumIconProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#1E82E6" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" rx="12" fill={`url(#${id}-bg)`} />
      <path d="M10.5 13H20.5L17.8 10.3M21.5 19H11.5L14.2 21.7" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PremiumHeadphonesIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 14V12C4.5 7.9 7.9 4.5 12 4.5C16.1 4.5 19.5 7.9 19.5 12V14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="3.5" y="13" width="4" height="6.5" rx="2" fill="currentColor" />
      <rect x="16.5" y="13" width="4" height="6.5" rx="2" fill="currentColor" />
    </svg>
  );
}

export function PremiumMicIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="8.8" y="3.5" width="6.4" height="10.5" rx="3.2" fill="currentColor" />
      <path d="M5.8 11.2C5.8 14.6 8.6 17.4 12 17.4C15.4 17.4 18.2 14.6 18.2 11.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M12 17.4V20.8M9 20.8H15" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

export function PremiumSpeakerIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.2 9.4H7.6L12.5 5.2V18.8L7.6 14.6H4.2C3.6 14.6 3.2 14.2 3.2 13.6V10.4C3.2 9.8 3.6 9.4 4.2 9.4Z"
        fill="currentColor"
      />
      <path d="M15.6 9.1C16.7 10.1 17.3 11 17.3 12C17.3 13 16.7 13.9 15.6 14.9" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M18.2 6.8C19.9 8.3 20.8 10 20.8 12C20.8 14 19.9 15.7 18.2 17.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

export function PremiumAwardMedalIcon({ className = 'w-6 h-6' }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="9.2" r="5.8" fill="currentColor" fillOpacity="0.24" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6.5L12.9 8.3L14.9 8.6L13.4 10L13.8 12L12 11L10.2 12L10.6 10L9.1 8.6L11.1 8.3L12 6.5Z" fill="currentColor" />
      <path d="M8.8 14.2L7.5 21L12 18.8L16.5 21L15.2 14.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PremiumCheckShieldIcon({ className = 'w-5 h-5' }: PremiumIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3L4.8 6V11.6C4.8 16.4 7.9 20.6 12 21.8C16.1 20.6 19.2 16.4 19.2 11.6V6L12 3Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M8.8 12.2L11 14.4L15.4 9.8" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
