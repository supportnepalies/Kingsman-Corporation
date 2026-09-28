import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookingRequest,
  Message,
  AppNotification,
  CompanionProfile,
  ClientProfile
} from '../types';
import {
  fetchClientBookings,
  updateBookingStatus,
  fetchMessages,
  sendMessage,
  fetchNotifications,
  markNotificationRead,
  fetchCompanionProfiles,
  submitSupportTicket
} from '../services/firebaseService';
import {
  User,
  Calendar,
  Heart,
  MessageSquare,
  Bell,
  HelpCircle,
  Settings,
  Compass,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Shield,
  Eye,
  Lock,
  LogOut,
  Sparkles
} from 'lucide-react';

interface ClientDashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectCompanion: (profile: CompanionProfile) => void;
}

export const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({
  onNavigate,
  onSelectCompanion
}) => {
  const { userAccount, clientProfile, updateProfileData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'requests' | 'saved' | 'messages' | 'notifications' | 'support' | 'settings'
  >('requests');

  // Bookings
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  // Messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  // All companions for saved lookup
  const [companions, setCompanions] = useState<CompanionProfile[]>([]);

  // Profile edit state
  const [editDisplayName, setEditDisplayName] = useState(clientProfile?.displayName || '');
  const [editAge, setEditAge] = useState(clientProfile?.age || 30);
  const [editCity, setEditCity] = useState(clientProfile?.city || 'London');
  const [editPhotoUrl, setEditPhotoUrl] = useState(clientProfile?.photoUrl || '');
  const [editShortIntro, setEditShortIntro] = useState(clientProfile?.shortIntro || '');
  const [editInterests, setEditInterests] = useState(clientProfile?.interests?.join(', ') || '');
  const [editPreferredAge, setEditPreferredAge] = useState(clientProfile?.preferredAgeRange || '21-40');
  const [editPreferredCity, setEditPreferredCity] = useState(clientProfile?.preferredCity || 'London');
  const [editLanguages, setEditLanguages] = useState(clientProfile?.languages?.join(', ') || 'English');
  const [editAvailability, setEditAvailability] = useState(clientProfile?.availability || 'Weekends');
  const [editVisibility, setEditVisibility] = useState<'registered_only' | 'private'>(
    clientProfile?.profileVisibility || 'registered_only'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Support ticket form
  const [supportCategory, setSupportCategory] = useState('Booking Inquiry');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);

  useEffect(() => {
    if (!userAccount) return;
    loadData();
  }, [userAccount]);

  const loadData = async () => {
    if (!userAccount) return;
    try {
      const [bList, mList, nList, cList] = await Promise.all([
        fetchClientBookings(userAccount.uid),
        fetchMessages(userAccount.uid, false),
        fetchNotifications(userAccount.uid),
        fetchCompanionProfiles()
      ]);
      setBookings(bList);
      setMessages(mList);
      setNotifications(nList);
      setCompanions(cList);
    } catch (e) {
      console.warn('Dashboard data fetch notice:', e);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, 'cancelled');
    loadData();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !userAccount) return;
    await sendMessage({
      conversationId: `conv-${userAccount.uid}`,
      senderId: userAccount.uid,
      senderName: clientProfile?.displayName || userAccount.email.split('@')[0],
      senderRole: 'client',
      recipientId: 'admin',
      content: replyText.trim()
    });
    setReplyText('');
    loadData();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      displayName: editDisplayName,
      age: Number(editAge),
      city: editCity,
      photoUrl: editPhotoUrl,
      shortIntro: editShortIntro,
      interests: editInterests.split(',').map(s => s.trim()).filter(Boolean),
      preferredAgeRange: editPreferredAge,
      preferredCity: editPreferredCity,
      languages: editLanguages.split(',').map(s => s.trim()).filter(Boolean),
      availability: editAvailability,
      profileVisibility: editVisibility
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim() || !userAccount) return;
    await submitSupportTicket({
      name: clientProfile?.displayName || userAccount.email,
      email: userAccount.email,
      category: supportCategory,
      message: supportMessage
    });
    setSupportMessage('');
    setSupportSuccess(true);
    setTimeout(() => setSupportSuccess(false), 4000);
  };

  const savedCompanions = companions.filter(c =>
    clientProfile?.savedCompanionIds?.includes(c.id)
  );

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#08080a] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  clientProfile?.photoUrl ||
                  '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg'
                }
                alt={clientProfile?.displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#dfb76c]/60"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#dfb76c] font-semibold">
                  Private Client Account
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1c1c28] text-neutral-400 border border-white/5">
                  ID: {userAccount?.uid.slice(0, 8)}...
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display text-white mt-0.5">
                {clientProfile?.displayName || 'Distinguished Member'}
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                {clientProfile?.city || 'London'} &bull; Discretion Status: {clientProfile?.profileVisibility === 'private' ? 'Confidential' : 'Registered Only'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('discover')}
              className="px-5 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Compass className="w-4 h-4 text-black" />
              <span>Browse Companions</span>
            </button>
            <button
              onClick={logout}
              className="p-2.5 rounded-lg bg-[#181822] hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-[#0f0f15] border border-white/10 rounded-2xl p-4 space-y-1.5 shadow-xl">
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-[#dfb76c] text-black shadow'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>My Requests</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'requests' ? 'bg-black/20 text-black' : 'bg-[#181824] text-neutral-400'}`}>
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#dfb76c] text-black shadow'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Concierge Messages</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-[#dfb76c] text-black shadow'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Saved Profiles</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'saved' ? 'bg-black/20 text-black' : 'bg-[#181824] text-neutral-400'}`}>
                {savedCompanions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#dfb76c] text-black shadow'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#dfb76c] text-black shadow'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-[#dfb76c] text-black shadow'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Concierge Support</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#dfb76c] text-black shadow'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Privacy</span>
            </button>
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-9 bg-[#0f0f15] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl min-h-[500px]">
            {/* TAB: REQUESTS */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-display text-white">Companionship Requests</h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Track the status of your lawful booking inquiries mediated by Kingsman Corporation.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('discover')}
                    className="px-4 py-2 rounded gold-btn-outline text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    + New Request
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <Calendar className="w-12 h-12 text-neutral-600 mx-auto" />
                    <h3 className="text-lg font-display text-white">No Active Requests</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      You haven't scheduled any companion engagements yet. Browse our curated companion roster to reserve your first arrangement.
                    </p>
                    <button
                      onClick={() => onNavigate('discover')}
                      className="px-5 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                    >
                      Browse Companions
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-[#14141c] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          {booking.companionPhotoUrl ? (
                            <img
                              src={booking.companionPhotoUrl}
                              alt={booking.companionDisplayName}
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 rounded-lg object-cover border border-[#dfb76c]/40"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-[#1c1c28] flex items-center justify-center text-[#dfb76c]">
                              <User className="w-6 h-6" />
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-[#dfb76c] font-semibold">
                                {booking.referenceNumber}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                                  booking.status === 'approved'
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                                    : booking.status === 'pending'
                                    ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                                    : booking.status === 'completed'
                                    ? 'bg-blue-950/60 text-blue-400 border border-blue-500/40'
                                    : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>

                            <h3 className="text-base font-display text-white mt-1">
                              With {booking.companionDisplayName}
                            </h3>

                            <div className="text-xs text-neutral-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                              <span>Date: {booking.preferredDate}</span>
                              <span>Time: {booking.preferredTime}</span>
                              <span>City: {booking.city}</span>
                            </div>

                            {booking.adminNotes && (
                              <p className="text-xs text-[#dfb76c] mt-2 italic bg-[#1c1c28] p-2 rounded">
                                Concierge Note: {booking.adminNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3.5 py-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800/40 cursor-pointer"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MESSAGES (CLIENT <-> ADMIN ONLY) */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-display text-white">Concierge Messaging</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Direct confidential communications with Kingsman Corporation management. Direct client-to-companion messaging is disabled to protect member privacy and security.
                  </p>
                </div>

                <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 h-80 overflow-y-auto space-y-3">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-2">
                      <MessageSquare className="w-8 h-8 text-neutral-600" />
                      <p className="text-xs">No messages yet in your concierge thread.</p>
                      <p className="text-[11px] text-neutral-600">
                        Type a message below to connect with the Kingsman concierge desk.
                      </p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.senderRole === 'client';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md p-3.5 rounded-xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-[#dfb76c] text-black font-medium rounded-tr-none'
                                : 'bg-[#181824] text-neutral-200 border border-white/10 rounded-tl-none'
                            }`}
                          >
                            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-75">
                              {isMe ? 'You' : 'Kingsman Concierge'}
                            </span>
                            <p>{m.content}</p>
                          </div>
                          <span className="text-[10px] text-neutral-500 mt-1 px-1">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Inquire about a booking, schedule adjustments, or membership concierge..."
                    className="flex-1 bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB: SAVED PROFILES */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-display text-white">Saved Companion Profiles</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Bookmarked companions for upcoming executive functions, dining, or cultural outings.
                  </p>
                </div>

                {savedCompanions.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Heart className="w-10 h-10 text-neutral-600 mx-auto" />
                    <h3 className="text-lg font-display text-white">No Saved Companions</h3>
                    <p className="text-xs text-neutral-400">
                      Click the heart icon on any companion profile to bookmark them here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedCompanions.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectCompanion(p)}
                        className="bg-[#14141c] border border-white/5 hover:border-[#dfb76c]/40 rounded-xl p-4 flex gap-4 cursor-pointer transition-all"
                      >
                        <img
                          src={p.photoUrl}
                          alt={p.displayName}
                          referrerPolicy="no-referrer"
                          className="w-20 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-display font-medium text-white text-base">
                              {p.displayName.replace(' [Demo]', '')}
                            </h4>
                            <span className="text-xs text-[#dfb76c]">
                              {p.city} &bull; Age {p.age}
                            </span>
                            <p className="text-xs text-neutral-400 line-clamp-1 mt-1 font-serif italic">
                              {p.profileType}
                            </p>
                          </div>
                          <span className="text-[11px] text-[#dfb76c] font-semibold underline">
                            View Profile & Book
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-display text-white">Member Notifications</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Real-time updates regarding your booking requests and concierge announcements.
                  </p>
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 text-xs">
                    No notifications at this time.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          n.isRead
                            ? 'bg-[#12121a] border-white/5 text-neutral-400'
                            : 'bg-[#181826] border-[#dfb76c]/40 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-xs text-white">{n.title}</h4>
                          <span className="text-[10px] text-neutral-500">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: EDIT PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-display text-white">Client Profile Details</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Update your private preferences and personal details.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile settings successfully updated.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editDisplayName}
                      onChange={e => setEditDisplayName(e.target.value)}
                      className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Primary City *
                    </label>
                    <input
                      type="text"
                      required
                      value={editCity}
                      onChange={e => setEditCity(e.target.value)}
                      className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min={18}
                      value={editAge}
                      onChange={e => setEditAge(Number(e.target.value))}
                      className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Avatar / Photo URL
                    </label>
                    <input
                      type="text"
                      value={editPhotoUrl}
                      onChange={e => setEditPhotoUrl(e.target.value)}
                      className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Introduction & Lifestyle Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editShortIntro}
                    onChange={e => setEditShortIntro(e.target.value)}
                    className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Interests (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editInterests}
                      onChange={e => setEditInterests(e.target.value)}
                      className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Languages Spoken
                    </label>
                    <input
                      type="text"
                      value={editLanguages}
                      onChange={e => setEditLanguages(e.target.value)}
                      className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            )}

            {/* TAB: SUPPORT */}
            {activeTab === 'support' && (
              <form onSubmit={handleSendSupport} className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-display text-white">Concierge Support Desk</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Submit private inquiries regarding account questions, bespoke arrangements, or privacy.
                  </p>
                </div>

                {supportSuccess && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg">
                    Your concierge ticket has been opened. Our team will review and reply via messaging.
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={supportCategory}
                    onChange={e => setSupportCategory(e.target.value)}
                    className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Booking Inquiry">Booking Inquiry</option>
                    <option value="Special Dietary / Event Request">Special Dietary / Event Request</option>
                    <option value="Discretion / Privacy">Discretion / Privacy</option>
                    <option value="Account Settings">Account Settings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={supportMessage}
                    onChange={e => setSupportMessage(e.target.value)}
                    placeholder="How may our private concierge assist you?"
                    className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  Dispatch Ticket
                </button>
              </form>
            )}

            {/* TAB: SETTINGS & PRIVACY */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-display text-white">Privacy & Visibility Settings</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Kingsman Corporation guarantees strict adherence to member discretion.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#14141c] border border-white/5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-white font-medium">
                        <Lock className="w-4 h-4 text-[#dfb76c]" />
                        <span>Profile Visibility Status</span>
                      </div>
                      <select
                        value={editVisibility}
                        onChange={async (e) => {
                          const val = e.target.value as any;
                          setEditVisibility(val);
                          await updateProfileData({ profileVisibility: val });
                        }}
                        className="bg-[#1c1c28] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="registered_only">Visible to Registered Members Only</option>
                        <option value="private">Completely Private (Concierge Only)</option>
                      </select>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      In accordance with our privacy framework, your personal phone number, real name, email, and home address are never made public.
                    </p>
                  </div>

                  <div className="p-4 bg-[#14141c] border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm text-white font-medium">Session & Sign Out</h4>
                      <p className="text-xs text-neutral-400">
                        Securely terminate your current session on this device.
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/40 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
