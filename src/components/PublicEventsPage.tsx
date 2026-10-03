import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { Event } from '../types/event';
import Header from './Header';
import { Calendar, MapPin, Clock, Megaphone } from 'lucide-react';

export default function PublicEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService
      .getPublishedEvents()
      .then((data) => setEvents(data))
      .catch((err) => console.error('Error loading published events:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <section className="bg-blue-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-yellow-400 space-y-4">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-950 font-black px-4 py-1.5 rounded-full text-lg">
            <Megaphone className="w-5 h-5" /> Campus Events &amp; Workshops
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            WYTU Public Events Calendar
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl font-medium">
            Stay updated with upcoming symposia, hackathons, seminars, and campus activities!
          </p>
        </section>

        {/* Published Events Feed */}
        <section>
          {loading ? (
            <div className="bg-white rounded-3xl p-12 border-2 border-slate-300 text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-blue-900 border-t-transparent"></div>
              <p className="text-2xl font-black text-slate-800">Loading Events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border-2 border-slate-300 text-center space-y-4">
              <Calendar className="w-16 h-16 text-slate-400 mx-auto" />
              <h3 className="text-3xl font-black text-slate-800">No Public Events Scheduled</h3>
              <p className="text-xl text-slate-600">Please check back later for upcoming campus events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((evt) => (
                <article
                  key={evt.id}
                  className="bg-white rounded-3xl overflow-hidden border-4 border-slate-300 shadow-xl hover:shadow-2xl transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Primary Image Gallery/Thumbnail */}
                    <div className="relative h-56 bg-slate-200 border-b-4 border-yellow-400">
                      {evt.images && evt.images.length > 0 ? (
                        <img
                          src={evt.images[0]}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-xl">
                          WYTU Events
                        </div>
                      )}
                      {evt.category && (
                        <span className="absolute top-4 left-4 bg-yellow-400 text-blue-950 font-black px-4 py-1.5 rounded-full text-base shadow-md uppercase">
                          {evt.category}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 leading-snug">
                        {evt.title}
                      </h3>

                      <div className="space-y-2 text-base font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 text-blue-900">
                          <Calendar className="w-5 h-5 flex-shrink-0" />
                          <span>{evt.date}</span>
                        </div>
                        {evt.time && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-5 h-5 flex-shrink-0" />
                            <span>{evt.time}</span>
                          </div>
                        )}
                        {evt.location && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-5 h-5 flex-shrink-0" />
                            <span>{evt.location}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-slate-700 font-medium text-base line-clamp-3 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  {evt.images && evt.images.length > 1 && (
                    <div className="p-6 pt-0 flex gap-2">
                      {evt.images.slice(1).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Additional preview"
                          className="w-16 h-12 object-cover rounded-xl border-2 border-slate-300"
                        />
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-8 border-t-4 border-yellow-400 mt-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-2xl font-black text-yellow-300">West Yangon Technological University</p>
          <p className="text-lg text-slate-300">Public Campus Events &amp; Portal System</p>
        </div>
      </footer>
    </div>
  );
}
