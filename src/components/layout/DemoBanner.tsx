import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ShieldCheck, UserCheck, Eye, LogOut } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isAdmin, isClient, isApplicant, userAccount, switchDemoRole, logout } = useAuth();

  return (
    <div className="bg-[#0f0e0c] border-b border-[#dfb76c]/25 text-neutral-300 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-[#dfb76c] uppercase tracking-wider text-[10px] bg-[#dfb76c]/10 px-2 py-0.5 rounded border border-[#dfb76c]/30">
            <Sparkles className="w-3 h-3 text-[#dfb76c]" /> Demo Environment
          </span>
          <span className="hidden md:inline text-neutral-400">
            Profiles & bookings shown are demonstration records. No credit card required.
          </span>
        </div>

        {/* Quick Role Persona Switcher for non-technical evaluation */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-neutral-400 mr-1 hidden sm:inline">Active Persona:</span>

          <button
            onClick={() => switchDemoRole('admin')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              isAdmin
                ? 'bg-[#dfb76c] text-black font-semibold shadow-[0_0_10px_rgba(223,183,108,0.4)]'
                : 'bg-[#181822] hover:bg-[#252535] text-neutral-300 border border-white/10'
            }`}
            title="Owner Admin Account (onlyindiankitchen@gmail.com)"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => switchDemoRole('client')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              isClient && !isAdmin
                ? 'bg-[#dfb76c] text-black font-semibold shadow-[0_0_10px_rgba(223,183,108,0.4)]'
                : 'bg-[#181822] hover:bg-[#252535] text-neutral-300 border border-white/10'
            }`}
            title="Private Registered Client (Lord Jonathan Vance)"
          >
            <UserCheck className="w-3 h-3" />
            <span>Client</span>
          </button>

          <button
            onClick={() => switchDemoRole('applicant')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              isApplicant
                ? 'bg-[#dfb76c] text-black font-semibold shadow-[0_0_10px_rgba(223,183,108,0.4)]'
                : 'bg-[#181822] hover:bg-[#252535] text-neutral-300 border border-white/10'
            }`}
            title="Prospective Companion Applicant"
          >
            <span>Applicant</span>
          </button>

          <button
            onClick={() => switchDemoRole('visitor')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              !userAccount
                ? 'bg-neutral-200 text-black font-semibold'
                : 'bg-[#181822] hover:bg-[#252535] text-neutral-400 border border-white/10'
            }`}
            title="Public Anonymous Visitor"
          >
            <Eye className="w-3 h-3" />
            <span>Visitor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
