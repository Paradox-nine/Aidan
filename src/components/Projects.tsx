import React, { useState } from 'react';
import { portfolio, Project } from '../data/portfolio';
import { TerminalSquare, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', ...Array.from(new Set(portfolio.projects.map(p => p.category)))];

  const filteredProjects = activeCategory === 'All'
    ? portfolio.projects
    : portfolio.projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 border-b border-obsidian-border bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <TerminalSquare className="text-electric-lime w-6 h-6" />
            <h2 className="text-3xl font-display font-bold">Interactive Engineering Lab</h2>
          </div>
          <p className="text-cool-gray max-w-2xl">A selection of my work spanning AI, robotics, computer vision, and software engineering. Filter by domain to explore specific solutions.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-mono border transition-colors ${
                activeCategory === cat
                  ? 'border-electric-lime text-electric-lime bg-electric-lime/10'
                  : 'border-obsidian-border text-cool-gray hover:border-cool-gray'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div key={project.id} className="group relative border border-obsidian-border bg-obsidian-light p-6 hover:border-engineering-blue transition-colors flex flex-col h-full cursor-pointer" onClick={() => project.caseStudyDetails && setSelectedProject(project as Project)}>

               <div className="mb-4">
                 <span className="text-xs font-mono text-engineering-blue tracking-wider mb-2 block">{project.category}</span>
                 <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-electric-lime transition-colors">{project.title}</h3>
                 <p className="text-sm text-cool-gray mb-4 line-clamp-2">{project.problem}</p>
                 <p className="text-sm text-warm-white line-clamp-3 mb-6">{project.solution}</p>
               </div>

               <div className="mt-auto">
                 <div className="flex flex-wrap gap-2 mb-4">
                   {project.technologies.slice(0, 3).map(tech => (
                     <span key={tech} className="text-xs border border-obsidian-border px-2 py-1 text-cool-gray">{tech}</span>
                   ))}
                   {project.technologies.length > 3 && (
                      <span className="text-xs border border-obsidian-border px-2 py-1 text-cool-gray">+{project.technologies.length - 3}</span>
                   )}
                 </div>

                 <div className="flex items-center justify-between border-t border-obsidian-border pt-4 text-xs font-mono text-cool-gray">
                   <span>{project.role}</span>
                   <span className={project.status.includes('Completed') ? 'text-electric-lime' : 'text-engineering-blue'}>{project.status}</span>
                 </div>
               </div>

               {/* Decorative corner accent */}
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-electric-lime transition-colors opacity-0 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal Overlay */}
      {selectedProject && selectedProject.caseStudyDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
           <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>

           <div className="relative bg-obsidian border border-obsidian-border w-full max-w-4xl max-h-full overflow-y-auto custom-scrollbar flex flex-col shadow-2xl shadow-electric-lime/5">

              <div className="sticky top-0 bg-obsidian border-b border-obsidian-border p-6 flex justify-between items-center z-10">
                 <div>
                   <span className="text-xs font-mono text-engineering-blue mb-1 block">{selectedProject.category}</span>
                   <h2 className="text-2xl font-display font-bold">{selectedProject.title}</h2>
                 </div>
                 <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-obsidian-light hover:text-electric-lime transition-colors">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                 </button>
              </div>

              <div className="p-6 md:p-10 space-y-12">

                 <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-obsidian-border pb-12">
                    <div className="md:col-span-2">
                       <h3 className="text-lg font-mono text-cool-gray mb-4 border-l-2 border-electric-lime pl-3">01. Overview</h3>
                       <p className="text-lg leading-relaxed">{selectedProject.caseStudyDetails.overview}</p>

                       <div className="mt-8 space-y-6">
                          <div>
                            <h4 className="text-sm font-mono text-warm-white mb-2">Problem Motivation</h4>
                            <p className="text-cool-gray">{selectedProject.caseStudyDetails.problemMotivation}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-mono text-warm-white mb-2">Requirements</h4>
                            <p className="text-cool-gray">{selectedProject.caseStudyDetails.requirements}</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-obsidian-light p-6 border border-obsidian-border h-fit">
                       <h4 className="text-sm font-mono text-warm-white mb-4 border-b border-obsidian-border pb-2">Project Metadata</h4>
                       <div className="space-y-4">
                         <div>
                            <span className="block text-xs text-cool-gray mb-1">Role</span>
                            <span className="text-sm">{selectedProject.role}</span>
                         </div>
                         <div>
                            <span className="block text-xs text-cool-gray mb-1">Status</span>
                            <span className="text-sm text-electric-lime">{selectedProject.status}</span>
                         </div>
                         <div>
                            <span className="block text-xs text-cool-gray mb-2">Stack</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.technologies.map(tech => (
                                <span key={tech} className="text-xs bg-obsidian px-2 py-1 border border-obsidian-border">{tech}</span>
                              ))}
                            </div>
                         </div>
                         <div className="pt-4 flex gap-4">
                            {selectedProject.links.github && (
                              <a href={selectedProject.links.github} className="text-cool-gray hover:text-white transition-colors" title="Source Code">
                                 <FaGithub className="w-5 h-5" />
                              </a>
                            )}
                            {selectedProject.links.demo && (
                              <a href={selectedProject.links.demo} className="text-cool-gray hover:text-white transition-colors" title="Live Demo">
                                 <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                         </div>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-12 pb-12 border-b border-obsidian-border">
                    <h3 className="text-lg font-mono text-cool-gray mb-4 border-l-2 border-electric-lime pl-3">02. Engineering & Architecture</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="bg-obsidian-light p-6 border border-obsidian-border relative overflow-hidden group">
                          <div className="absolute top-0 right-0 bg-obsidian-border px-2 py-1 text-[10px] font-mono">ARCHITECTURE</div>
                          <p className="text-cool-gray mt-4">{selectedProject.caseStudyDetails.architecture}</p>
                       </div>
                       <div className="bg-obsidian-light p-6 border border-obsidian-border relative overflow-hidden group">
                          <div className="absolute top-0 right-0 bg-obsidian-border px-2 py-1 text-[10px] font-mono">COMPONENTS</div>
                          <p className="text-cool-gray mt-4">{selectedProject.caseStudyDetails.components}</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                         <h4 className="text-sm font-mono text-warm-white mb-2">Implementation Process</h4>
                         <p className="text-cool-gray">{selectedProject.caseStudyDetails.implementation}</p>
                       </div>
                       <div>
                         <h4 className="text-sm font-mono text-warm-white mb-2">Key Decisions</h4>
                         <p className="text-cool-gray">{selectedProject.caseStudyDetails.decisions}</p>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-8 pb-12">
                    <h3 className="text-lg font-mono text-cool-gray mb-4 border-l-2 border-electric-lime pl-3">03. Outcomes</h3>

                    <div className="space-y-6">
                       <div className="border-l border-obsidian-border pl-4">
                         <h4 className="text-sm font-mono text-warm-white mb-2 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-electric-lime"></span> Results & Validation
                         </h4>
                         <p className="text-cool-gray">{selectedProject.caseStudyDetails.results}</p>
                       </div>
                       <div className="border-l border-obsidian-border pl-4">
                         <h4 className="text-sm font-mono text-warm-white mb-2 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-engineering-blue"></span> Challenges & Limitations
                         </h4>
                         <p className="text-cool-gray mb-2">{selectedProject.caseStudyDetails.challenges}</p>
                         <p className="text-cool-gray">{selectedProject.caseStudyDetails.limitations}</p>
                       </div>
                    </div>
                 </section>

              </div>
           </div>
        </div>
      )}
    </section>
  );
}