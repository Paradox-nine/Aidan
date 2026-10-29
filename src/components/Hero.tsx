import React from 'react';
import { portfolio } from '../data/portfolio';

export default function Hero() {
  const { personalInfo } = portfolio;
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden border-b border-obsidian-border" id="hero">
      <div className="absolute inset-0 tech-grid opacity-50 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div className="flex flex-col space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-electric-lime"></span>
            <span className="text-xs font-mono text-electric-lime tracking-widest">{personalInfo.role}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            {personalInfo.tagline}
          </h1>

          <p className="text-xl text-cool-gray max-w-2xl leading-relaxed">
            {personalInfo.supportingText}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#projects" className="inline-flex justify-center items-center px-8 py-4 bg-obsidian-light border border-electric-lime text-electric-lime hover:bg-electric-lime hover:text-obsidian font-medium transition-all group">
              <span>Explore My Projects</span>
            </a>
            <a href="#about" className="inline-flex justify-center items-center px-8 py-4 border border-obsidian-border text-warm-white hover:border-engineering-blue hover:text-engineering-blue font-medium transition-all">
              <span>About My Journey</span>
            </a>
          </div>

          <div className="flex gap-6 pt-8 text-sm font-mono text-cool-gray">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-electric-lime/50"></div>
                <span>{personalInfo.location}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-engineering-blue/50"></div>
                <span>{personalInfo.education.split('at')[0]}</span>
             </div>
          </div>
        </div>

        <div className="relative h-[400px] lg:h-[600px] border border-obsidian-border bg-obsidian-light/50 flex items-center justify-center overflow-hidden group">
          {/* Fallback abstract tech visualization */}
          <svg className="w-full h-full opacity-30 text-electric-lime/20" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M 0,50 Q 25,20 50,50 T 100,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-pulse" />
             <path d="M 0,70 Q 25,40 50,70 T 100,70" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-pulse delay-150" />
             <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" className="animate-spin-slow" />
             <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.2" className="animate-ping" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center pointer-events-none">
             <p className="text-cool-gray/50 font-mono text-xs tracking-widest border border-cool-gray/20 px-4 py-2">SYSTEM VISUALIZATION AREA</p>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-warm-white/30 m-4"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-warm-white/30 m-4"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-warm-white/30 m-4"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-warm-white/30 m-4"></div>
        </div>

      </div>
    </section>
  );
}