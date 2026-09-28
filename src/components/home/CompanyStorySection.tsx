import React from 'react';
import { Crown, Shield, Award, Users } from 'lucide-react';

export const CompanyStorySection: React.FC = () => {
  return (
    <section className="py-24 bg-[#0a0a0f] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Visual Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#dfb76c]/30 shadow-2xl">
              <img
                src="/src/assets/images/story_indian_married_women_1790523969019.jpg"
                alt="Kingsman Corporation Private Salon - Cultured Indian Companions"
                className="w-full aspect-[4/5] object-cover filter contrast-110 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-black/75 backdrop-blur-md border border-white/10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#dfb76c] font-semibold block mb-1">
                  Private Sovereignty
                </span>
                <p className="text-xs text-neutral-300 italic font-serif">
                  "True companionship begins where intellectual alignment, elegance, and mutual sovereignty meet."
                </p>
              </div>
            </div>

            {/* Floating Gold Crest Accent */}
            <div className="hidden sm:flex absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#121218] border-2 border-[#dfb76c] items-center justify-center shadow-[0_0_30px_rgba(223,183,108,0.3)]">
              <Crown className="w-8 h-8 text-[#dfb76c]" />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold">
              <span>The Corporation Ethos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white tracking-wide leading-tight">
              Elegance, Sovereignty, and Unwavering Discretion.
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Founded on the belief that meaningful human connection should never be compromised, Kingsman Corporation was conceived as a private enclave for discerning adults who value stimulating company, cultured conversation, and social poise.
            </p>

            <p className="text-neutral-400 text-sm leading-relaxed">
              Whether you require a knowledgeable companion for an art exhibition at NMACC, an articulate partner for high-table dining at The Taj Mahal Palace Mumbai, or an engaging presence at exclusive cultural galas across India, our concierge curates arrangements that exceed the highest expectations of etiquette.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <span className="text-2xl font-display text-[#dfb76c] block">100%</span>
                <span className="text-xs uppercase tracking-wider text-neutral-400">Consensual & Lawful</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-display text-[#dfb76c] block">Zero</span>
                <span className="text-xs uppercase tracking-wider text-neutral-400">Tolerance for Illegality</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-display text-[#dfb76c] block">24/7</span>
                <span className="text-xs uppercase tracking-wider text-neutral-400">Concierge Mediation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
