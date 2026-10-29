import React from 'react';
import { portfolio } from '../data/portfolio';
import { Users, BookOpen } from 'lucide-react';

export default function Leadership() {
  const leadershipExp = portfolio.experience.filter(exp => exp.type === 'leadership');

  return (
    <section id="leadership" className="py-24 border-b border-obsidian-border bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <Users className="text-electric-lime w-6 h-6" />
            <h2 className="text-3xl font-display font-bold">Engineering Beyond Code</h2>
          </div>
          <p className="text-cool-gray max-w-2xl">Leadership, mentoring, and judging experiences that shape my approach to engineering and innovation.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">

          <div className="lg:col-span-2 space-y-8">
             {leadershipExp.map((exp, idx) => (
               <div key={idx} className="relative pl-8 md:pl-0">

                  {/* Mobile Timeline Line */}
                  <div className="absolute left-[11px] top-2 bottom-[-2rem] w-px bg-obsidian-border md:hidden"></div>

                  <div className="md:grid md:grid-cols-4 gap-6 relative">
                     {/* Timeline Marker */}
                     <div className="absolute left-[7px] top-1.5 w-2 h-2 rounded-full bg-electric-lime md:hidden z-10"></div>

                     <div className="md:col-span-1 mb-2 md:mb-0 text-sm font-mono text-engineering-blue pt-1 pl-6 md:pl-0">
                       {exp.date}
                     </div>
                     <div className="md:col-span-3 bg-obsidian-light p-6 border border-obsidian-border hover:border-cool-gray transition-colors ml-6 md:ml-0 relative">
                        <div className="absolute -left-3 top-4 w-3 h-px bg-obsidian-border hidden md:block"></div>
                        <h4 className="text-lg font-display font-semibold text-warm-white">{exp.title}</h4>
                        <span className="text-sm font-mono text-cool-gray block mb-4">{exp.organization}</span>
                        <p className="text-sm text-cool-gray leading-relaxed">{exp.description}</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-24 bg-obsidian-light/50 border border-obsidian-border p-8">
                <BookOpen className="text-engineering-blue w-8 h-8 mb-6" />
                <h3 className="text-sm font-mono text-warm-white mb-4">TEACHING PHILOSOPHY</h3>
                <blockquote className="text-lg leading-relaxed text-cool-gray italic border-l-2 border-electric-lime pl-4">
                  "{portfolio.teachingPhilosophy}"
                </blockquote>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}