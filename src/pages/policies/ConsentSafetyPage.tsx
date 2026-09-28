import React from 'react';
import { ArrowLeft, HeartHandshake } from 'lucide-react';

export const ConsentSafetyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
            Member Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-white">
            Consent & Safety Policy
          </h1>
          <p className="text-xs text-neutral-500">
            Kingsman Corporation Safety & Autonomy Charter
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-neutral-300 bg-[#0f0f15] border border-white/5 rounded-2xl p-8 sm:p-10">
          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">1. Bodily Sovereignty & Enthusiastic Consent</h2>
            <p>
              Companions are autonomous individuals providing social, dining, and event companionship. Physical intimacy is never part of an engagement package. Any unwanted physical touch or coercion is strictly forbidden.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">2. Right to Terminate Engagements</h2>
            <p>
              Both clients and companions reserve the unconditional right to conclude an engagement immediately if they feel unsafe, disrespected, or if boundaries are crossed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">3. Public & Verified Venues</h2>
            <p>
              Initial arrangements should take place in reputable venues such as Michelin-starred restaurants, private members' clubs, gallery exhibits, or gala spaces with concierge check-ins.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">4. Incident Reporting Mechanism</h2>
            <p>
              Clients and companions have access to our integrated safety reporting tool. All reports are immediately flagged for administrative review and escalated where appropriate.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
