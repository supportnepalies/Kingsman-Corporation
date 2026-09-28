import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { FeaturedProfilesSection } from '../components/home/FeaturedProfilesSection';
import { CompanyStorySection } from '../components/home/CompanyStorySection';
import { WhyKingsmanSection } from '../components/home/WhyKingsmanSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FaqSection } from '../components/home/FaqSection';
import { ContactSupportSection } from '../components/home/ContactSupportSection';
import { CompanionProfile, Testimonial, SiteSettings } from '../types';

interface HomePageProps {
  siteSettings: SiteSettings;
  profiles: CompanionProfile[];
  testimonials: Testimonial[];
  onNavigate: (page: string) => void;
  onSelectProfile: (profile: CompanionProfile) => void;
  onOpenRegister: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  siteSettings,
  profiles,
  testimonials,
  onNavigate,
  onSelectProfile,
  onOpenRegister
}) => {
  const sectionsOrder = siteSettings.homepageSectionsOrder || [
    'hero',
    'howItWorks',
    'featuredProfiles',
    'companyStory',
    'whyKingsman',
    'testimonials',
    'faq',
    'contactSupport'
  ];

  const hidden = siteSettings.hiddenSections || [];

  const renderSection = (id: string) => {
    if (hidden.includes(id)) return null;

    switch (id) {
      case 'hero':
        return (
          <HeroSection
            key="hero"
            siteSettings={siteSettings}
            onNavigate={onNavigate}
            onOpenRegister={onOpenRegister}
          />
        );
      case 'howItWorks':
        return <HowItWorksSection key="howItWorks" onNavigate={onNavigate} />;
      case 'featuredProfiles':
        return (
          <FeaturedProfilesSection
            key="featuredProfiles"
            profiles={profiles}
            onSelectProfile={onSelectProfile}
            onNavigate={onNavigate}
          />
        );
      case 'companyStory':
        return <CompanyStorySection key="companyStory" />;
      case 'whyKingsman':
        return <WhyKingsmanSection key="whyKingsman" />;
      case 'testimonials':
        return <TestimonialsSection key="testimonials" testimonials={testimonials} />;
      case 'faq':
        return <FaqSection key="faq" />;
      case 'contactSupport':
        return <ContactSupportSection key="contactSupport" siteSettings={siteSettings} />;
      default:
        return null;
    }
  };

  return <main>{sectionsOrder.map(renderSection)}</main>;
};
