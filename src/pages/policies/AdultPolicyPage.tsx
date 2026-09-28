import React from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const AdultPolicyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#08080a] py-16 px-4 sm:px-6 lg:px-8 text-neutral-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#dfb76c] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </button>

        <div className="border-b border-white/10 pb-6 space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#dfb76c] font-semibold">
            Age Verification & Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-white">
            18+ Adult Platform Policy
          </h1>
          <p className="text-xs text-neutral-500">
            Mandatory Requirement for All Registered Users & Companions
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-neutral-300 bg-[#0f0f15] border border-white/5 rounded-2xl p-8 sm:p-10">
          <div className="p-4 bg-amber-950/40 border border-amber-600/40 rounded-xl text-amber-200 text-xs">
            Notice: Kingsman Corporation requires explicit age confirmation ("I confirm that I am 18 years of age or older") before granting entry to service directories. This acknowledgment is an entry barrier. The application architecture supports integration with third-party biometric and government-issued ID validation services.
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">1. Strict Age Requirement</h2>
            <p>
              Under no circumstances may any individual under the age of 18 register, apply, browse, or participate in Kingsman Corporation activities. Any account suspected of minor involvement will be immediately blocked and reported.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">2. Companion Age Verification</h2>
            <p>
              Prospective companions must submit proof of age during application review. Admin vetting includes cross-referencing valid legal identification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">3. Zero Tolerance for Exploitation</h2>
            <p>
              We maintain absolute zero tolerance for child sexual abuse material (CSAM), non-consensual imagery, exploitation, or human trafficking. Violations will be referred without delay to the National Center for Missing & Exploited Children (NCMEC) and appropriate international law enforcement agencies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
