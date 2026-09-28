import React from 'react';
import { Shield, EyeOff, Award, Clock, Heart, CheckCircle2 } from 'lucide-react';

export const WhyKingsmanSection: React.FC = () => {
  const pillars = [
    {
      icon: <EyeOff className="w-6 h-6 text-[#dfb76c]" />,
      title: 'Guaranteed Discretion',
      desc: 'All communications and bookings are held in strict confidence. No public phone numbers, emails, or personal contact details are ever revealed.'
    },
    {
      icon: <Shield className="w-6 h-6 text-[#dfb76c]" />,
      title: 'Consent & Safety First',
      desc: 'Every companion and client operates under a firm agreement of mutual consent, bodily autonomy, and dignified social engagement.'
    },
    {
      icon: <Award className="w-6 h-6 text-[#dfb76c]" />,
      title: 'Curated Excellence',
      desc: 'Companions are carefully reviewed by our administrative concierge for etiquette, conversational mastery, and cultural sophistication.'
    },
    {
      icon: <Clock className="w-6 h-6 text-[#dfb76c]" />,
      title: 'Seamless Mediation',
      desc: 'Our private concierge oversees all dates, venues, and timings. You focus entirely on enjoying genuine companionship.'
    }
  ];

  return (
    <section className="py-24 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold block mb-3">
            The Distinction
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white tracking-wide">
            Why Kingsman Corporation
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-4 leading-relaxed">
            We provide a sanctuary of luxury dating and companionship, built upon transparent ethics and uncompromising standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#101016] border border-white/5 hover:border-[#dfb76c]/40 rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="w-12 h-12 rounded-lg bg-[#181824] border border-[#dfb76c]/30 flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-lg font-display text-white mb-2 tracking-wide">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
