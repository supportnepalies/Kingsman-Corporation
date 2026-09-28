import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, Check, Lock } from 'lucide-react';

interface HowItWorksSectionProps {
  onNavigate: (page: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      icon: <Compass className="w-6 h-6 text-[#dfb76c]" />,
      title: 'Curated Discovery',
      desc: 'Browse distinguished companion profiles with complete transparency on interests, languages, and social availability. Private client details remain strictly protected.'
    },
    {
      num: '02',
      icon: <Lock className="w-6 h-6 text-[#dfb76c]" />,
      title: 'Concierge Mediation',
      desc: 'Submit your requested date, time, and city. To preserve member safety and complete discretion, all communication and booking arrangements are mediated exclusively by Kingsman Corporation admin.'
    },
    {
      num: '03',
      icon: <HeartHandshake className="w-6 h-6 text-[#dfb76c]" />,
      title: 'Uncompromised Companionship',
      desc: 'Attend charity galas, fine dining evenings, private gallery openings, or weekend travel accompanied by articulate, poised individuals with mutual respect and clear boundaries.'
    }
  ];

  return (
    <section id="how-it-works-section" className="py-24 bg-[#0a0a0e] relative border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold block mb-3">
            The Kingsman Method
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white tracking-wide">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
            Our platform operates under rigorous concierge protocols, ensuring absolute discretion, mutual comfort, and uncompromising security for both clients and companions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass-card-gold rounded-xl p-8 relative flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#181824] border border-[#dfb76c]/30 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-display font-light text-[#dfb76c]/40">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-display text-white mb-3 tracking-wide">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#dfb76c]">
                <Check className="w-3.5 h-3.5" />
                <span>Standard of Excellence</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legal & Conduct Notice Box */}
        <div className="mt-14 max-w-4xl mx-auto p-6 rounded-lg bg-[#12121a] border border-[#dfb76c]/20 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#dfb76c] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Adult Companionship Code</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Bookings are strictly limited to social companionship, dining, gala attendance, and intellectual company between consenting adults. Any request for sexual acts or unlawful conduct will result in immediate termination of membership.
          </p>
        </div>
      </div>
    </section>
  );
};
