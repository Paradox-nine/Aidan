import React, { useState, useEffect, useCallback } from 'react';
import { eventService } from '../../services/eventService';
import { Event } from '../../types/event';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function AdminEventsDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal States
  const [deleteModalEvent, setDeleteModalEvent] = useState<Event | null>(null);
  const [viewModalEvent, setViewModalEvent] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      setActionError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Action Handlers
  const handleTogglePublish = async (event: Event) => {
    try {
      if (event.status === 'published') {
        await eventService.unpublishEvent(event.id);
      } else {
        await eventService.publishEvent(event.id);
      }
      await fetchEvents();
    } catch (err) {
      alert('Failed to update event status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalEvent) return;
    setDeleting(true);
    try {
      await eventService.deleteEvent(deleteModalEvent.id);
      setDeleteModalEvent(null);
      await fetchEvents();
    } catch (err) {
      alert('Failed to delete event: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDeleting(false);
    }
  };

  // Categories extraction
  const categories = ['ALL', ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))];

  // Filtering
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      !searchTerm ||
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.description && evt.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (evt.location && evt.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || evt.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'ALL' || (evt.category && evt.category.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Event Management Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1">
            Create, publish, edit, or remove WYTU campus events & workshops.
          </p>
        </div>

        <a
          href="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-md transition transform active:scale-95 border-2 border-sky-600 text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Event</span>
        </a>
      </div>

      {actionError && (
        <div className="bg-rose-50 border-2 border-rose-400 text-rose-900 p-4 rounded-xl font-bold">
          {actionError}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Field */}
        <div className="md:col-span-6 relative">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, location, description..."
              className="w-full text-base font-bold p-3 pl-10 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="md:col-span-3 flex bg-slate-100 p-1 rounded-xl border border-slate-300">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-sky-300 shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition ${
              statusFilter === 'published'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition ${
              statusFilter === 'draft'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Draft
          </button>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3 relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-base font-bold p-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border-2 border-slate-300 text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-sky-400"></div>
          <p className="text-xl font-extrabold text-slate-800">Loading Events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border-2 border-slate-300 text-center space-y-3">
          <Filter className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-2xl font-black text-slate-800">No Events Found</h3>
          <p className="text-base text-slate-600 font-medium max-w-md mx-auto">
            No events match your selected filters. Try clearing search keywords or create a new event.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('ALL');
            }}
            className="mt-2 bg-slate-900 text-sky-300 font-extrabold px-5 py-2.5 rounded-xl border border-sky-400"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Event Table */}
          <div className="hidden lg:block bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-sky-300 text-xs font-black uppercase tracking-wider">
                    <th className="py-4 px-4">Image</th>
                    <th className="py-4 px-4">Title</th>
                    <th className="py-4 px-4">Date &amp; Time</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Updated</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm font-bold text-slate-800">
                  {filteredEvents.map((event) => {
                    const isPublished = event.status === 'published';
                    const primaryImg = event.images?.[0];

                    return (
                      <tr key={event.id} className="hover:bg-slate-50 transition">
                        {/* Image */}
                        <td className="py-3 px-4">
                          {primaryImg ? (
                            <img
                              src={primaryImg}
                              alt={event.title}
                              className="w-16 h-12 object-cover rounded-lg border border-slate-300"
                            />
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-xs text-slate-500 font-bold">
                              No Image
                            </div>
                          )}
                        </td>

                        {/* Title */}
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-extrabold text-slate-900 line-clamp-2">{event.title}</p>
                          {event.location && (
                            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </p>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <p className="font-extrabold text-slate-900">{event.date}</p>
                          {event.time && <p className="text-xs text-slate-500">{event.time}</p>}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded-lg text-xs font-black">
                            {event.category || 'General'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-400 px-3 py-1 rounded-full text-xs font-black">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-400 px-3 py-1 rounded-full text-xs font-black">
                              <Clock className="w-3.5 h-3.5 text-amber-700" /> Draft
                            </span>
                          )}
                        </td>

                        {/* Updated */}
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500">
                          {new Date(event.updatedAt || event.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View */}
                            <button
                              onClick={() => setViewModalEvent(event)}
                              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Publish / Unpublish */}
                            <button
                              onClick={() => handleTogglePublish(event)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-black border transition ${
                                isPublished
                                  ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                              }`}
                              title={isPublished ? 'Unpublish event' : 'Publish event'}
                            >
                              {isPublished ? 'Unpublish' : 'Publish'}
                            </button>

                            {/* Edit */}
                            <a
                              href={`/admin/events/${event.id}/edit`}
                              className="p-2 text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded-lg transition"
                              title="Edit event"
                            >
                              <Edit2 className="w-4 h-4" />
                            </a>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteModalEvent(event)}
                              className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Event Cards (No horizontal scroll) */}
          <div className="lg:hidden space-y-4">
            {filteredEvents.map((event) => {
              const isPublished = event.status === 'published';
              const primaryImg = event.images?.[0];

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm space-y-4"
                >
                  <div className="flex gap-4">
                    {primaryImg ? (
                      <img
                        src={primaryImg}
                        alt={event.title}
                        className="w-24 h-20 object-cover rounded-xl border border-slate-300 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-20 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-xs text-slate-500 font-bold flex-shrink-0">
                        No Image
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        {isPublished ? (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                            Published
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 border border-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                            Draft
                          </span>
                        )}
                        <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-md text-[10px] font-black truncate">
                          {event.category || 'General'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                        {event.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.date}</span>
                        {event.time && <span>• {event.time}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Actions Grid for Mobile */}
                  <div className="pt-3 border-t border-slate-200 grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setViewModalEvent(event)}
                      className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>

                    <button
                      onClick={() => handleTogglePublish(event)}
                      className={`flex items-center justify-center gap-1 py-2 rounded-xl font-extrabold text-xs border ${
                        isPublished
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>

                    <a
                      href={`/admin/events/${event.id}/edit`}
                      className="flex items-center justify-center gap-1 py-2 rounded-xl bg-sky-50 text-sky-900 border border-sky-300 font-extrabold text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </a>

                    <button
                      onClick={() => setDeleteModalEvent(event)}
                      className="flex items-center justify-center gap-1 py-2 rounded-xl bg-rose-50 text-rose-900 border border-rose-300 font-extrabold text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-rose-500 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-4 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Delete Event?</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-base font-bold text-slate-700 leading-relaxed">
              Are you sure you want to delete <span className="text-slate-900 font-black">"{deleteModalEvent.title}"</span>? This will permanently remove the event.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={deleting}
                onClick={() => setDeleteModalEvent(null)}
                className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-base cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:bg-slate-400 text-white font-black text-base shadow-md cursor-pointer flex items-center gap-2"
              >
                {deleting ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-sky-400 shadow-2xl overflow-hidden my-8 space-y-0">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b-4 border-sky-400">
              <div className="flex items-center gap-3">
                <span className="bg-sky-400 text-slate-950 font-black px-3 py-1 rounded-full text-xs uppercase">
                  {viewModalEvent.category || 'General'}
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border ${
                    viewModalEvent.status === 'published'
                      ? 'bg-emerald-800 text-emerald-200 border-emerald-500'
                      : 'bg-amber-800 text-amber-200 border-amber-500'
                  }`}
                >
                  {viewModalEvent.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setViewModalEvent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-black text-slate-900 leading-snug">
                {viewModalEvent.title}
              </h2>

              {/* Gallery Preview */}
              {viewModalEvent.images && viewModalEvent.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {viewModalEvent.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`Event preview ${idx + 1}`}
                      className="w-full h-36 object-cover rounded-xl border border-slate-300"
                    />
                  ))}
                </div>
              )}

              {/* Details List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-600" />
                  <span>Date: {viewModalEvent.date}</span>
                </div>
                {viewModalEvent.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-600" />
                    <span>Time: {viewModalEvent.time}</span>
                  </div>
                )}
                {viewModalEvent.location && (
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-5 h-5 text-sky-600 flex-shrink-0" />
                    <span>Location: {viewModalEvent.location}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Description
                </h4>
                <p className="text-base text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                  {viewModalEvent.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
              <a
                href={`/admin/events/${viewModalEvent.id}/edit`}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit Event
              </a>
              <button
                onClick={() => setViewModalEvent(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-black px-5 py-2.5 rounded-xl text-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
