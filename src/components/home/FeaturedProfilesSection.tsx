import React from 'react';
import { CompanionProfile } from '../../types';
import { Sparkles, MapPin, ArrowRight, Heart } from 'lucide-react';

interface FeaturedProfilesSectionProps {
  profiles: CompanionProfile[];
  onSelectProfile: (profile: CompanionProfile) => void;
  onNavigate: (page: string) => void;
}

export const FeaturedProfilesSection: React.FC<FeaturedProfilesSectionProps> = ({
  profiles,
  onSelectProfile,
  onNavigate
}) => {
  const featured = profiles.filter(p => p.isPublished && p.isFeatured).slice(0, 4);

  return (
    <section className="py-24 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Companionship</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white tracking-wide">
              Featured Companions
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-xl">
              Articulate, poised, and cultured companions available for high-profile galas, dining, and lifestyle experiences.
            </p>
          </div>

          <button
            onClick={() => onNavigate('discover')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-bold text-[#dfb76c] hover:text-[#f3d28d] transition-colors py-2 cursor-pointer group"
          >
            <span>Explore All Profiles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((profile) => (
            <div
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-[#111116] border border-white/10 hover:border-[#dfb76c]/50 transition-all duration-500 shadow-xl flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#181822]">
                <img
                  src={profile.photoUrl}
                  alt={profile.displayName}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-black/20" />

                {/* City badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                  <MapPin className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>{profile.city}</span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-display font-medium text-white group-hover:text-[#dfb76c] transition-colors">
                      {profile.displayName.replace(/\s*\[demo\]/gi, '').trim()}
                    </h3>
                    <span className="text-xs text-neutral-400 font-sans font-medium">
                      Age {profile.age}
                    </span>
                  </div>

                  <p className="text-xs text-[#dfb76c]/80 mb-3 italic font-serif line-clamp-1">
                    {profile.profileType || 'Cultural Companion'}
                  </p>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {profile.bio}
                  </p>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {profile.interests.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#181822] text-neutral-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#dfb76c] group-hover:underline">
                    View Profile
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#dfb76c] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
