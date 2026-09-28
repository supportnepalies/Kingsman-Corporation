import React, { useState } from 'react';
import { CompanionProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { submitBookingRequest } from '../../services/firebaseService';
import { X, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  companion: CompanionProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (refNum: string) => void;
  onOpenAuth: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  companion,
  isOpen,
  onClose,
  onSuccess,
  onOpenAuth
}) => {
  const { userAccount, clientProfile } = useAuth();
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Evening (19:00 - 23:00)');
  const [city, setCity] = useState(companion.city);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAccount) {
      onOpenAuth();
      return;
    }

    if (!preferredDate) {
      setErrorMsg('Please select your preferred date.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await submitBookingRequest({
        clientId: userAccount.uid,
        clientDisplayName: clientProfile?.displayName || userAccount.email.split('@')[0],
        clientEmail: userAccount.email,
        companionId: companion.id,
        companionDisplayName: companion.displayName.replace(/\s*\[demo\]/gi, '').trim(),
        companionPhotoUrl: companion.photoUrl,
        preferredDate,
        preferredTime,
        city,
        message
      });

      setSubmittedRef(res.referenceNumber);
      onSuccess(res.referenceNumber);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full bg-[#0d0d12] border border-[#dfb76c]/40 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#12121a]">
          <div className="flex items-center gap-3">
            <img
              src={companion.photoUrl}
              alt={companion.displayName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-[#dfb76c]/50"
            />
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#dfb76c] font-semibold block">
                Lawful Companionship Request
              </span>
              <h3 className="text-lg font-display text-white">
                Book {companion.displayName.replace(' [Demo]', '')}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submittedRef ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#181824] border border-[#dfb76c]/50 flex items-center justify-center mx-auto text-[#dfb76c]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-display text-white">Request Dispatched</h4>
              <p className="text-sm text-neutral-300">
                Your lawful companionship request has been generated with reference number:
              </p>
              <div className="inline-block px-4 py-2 bg-[#181822] border border-[#dfb76c]/40 rounded text-lg font-mono text-[#dfb76c] font-bold">
                {submittedRef}
              </div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                The Kingsman Corporation concierge will verify companion availability and contact you confidentially.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                Close & View in Dashboard
              </button>
            </div>
          ) : !userAccount ? (
            <div className="text-center py-8 space-y-4">
              <AlertCircle className="w-12 h-12 text-[#dfb76c] mx-auto" />
              <h4 className="text-xl font-display text-white">Member Login Required</h4>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                To guarantee discretion and security, only registered Kingsman Corporation members can submit companion booking requests.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-3 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  Login / Create Account
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded bg-[#181824] text-neutral-300 text-xs uppercase tracking-wider font-semibold hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Compliance banner */}
              <div className="p-3 bg-[#151520] border border-[#dfb76c]/25 rounded-lg flex items-start gap-2.5 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-[#dfb76c] shrink-0 mt-0.5" />
                <span>
                  All bookings are exclusively for lawful adult dating and social companionship (dinner, galas, theater, travel). Strictly no sexual services.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#dfb76c]" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#dfb76c]" />
                    Preferred Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="Luncheon (12:00 - 15:00)">Luncheon (12:00 - 15:00)</option>
                    <option value="Afternoon Tea / Gallery (15:00 - 18:00)">Afternoon Tea / Gallery (15:00 - 18:00)</option>
                    <option value="Evening (19:00 - 23:00)">Evening (19:00 - 23:00)</option>
                    <option value="Full Gala / Premiere (18:00 - Late)">Full Gala / Premiere (18:00 - Late)</option>
                    <option value="Multi-Day / Travel Engagement">Multi-Day / Travel Engagement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#dfb76c]" />
                  City / Venue Location *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mayfair, London / Manhattan, New York"
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Engagement Notes & Event Details
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the occasion (e.g. Symphony opening at Royal Albert Hall, dinner at Annabel's, dress code)..."
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded bg-[#181822] text-neutral-400 hover:text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmitting Request...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
