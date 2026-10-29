import React from 'react';
import { portfolio } from '../data/portfolio';
import { User, GraduationCap } from 'lucide-react';

export default function About() {
  const education = portfolio.experience.filter(exp => exp.type === 'education');

  return (
    <section id="about" className="py-24 border-b border-obsidian-border bg-obsidian-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-16 items-start">

          <div>
            <div className="flex items-center gap-4 mb-8">
              <User className="text-electric-lime w-6 h-6" />
              <h2 className="text-3xl font-display font-bold">About My Journey</h2>
            </div>

            <div className="space-y-6 text-lg text-cool-gray leading-relaxed">
              <p>
                I am an IT Engineering student driven by a fascination with how software can interact with and understand the physical world.
                My journey began with basic coding, but quickly expanded into robotics, computer vision, and embedded systems.
              </p>
              <p>
                Building intelligent systems requires more than just writing code; it demands an understanding of hardware constraints,
                data flow, and user interaction. Whether I'm configuring an ESP32 for a solar tracker, developing a RAG-based AI assistant,
                or exploring real-time facial mesh processing, I focus on the complete engineering pipeline.
              </p>
              <p>
                My ultimate ambition is to grow into an AI/ML engineering role, building robust models and deploying them in real-world scenarios.
                Simultaneously, my work as a coding coach and robotics competition judge keeps me grounded. Teaching others forces me to clarify
                my own understanding and reminds me why I fell in love with engineering in the first place: the ability to turn ideas into reality.
              </p>
            </div>
          </div>

          <div className="space-y-12">

             <div>
               <div className="flex items-center gap-4 mb-8">
                 <GraduationCap className="text-engineering-blue w-6 h-6" />
                 <h3 className="text-2xl font-display font-bold">Education</h3>
               </div>

               <div className="space-y-6">
                 {education.map((exp, idx) => (
                   <div key={idx} className="bg-obsidian border border-obsidian-border p-6 relative group hover:border-engineering-blue transition-colors">
                      <div className="absolute top-0 left-0 w-1 h-full bg-engineering-blue opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-warm-white">{exp.title}</h4>
                        <span className="text-sm font-mono text-electric-lime">{exp.date}</span>
                      </div>
                      <span className="text-sm font-mono text-cool-gray block mb-4">{exp.organization}</span>
                      <p className="text-sm text-cool-gray">{exp.description}</p>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-obsidian border border-obsidian-border p-8 border-t-2 border-t-electric-lime">
                <h4 className="text-sm font-mono text-warm-white mb-4">CURRENT FOCUS</h4>
                <ul className="space-y-3 font-mono text-sm text-cool-gray">
                   <li className="flex gap-3">
                     <span className="text-electric-lime">►</span>
                     <span>Deepening expertise in Machine Learning algorithms.</span>
                   </li>
                   <li className="flex gap-3">
                     <span className="text-electric-lime">►</span>
                     <span>Building scalable web interfaces for AI applications.</span>
                   </li>
                   <li className="flex gap-3">
                     <span className="text-electric-lime">►</span>
                     <span>Mentoring students for upcoming WRO challenges.</span>
                   </li>
                </ul>
             </div>

          </div>

        </div>

      </div>
    </section>
  );
}