import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { Sparkles, Shield, ChevronDown, UserCheck } from 'lucide-react';

interface HeroSectionProps {
  siteSettings: SiteSettings;
  onNavigate: (page: string) => void;
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  siteSettings,
  onNavigate,
  onOpenRegister
}) => {
  const [videoError, setVideoError] = useState(false);
  const heroImage = siteSettings.heroFallbackImg || '/src/assets/images/hero_indian_married_woman_1790523916791.jpg';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#08080a]">
      {/* Background Image / Video */}
      {!videoError && siteSettings.heroVideoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroImage}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125 brightness-90"
        >
          <source src={siteSettings.heroVideoUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}

      {/* Atmospheric Overlays for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/65 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#08080a]/70 to-[#08080a]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Subtle Brand Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181822]/80 border border-[#dfb76c]/40 text-[#dfb76c] text-xs font-semibold uppercase tracking-[0.25em] mb-8 shadow-[0_0_25px_rgba(223,183,108,0.15)] animate-in fade-in duration-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India's Premier Adult Companionship &bull; Strictly 18+</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium text-white tracking-wide leading-[1.1] mb-6">
          {siteSettings.heroHeadline || 'Where Exceptional Connections Begin.'}
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-neutral-300 font-light leading-relaxed mb-10">
          {siteSettings.heroSubheadline ||
            'A refined platform for adults seeking genuine companionship and memorable connections.'}
        </p>

        {/* Primary Homepage Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 rounded gold-btn text-xs uppercase tracking-[0.16em] font-bold shadow-[0_4px_25px_rgba(223,183,108,0.3)] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Create Account</span>
          </button>

          <button
            onClick={() => onNavigate('apply')}
            className="w-full sm:w-auto px-8 py-4 rounded gold-btn-outline text-xs uppercase tracking-[0.16em] font-semibold cursor-pointer flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[#dfb76c]" />
            <span>Apply as a Companion</span>
          </button>
        </div>

        {/* Trust & Compliance Markers */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#dfb76c]" />
            <span>Encrypted Member Discretion</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dfb76c]" />
            <span>Concierge Mediated Bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dfb76c]" />
            <span>Consenting Adult Governance</span>
          </div>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <button
        onClick={() => {
          const el = document.getElementById('how-it-works-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral-500 hover:text-[#dfb76c] transition-colors p-2 cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>
    </section>
  );
};
