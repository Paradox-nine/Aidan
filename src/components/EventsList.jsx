import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import EventCard from './EventCard';
import { eventService } from '../services/eventService';
import { Calendar, Megaphone, Sparkles } from 'lucide-react';

export default function EventsList({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    eventService.getPublishedEvents().then((data) => {
      if (isMounted) {
        setEvents(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Header onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Page Hero Header Banner */}
        <section className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-blue-800 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Calendar className="w-64 h-64 text-sky-400" />
          </div>

          <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-200 border border-sky-400/30 px-4 py-1.5 rounded-full text-sm font-semibold">
            <Megaphone className="w-4 h-4 text-sky-300" /> Official University Bulletin
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Events &amp; Announcements
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl font-medium leading-relaxed">
            Stay updated with upcoming technological exhibitions, academic hackathons, technical workshops, and official announcements from West Yangon Technological University (WYTU).
          </p>
        </section>

        {/* Events Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-sky-600" /> Published Events
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Explore current and upcoming campus activities
              </p>
            </div>
            <span className="text-sm font-bold bg-sky-100 text-sky-800 px-3 py-1 rounded-full border border-sky-200">
              {events.length} Event{events.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                  <div className="w-full aspect-[16/9] bg-slate-200 rounded-xl"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-10 bg-slate-200 rounded-xl pt-2"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
              <p className="text-2xl font-bold text-slate-700">No published events found at this time.</p>
              <p className="text-slate-500">Please check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((evt) => (
                <EventCard key={evt.id} event={evt} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
