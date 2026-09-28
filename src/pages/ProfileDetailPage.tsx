import React, { useState } from 'react';
import { CompanionProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Languages,
  Sparkles,
  Heart,
  Share2,
  ShieldCheck,
  ArrowLeft,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface ProfileDetailPageProps {
  profile: CompanionProfile;
  onBack: () => void;
  onBookNow: (profile: CompanionProfile) => void;
  onOpenReport: (targetId: string, targetName: string) => void;
}

export const ProfileDetailPage: React.FC<ProfileDetailPageProps> = ({
  profile,
  onBack,
  onBookNow,
  onOpenReport
}) => {
  const { clientProfile, updateProfileData, userAccount } = useAuth();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const isSaved = clientProfile?.savedCompanionIds?.includes(profile.id) || false;

  const toggleSave = async () => {
    if (!clientProfile) return;
    const current = clientProfile.savedCompanionIds || [];
    const updated = isSaved
      ? current.filter(id => id !== profile.id)
      : [...current, profile.id];
    await updateProfileData({ savedCompanionIds: updated });
  };

  const allPhotos = profile.gallery && profile.gallery.length > 0 ? profile.gallery : [profile.photoUrl];

  return (
    <div className="min-h-screen bg-[#08080a] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-400 hover:text-[#dfb76c] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Companions</span>
          </button>

          <div className="flex items-center gap-3">
            {userAccount && (
              <button
                onClick={toggleSave}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                    : 'bg-[#151520] border-white/10 text-neutral-400 hover:text-white'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save profile'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>
            )}

            <button
              onClick={() => onOpenReport(profile.id, profile.displayName)}
              className="p-2.5 rounded-full bg-[#151520] border border-white/10 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Report profile concern"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cinematic Header & Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Frame */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#dfb76c]/40 bg-[#12121a] shadow-2xl">
              <img
                src={allPhotos[activePhotoIdx]}
                alt={profile.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Bottom Quick Info */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 text-xs text-[#dfb76c] uppercase tracking-wider font-semibold mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.city}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-medium text-white">
                  {profile.displayName.replace(/\s*\[demo\]/gi, '').trim()}
                </h1>
                <p className="text-sm text-neutral-300 font-serif italic mt-0.5">
                  Age {profile.age} &bull; {profile.profileType || 'Social & Lifestyle Companion'}
                </p>
              </div>
            </div>

            {/* Thumbnail Row */}
            {allPhotos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allPhotos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      activePhotoIdx === i
                        ? 'border-[#dfb76c] ring-2 ring-[#dfb76c]/30'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Booking Box */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary Action Card */}
            <div className="glass-card-gold rounded-2xl p-8 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#dfb76c] font-semibold">
                    Concierge Reservation
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Booking Open</span>
                  </div>
                </div>
                <h3 className="text-2xl font-display text-white mt-1">
                  Request Lawful Companionship
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Arrange refined company for an upcoming private dinner, evening gala, theater premiere, or weekend cultural itinerary.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#dfb76c]" />
                  <span>Availability: {profile.availability}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Languages className="w-4 h-4 text-[#dfb76c]" />
                  <span>Languages: {profile.languages?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#dfb76c]" />
                  <span>Mediated by Kingsman Corporation Concierge</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => onBookNow(profile)}
                className="w-full py-4 rounded gold-btn text-xs uppercase tracking-[0.18em] font-bold shadow-[0_4px_25px_rgba(223,183,108,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Book Now</span>
              </button>

              <div className="p-3 bg-[#13131b] border border-white/5 rounded text-[11px] text-neutral-400 leading-relaxed text-center">
                Strict adherence to 18+ adult companionship. Prostitution, sexual solicitations, and any unlawful services are strictly prohibited.
              </div>
            </div>

            {/* About / Bio */}
            <div className="bg-[#0f0f15] border border-white/10 rounded-2xl p-8 space-y-4">
              <h3 className="text-lg font-display text-white tracking-wide">
                About {profile.displayName.replace(/\s*\[demo\]/gi, '').trim()}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>

              {/* Interests Tags */}
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2.5">
                  Passions & Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded bg-[#181824] text-neutral-200 border border-white/5"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
