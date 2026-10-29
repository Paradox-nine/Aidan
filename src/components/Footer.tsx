import React from 'react';
import { MailIcon, FileTextIcon } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { portfolio } from '../data/portfolio';

export default function Footer() {
  return (
    <footer id="contact" className="bg-obsidian-light border-t border-obsidian-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-warm-white mb-4">Have an idea worth building?</h2>
          <p className="text-cool-gray max-w-2xl mx-auto text-lg">
            I’m interested in engineering projects, AI and robotics opportunities, technical collaboration, and meaningful learning experiences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16">
          <a href={portfolio.personalInfo.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 border border-obsidian-border rounded-sm hover:border-electric-lime hover:text-electric-lime transition-colors">
            <FaGithub className="w-5 h-5" />
            <span>GitHub</span>
          </a>
          <a href={portfolio.personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 border border-obsidian-border rounded-sm hover:border-engineering-blue hover:text-engineering-blue transition-colors">
            <FaLinkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </a>
          <a href={`mailto:${portfolio.personalInfo.contact.email}`} className="flex items-center gap-2 px-6 py-3 border border-obsidian-border rounded-sm hover:border-warm-white transition-colors">
            <MailIcon className="w-5 h-5" />
            <span>Email</span>
          </a>
          <a href={portfolio.personalInfo.contact.cv} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-obsidian border border-obsidian-border rounded-sm hover:bg-obsidian-border transition-colors">
            <FileTextIcon className="w-5 h-5 text-electric-lime" />
            <span>View CV</span>
          </a>
        </div>

        <div className="border-t border-obsidian-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-cool-gray">
          <p>&copy; {new Date().getFullYear()} {portfolio.personalInfo.name}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>{portfolio.personalInfo.location}</span>
            <span className="text-obsidian-border">|</span>
            <span>{portfolio.personalInfo.role}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}