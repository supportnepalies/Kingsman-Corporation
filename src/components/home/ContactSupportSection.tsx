import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../../types';
import { submitSupportTicket } from '../../services/firebaseService';

interface ContactSupportSectionProps {
  siteSettings: SiteSettings;
}

export const ContactSupportSection: React.FC<ContactSupportSectionProps> = ({ siteSettings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    referenceNumber: '',
    category: 'General Concierge Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await submitSupportTicket({
        name: formData.name,
        email: formData.email,
        referenceNumber: formData.referenceNumber,
        category: formData.category,
        message: formData.message
      });
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        referenceNumber: '',
        category: 'General Concierge Inquiry',
        message: ''
      });
    } catch (err: any) {
      setErrorMsg('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-support-section" className="py-24 bg-[#0a0a0f] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold block">
              Direct Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-display text-white tracking-wide">
              Contact Kingsman Concierge
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Our private concierge team is at your disposal for bespoke companionship arrangements, membership consultations, and confidential questions.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#dfb76c] shrink-0 mt-1" />
                <div>
                  <span className="text-white block font-medium">Headquarters</span>
                  <span className="text-neutral-400">{siteSettings.businessAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#dfb76c] shrink-0 mt-1" />
                <div>
                  <span className="text-white block font-medium">Private Line</span>
                  <a
                    href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-neutral-400 hover:text-[#dfb76c] transition-colors"
                  >
                    {siteSettings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#dfb76c] shrink-0 mt-1" />
                <div>
                  <span className="text-white block font-medium">Concierge Desk</span>
                  <span className="text-neutral-400">{siteSettings.businessEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-[#101016] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#181824] border border-[#dfb76c]/40 flex items-center justify-center mx-auto text-[#dfb76c]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display text-white">Inquiry Dispatched</h3>
                  <p className="text-sm text-neutral-400 max-w-md mx-auto">
                    Thank you. A Kingsman Corporation concierge officer will review your request and reply confidentially.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded gold-btn-outline text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jonathan Sterling"
                        className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. client@domain.com"
                        className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-2">
                        Account / Ref Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.referenceNumber}
                        onChange={e => setFormData({ ...formData, referenceNumber: e.target.value })}
                        placeholder="e.g. KC-81923"
                        className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-2">
                        Inquiry Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      >
                        <option value="General Concierge Inquiry">General Concierge Inquiry</option>
                        <option value="Booking Assistance">Booking Assistance</option>
                        <option value="Companion Application">Companion Application</option>
                        <option value="Privacy & Security Question">Privacy & Security Question</option>
                        <option value="Feedback / Moderation">Feedback / Moderation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-2">
                      Confidential Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details regarding your inquiry, preferred schedule, or questions..."
                      className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded gold-btn text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-black" />
                    <span>{isSubmitting ? 'Dispatching Inquiry...' : 'Submit Confidential Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
