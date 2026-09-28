import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CompanionProfile,
  CompanionApplication,
  BookingRequest,
  Message,
  ReportItem,
  SupportTicket,
  PaymentPlaceholder,
  MediaItem,
  Testimonial,
  SiteSettings
} from '../types';
import {
  fetchCompanionProfiles,
  saveCompanionProfile,
  deleteCompanionProfile,
  fetchCompanionApplications,
  updateApplicationStatus,
  fetchAllBookings,
  updateBookingStatus,
  fetchMessages,
  sendMessage,
  fetchReports,
  updateReportStatus,
  fetchSupportTickets,
  fetchPayments,
  addPaymentPlaceholder,
  fetchMedia,
  addMedia,
  deleteMedia,
  fetchTestimonials,
  saveTestimonial,
  deleteTestimonial,
  fetchSiteSettings,
  saveSiteSettings
} from '../services/firebaseService';
import {
  Shield,
  Users,
  FileCheck,
  Calendar,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  Image as ImageIcon,
  Layout,
  Quote,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ExternalLink,
  Upload,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  ArrowUpDown,
  Lock
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome,
  siteSettings,
  onUpdateSiteSettings
}) => {
  const { userAccount, isAdmin } = useAuth();

  const [activeSection, setActiveSection] = useState<
    | 'overview'
    | 'applications'
    | 'companions'
    | 'bookings'
    | 'messages'
    | 'payments'
    | 'reports'
    | 'support'
    | 'media'
    | 'content'
    | 'testimonials'
    | 'contact'
  >('overview');

  // Data states
  const [companions, setCompanions] = useState<CompanionProfile[]>([]);
  const [applications, setApplications] = useState<CompanionApplication[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [tickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [payments, setPayments] = useState<PaymentPlaceholder[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(siteSettings);

  // Companion edit modal state
  const [editingCompanion, setEditingCompanion] = useState<CompanionProfile | null>(null);
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);

  // Application view modal
  const [viewingApp, setViewingApp] = useState<CompanionApplication | null>(null);

  // Reply message text
  const [activeClientChatId, setActiveClientChatId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // New testimonial form state
  const [newTestimonialOpen, setNewTestimonialOpen] = useState(false);
  const [newTestimonialData, setNewTestimonialData] = useState({
    clientName: '',
    city: '',
    quote: '',
    rating: 5,
    companionName: ''
  });

  // Media upload form
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaCategory, setNewMediaCategory] = useState('hero');

  // Booking admin notes state
  const [editingBookingNoteId, setEditingBookingNoteId] = useState<string | null>(null);
  const [bookingNoteText, setBookingNoteText] = useState('');

  // Content save feedback
  const [contentSaved, setContentSaved] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      const [
        cList,
        aList,
        bList,
        mList,
        rList,
        tList,
        pList,
        medList,
        testList,
        setts
      ] = await Promise.all([
        fetchCompanionProfiles(),
        fetchCompanionApplications(),
        fetchAllBookings(),
        fetchMessages('admin', true),
        fetchReports(),
        fetchSupportTickets(),
        fetchPayments(),
        fetchMedia(),
        fetchTestimonials(),
        fetchSiteSettings()
      ]);

      setCompanions(cList);
      setApplications(aList);
      setBookings(bList);
      setMessages(mList);
      setReports(rList);
      setSupportTickets(tList);
      setPayments(pList);
      setMediaList(medList);
      setTestimonials(testList);
      setLocalSettings(setts);
    } catch (e) {
      console.warn('Admin load data error:', e);
    }
  };

  // Guard for non-admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111116] border border-rose-900/50 rounded-xl p-8 text-center space-y-4">
          <Lock className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-display text-white">Owner Authorization Required</h2>
          <p className="text-xs text-neutral-400">
            This administration suite is restricted strictly to the platform owner account (<code>onlyindiankitchen@gmail.com</code>).
          </p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  // Statistics
  const pendingApps = applications.filter(a => a.status === 'pending').length;
  const activeCompanions = companions.filter(c => c.isPublished).length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const openReports = reports.filter(r => r.status === 'new' || r.status === 'under_review').length;

  // Companion Profile Save / Publish
  const handleSaveCompanion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompanion) return;
    await saveCompanionProfile(editingCompanion);
    setIsCompanionModalOpen(false);
    setEditingCompanion(null);
    loadAllAdminData();
  };

  const handleTogglePublish = async (profile: CompanionProfile) => {
    await saveCompanionProfile({ ...profile, isPublished: !profile.isPublished });
    loadAllAdminData();
  };

  const handleDeleteCompanion = async (id: string) => {
    if (confirm('Are you sure you wish to delete this companion profile?')) {
      await deleteCompanionProfile(id);
      loadAllAdminData();
    }
  };

  // Convert Approved Application to Companion Profile
  const handleApproveApplication = async (app: CompanionApplication) => {
    await updateApplicationStatus(app.id, 'approved', 'Approved by administrator');
    // Create new published companion profile
    const newProfile: CompanionProfile = {
      id: `comp-${Date.now()}`,
      displayName: app.displayName,
      age: 26,
      city: app.city,
      photoUrl: app.profilePhotos[0] || '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
      gallery: app.profilePhotos,
      bio: app.shortIntro || 'Refined companion with a passion for social and cultural outings.',
      languages: app.languages,
      interests: app.interests,
      availability: app.availability,
      profileType: 'Verified Companion (Married)',
      isPublished: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await saveCompanionProfile(newProfile);
    setViewingApp(null);
    loadAllAdminData();
  };

  const handleRejectApplication = async (appId: string) => {
    await updateApplicationStatus(appId, 'rejected', 'Application did not meet criteria');
    setViewingApp(null);
    loadAllAdminData();
  };

  // Booking updates
  const handleBookingStatusChange = async (bookingId: string, status: BookingRequest['status']) => {
    await updateBookingStatus(bookingId, status);
    loadAllAdminData();
  };

  const handleSaveBookingNote = async (bookingId: string) => {
    await updateBookingStatus(bookingId, bookings.find(b => b.id === bookingId)?.status || 'pending', bookingNoteText);
    setEditingBookingNoteId(null);
    setBookingNoteText('');
    loadAllAdminData();
  };

  // Admin reply to messages
  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeClientChatId) return;

    await sendMessage({
      conversationId: `conv-${activeClientChatId}`,
      senderId: 'admin',
      senderName: 'Kingsman Concierge Desk',
      senderRole: 'admin',
      recipientId: activeClientChatId,
      content: adminReplyText.trim()
    });
    setAdminReplyText('');
    loadAllAdminData();
  };

  // Testimonial Save
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveTestimonial({
      id: `test-${Date.now()}`,
      clientName: newTestimonialData.clientName,
      city: newTestimonialData.city,
      quote: newTestimonialData.quote,
      rating: newTestimonialData.rating,
      companionName: newTestimonialData.companionName,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isActive: true
    });
    setNewTestimonialOpen(false);
    setNewTestimonialData({
      clientName: '',
      city: '',
      quote: '',
      rating: 5,
      companionName: ''
    });
    loadAllAdminData();
  };

  // Media Add
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle || !newMediaUrl) return;
    await addMedia({
      title: newMediaTitle,
      url: newMediaUrl,
      type: newMediaType,
      category: newMediaCategory,
      uploadedBy: 'owner'
    });
    setNewMediaTitle('');
    setNewMediaUrl('');
    loadAllAdminData();
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSiteSettings(localSettings);
    onUpdateSiteSettings(localSettings);
    setContentSaved(true);
    setTimeout(() => setContentSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-300">
      {/* Top Admin Bar */}
      <header className="bg-[#0e0e14] border-b border-[#dfb76c]/30 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#181824] border border-[#dfb76c] flex items-center justify-center text-[#dfb76c]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-base tracking-wider block">
              KINGSMAN CORPORATION
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#dfb76c] font-semibold block">
              Owner Administration Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="text-xs text-white block font-medium">onlyindiankitchen@gmail.com</span>
            <span className="text-[10px] text-emerald-400 block font-mono">Owner Access &bull; Spark Free Tier</span>
          </div>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded gold-btn-outline text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Admin Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-[#0f0f15] border border-white/10 rounded-2xl p-4 space-y-1 shadow-2xl">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#dfb76c] font-semibold px-3 py-2 block">
              Management Modules
            </span>

            {[
              { id: 'overview', label: 'Executive Overview', icon: <Layout className="w-4 h-4" /> },
              { id: 'applications', label: 'Companion Applications', icon: <FileCheck className="w-4 h-4" />, count: pendingApps },
              { id: 'companions', label: 'Companion Profiles', icon: <Users className="w-4 h-4" />, count: companions.length },
              { id: 'bookings', label: 'Booking Requests', icon: <Calendar className="w-4 h-4" />, count: pendingBookings },
              { id: 'messages', label: 'Concierge Messages', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'payments', label: 'Payments & Retainers', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'reports', label: 'Safety & Moderation', icon: <AlertTriangle className="w-4 h-4" />, count: openReports },
              { id: 'support', label: 'Support Inquiries', icon: <Sparkles className="w-4 h-4" />, count: tickets.length },
              { id: 'media', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'testimonials', label: 'Client Testimonials', icon: <Quote className="w-4 h-4" /> },
              { id: 'content', label: 'Homepage Content', icon: <Edit3 className="w-4 h-4" /> },
              { id: 'contact', label: 'Contact Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-[#dfb76c] text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeSection === item.id
                        ? 'bg-black text-[#dfb76c]'
                        : 'bg-amber-900/60 text-amber-300 border border-amber-600/40'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </aside>

          {/* Admin Main Body */}
          <main className="lg:col-span-9 bg-[#0f0f15] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl min-h-[650px]">
            {/* 1. OVERVIEW */}
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-display text-white">Executive Control Center</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Real-time status of applications, requests, companion profiles, and moderation.
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">
                      Active Companions
                    </span>
                    <span className="text-3xl font-display text-[#dfb76c] font-semibold block">
                      {activeCompanions}
                    </span>
                    <span className="text-[11px] text-neutral-500">Publicly browsable</span>
                  </div>

                  <div className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">
                      Pending Applications
                    </span>
                    <span className="text-3xl font-display text-amber-400 font-semibold block">
                      {pendingApps}
                    </span>
                    <span className="text-[11px] text-neutral-500">Awaiting owner review</span>
                  </div>

                  <div className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">
                      New Bookings
                    </span>
                    <span className="text-3xl font-display text-emerald-400 font-semibold block">
                      {pendingBookings}
                    </span>
                    <span className="text-[11px] text-neutral-500">Requires concierge action</span>
                  </div>

                  <div className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">
                      Open Safety Reports
                    </span>
                    <span className="text-3xl font-display text-rose-400 font-semibold block">
                      {openReports}
                    </span>
                    <span className="text-[11px] text-neutral-500">Moderation priority</span>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div className="bg-[#14141c] border border-white/5 rounded-xl p-6 space-y-3">
                    <h3 className="font-display text-white text-base">Quick Action: Review Applications</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      You have {pendingApps} prospective companion applications awaiting vetting. Review uploaded credentials and photos.
                    </p>
                    <button
                      onClick={() => setActiveSection('applications')}
                      className="px-4 py-2 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                    >
                      Inspect Applications
                    </button>
                  </div>

                  <div className="bg-[#14141c] border border-white/5 rounded-xl p-6 space-y-3">
                    <h3 className="font-display text-white text-base">Concierge Bookings Queue</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {pendingBookings} bookings require venue and itinerary mediation. Submit confirmation or notes to clients.
                    </p>
                    <button
                      onClick={() => setActiveSection('bookings')}
                      className="px-4 py-2 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                    >
                      Process Bookings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. COMPANION APPLICATIONS */}
            {activeSection === 'applications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Companion Applications</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Review candidate statements, photos, and credentials. Approving creates a public companion profile.
                  </p>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 text-xs">
                    No companion applications received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div
                        key={app.id}
                        className="bg-[#14141c] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={app.profilePhotos[0] || '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg'}
                            alt={app.displayName}
                            className="w-16 h-16 rounded-xl object-cover border border-[#dfb76c]/40"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-display text-white">{app.displayName}</h3>
                              <span className="text-xs text-neutral-400 font-sans">({app.fullName})</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                                  app.status === 'approved'
                                    ? 'bg-emerald-950/60 text-emerald-400'
                                    : app.status === 'rejected'
                                    ? 'bg-rose-950/60 text-rose-400'
                                    : 'bg-amber-950/60 text-amber-400'
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 mt-1">
                              {app.city} &bull; {app.email} &bull; {app.phone}
                            </p>
                            <p className="text-xs text-neutral-300 mt-1 line-clamp-1 italic font-serif">
                              "{app.shortIntro}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingApp(app)}
                            className="px-3.5 py-2 rounded bg-[#181824] hover:bg-[#222232] text-neutral-200 text-xs uppercase tracking-wider font-semibold border border-white/10 cursor-pointer"
                          >
                            Inspect Details
                          </button>

                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveApplication(app)}
                                className="px-3.5 py-2 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs uppercase tracking-wider font-semibold border border-emerald-700/40 cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectApplication(app.id)}
                                className="px-3.5 py-2 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs uppercase tracking-wider font-semibold border border-rose-700/40 cursor-pointer flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. COMPANION PROFILES */}
            {activeSection === 'companions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-2xl font-display text-white">Companion Profiles</h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Manage published and draft companion profiles. Note: No public verification badges.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCompanion({
                        id: `comp-${Date.now()}`,
                        displayName: '',
                        age: 28,
                        city: 'Mumbai',
                        photoUrl: '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
                        gallery: ['/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg'],
                        bio: '',
                        languages: ['English', 'Hindi'],
                        interests: ['Contemporary Art', 'Classical Dance', 'Fine Dining'],
                        availability: 'Evenings and weekends',
                        profileType: 'Cultural & High-Society Companion (Married)',
                        isPublished: true,
                        isFeatured: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      });
                      setIsCompanionModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-4 h-4 text-black" />
                    <span>Create Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companions.map(comp => (
                    <div
                      key={comp.id}
                      className="bg-[#14141c] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-black">
                        <img
                          src={comp.photoUrl}
                          alt={comp.displayName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              comp.isPublished
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                : 'bg-neutral-900/80 text-neutral-400 border border-white/10'
                            }`}
                          >
                            {comp.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-display text-white">
                              {comp.displayName.replace(' [Demo]', '')}
                            </h3>
                            <span className="text-xs text-neutral-400">Age {comp.age}</span>
                          </div>
                          <span className="text-xs text-[#dfb76c] block">{comp.city}</span>
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                            {comp.bio}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleTogglePublish(comp)}
                            className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            {comp.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{comp.isPublished ? 'Unpublish' : 'Publish'}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCompanion(comp);
                                setIsCompanionModalOpen(true);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-[#dfb76c] cursor-pointer"
                              title="Edit Profile"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCompanion(comp.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 cursor-pointer"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. BOOKINGS */}
            {activeSection === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Booking Requests</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage client bookings. All communication goes through the company admin desk.
                  </p>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 text-xs">
                    No booking requests in system.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(b => (
                      <div
                        key={b.id}
                        className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-[#dfb76c] font-bold">
                              {b.referenceNumber}
                            </span>
                            <span className="text-xs text-white font-medium">
                              Client: {b.clientDisplayName} ({b.clientEmail})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400">Status:</span>
                            <select
                              value={b.status}
                              onChange={e => handleBookingStatusChange(b.id, e.target.value as any)}
                              className="bg-[#1c1c28] border border-white/10 text-xs text-white px-2.5 py-1 rounded focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
                          <div>
                            <span className="text-neutral-500 block">Requested Companion:</span>
                            <span className="font-medium text-white">{b.companionDisplayName}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block">Date & Time:</span>
                            <span>{b.preferredDate} &bull; {b.preferredTime}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block">City / Venue:</span>
                            <span>{b.city}</span>
                          </div>
                        </div>

                        {b.message && (
                          <div className="bg-[#181824] p-3 rounded text-xs text-neutral-300">
                            <span className="text-neutral-500 block mb-1">Client Engagement Details:</span>
                            <p>{b.message}</p>
                          </div>
                        )}

                        {/* Admin Notes */}
                        <div className="pt-2 flex items-center justify-between text-xs">
                          {editingBookingNoteId === b.id ? (
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={bookingNoteText}
                                onChange={e => setBookingNoteText(e.target.value)}
                                placeholder="Add concierge coordination notes..."
                                className="flex-1 bg-[#181826] border border-white/10 rounded px-3 py-1 text-xs text-white"
                              />
                              <button
                                onClick={() => handleSaveBookingNote(b.id)}
                                className="px-3 py-1 bg-[#dfb76c] text-black font-semibold rounded cursor-pointer"
                              >
                                Save Note
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-500">Concierge Note:</span>
                              <span className="text-[#dfb76c] italic">
                                {b.adminNotes || 'None'}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingBookingNoteId(b.id);
                                  setBookingNoteText(b.adminNotes || '');
                                }}
                                className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer ml-2"
                              >
                                Edit Note
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. MESSAGES */}
            {activeSection === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Concierge Message Threads</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Communicate with clients. Direct client-to-companion messaging is blocked.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Conversations list */}
                  <div className="md:col-span-4 bg-[#14141c] border border-white/5 rounded-xl p-4 space-y-2">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                      Recent Threads
                    </span>
                    {Array.from(new Set(messages.map(m => m.senderRole === 'client' ? m.senderId : m.recipientId))).length === 0 ? (
                      <span className="text-xs text-neutral-500">No active threads</span>
                    ) : (
                      Array.from(new Set(messages.map(m => m.senderRole === 'client' ? m.senderId : m.recipientId))).map(clientId => (
                        <button
                          key={clientId}
                          onClick={() => setActiveClientChatId(clientId)}
                          className={`w-full text-left p-3 rounded-lg text-xs cursor-pointer ${
                            activeClientChatId === clientId
                              ? 'bg-[#dfb76c] text-black font-semibold'
                              : 'bg-[#181824] text-neutral-300 hover:bg-[#202030]'
                          }`}
                        >
                          <span className="block font-medium">Client {clientId.slice(0, 10)}</span>
                          <span className="text-[10px] opacity-75">Click to view thread</span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Chat Box */}
                  <div className="md:col-span-8 bg-[#14141c] border border-white/5 rounded-xl p-5 flex flex-col justify-between h-96">
                    <div className="overflow-y-auto space-y-3 flex-1 pr-2">
                      {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-neutral-500">
                          Select a conversation or wait for incoming client inquiries.
                        </div>
                      ) : (
                        messages.map(m => (
                          <div
                            key={m.id}
                            className={`p-3 rounded-lg text-xs max-w-md ${
                              m.senderRole === 'admin'
                                ? 'bg-[#dfb76c] text-black ml-auto font-medium'
                                : 'bg-[#1c1c28] text-neutral-200 mr-auto border border-white/10'
                            }`}
                          >
                            <span className="block text-[10px] font-bold uppercase mb-0.5 opacity-75">
                              {m.senderName}
                            </span>
                            <p>{m.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleSendAdminMessage} className="flex gap-2 pt-4 border-t border-white/10">
                      <input
                        type="text"
                        value={adminReplyText}
                        onChange={e => setAdminReplyText(e.target.value)}
                        placeholder="Reply as Kingsman Corporation Concierge..."
                        className="flex-1 bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PAYMENTS (DEMO PLACEHOLDER) */}
            {activeSection === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Payments & Retainers Module</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Compliant architecture placeholder for future platform fees and concierge retainers. No live payment gateway connected yet.
                  </p>
                </div>

                <div className="p-4 bg-[#14141c] border border-amber-900/40 rounded-xl flex items-center gap-3 text-xs text-amber-300">
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <span>
                    Notice: Live credit card billing is disabled on the free tier. The records below are demonstration platform fee records for architectural validation.
                  </span>
                </div>

                <div className="bg-[#14141c] border border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181824] text-neutral-400 uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Payment ID</th>
                        <th className="p-3.5">Client</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-neutral-300">
                      {payments.map(p => (
                        <tr key={p.id}>
                          <td className="p-3.5 font-mono text-[#dfb76c]">{p.paymentId}</td>
                          <td className="p-3.5">{p.clientEmail}</td>
                          <td className="p-3.5 font-semibold">${p.amount} {p.currency}</td>
                          <td className="p-3.5 text-neutral-400">{p.description}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 uppercase font-bold">
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-neutral-400">{p.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. REPORTS & MODERATION */}
            {activeSection === 'reports' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Safety Reports & Moderation</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Review and act upon safety flags submitted by members.
                  </p>
                </div>

                {reports.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 text-xs">
                    No open reports. Platform operating with full integrity.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map(r => (
                      <div
                        key={r.id}
                        className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                              {r.reportedType}: {r.targetName || r.targetId}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-black text-neutral-400">
                              Status: {r.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateReportStatus(r.id, 'action_taken', 'Reviewed and action completed')}
                              className="px-3 py-1 rounded bg-emerald-950/60 text-emerald-300 text-xs font-medium cursor-pointer"
                            >
                              Take Action
                            </button>
                            <button
                              onClick={() => updateReportStatus(r.id, 'closed', 'Closed by admin')}
                              className="px-3 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-medium cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </div>

                        <div className="text-xs space-y-1">
                          <p><span className="text-neutral-500">Reason:</span> {r.reason}</p>
                          <p><span className="text-neutral-500">Details:</span> {r.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 8. SUPPORT INQUIRIES */}
            {activeSection === 'support' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Concierge Inquiries & Support</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Direct inquiries submitted via the public contact and support portal.
                  </p>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 text-xs">
                    No pending inquiries.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map(t => (
                      <div key={t.id} className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{t.name} &bull; {t.email}</span>
                          <span className="text-[#dfb76c] font-medium">{t.category}</span>
                        </div>
                        <p className="text-xs text-neutral-300 whitespace-pre-line">{t.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 9. MEDIA LIBRARY */}
            {activeSection === 'media' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Media Library</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Store and assign public photos, videos, and luxury hero backgrounds.
                  </p>
                </div>

                {/* Upload / Add Form */}
                <form onSubmit={handleAddMedia} className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-display text-white">Add New Media Asset</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={newMediaTitle}
                      onChange={e => setNewMediaTitle(e.target.value)}
                      placeholder="Title / Description"
                      className="bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="url"
                      required
                      value={newMediaUrl}
                      onChange={e => setNewMediaUrl(e.target.value)}
                      placeholder="Direct Media URL (.mp4, .jpg, .webp)"
                      className="bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newMediaType}
                        onChange={e => setNewMediaType(e.target.value as any)}
                        className="bg-[#181826] border border-white/10 rounded px-2 py-2 text-xs text-white"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Add Asset
                      </button>
                    </div>
                  </div>
                </form>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {mediaList.map(item => (
                    <div key={item.id} className="bg-[#14141c] border border-white/5 rounded-xl overflow-hidden">
                      {item.type === 'video' ? (
                        <div className="aspect-video bg-black flex items-center justify-center text-xs text-neutral-400">
                          Video Asset ({item.url.slice(0, 30)}...)
                        </div>
                      ) : (
                        <img src={item.url} alt={item.title} referrerPolicy="no-referrer" className="aspect-video object-cover w-full" />
                      )}
                      <div className="p-3 flex items-center justify-between text-xs">
                        <span className="font-medium text-white line-clamp-1">{item.title}</span>
                        <button
                          onClick={() => deleteMedia(item.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. TESTIMONIALS */}
            {activeSection === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-2xl font-display text-white">Genuine Testimonials</h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Manually entered genuine member reviews.
                    </p>
                  </div>
                  <button
                    onClick={() => setNewTestimonialOpen(!newTestimonialOpen)}
                    className="px-4 py-2 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                  >
                    + Add Testimonial
                  </button>
                </div>

                {newTestimonialOpen && (
                  <form onSubmit={handleAddTestimonial} className="bg-[#14141c] border border-white/5 rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-display text-white">Add Verified Testimonial</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        value={newTestimonialData.clientName}
                        onChange={e => setNewTestimonialData({ ...newTestimonialData, clientName: e.target.value })}
                        placeholder="Client Pseudonym (e.g. Lord Sterling)"
                        className="bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        required
                        value={newTestimonialData.city}
                        onChange={e => setNewTestimonialData({ ...newTestimonialData, city: e.target.value })}
                        placeholder="City (e.g. London)"
                        className="bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={newTestimonialData.companionName}
                        onChange={e => setNewTestimonialData({ ...newTestimonialData, companionName: e.target.value })}
                        placeholder="Companion Name (Optional)"
                        className="bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      required
                      value={newTestimonialData.quote}
                      onChange={e => setNewTestimonialData({ ...newTestimonialData, quote: e.target.value })}
                      placeholder="Genuine experience review quote..."
                      className="w-full bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                    >
                      Save Testimonial
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-[#14141c] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">{t.clientName} ({t.city})</h4>
                        <p className="text-xs text-neutral-400 italic">"{t.quote}"</p>
                      </div>
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="text-neutral-500 hover:text-rose-400 p-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. HOMEPAGE CONTENT & HERO */}
            {activeSection === 'content' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Homepage Content Customizer</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Edit hero video, headline, and subheadline without modifying source code.
                  </p>
                </div>

                {contentSaved && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg">
                    Website content updated and published successfully!
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Hero Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={localSettings.heroHeadline}
                      onChange={e => setLocalSettings({ ...localSettings, heroHeadline: e.target.value })}
                      className="w-full bg-[#181826] border border-white/10 rounded px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Hero Subheadline *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={localSettings.heroSubheadline}
                      onChange={e => setLocalSettings({ ...localSettings, heroSubheadline: e.target.value })}
                      className="w-full bg-[#181826] border border-white/10 rounded px-3.5 py-2.5 text-xs text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Hero Video URL (.mp4)
                    </label>
                    <input
                      type="url"
                      value={localSettings.heroVideoUrl}
                      onChange={e => setLocalSettings({ ...localSettings, heroVideoUrl: e.target.value })}
                      className="w-full bg-[#181826] border border-white/10 rounded px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Hero Fallback Image URL
                    </label>
                    <input
                      type="url"
                      value={localSettings.heroFallbackImg}
                      onChange={e => setLocalSettings({ ...localSettings, heroFallbackImg: e.target.value })}
                      className="w-full bg-[#181826] border border-white/10 rounded px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  Save Homepage Changes
                </button>
              </form>
            )}

            {/* 12. CONTACT SETTINGS */}
            {activeSection === 'contact' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display text-white">Contact & Concierge Settings</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage business address, concierge hotline, and support channels.
                  </p>
                </div>

                {contentSaved && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg">
                    Contact settings updated successfully!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={localSettings.businessEmail}
                      onChange={e => setLocalSettings({ ...localSettings, businessEmail: e.target.value })}
                      className="w-full bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={localSettings.supportEmail}
                      onChange={e => setLocalSettings({ ...localSettings, supportEmail: e.target.value })}
                      className="w-full bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Concierge Phone Line
                    </label>
                    <input
                      type="text"
                      value={localSettings.phone}
                      onChange={e => setLocalSettings({ ...localSettings, phone: e.target.value })}
                      className="w-full bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Desk Hours
                    </label>
                    <input
                      type="text"
                      value={localSettings.businessHours}
                      onChange={e => setLocalSettings({ ...localSettings, businessHours: e.target.value })}
                      className="w-full bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Physical Headquarters Address
                  </label>
                  <input
                    type="text"
                    value={localSettings.businessAddress}
                    onChange={e => setLocalSettings({ ...localSettings, businessAddress: e.target.value })}
                    className="w-full bg-[#181826] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  Save Contact Settings
                </button>
              </form>
            )}
          </main>
        </div>
      </div>

      {/* COMPANION EDIT / CREATE MODAL */}
      {isCompanionModalOpen && editingCompanion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-[#0d0d12] border border-[#dfb76c]/50 rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xl font-display text-white">
                {editingCompanion.id ? 'Edit Companion Profile' : 'New Companion Profile'}
              </h3>
              <button
                onClick={() => setIsCompanionModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompanion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-neutral-300 mb-1">Display Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCompanion.displayName}
                    onChange={e => setEditingCompanion({ ...editingCompanion, displayName: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-neutral-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={editingCompanion.city}
                    onChange={e => setEditingCompanion({ ...editingCompanion, city: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-neutral-300 mb-1">Age *</label>
                  <input
                    type="number"
                    min={18}
                    required
                    value={editingCompanion.age}
                    onChange={e => setEditingCompanion({ ...editingCompanion, age: Number(e.target.value) })}
                    className="w-full bg-[#161622] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-neutral-300 mb-1">Companion Style / Category</label>
                  <input
                    type="text"
                    value={editingCompanion.profileType || ''}
                    onChange={e => setEditingCompanion({ ...editingCompanion, profileType: e.target.value })}
                    placeholder="e.g. Cultural & Opera Companion"
                    className="w-full bg-[#161622] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-neutral-300 mb-1">Primary Photo URL *</label>
                <input
                  type="url"
                  required
                  value={editingCompanion.photoUrl}
                  onChange={e => setEditingCompanion({ ...editingCompanion, photoUrl: e.target.value })}
                  className="w-full bg-[#161622] border border-white/10 rounded px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-neutral-300 mb-1">Biography *</label>
                <textarea
                  rows={3}
                  required
                  value={editingCompanion.bio}
                  onChange={e => setEditingCompanion({ ...editingCompanion, bio: e.target.value })}
                  className="w-full bg-[#161622] border border-white/10 rounded px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-neutral-300 mb-1">Interests (comma separated)</label>
                <input
                  type="text"
                  value={editingCompanion.interests?.join(', ')}
                  onChange={e => setEditingCompanion({ ...editingCompanion, interests: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full bg-[#161622] border border-white/10 rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-neutral-300 mb-1">Availability</label>
                <input
                  type="text"
                  value={editingCompanion.availability}
                  onChange={e => setEditingCompanion({ ...editingCompanion, availability: e.target.value })}
                  className="w-full bg-[#161622] border border-white/10 rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingCompanion.isPublished}
                    onChange={e => setEditingCompanion({ ...editingCompanion, isPublished: e.target.checked })}
                    className="rounded bg-black text-[#dfb76c]"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingCompanion.isFeatured}
                    onChange={e => setEditingCompanion({ ...editingCompanion, isFeatured: e.target.checked })}
                    className="rounded bg-black text-[#dfb76c]"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCompanionModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#181822] text-xs text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW APPLICATION DETAIL MODAL */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-[#0d0d12] border border-[#dfb76c]/50 rounded-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xl font-display text-white">Application Review</h3>
              <button onClick={() => setViewingApp(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={viewingApp.profilePhotos[0]}
                alt={viewingApp.displayName}
                referrerPolicy="no-referrer"
                className="w-20 h-24 rounded-lg object-cover border border-[#dfb76c]/40"
              />
              <div className="text-xs space-y-1">
                <h4 className="text-base font-display text-white">{viewingApp.displayName}</h4>
                <p><span className="text-neutral-500">Legal Name:</span> {viewingApp.fullName}</p>
                <p><span className="text-neutral-500">Contact:</span> {viewingApp.email} | {viewingApp.phone}</p>
                <p><span className="text-neutral-500">City:</span> {viewingApp.city}</p>
              </div>
            </div>

            <div className="text-xs space-y-2 bg-[#14141c] p-4 rounded-xl border border-white/5">
              <p><strong className="text-white">Languages:</strong> {viewingApp.languages?.join(', ')}</p>
              <p><strong className="text-white">Interests:</strong> {viewingApp.interests?.join(', ')}</p>
              <p><strong className="text-white">Availability:</strong> {viewingApp.availability}</p>
              <p><strong className="text-white">Bio / Statement:</strong></p>
              <p className="text-neutral-300 italic">{viewingApp.shortIntro}</p>
              {viewingApp.experience && (
                <p className="text-neutral-300 mt-2">{viewingApp.experience}</p>
              )}
            </div>

            {viewingApp.status === 'pending' && (
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => handleRejectApplication(viewingApp.id)}
                  className="px-4 py-2 rounded bg-rose-950/60 text-rose-300 text-xs font-semibold cursor-pointer"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleApproveApplication(viewingApp)}
                  className="px-5 py-2 rounded gold-btn text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Approve & Create Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
