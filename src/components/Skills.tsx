import React from 'react';
import { portfolio } from '../data/portfolio';
import { Cpu } from 'lucide-react';

export default function Skills() {
  return (
    <section id="skills" className="py-24 border-b border-obsidian-border bg-obsidian-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <Cpu className="text-electric-lime w-6 h-6" />
            <h2 className="text-3xl font-display font-bold">Technical Capability Map</h2>
          </div>
          <p className="text-cool-gray max-w-2xl">A structured overview of my technical proficiencies, grounded in practical application rather than arbitrary metrics.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {portfolio.skills.map((category, idx) => (
            <div key={idx} className="relative pl-6 border-l border-obsidian-border">
               {/* Marker */}
               <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-obsidian border border-electric-lime"></div>

               <h3 className="text-sm font-mono text-electric-lime tracking-widest mb-6">{category.title}</h3>

               <div className="space-y-6">
                 {category.skills.map((skill, sIdx) => (
                   <div key={sIdx} className="group">
                     <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                        <h4 className="text-warm-white font-medium group-hover:text-engineering-blue transition-colors">{skill.name}</h4>
                        {skill.projects && (
                          <div className="flex gap-2 mt-1 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                             {skill.projects.map(pid => (
                               <span key={pid} className="text-[10px] font-mono text-cool-gray border border-obsidian-border px-1">REF:{pid.split('-')[0].toUpperCase()}</span>
                             ))}
                          </div>
                        )}
                     </div>
                     <p className="text-sm text-cool-gray">{skill.description}</p>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}