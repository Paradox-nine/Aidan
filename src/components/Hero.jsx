import React from 'react';
import { Terminal, Calendar, Users, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-background-grid"></div>
      <div className="hero-container">
        <div className="hero-badge">
          <Sparkles size={16} className="badge-icon" />
          <span>Welcome to the Official Coding Club</span>
        </div>
        
        <h1 className="hero-title">
          Build the Future, <br />
          <span className="gradient-text">One Line at a Time.</span>
        </h1>
        
        <p className="hero-subtitle">
          Join our vibrant community of developers, designers, and innovators. 
          Discover upcoming hackathons, tech workshops, and club updates.
        </p>

        <div className="hero-actions">
          <a href="#announcements" className="btn btn-primary btn-lg">
            View Latest Feed
          </a>
          <a href="#about" className="btn btn-secondary btn-lg">
            Learn More
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <Users className="stat-icon" size={20} />
            <div className="stat-info">
              <span className="stat-value">250+</span>
              <span className="stat-label">Active Members</span>
            </div>
          </div>

          <div className="stat-card">
            <Calendar className="stat-icon" size={20} />
            <div className="stat-info">
              <span className="stat-value">40+</span>
              <span className="stat-label">Events Hosted</span>
            </div>
          </div>

          <div className="stat-card">
            <Terminal className="stat-icon" size={20} />
            <div className="stat-info">
              <span className="stat-value">15+</span>
              <span className="stat-label">Open Projects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
