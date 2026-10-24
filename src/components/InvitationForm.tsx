import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, UserCheck, Mail, Users, MessageSquare } from 'lucide-react';

export interface FormDataState {
  fullName: string;
  email: string;
  attendance: 'Attending' | 'Not Attending' | 'Maybe';
  guestCount: number;
  message: string;
  consent: boolean;
  hp_field: string; // Honeypot
}

export const InvitationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>({
    fullName: '',
    email: '',
    attendance: 'Attending',
    guestCount: 0,
    message: '',
    consent: false,
    hp_field: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'guestCount') {
      setFormData((prev) => ({ ...prev, guestCount: parseInt(value, 10) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validations
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!formData.consent) {
      setErrorMsg('Please confirm agreement by checking the consent box.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/submit-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'An error occurred while submitting your invitation.');
      }

      setSuccessMsg(result.message || 'Your submission was received successfully! A PDF summary has been delivered.');
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        attendance: 'Attending',
        guestCount: 0,
        message: '',
        consent: false,
        hp_field: '',
      });
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto my-10 p-6 sm:p-8 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/5">
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-white mb-2">
        RSVP & Invitation Response
      </h2>
      <p className="text-center text-slate-400 text-sm mb-8">
        Please fill out your response below. A formal PDF will be emailed to Zin upon submission.
      </p>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 animate-fade-in">
          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-300 text-base">Response Received!</h3>
            <p className="text-sm text-emerald-200/90 mt-1">{successMsg}</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-rose-300 text-base">Submission Error</h3>
            <p className="text-sm text-rose-200/90 mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden Honeypot Field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="hp_field">Do not fill this out if human</label>
          <input
            type="text"
            id="hp_field"
            name="hp_field"
            value={formData.hp_field}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-amber-200/90 mb-2">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              maxLength={100}
              placeholder="e.g., Alex Johnson"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-white placeholder-slate-500 text-sm transition"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-amber-200/90 mb-2">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              required
              maxLength={150}
              placeholder="e.g., alex@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-white placeholder-slate-500 text-sm transition"
            />
          </div>
        </div>

        {/* Attendance & Guest Count Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Attendance Status */}
          <div>
            <label htmlFor="attendance" className="block text-sm font-medium text-amber-200/90 mb-2">
              Attendance Status <span className="text-rose-400">*</span>
            </label>
            <select
              id="attendance"
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-white text-sm transition"
            >
              <option value="Attending">Attending</option>
              <option value="Not Attending">Not Attending</option>
              <option value="Maybe">Maybe</option>
            </select>
          </div>

          {/* Additional Guest Count */}
          <div>
            <label htmlFor="guestCount" className="block text-sm font-medium text-amber-200/90 mb-2">
              Additional Guests (0 - 10)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Users className="w-5 h-5" />
              </div>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                min={0}
                max={10}
                value={formData.guestCount}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-white text-sm transition"
              />
            </div>
          </div>
        </div>

        {/* Personal Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-amber-200/90 mb-2">
            Personal Message <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <textarea
              id="message"
              name="message"
              rows={4}
              maxLength={1000}
              placeholder="Write a birthday wish or note for Zin..."
              value={formData.message}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-white placeholder-slate-500 text-sm transition resize-y"
            />
          </div>
          <div className="text-right text-xs text-slate-500 mt-1">
            {formData.message.length} / 1000 characters
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-amber-500 bg-slate-950 border-slate-700 rounded focus:ring-amber-400"
          />
          <label htmlFor="consent" className="text-xs sm:text-sm text-slate-300 leading-snug">
            I agree to submit my details for this birthday invitation response and understand a PDF summary will be sent to the host. <span className="text-rose-400">*</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-base tracking-wide hover:from-amber-400 hover:to-amber-300 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              <span>Generating PDF & Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 text-slate-950" />
              <span>Submit Invitation Response</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};
