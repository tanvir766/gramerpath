import React from 'react';
import { CatnivoCharacter, CatnivoPose } from './CatnivoCharacter.tsx';

interface MascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  waving?: boolean;
  pose?: CatnivoPose;
}

export function MascotAvatar({ size = 'md', className = '', waving = false, pose }: MascotProps) {
  // Default to the transparent blue waving welcome Catnivo unless another pose is specified
  const activePose: CatnivoPose = pose || (waving ? 'welcome' : 'welcome');

  return (
    <CatnivoCharacter
      pose={activePose}
      size={size}
      className={className}
      interactive={true}
    />
  );
}

export function StudentAvatar({ name, className = '' }: { name: string; className?: string }) {
  const colors = [
    { bg: 'bg-sky-50', text: 'text-[#1570CD]', border: 'border-sky-200' },
    { bg: 'bg-blue-50', text: 'text-[#1E82E6]', border: 'border-blue-200' },
    { bg: 'bg-sky-100/70', text: 'text-sky-900', border: 'border-sky-200' },
    { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
    { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  ];
  const charCode = name.charCodeAt(0) || 0;
  const theme = colors[charCode % colors.length];

  return (
    <div
      className={`w-9 h-9 rounded-full ${theme.bg} ${theme.text} ${theme.border} border flex items-center justify-center font-semibold text-sm shadow-2xs ${className}`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}
