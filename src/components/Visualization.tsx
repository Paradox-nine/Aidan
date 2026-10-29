import React, { useState } from 'react';
import { Network } from 'lucide-react';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  projects: string[];
}

export default function Visualization() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes: Node[] = [
    { id: 'ai', x: 50, y: 20, label: 'AI & ML', description: 'Building intelligent algorithms, RAG systems, and data processing pipelines.', projects: ['AI Trash Cam', 'Aidan AI'] },
    { id: 'cv', x: 80, y: 35, label: 'Computer Vision', labelPos: 'right', description: 'Real-time image processing, facial landmarks, and object detection.', projects: ['Face Swap', 'AI Trash Cam'] },
    { id: 'rob', x: 80, y: 70, label: 'Robotics', labelPos: 'right', description: 'Hardware integration, sensory feedback loops, and automated mechanisms.', projects: ['MM-HE01', 'WRO Judging'] },
    { id: 'emb', x: 50, y: 85, label: 'Embedded Systems', description: 'Microcontroller programming, sensor data acquisition, and physical computing.', projects: ['MM-HE01'] },
    { id: 'se', x: 20, y: 70, label: 'Software Eng.', labelPos: 'left', description: 'Full-stack development, architectural design, and deploying robust applications.', projects: ['Web Apps', 'Aidan AI'] },
    { id: '3d', x: 20, y: 35, label: '3D Design', labelPos: 'left', description: 'Environmental modeling and technical visualization.', projects: ['3D Environment'] },
    { id: 'edu', x: 50, y: 52, label: 'Education', isCenter: true, description: 'Mentoring, judging, and developing interactive learning experiences.', projects: ['CIY Coaching', 'WRO Judging'] },
  ];

  const edges = [
    ['ai', 'cv'], ['cv', 'rob'], ['rob', 'emb'], ['emb', 'se'], ['se', '3d'], ['3d', 'ai'],
    ['edu', 'ai'], ['edu', 'cv'], ['edu', 'rob'], ['edu', 'emb'], ['edu', 'se'], ['edu', '3d'],
    ['se', 'ai'], ['cv', 'emb']
  ];

  return (
    <section className="py-24 border-b border-obsidian-border bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Network className="text-electric-lime w-5 h-5" />
            <h2 className="text-2xl font-mono text-warm-white tracking-widest">SYSTEM_ARCHITECTURE</h2>
          </div>
          <p className="text-cool-gray max-w-2xl mx-auto text-sm">Interactive map of interconnected disciplines forming my engineering foundation.</p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto aspect-square md:aspect-[16/9] border border-obsidian-border bg-obsidian-light/50 p-4">
           {/* Grid background */}
           <div className="absolute inset-0 tech-grid opacity-20"></div>

           <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              {/* Edges */}
              {edges.map(([source, target], i) => {
                const s = nodes.find(n => n.id === source);
                const t = nodes.find(n => n.id === target);
                if (!s || !t) return null;
                const isActive = activeNode === source || activeNode === target;

                return (
                  <line
                    key={i}
                    x1={`${s.x}%`} y1={`${s.y}%`}
                    x2={`${t.x}%`} y2={`${t.y}%`}
                    stroke={isActive ? 'var(--color-electric-lime)' : 'var(--color-obsidian-border)'}
                    strokeWidth={isActive ? "2" : "1"}
                    className="transition-all duration-500"
                    opacity={activeNode && !isActive ? 0.2 : 1}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const isActive = activeNode === node.id;
                const isDimmed = activeNode && !isActive;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    style={{ transform: `translate(${node.x}%, ${node.y}%)`, opacity: isDimmed ? 0.3 : 1 }}
                  >
                    <circle
                      r={node.isCenter ? "12" : "8"}
                      fill="var(--color-obsidian)"
                      stroke={isActive ? 'var(--color-electric-lime)' : 'var(--color-engineering-blue)'}
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />
                    {isActive && (
                      <circle r={node.isCenter ? "16" : "12"} fill="none" stroke="var(--color-electric-lime)" strokeWidth="1" className="animate-ping opacity-50" />
                    )}
                    <text
                      x={node.labelPos === 'left' ? -20 : node.labelPos === 'right' ? 20 : 0}
                      y={node.labelPos ? 4 : (node.y > 50 ? 25 : -15)}
                      textAnchor={node.labelPos === 'left' ? 'end' : node.labelPos === 'right' ? 'start' : 'middle'}
                      fill={isActive ? "var(--color-warm-white)" : "var(--color-cool-gray)"}
                      className="text-xs font-mono select-none transition-colors duration-300"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
           </svg>

           {/* Info Panel */}
           <div className={`absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-obsidian border border-obsidian-border p-6 max-w-sm transition-all duration-300 ${activeNode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              {activeNode && (() => {
                 const node = nodes.find(n => n.id === activeNode);
                 if (!node) return null;
                 return (
                   <>
                     <h3 className="text-lg font-display font-bold text-electric-lime mb-2">{node.label}</h3>
                     <p className="text-sm text-cool-gray mb-4">{node.description}</p>
                     <div className="pt-4 border-t border-obsidian-border">
                        <span className="text-[10px] font-mono text-engineering-blue block mb-2">RELATED_ENTITIES:</span>
                        <div className="flex flex-wrap gap-2">
                           {node.projects.map(p => (
                              <span key={p} className="text-xs bg-obsidian-light px-2 py-1 border border-obsidian-border text-warm-white">{p}</span>
                           ))}
                        </div>
                     </div>
                   </>
                 );
              })()}
           </div>

        </div>

      </div>
    </section>
  );
}