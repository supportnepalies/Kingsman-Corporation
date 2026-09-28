import React from 'react';
import { FaqSection } from '../components/home/FaqSection';

export const FaqPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08080a]">
      <section className="py-20 border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold block">
            Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl font-display text-white tracking-wide">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Review fundamental guidance on our adult companionship standards, privacy model, and concierge booking.
          </p>
        </div>
      </section>

      <FaqSection />
    </div>
  );
};
