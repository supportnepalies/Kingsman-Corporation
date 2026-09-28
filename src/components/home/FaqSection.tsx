import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What kind of platform is Kingsman Corporation?',
      a: 'Kingsman Corporation is an exclusive, legitimate adult companionship and dating platform designed for consenting adults aged 18 and older. We facilitate connections for social events, dining, cultural outings, galas, and stimulating lifestyle companionship.'
    },
    {
      q: 'Does Kingsman Corporation allow or facilitate commercial sex work or prostitution?',
      a: 'Strictly no. Kingsman Corporation enforces an absolute zero-tolerance policy against prostitution, commercial sex work, solicitation, trafficking, and any unlawful services. Any participant soliciting or offering sexual services will have their membership revoked immediately and may be reported to appropriate authorities.'
    },
    {
      q: 'Why can clients not message companions directly?',
      a: 'To guarantee privacy, personal security, and uncompromised discretion for both parties, all bookings and arrangements are mediated solely through Kingsman Corporation administration and concierge. Personal contact details, addresses, and phone numbers are never disclosed.'
    },
    {
      q: 'How does the booking request process work?',
      a: 'Registered clients select a companion profile, click "Book Now", and submit their requested date, time, city, and event details. Our concierge verifies availability, coordinates the itinerary, and confirms the engagement.'
    },
    {
      q: 'What is the vetting process for companions?',
      a: 'Prospective companions submit a formal application including background details, languages, interests, and photo verifications. Applications are reviewed directly by the owner administrator. Only approved candidates receive published public profiles.'
    },
    {
      q: 'Are client profiles visible to the general public?',
      a: 'No. Public visitors cannot browse client accounts. Client profiles are strictly private or restricted to registered members according to your privacy settings, ensuring your professional and social life remains uncompromised.'
    }
  ];

  return (
    <section className="py-24 bg-[#08080a] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clarity & Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display text-white tracking-wide">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-sm mt-3">
            Essential information regarding our concierge model, standards, and legal compliance.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#101016] border border-white/10 rounded-lg overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white text-base sm:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#dfb76c] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
