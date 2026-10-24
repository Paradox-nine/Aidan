import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-amber-500/20 py-8 px-4 bg-slate-950/60 text-center">
      <div className="max-w-3xl mx-auto space-y-2">
        <p className="text-amber-200/90 font-serif font-semibold text-base sm:text-lg">
          Birthday of Zin — 9 November 2004
        </p>
        <p className="text-slate-500 text-xs sm:text-sm flex items-center justify-center gap-1">
          <span>Created with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for Zin's Birthday Celebration. All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
};
