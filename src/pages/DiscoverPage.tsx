import React, { useState, useMemo } from 'react';
import { CompanionProfile } from '../types';
import { Search, MapPin, Filter, Sparkles, ChevronRight, X, ShieldAlert } from 'lucide-react';

interface DiscoverPageProps {
  profiles: CompanionProfile[];
  onSelectProfile: (profile: CompanionProfile) => void;
  onOpenReport: (targetId: string, targetName: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  profiles,
  onSelectProfile,
  onOpenReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [ageRange, setAgeRange] = useState<'all' | '21-27' | '28-33' | '34+'>('all');
  const [selectedProfileType, setSelectedProfileType] = useState('All');

  // Cities list from profiles
  const cities = useMemo(() => {
    const list = Array.from(new Set(profiles.map(p => p.city))).filter(Boolean);
    return ['All', ...list];
  }, [profiles]);

  // Languages list
  const languages = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach(p => p.languages?.forEach(l => set.add(l)));
    return ['All', ...Array.from(set)];
  }, [profiles]);

  // Profile types
  const profileTypes = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach(p => {
      if (p.profileType) set.add(p.profileType);
    });
    return ['All', ...Array.from(set)];
  }, [profiles]);

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      if (!p.isPublished) return false;

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = p.displayName.toLowerCase().includes(term);
        const matchesBio = p.bio.toLowerCase().includes(term);
        const matchesCity = p.city.toLowerCase().includes(term);
        const matchesInterest = p.interests?.some(i => i.toLowerCase().includes(term));
        if (!matchesName && !matchesBio && !matchesCity && !matchesInterest) return false;
      }

      // City filter
      if (selectedCity !== 'All' && p.city !== selectedCity) return false;

      // Language filter
      if (selectedLanguage !== 'All' && !p.languages?.includes(selectedLanguage)) return false;

      // Profile type filter
      if (selectedProfileType !== 'All' && p.profileType !== selectedProfileType) return false;

      // Age range filter
      if (ageRange === '21-27' && (p.age < 21 || p.age > 27)) return false;
      if (ageRange === '28-33' && (p.age < 28 || p.age > 33)) return false;
      if (ageRange === '34+' && p.age < 34) return false;

      return true;
    });
  }, [profiles, searchTerm, selectedCity, selectedLanguage, ageRange, selectedProfileType]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('All');
    setSelectedLanguage('All');
    setAgeRange('all');
    setSelectedProfileType('All');
  };

  const hasActiveFilters =
    searchTerm || selectedCity !== 'All' || selectedLanguage !== 'All' || ageRange !== 'all' || selectedProfileType !== 'All';

  return (
    <div className="min-h-screen bg-[#08080a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Companionship Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display text-white tracking-wide">
            Discover Exceptional Companions
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Browse our vetted roster of cultured companions for galas, dining, and premier lifestyle events. All bookings are managed via our private concierge.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#0f0f15] border border-white/10 rounded-xl p-6 shadow-xl space-y-5">
          {/* Top Search Line */}
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by companion name, city, interest (e.g. Opera, Wine, Horology)..."
              className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Granular Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {/* City */}
            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                City / Location
              </label>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full bg-[#181824] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-white focus:outline-none"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Age Range
              </label>
              <select
                value={ageRange}
                onChange={e => setAgeRange(e.target.value as any)}
                className="w-full bg-[#181824] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-white focus:outline-none"
              >
                <option value="all">All Ages (18+)</option>
                <option value="21-27">21 - 27 Years</option>
                <option value="28-33">28 - 33 Years</option>
                <option value="34+">34+ Years</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Languages Spoken
              </label>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="w-full bg-[#181824] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-white focus:outline-none"
              >
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Style / Profile Type */}
            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Companion Style
              </label>
              <select
                value={selectedProfileType}
                onChange={e => setSelectedProfileType(e.target.value)}
                className="w-full bg-[#181824] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-white focus:outline-none"
              >
                {profileTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-neutral-400">
                Showing {filteredProfiles.length} of {profiles.length} companion profiles
              </span>
              <button
                onClick={resetFilters}
                className="text-[#dfb76c] hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-20 bg-[#0f0f15] border border-white/5 rounded-xl p-8 space-y-4">
            <Filter className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-xl font-display text-white">No Profiles Match Your Criteria</h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Try adjusting your search criteria or resetting filters to view available companions.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="group rounded-xl overflow-hidden bg-[#111116] border border-white/10 hover:border-[#dfb76c]/60 transition-all duration-500 shadow-xl flex flex-col justify-between"
              >
                {/* Image Frame */}
                <div
                  onClick={() => onSelectProfile(profile)}
                  className="relative aspect-[3/4] overflow-hidden bg-[#181822] cursor-pointer"
                >
                  <img
                    src={profile.photoUrl}
                    alt={profile.displayName}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-black/25" />

                  {/* Location badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-black/70 backdrop-blur-sm px-3 py-1 rounded">
                    <MapPin className="w-3.5 h-3.5 text-[#dfb76c]" />
                    <span>{profile.city}</span>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        onClick={() => onSelectProfile(profile)}
                        className="text-xl font-display font-medium text-white group-hover:text-[#dfb76c] transition-colors cursor-pointer"
                      >
                        {profile.displayName.replace(/\s*\[demo\]/gi, '').trim()}
                      </h3>
                      <span className="text-xs text-neutral-400 font-medium">
                        Age {profile.age}
                      </span>
                    </div>

                    <p className="text-xs text-[#dfb76c]/80 mb-3 italic font-serif">
                      {profile.profileType || 'Social & Cultural Companion'}
                    </p>

                    <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                      {profile.bio}
                    </p>

                    {/* Interests pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {profile.interests.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-0.5 rounded bg-[#181822] text-neutral-300 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => onSelectProfile(profile)}
                      className="text-xs uppercase tracking-wider font-bold text-[#dfb76c] hover:text-[#f8dfa8] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Profile & Bio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReport(profile.id, profile.displayName);
                      }}
                      title="Report concern"
                      className="text-neutral-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
