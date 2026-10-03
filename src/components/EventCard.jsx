import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function EventCard({ event, onNavigate }) {
  if (!event) return null;

  const coverImage = event.images && event.images.length > 0
    ? event.images[0]
    : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

  const handleCardClick = (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(`/events/${event.slug}`);
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Event Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {event.category && (
          <span className="absolute top-3 left-3 bg-sky-700/90 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {event.category}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Details & Action */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2 text-sky-800">
              <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{event.date}</span>
            </div>

            {event.time && (
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          <a
            href={`/events/${event.slug}`}
            onClick={handleCardClick}
            className="inline-flex items-center justify-between w-full mt-2 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors group/btn border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 text-sky-700 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
}
