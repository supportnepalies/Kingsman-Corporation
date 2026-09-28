import React, { useState } from 'react';
import { useAgeGate } from '../../context/AgeGateContext';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export const AgeGateModal: React.FC = () => {
  const { isAgeConfirmed, confirmAge } = useAgeGate();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);

  if (isAgeConfirmed) return null;

  const handleConfirm = () => {
    if (!isChecked) {
      setError(true);
      return;
    }
    confirmAge();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full bg-[#0d0d12] border border-[#dfb76c]/40 rounded-xl p-8 shadow-2xl text-center space-y-6">
        {/* Crest */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#181822] border border-[#dfb76c]/50 flex items-center justify-center text-[#dfb76c] shadow-[0_0_20px_rgba(223,183,108,0.2)]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfb76c] font-semibold">
            Strictly 18+ Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-display text-white mt-1">
            Kingsman Corporation
          </h2>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            You are entering an exclusive adult dating and companionship service. Our platform connects consenting adults for lawful, dignified companionship and high-society experiences.
          </p>
        </div>

        <div className="bg-[#14141c] border border-white/5 rounded-lg p-4 text-left space-y-2 text-xs text-neutral-300">
          <div className="flex items-center gap-2 text-[#dfb76c] font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>Age Verification Notice</span>
          </div>
          <p className="text-neutral-400">
            By proceeding, you attest that you are at least 18 years old (or the legal age of majority in your jurisdiction). Kingsman Corporation strictly prohibits prostitution, sexual solicitation, trafficking, and any illegal services.
          </p>
        </div>

        <div className="pt-2">
          <label className="flex items-center justify-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e.target.checked);
                if (error) setError(false);
              }}
              className="w-5 h-5 rounded border-[#dfb76c]/50 bg-black/50 text-[#dfb76c] focus:ring-[#dfb76c] cursor-pointer"
            />
            <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#dfb76c] transition-colors">
              I confirm that I am 18 years of age or older.
            </span>
          </label>
          {error && (
            <p className="text-xs text-amber-400 mt-2 font-medium">
              Please check the confirmation box to enter the platform.
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 px-6 rounded-md gold-btn font-medium uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4" />
            Enter Platform
          </button>
          <a
            href="https://www.google.com"
            className="w-full py-3.5 px-6 rounded-md bg-[#16161f] border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white text-xs font-medium uppercase tracking-wider transition-colors text-center"
          >
            I am under 18 (Exit)
          </a>
        </div>

        <p className="text-[11px] text-neutral-500">
          Kingsman Corporation &bull; Mayfair, London &bull; All interactions subject to Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
