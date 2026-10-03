import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { storageService } from '../../services/storageService';
import { EventStatus } from '../../types/event';
import {
  Upload,
  X,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  MoveLeft,
  MoveRight,
  Loader2,
} from 'lucide-react';

interface EventFormProps {
  eventId?: string; // If provided, edit mode
}

export default function EventForm({ eventId }: EventFormProps) {
  const isEdit = Boolean(eventId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<EventStatus>('draft');

  // Images state: Array of image URLs (min 1, max 3)
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(isEdit);

  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Load existing event data if in Edit Mode
  useEffect(() => {
    if (isEdit && eventId) {
      setLoadingEvent(true);
      eventService
        .getEventById(eventId)
        .then((evt) => {
          if (evt) {
            setTitle(evt.title || '');
            setDescription(evt.description || '');
            setDate(evt.date || '');
            setTime(evt.time || '');
            setLocation(evt.location || '');
            setCategory(evt.category || '');
            setStatus(evt.status || 'draft');
            setImages(evt.images || []);
          } else {
            setStatusBanner({
              type: 'error',
              message: `Event with ID "${eventId}" was not found.`,
            });
          }
        })
        .catch(() => {
          setStatusBanner({
            type: 'error',
            message: 'Failed to load event details for editing.',
          });
        })
        .finally(() => setLoadingEvent(false));
    }
  }, [eventId, isEdit]);

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 3) {
      setStatusBanner({
        type: 'error',
        message: 'Maximum 3 images allowed per event. Remove an image to add a new one.',
      });
      return;
    }

    const availableSlots = 3 - images.length;
    const selectedFiles = Array.from(files).slice(0, availableSlots);

    setUploading(true);
    setStatusBanner(null);

    try {
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await storageService.uploadEventImage(file);
        uploadedUrls.push(url);
      }
      setImages((prev) => [...prev, ...uploadedUrls].slice(0, 3));
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Image upload failed.',
      });
    } finally {
      setUploading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    const removedUrl = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (removedUrl) {
      storageService.deleteEventImage(removedUrl).catch(() => {});
    }
  };

  // Reorder Images
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setImages(newImages);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusBanner(null);

    if (!title.trim()) {
      setStatusBanner({ type: 'error', message: 'Event Title is required.' });
      return;
    }

    if (!date) {
      setStatusBanner({ type: 'error', message: 'Event Date is required.' });
      return;
    }

    if (images.length === 0) {
      setStatusBanner({
        type: 'error',
        message: 'At least 1 event image is required (Minimum: 1, Maximum: 3).',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && eventId) {
        await eventService.updateEvent(eventId, {
          title: title.trim(),
          description: description.trim(),
          date,
          time: time.trim() || undefined,
          location: location.trim() || undefined,
          category: category.trim() || undefined,
          status,
          images,
        });
        setStatusBanner({
          type: 'success',
          message: 'Event updated successfully!',
        });
      } else {
        await eventService.createEvent({
          title: title.trim(),
          description: description.trim(),
          date,
          time: time.trim() || undefined,
          location: location.trim() || undefined,
          category: category.trim() || undefined,
          status,
          images,
        });
        setStatusBanner({
          type: 'success',
          message: 'Event created successfully!',
        });
        setTimeout(() => {
          window.location.href = '/admin/events';
        }, 1200);
      }
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save event. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="bg-white rounded-2xl p-12 border-2 border-slate-300 text-center space-y-4 font-sans">
        <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto" />
        <p className="text-xl font-black text-slate-800">Loading Event Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-300 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a
            href="/admin/events"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold transition"
            title="Back to events"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              {isEdit ? 'Modify details, images, and publishing status' : 'Add a new campus event or announcement'}
            </p>
          </div>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusBanner && (
        <div
          className={`p-5 rounded-2xl border-2 flex items-center gap-3 text-base font-extrabold shadow-sm ${
            statusBanner.type === 'success'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
              : 'bg-rose-50 border-rose-500 text-rose-950'
          }`}
        >
          {statusBanner.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          )}
          <span>{statusBanner.message}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-300 shadow-sm space-y-8">
        {/* Title */}
        <div>
          <label className="block text-base font-black text-slate-900 mb-1">
            Event Title <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Annual WYTU Technology Symposium 2025"
            className="w-full text-lg font-bold p-3.5 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
          />
        </div>

        {/* Date, Time, Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-base font-black text-slate-900 mb-1">
              Date <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-base font-bold p-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-base font-black text-slate-900 mb-1">
              Time (Optional)
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 09:00 AM - 04:30 PM"
              className="w-full text-base font-bold p-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-base font-black text-slate-900 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Technology, Workshop, Sports"
              className="w-full text-base font-bold p-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-base font-black text-slate-900 mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Main Auditorium, WYTU Campus"
            className="w-full text-base font-bold p-3.5 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-base font-black text-slate-900 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the event, agenda, speakers, registration links..."
            className="w-full text-base font-medium p-3.5 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
          />
        </div>

        {/* Status */}
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-300 space-y-2">
          <label className="block text-base font-black text-slate-900">
            Publishing Status
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer font-extrabold text-slate-800 text-base">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === 'draft'}
                onChange={() => setStatus('draft')}
                className="w-5 h-5 text-amber-600 focus:ring-amber-400"
              />
              <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black border border-amber-300">
                Draft (Hidden from public)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-extrabold text-slate-800 text-base">
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === 'published'}
                onChange={() => setStatus('published')}
                className="w-5 h-5 text-emerald-600 focus:ring-emerald-400"
              />
              <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-black border border-emerald-300">
                Published (Visible on public site)
              </span>
            </label>
          </div>
        </div>

        {/* Image Upload Component (Min 1, Max 3) */}
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-300 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Event Images <span className="text-rose-600">*</span>
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                Minimum 1 image, Maximum 3 images. Supported: JPG, JPEG, PNG, WEBP (Max 5MB each).
              </p>
            </div>
            <span className="text-xs font-black bg-slate-200 text-slate-800 px-3 py-1 rounded-full">
              {images.length} / 3 Uploaded
            </span>
          </div>

          {/* Image Previews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {images.map((imgUrl, index) => (
              <div key={index} className="relative group bg-white rounded-2xl border-2 border-slate-300 overflow-hidden shadow-sm">
                <img
                  src={imgUrl}
                  alt={`Event preview ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 bg-slate-900 text-white flex items-center justify-between text-xs font-black">
                  <span>Image #{index + 1}</span>
                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, 'left')}
                        className="p-1 hover:bg-slate-700 rounded cursor-pointer"
                        title="Move left"
                      >
                        <MoveLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, 'right')}
                        className="p-1 hover:bg-slate-700 rounded cursor-pointer"
                        title="Move right"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 bg-rose-700 hover:bg-rose-800 rounded text-white cursor-pointer ml-1"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Upload Drop Button */}
            {images.length < 3 && (
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-sky-400 hover:border-sky-600 rounded-2xl bg-sky-50/50 hover:bg-sky-50 cursor-pointer transition p-4 text-center">
                {uploading ? (
                  <div className="space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
                    <span className="text-xs font-black text-sky-800">Processing...</span>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-700">
                    <div className="p-3 bg-sky-100 rounded-2xl inline-block text-sky-700">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Upload Image</p>
                      <p className="text-[11px] font-bold text-slate-500">JPG, PNG, WEBP</p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-4">
          <a
            href="/admin/events"
            className="px-6 py-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-base transition"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-sky-300 font-black text-lg shadow-lg border-2 border-sky-400 flex items-center gap-2 cursor-pointer transition"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-sky-300" />
                <span>Saving Event...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{isEdit ? 'Update Event' : 'Save Event'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
