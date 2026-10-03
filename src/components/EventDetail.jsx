import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ImageGallery from './ImageGallery';
import EventCard from './EventCard';
import { eventService } from '../services/eventService';
import { Calendar, Clock, MapPin, ArrowLeft, ChevronRight, Home } from 'lucide-react';

export default function EventDetail({ slug, onNavigate }) {
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const data = await eventService.getEventBySlug(slug);
      if (isMounted) {
        setEvent(data);
        if (data) {
          const related = await eventService.getRelatedEvents(slug, 3);
          if (isMounted) {
            setRelatedEvents(related);
          }
        }
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleBackToEvents = (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('/events');
    }
  };

  const handleHomeClick = (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Header onNavigate={onNavigate} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-sm font-semibold text-slate-600">
          <ol className="flex items-center flex-wrap gap-2">
            <li>
              <a
                href="/"
                onClick={handleHomeClick}
                className="hover:text-sky-700 flex items-center gap-1 transition-colors"
              >
                <Home className="w-4 h-4" /> Home
              </a>
            </li>
            <li className="text-slate-400">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li>
              <a
                href="/events"
                onClick={handleBackToEvents}
                className="hover:text-sky-700 transition-colors"
              >
                Events
              </a>
            </li>
            <li className="text-slate-400">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-md">
              {event ? event.title : 'Event Detail'}
            </li>
          </ol>
        </nav>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
            <p className="text-xl font-bold text-slate-700">Loading Event Details...</p>
          </div>
        ) : !event ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Event Not Found</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              The event you are looking for could not be found or has been removed.
            </p>
            <a
              href="/events"
              onClick={handleBackToEvents}
              className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Events
            </a>
          </div>
        ) : (
          <article className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
            {/* Header Section */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                {event.category && (
                  <span className="bg-sky-100 text-sky-800 font-extrabold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-sky-200">
                    {event.category}
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-500">
                  Published: {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
                {event.title}
              </h1>

              {/* Event Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-slate-700 font-semibold text-sm sm:text-base">
                <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <Calendar className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <span className="block text-xs text-slate-500 font-normal">Date</span>
                    <span>{event.date}</span>
                  </div>
                </div>

                {event.time && (
                  <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <Clock className="w-5 h-5 text-sky-600 shrink-0" />
                    <div>
                      <span className="block text-xs text-slate-500 font-normal">Time</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
                    <div>
                      <span className="block text-xs text-slate-500 font-normal">Location</span>
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Gallery */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Event Gallery</h2>
              <ImageGallery images={event.images} title={event.title} />
            </div>

            {/* Full Description */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900">Event Overview</h2>
              <div className="prose prose-slate max-w-none text-slate-700 text-lg leading-relaxed space-y-4">
                <p>{event.description}</p>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-6 border-t border-slate-100">
              <a
                href="/events"
                onClick={handleBackToEvents}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-xl transition-colors border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Events
              </a>
            </div>
          </article>
        )}

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <section className="space-y-6 pt-6">
            <h2 className="text-2xl font-black text-slate-900">Related Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map((relEvt) => (
                <EventCard key={relEvt.id} event={relEvt} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
