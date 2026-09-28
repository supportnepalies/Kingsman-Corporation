import React from 'react';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { Shield, Sparkles, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
  onOpenRegister: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate, onOpenRegister }) => {
  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-300">
      {/* Editorial Header */}
      <section className="py-20 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold block">
            Concierge Architecture
          </span>
          <h1 className="text-4xl sm:text-6xl font-display text-white tracking-wide">
            How Kingsman Operates
          </h1>
          <p className="text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A bespoke mediation protocol designed to preserve unyielding discretion, total safety, and mutual dignity for clients and companions.
          </p>
        </div>
      </section>

      <HowItWorksSection onNavigate={onNavigate} />

      {/* Deep-Dive FAQ & Protocols */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-[#101016] border border-white/10 rounded-2xl p-8 sm:p-10 space-y-6">
          <h2 className="text-2xl font-display text-white">Three Pillars of Our Mediation</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs leading-relaxed">
            <div className="space-y-2">
              <span className="text-[#dfb76c] font-bold uppercase tracking-wider block">
                1. No Direct Contact
              </span>
              <p className="text-neutral-400">
                Direct client-to-companion messaging and phone number exchanges are prohibited by our platform architecture. All itinerary scheduling, special accommodations, and reservations flow through Kingsman Corporation admin.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[#dfb76c] font-bold uppercase tracking-wider block">
                2. Vetted In-Person Boundaries
              </span>
              <p className="text-neutral-400">
                Engagements must take place at public venues, galas, premieres, fine dining establishments, or verified private reservations. Companions retain sovereign bodily autonomy at all times.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[#dfb76c] font-bold uppercase tracking-wider block">
                3. Absolute Confidentiality
              </span>
              <p className="text-neutral-400">
                Client documents and companion identities are encrypted. Real names are strictly withheld from public discovery profiles.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-6">
          <h3 className="text-2xl font-display text-white">Ready for Exceptional Company?</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Create your confidential account to begin reserving high-society companions for your upcoming itinerary.
          </p>
          <button
            onClick={onOpenRegister}
            className="px-8 py-3.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer inline-flex items-center gap-2"
          >
            <span>Begin Registration</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </section>
    </div>
  );
};
