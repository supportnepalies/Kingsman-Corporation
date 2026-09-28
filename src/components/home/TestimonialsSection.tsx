import React from 'react';
import { Testimonial } from '../../types';
import { Star, Quote, Sparkles } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const activeTestimonials = testimonials.filter(t => t.isActive);

  return (
    <section className="py-24 bg-[#0a0a0f] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white tracking-wide">
            Client Impressions
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-3 leading-relaxed">
            Genuine experiences shared by verified members. Real discretion, cultural alignment, and impeccable presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#101016] border border-white/10 hover:border-[#dfb76c]/40 rounded-xl p-8 relative flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <Quote className="w-8 h-8 text-[#dfb76c]/30 mb-4" />
                <div className="flex items-center gap-1 mb-4 text-[#dfb76c]">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#dfb76c]" />
                  ))}
                </div>
                <p className="text-sm text-neutral-300 italic font-serif leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-medium text-white tracking-wide">
                    {t.clientName}
                  </h4>
                  <span className="text-neutral-400">{t.city}</span>
                </div>
                {t.companionName && (
                  <span className="text-[11px] text-[#dfb76c] bg-[#181824] px-2 py-1 rounded border border-white/5">
                    with {t.companionName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
