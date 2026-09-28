import React from 'react';
import { ContactSupportSection } from '../components/home/ContactSupportSection';
import { SiteSettings } from '../types';

interface ContactPageProps {
  siteSettings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ siteSettings }) => {
  return (
    <div className="min-h-screen bg-[#08080a]">
      <section className="py-20 border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold block">
            Discreet Communication
          </span>
          <h1 className="text-4xl sm:text-5xl font-display text-white tracking-wide">
            Concierge & Support Desk
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Direct your confidential inquiries to Kingsman Corporation management.
          </p>
        </div>
      </section>

      <ContactSupportSection siteSettings={siteSettings} />
    </div>
  );
};
