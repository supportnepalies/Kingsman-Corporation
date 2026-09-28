import React from 'react';
import { Crown, Shield, Award, Users, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-300">
      {/* Editorial Hero */}
      <section className="py-24 border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#dfb76c] via-[#b88e3a] to-[#755518] p-0.5 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(223,183,108,0.25)]">
            <div className="w-full h-full bg-[#0d0d12] flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#dfb76c]" />
            </div>
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold block">
            The Kingsman Heritage
          </span>
          <h1 className="text-4xl sm:text-6xl font-display text-white tracking-wide">
            About Kingsman Corporation
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Redefining modern adult companionship through uncompromising poise, discreet concierge mediation, and mutual sovereignty.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#dfb76c] font-semibold">
              Our Founding Ethos
            </span>
            <h2 className="text-2xl sm:text-3xl font-display text-white">
              Cultivated Company for Discerning Lives
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              In an era dominated by superficial apps and ambiguous interactions, Kingsman Corporation was founded to restore dignity, intellectual charm, and refined etiquette to adult dating and companionship.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We cater exclusively to executives, diplomats, art patrons, and high-society individuals who require articulate company for formal occasions, gallery viewings, private club dinners, or luxury travel itineraries.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[#dfb76c]/40 shadow-2xl">
            <img
              src="/src/assets/images/hero_indian_married_woman_1790523916791.jpg"
              alt="Cultured Indian Married Women Companionship"
              className="w-full aspect-[4/3] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Core Principles */}
        <div className="bg-[#101016] border border-white/10 rounded-2xl p-8 sm:p-10 space-y-8">
          <h3 className="text-2xl font-display text-white text-center">
            Our Four Non-Negotiable Tenets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs leading-relaxed">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-white block">
                1. Absolute Legal Integrity
              </span>
              <p className="text-neutral-400">
                Kingsman Corporation operates strictly within the law. We facilitate social and cultural companionship. We do not process, facilitate, or condone prostitution or commercial sexual services.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-white block">
                2. Consensual Bodily Sovereignty
              </span>
              <p className="text-neutral-400">
                Every member—client and companion alike—retains sovereign bodily autonomy. Boundaries agreed upon prior to the engagement are strictly maintained.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-white block">
                3. Total Privacy Safeguards
              </span>
              <p className="text-neutral-400">
                Member records are strictly segregated. We do not sell data, display phone numbers, or reveal sensitive personal information to third parties or other members.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-white block">
                4. Concierge Oversight
              </span>
              <p className="text-neutral-400">
                Our administrative desk acts as a protective shield for both parties, ensuring expectations are aligned, venues are appropriate, and conduct remains impeccable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
