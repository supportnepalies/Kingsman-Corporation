import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

export const TermsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
            Legal Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-white">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-500">
            Last Updated: September 2026 &bull; Kingsman Corporation
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-neutral-300 bg-[#0f0f15] border border-white/5 rounded-2xl p-8 sm:p-10">
          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">1. Platform Nature & Scope</h2>
            <p>
              Kingsman Corporation operates an exclusive digital platform facilitating introductions and concierge-mediated social, cultural, and dining companionship between consenting adults. All users must be at least 18 years of age.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">2. Strict Prohibition of Commercial Sex & Prostitution</h2>
            <p className="text-amber-300 font-medium">
              Kingsman Corporation explicitly and strictly prohibits prostitution, commercial sexual transactions, solicitation of sexual acts, human trafficking, exploitation, or any illegal services.
            </p>
            <p>
              Any attempt to utilize the platform or its concierge services to offer, negotiate, or solicit sexual acts will result in immediate and permanent termination of membership, forfeiture of retainers, and potential referral to law enforcement authorities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">3. Concierge Mediation & Direct Contact Ban</h2>
            <p>
              To protect member discretion and security, all bookings are coordinated exclusively through Kingsman Corporation administration. Direct client-to-companion messaging, unsolicited contact, or pressure to bypass platform mediation constitutes a material breach of these Terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">4. User Attestations & Warranties</h2>
            <p>
              You warrant that you are at least 18 years of age, legally competent to enter into binding agreements, and that your use of the platform is solely for lawful social and cultural companionship.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">5. Limitation of Liability</h2>
            <p>
              Kingsman Corporation provides coordination and vetting services. Engagements occur between sovereign consenting adults who bear responsibility for their personal conduct, manners, and adherence to mutual boundaries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
