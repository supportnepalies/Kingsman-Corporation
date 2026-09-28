import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Crown,
  Menu,
  X,
  User,
  Shield,
  Bell,
  MessageSquare,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  openBookingForCompanion?: (companionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { userAccount, clientProfile, isAdmin, isClient, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'discover', label: 'Discover' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'apply', label: 'Join Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08080a]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Crest */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <img
            src="/src/assets/images/kingsman_crest_1790586928168.jpg"
            alt="Kingsman Corporation Logo"
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-full object-cover border border-[#dfb76c]/60 shadow-[0_0_18px_rgba(223,183,108,0.35)] group-hover:scale-105 transition-transform duration-300 shrink-0"
          />
          <div>
            <span className="font-display font-bold tracking-[0.2em] text-white text-base sm:text-lg block leading-tight group-hover:text-[#dfb76c] transition-colors">
              KINGSMAN
            </span>
            <span className="text-[10px] tracking-[0.35em] text-[#dfb76c] uppercase block font-medium">
              Corporation
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer py-1 relative ${
                activePage === item.id
                  ? 'text-[#dfb76c]'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {item.label}
              {activePage === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#dfb76c] to-transparent animate-in fade-in" />
              )}
            </button>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('admin')}
                className={`py-2.5 px-4 rounded text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activePage === 'admin'
                    ? 'bg-[#dfb76c] text-black shadow-[0_0_15px_rgba(223,183,108,0.3)]'
                    : 'bg-[#181824] border border-[#dfb76c]/40 text-[#dfb76c] hover:bg-[#202030]'
                }`}
              >
                <Shield className="w-4 h-4 text-[#dfb76c]" />
                Admin Suite
              </button>
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : isClient ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('client-dashboard')}
                className={`py-2.5 px-4 rounded text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activePage === 'client-dashboard'
                    ? 'bg-[#dfb76c] text-black shadow-[0_0_15px_rgba(223,183,108,0.3)]'
                    : 'bg-[#151520] border border-white/10 hover:border-[#dfb76c]/40 text-neutral-200'
                }`}
              >
                <User className="w-4 h-4 text-[#dfb76c]" />
                <span>{clientProfile?.displayName || 'My Dashboard'}</span>
              </button>
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('login')}
                className="text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-white px-3 py-2 cursor-pointer transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="py-2.5 px-5 rounded gold-btn text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="p-2 text-[#dfb76c] bg-[#1a1a24] rounded border border-[#dfb76c]/30 text-xs flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
          )}
          {isClient && (
            <button
              onClick={() => handleNavClick('client-dashboard')}
              className="p-2 text-[#dfb76c] bg-[#1a1a24] rounded border border-white/10 text-xs flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white rounded focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d12] border-b border-[#dfb76c]/20 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-3 px-3 rounded flex items-center justify-between text-sm uppercase tracking-wider font-medium cursor-pointer ${
                  activePage === item.id
                    ? 'bg-[#dfb76c]/10 text-[#dfb76c] font-semibold border-l-2 border-[#dfb76c]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            {isAdmin ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-3 rounded bg-[#dfb76c] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Suite
              </button>
            ) : isClient ? (
              <button
                onClick={() => handleNavClick('client-dashboard')}
                className="w-full py-3 rounded bg-[#dfb76c] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Client Dashboard
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full py-3 rounded gold-btn font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Account
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 rounded bg-[#181822] text-white border border-white/10 font-semibold text-xs uppercase tracking-wider"
                >
                  Login to Account
                </button>
              </div>
            )}

            {userAccount && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
