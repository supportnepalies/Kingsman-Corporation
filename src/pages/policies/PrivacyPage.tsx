import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';

export const PrivacyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
            Confidentiality Standards
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-white">
            Privacy & Discretion Policy
          </h1>
          <p className="text-xs text-neutral-500">
            Kingsman Corporation &bull; Zero Data Monetization Guarantee
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-neutral-300 bg-[#0f0f15] border border-white/5 rounded-2xl p-8 sm:p-10">
          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">1. Data Minimization & Protection</h2>
            <p>
              We collect only the information necessary to maintain account security and mediate reservations. We never sell, lease, or distribute member data to commercial data brokers, advertising networks, or social platforms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">2. Profile Visibility & PII Segregation</h2>
            <p>
              Client records are segregated from public views. Public search results display only verified companion profiles. Contact information (phone numbers, physical addresses, real legal surnames) is strictly hidden from other members.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">3. Companion Application Documents</h2>
            <p>
              Materials submitted by applicants are confidential and accessible solely by the platform owner/administrator for vetting. Unapproved applicant data is purged upon request or after formal review.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">4. Encryption & Retention</h2>
            <p>
              Communications and records are stored with high-standard cloud access controls. Members may request full account deletion and data scrubbing at any time via the Concierge Support Desk.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
