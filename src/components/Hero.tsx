import React from 'react';
import { Calendar, Sparkles, Gift } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <header className="relative text-center py-16 px-4 overflow-hidden border-b border-amber-500/20">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>You're Cordially Invited</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-serif">
          Birthday of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">Zin</span>
        </h1>

        <div className="flex items-center justify-center gap-3 text-lg sm:text-2xl text-amber-200/90 font-medium">
          <Calendar className="w-6 h-6 text-amber-400" />
          <span>9 November 2004</span>
        </div>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
          Join us in celebrating this special milestone! Please fill out the invitation form below to send your response directly to Zin.
        </p>

        <div className="pt-2 flex justify-center items-center gap-2 text-amber-400/80 text-sm">
          <Gift className="w-4 h-4" />
          <span>Your response will generate a PDF confirmation sent via email.</span>
        </div>
      </div>
    </header>
  );
};
