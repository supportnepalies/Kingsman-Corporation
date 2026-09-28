import React from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';

export const RefundPolicyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
            Concierge Financial Terms
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-white">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-neutral-500">
            Kingsman Corporation Platform Retainers & Coordination Fees
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-neutral-300 bg-[#0f0f15] border border-white/5 rounded-2xl p-8 sm:p-10">
          <div className="p-4 bg-[#14141c] border border-white/10 rounded-xl text-neutral-400 text-xs">
            Notice: Current platform fee records are non-live architectural placeholders. When compliant payment processors are activated, the following provisions will apply.
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">1. Cancellation Timelines</h2>
            <p>
              Clients may cancel a pending booking request without penalty at any time prior to concierge confirmation. Once confirmed, cancellations with more than 48 hours notice prior to the engagement are eligible for a full credit toward future arrangements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">2. Late Cancellations</h2>
            <p>
              Cancellations made within 24 to 48 hours of scheduled arrival may incur a 50% coordination retainer fee to honor companion schedule reservation. Cancellations under 24 hours are non-refundable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display text-white">3. Exceptional Circumstances & Safety Terminations</h2>
            <p>
              If an engagement is terminated due to safety violations, harassment, or policy breaches, fees are reviewed on a case-by-case basis by the owner administrator.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
