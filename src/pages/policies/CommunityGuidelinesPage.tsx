import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';

export const CommunityGuidelinesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
            Member Conduct
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-white">
            Community Guidelines
          </h1>
          <p className="text-xs text-neutral-500">
            Expectations of Etiquette & Dignity at Kingsman Corporation
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-neutral-300 bg-[#0f0f15] border border-white/5 rounded-2xl p-8 sm:p-10">
          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">1. Cultivated Etiquette</h2>
            <p>
              Members are expected to demonstrate impeccable courtesy, punctuality, and respect during all interactions and bookings. Disparaging, coarse, or abusive language will not be tolerated.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">2. Genuine Representation</h2>
            <p>
              We do not permit impersonation, fabricated credentials, misleading photos, or deceptive claims. All profiles and applications must reflect honest background representation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">3. Discretion & Non-Disclosure</h2>
            <p>
              Members must never publicly broadcast, photograph without express consent, or reveal details of their companion engagements on social media or public forums.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">4. Strict Anti-Solicitation Enforcement</h2>
            <p>
              Any attempt to treat companionship as a commercial sexual transaction will result in instant account revocation and blacklisting across our platform network.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
