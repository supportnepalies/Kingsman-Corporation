import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AgeGateProvider } from './context/AgeGateContext';
import { AgeGateModal } from './components/layout/AgeGateModal';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BookingModal } from './components/booking/BookingModal';
import { ReportModal } from './components/booking/ReportModal';

// Pages
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProfileDetailPage } from './pages/ProfileDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { AuthPage } from './pages/AuthPage';
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Policies
import { TermsPage } from './pages/policies/TermsPage';
import { PrivacyPage } from './pages/policies/PrivacyPage';
import { AdultPolicyPage } from './pages/policies/AdultPolicyPage';
import { ConsentSafetyPage } from './pages/policies/ConsentSafetyPage';
import { CommunityGuidelinesPage } from './pages/policies/CommunityGuidelinesPage';
import { RefundPolicyPage } from './pages/policies/RefundPolicyPage';

import { CompanionProfile, Testimonial, SiteSettings } from './types';
import {
  fetchCompanionProfiles,
  fetchTestimonials,
  fetchSiteSettings
} from './services/firebaseService';
import { INITIAL_SITE_SETTINGS } from './services/mockInitialData';

function AppContent() {
  const { userAccount, isAdmin } = useAuth();

  // Navigation page state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionProfile | null>(null);

  // Data states
  const [profiles, setProfiles] = useState<CompanionProfile[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingCompanion, setBookingCompanion] = useState<CompanionProfile | null>(null);

  // Report modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string }>({ id: '', name: '' });

  // Initial data load
  useEffect(() => {
    async function initData() {
      try {
        const [cList, tList, settings] = await Promise.all([
          fetchCompanionProfiles(),
          fetchTestimonials(),
          fetchSiteSettings()
        ]);
        setProfiles(cList);
        setTestimonials(tList);
        setSiteSettings(settings);
      } catch (err) {
        console.warn('Boot initialization notice:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  const handleSelectProfile = (profile: CompanionProfile) => {
    setSelectedCompanion(profile);
    setCurrentPage('profile-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (profile: CompanionProfile) => {
    setBookingCompanion(profile);
    setBookingModalOpen(true);
  };

  const handleOpenReport = (targetId: string, targetName: string) => {
    setReportTarget({ id: targetId, name: targetName });
    setReportModalOpen(true);
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-200 flex flex-col font-sans selection:bg-[#dfb76c] selection:text-black">
      {/* 18+ Age Gate Intercept */}
      <AgeGateModal />

      {/* Universal Luxury Navigation */}
      {currentPage !== 'admin' && (
        <Navbar
          activePage={currentPage}
          setActivePage={navigateTo}
        />
      )}

      {/* Page Routing */}
      <div className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            siteSettings={siteSettings}
            profiles={profiles}
            testimonials={testimonials}
            onNavigate={navigateTo}
            onSelectProfile={handleSelectProfile}
            onOpenRegister={() => navigateTo('register')}
          />
        )}

        {currentPage === 'discover' && (
          <DiscoverPage
            profiles={profiles}
            onSelectProfile={handleSelectProfile}
            onOpenReport={handleOpenReport}
          />
        )}

        {currentPage === 'profile-detail' && selectedCompanion && (
          <ProfileDetailPage
            profile={selectedCompanion}
            onBack={() => navigateTo('discover')}
            onBookNow={handleOpenBooking}
            onOpenReport={handleOpenReport}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksPage
            onNavigate={navigateTo}
            onOpenRegister={() => navigateTo('register')}
          />
        )}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'contact' && (
          <ContactPage siteSettings={siteSettings} />
        )}

        {currentPage === 'faq' && <FaqPage />}

        {currentPage === 'apply' && (
          <AuthPage
            initialMode="apply"
            onSuccess={navigateTo}
          />
        )}

        {currentPage === 'login' && (
          <AuthPage
            initialMode="login"
            onSuccess={navigateTo}
          />
        )}

        {currentPage === 'register' && (
          <AuthPage
            initialMode="register"
            onSuccess={navigateTo}
          />
        )}

        {currentPage === 'client-dashboard' && (
          <ClientDashboardPage
            onNavigate={navigateTo}
            onSelectCompanion={handleSelectProfile}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage
            onNavigateHome={() => navigateTo('home')}
            siteSettings={siteSettings}
            onUpdateSiteSettings={(newSettings) => setSiteSettings(newSettings)}
          />
        )}

        {/* Legal and Safety Policies */}
        {currentPage === 'policy-terms' && (
          <TermsPage onBack={() => navigateTo('home')} />
        )}

        {currentPage === 'policy-privacy' && (
          <PrivacyPage onBack={() => navigateTo('home')} />
        )}

        {currentPage === 'policy-18plus' && (
          <AdultPolicyPage onBack={() => navigateTo('home')} />
        )}

        {currentPage === 'policy-consent' && (
          <ConsentSafetyPage onBack={() => navigateTo('home')} />
        )}

        {currentPage === 'policy-community' && (
          <CommunityGuidelinesPage onBack={() => navigateTo('home')} />
        )}

        {currentPage === 'policy-refund' && (
          <RefundPolicyPage onBack={() => navigateTo('home')} />
        )}
      </div>

      {/* Universal Luxury Footer */}
      {currentPage !== 'admin' && (
        <Footer
          setActivePage={navigateTo}
          siteSettings={siteSettings}
        />
      )}

      {/* Booking Modal */}
      {bookingModalOpen && bookingCompanion && (
        <BookingModal
          companion={bookingCompanion}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          onSuccess={() => {
            // refresh data if needed
          }}
          onOpenAuth={() => {
            setBookingModalOpen(false);
            navigateTo('login');
          }}
        />
      )}

      {/* Safety Report Modal */}
      {reportModalOpen && (
        <ReportModal
          targetId={reportTarget.id}
          targetName={reportTarget.name}
          reportedType="profile"
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AgeGateProvider>
        <AppContent />
      </AgeGateProvider>
    </AuthProvider>
  );
}
