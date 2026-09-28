import React from 'react';
import { Crown, ShieldCheck, Mail, MapPin, Phone, Clock, AlertTriangle } from 'lucide-react';
import { SiteSettings } from '../../types';

interface FooterProps {
  setActivePage: (page: string) => void;
  siteSettings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, siteSettings }) => {
  const handleNav = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050507] border-t border-[#dfb76c]/20 text-neutral-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 18+ Mandatory Disclaimer Bar */}
        <div className="bg-[#0c0c10] border border-amber-900/40 rounded-lg p-4 mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-xs">
              Strictly 18+ Consenting Adult Service
            </span>
          </div>
          <p className="text-xs text-neutral-400 max-w-3xl leading-relaxed">
            Kingsman Corporation provides exclusive social and cultural companionship arrangements strictly for consenting adults aged 18 and older. We enforce a zero-tolerance policy regarding prostitution, commercial sexual services, human trafficking, exploitation, or any unlawful conduct.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/src/assets/images/kingsman_crest_1790586928168.jpg"
                alt="Kingsman Corporation Logo"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-[#dfb76c]/50 shadow-[0_0_15px_rgba(223,183,108,0.25)] shrink-0"
              />
              <div>
                <span className="font-display font-bold tracking-[0.2em] text-white text-lg block">
                  KINGSMAN
                </span>
                <span className="text-[10px] tracking-[0.35em] text-[#dfb76c] uppercase block">
                  Corporation
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-400 leading-relaxed pr-6">
              A refined private platform where distinguished individuals connect with cultured companions for galas, dining, and memorable lifestyle engagements. Discretion, safety, and mutual respect form our foundation.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#dfb76c]">
              <ShieldCheck className="w-4 h-4" />
              <span>Registered & Encrypted Discretion Protocol</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('discover')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  Discover Companions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  About the Corporation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('apply')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer text-[#dfb76c]"
                >
                  Apply as a Companion
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Safety Policies */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-4">
              Governance & Safety
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('policy-18plus')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  18+ Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('policy-consent')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  Consent & Safety Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('policy-community')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  Community Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('policy-terms')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('policy-privacy')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('policy-refund')}
                  className="hover:text-[#dfb76c] transition-colors cursor-pointer"
                >
                  Refund & Cancellation
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-4">
              Concierge Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#dfb76c] shrink-0 mt-0.5" />
                <span>{siteSettings.businessAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#dfb76c] shrink-0" />
                <a
                  href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-[#dfb76c] transition-colors"
                >
                  {siteSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#dfb76c] shrink-0" />
                <span>{siteSettings.businessEmail}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#dfb76c] shrink-0 mt-0.5" />
                <span>{siteSettings.businessHours}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => handleNav('faq')}
                  className="text-neutral-300 hover:text-[#dfb76c] underline transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} Kingsman Corporation. All rights reserved. Registered trademark.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('policy-terms')}
              className="hover:text-neutral-400 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => handleNav('policy-privacy')}
              className="hover:text-neutral-400 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="hover:text-neutral-400 transition-colors"
            >
              Concierge Inquiries
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
