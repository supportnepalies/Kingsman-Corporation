import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitCompanionApplication } from '../services/firebaseService';
import {
  Crown,
  Lock,
  Mail,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  FileText
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'apply';
  onSuccess: (targetPage: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onSuccess }) => {
  const {
    loginWithEmail,
    loginWithGoogle,
    registerClient,
    resetPassword,
    loginError,
    isRateLimited,
    switchDemoRole
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(
    initialMode === 'login' ? 'login' : 'register'
  );
  const [registerType, setRegisterType] = useState<'client' | 'companion'>(
    initialMode === 'apply' ? 'companion' : 'client'
  );

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  // Client registration fields
  const [clientDisplayName, setClientDisplayName] = useState('');
  const [clientCity, setClientCity] = useState('London');
  const [clientAge, setClientAge] = useState(28);
  const [clientTermsAccepted, setClientTermsAccepted] = useState(false);
  const [clientAgeConfirmed, setClientAgeConfirmed] = useState(false);

  // Companion application fields
  const [compFullName, setCompFullName] = useState('');
  const [compDisplayName, setCompDisplayName] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compCity, setCompCity] = useState('Mumbai');
  const [compLanguages, setCompLanguages] = useState('English, Hindi');
  const [compInterests, setCompInterests] = useState('Contemporary Art, Classical Music, Fine Dining');
  const [compIntro, setCompIntro] = useState('');
  const [compAvailability, setCompAvailability] = useState('Evenings and select weekends');
  const [compExperience, setCompExperience] = useState('');
  const [compPhotos, setCompPhotos] = useState<string>('/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg');
  const [compStatement, setCompStatement] = useState('');
  const [compAgeConfirmed, setCompAgeConfirmed] = useState(false);
  const [compPoliciesAccepted, setCompPoliciesAccepted] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please fill in both email and password.');
      return;
    }
    setIsSubmitting(true);
    setLocalError(null);
    const success = await loginWithEmail(email, password);
    setIsSubmitting(false);
    if (success) {
      if (email.toLowerCase().includes('admin') || email === 'onlyindiankitchen@gmail.com') {
        onSuccess('admin');
      } else {
        onSuccess('client-dashboard');
      }
    }
  };

  const handleClientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientAgeConfirmed) {
      setLocalError('You must confirm that you are at least 18 years of age.');
      return;
    }
    if (!clientTermsAccepted) {
      setLocalError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    const success = await registerClient({
      displayName: clientDisplayName,
      email,
      password,
      city: clientCity,
      age: Number(clientAge)
    });
    setIsSubmitting(false);
    if (success) {
      onSuccess('client-dashboard');
    }
  };

  const handleCompanionApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compAgeConfirmed) {
      setLocalError('Age confirmation (18+) is required for companion applications.');
      return;
    }
    if (!compPoliciesAccepted) {
      setLocalError('You must agree to Kingsman Corporation safety and companion policies.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      const photosList = compPhotos
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      await submitCompanionApplication({
        uid: `applicant-${Date.now()}`,
        fullName: compFullName,
        displayName: compDisplayName,
        email,
        phone: compPhone,
        city: compCity,
        isAgeConfirmed: true,
        languages: compLanguages.split(',').map(s => s.trim()),
        interests: compInterests.split(',').map(s => s.trim()),
        shortIntro: compIntro,
        availability: compAvailability,
        experience: compExperience,
        profilePhotos: photosList.length > 0 ? photosList : ['/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg'],
        applicationStatement: compStatement
      });

      setAppSubmitted(true);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setLocalError('Please enter your account email address.');
      return;
    }
    const msg = await resetPassword(email);
    setResetStatus(msg);
  };

  return (
    <div className="min-h-screen bg-[#08080a] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        {/* Crest */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full border-2 border-[#dfb76c]/60 mx-auto overflow-hidden shadow-[0_0_25px_rgba(223,183,108,0.35)]">
            <img
              src="/src/assets/images/kingsman_crest_1790586928168.jpg"
              alt="Kingsman Corporation Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[10px] tracking-[0.3em] text-[#dfb76c] uppercase block font-semibold">
            Member Portal
          </span>
          <h1 className="text-3xl font-display text-white tracking-wide">
            Kingsman Corporation
          </h1>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="flex bg-[#12121a] p-1 rounded-xl border border-white/10 max-w-md mx-auto">
          <button
            onClick={() => {
              setMode('login');
              setLocalError(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#dfb76c] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Login to Account
          </button>
          <button
            onClick={() => {
              setMode('register');
              setLocalError(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#dfb76c] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Register / Apply
          </button>
        </div>

        {/* Container */}
        <div className="bg-[#0f0f15] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          {/* Rate limiting notice */}
          {isRateLimited && (
            <div className="mb-6 p-4 rounded-lg bg-amber-950/40 border border-amber-600/50 flex items-center gap-3 text-xs text-amber-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>
                Security rate limit enabled. Multiple unsuccessful attempts recorded. Please wait 30 seconds before attempting again.
              </span>
            </div>
          )}

          {/* Errors */}
          {(loginError || localError) && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-950/40 border border-rose-600/50 text-xs text-rose-300">
              {loginError || localError}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && !forgotPasswordOpen && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#dfb76c]" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#dfb76c]" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-xs text-[#dfb76c] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isRateLimited}
                className="w-full py-3.5 rounded gold-btn text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>{isSubmitting ? 'Authenticating...' : 'Secure Sign In'}</span>
              </button>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full py-3 rounded bg-[#181824] hover:bg-[#222232] border border-white/10 text-neutral-300 hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue with Google</span>
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs text-neutral-400">
                    Quick test as owner?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      switchDemoRole('admin');
                      onSuccess('admin');
                    }}
                    className="text-xs text-[#dfb76c] hover:underline font-semibold cursor-pointer"
                  >
                    Owner Admin Quick Login
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD MODAL */}
          {forgotPasswordOpen && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <h3 className="text-lg font-display text-white">Reset Account Password</h3>
              <p className="text-xs text-neutral-400">
                Enter your registered email address to receive password reset instructions.
              </p>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Account Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              {resetStatus && (
                <p className="text-xs text-emerald-400 font-medium">{resetStatus}</p>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  Return to Sign In
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORMS (ONE PAGE, USER CHOOSES ROLE) */}
          {mode === 'register' && (
            <div className="space-y-6">
              {/* Role selection radio cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRegisterType('client');
                    setLocalError(null);
                  }}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    registerType === 'client'
                      ? 'bg-[#181826] border-[#dfb76c] shadow-[0_0_15px_rgba(223,183,108,0.2)]'
                      : 'bg-[#12121a] border-white/10 hover:border-white/20'
                  }`}
                >
                  <User className={`w-5 h-5 mb-2 ${registerType === 'client' ? 'text-[#dfb76c]' : 'text-neutral-400'}`} />
                  <span className="block font-medium text-white text-sm">
                    Looking for Companionship
                  </span>
                  <span className="text-xs text-neutral-400 block mt-1">
                    Private client account for booking vetted companions.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegisterType('companion');
                    setLocalError(null);
                  }}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    registerType === 'companion'
                      ? 'bg-[#181826] border-[#dfb76c] shadow-[0_0_15px_rgba(223,183,108,0.2)]'
                      : 'bg-[#12121a] border-white/10 hover:border-white/20'
                  }`}
                >
                  <Sparkles className={`w-5 h-5 mb-2 ${registerType === 'companion' ? 'text-[#dfb76c]' : 'text-neutral-400'}`} />
                  <span className="block font-medium text-white text-sm">
                    Applying as a Companion
                  </span>
                  <span className="text-xs text-neutral-400 block mt-1">
                    Submit credentials and bio for concierge review.
                  </span>
                </button>
              </div>

              {/* CLIENT REGISTRATION FORM */}
              {registerType === 'client' && (
                <form onSubmit={handleClientRegister} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                        Display Name / Pseudonym *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientDisplayName}
                        onChange={e => setClientDisplayName(e.target.value)}
                        placeholder="e.g. Lord Jonathan"
                        className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                        Primary City *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientCity}
                        onChange={e => setClientCity(e.target.value)}
                        placeholder="e.g. London / Zurich"
                        className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                        Age (Must be 18+) *
                      </label>
                      <input
                        type="number"
                        min={18}
                        max={99}
                        required
                        value={clientAge}
                        onChange={e => setClientAge(Number(e.target.value))}
                        className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                      Password (min 6 characters) *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>

                  {/* Legal Checkboxes */}
                  <div className="space-y-2 pt-2 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clientAgeConfirmed}
                        onChange={e => setClientAgeConfirmed(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 bg-black text-[#dfb76c] focus:ring-[#dfb76c]"
                      />
                      <span className="text-neutral-300">
                        I confirm that I am 18 years of age or older.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clientTermsAccepted}
                        onChange={e => setClientTermsAccepted(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 bg-black text-[#dfb76c] focus:ring-[#dfb76c]"
                      />
                      <span className="text-neutral-400">
                        I agree to Kingsman Corporation's Terms of Service, Privacy Policy, and 18+ Consent & Safety policies.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded gold-btn text-xs uppercase tracking-[0.16em] font-bold cursor-pointer shadow-lg disabled:opacity-50 mt-4"
                  >
                    {isSubmitting ? 'Creating Private Account...' : 'Complete Client Registration'}
                  </button>
                </form>
              )}

              {/* COMPANION APPLICATION FORM */}
              {registerType === 'companion' && (
                <div>
                  {appSubmitted ? (
                    <div className="text-center py-8 space-y-4">
                      <CheckCircle2 className="w-16 h-16 text-[#dfb76c] mx-auto" />
                      <h3 className="text-2xl font-display text-white">Application Received</h3>
                      <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                        Your private companion application has been dispatched to Kingsman Corporation administration.
                        Uploaded materials remain strictly confidential until verified and approved.
                      </p>
                      <button
                        onClick={() => onSuccess('home')}
                        className="mt-4 px-6 py-2.5 rounded gold-btn text-xs uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Return to Homepage
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCompanionApplication} className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                            Legal Full Name (Private) *
                          </label>
                          <input
                            type="text"
                            required
                            value={compFullName}
                            onChange={e => setCompFullName(e.target.value)}
                            placeholder="Private legal name"
                            className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                            Public Display Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={compDisplayName}
                            onChange={e => setCompDisplayName(e.target.value)}
                            placeholder="e.g. Genevieve L."
                            className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="contact@domain.com"
                            className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                            Phone (Private) *
                          </label>
                          <input
                            type="tel"
                            required
                            value={compPhone}
                            onChange={e => setCompPhone(e.target.value)}
                            placeholder="+44 7911 123456"
                            className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                            Base City *
                          </label>
                          <input
                            type="text"
                            required
                            value={compCity}
                            onChange={e => setCompCity(e.target.value)}
                            placeholder="London / Paris"
                            className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                            Languages Spoken
                          </label>
                          <input
                            type="text"
                            value={compLanguages}
                            onChange={e => setCompLanguages(e.target.value)}
                            placeholder="e.g. English, French, Italian"
                            className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                            Interests & Passions
                          </label>
                          <input
                            type="text"
                            value={compInterests}
                            onChange={e => setCompInterests(e.target.value)}
                            placeholder="Fine Art, Polo, Classical Piano"
                            className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                          Short Introduction & Bio *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={compIntro}
                          onChange={e => setCompIntro(e.target.value)}
                          placeholder="Summarize your background, education, and social interests..."
                          className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                          Social Availability & Scheduling
                        </label>
                        <input
                          type="text"
                          value={compAvailability}
                          onChange={e => setCompAvailability(e.target.value)}
                          placeholder="e.g. Evenings, galas, weekend travel"
                          className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                          Profile Photo URL(s) (One per line) *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={compPhotos}
                          onChange={e => setCompPhotos(e.target.value)}
                          placeholder="/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg"
                          className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                          Application Statement & Philosophy
                        </label>
                        <textarea
                          rows={2}
                          value={compStatement}
                          onChange={e => setCompStatement(e.target.value)}
                          placeholder="Why do you wish to join Kingsman Corporation? What standard of companionship do you bring?"
                          className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
                        />
                      </div>

                      {/* Legal & Age acknowledgments */}
                      <div className="space-y-2 pt-2 text-xs">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={compAgeConfirmed}
                            onChange={e => setCompAgeConfirmed(e.target.checked)}
                            className="mt-0.5 rounded border-white/20 bg-black text-[#dfb76c] focus:ring-[#dfb76c]"
                          />
                          <span className="text-neutral-300">
                            I confirm that I am 18 years of age or older.
                          </span>
                        </label>

                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={compPoliciesAccepted}
                            onChange={e => setCompPoliciesAccepted(e.target.checked)}
                            className="mt-0.5 rounded border-white/20 bg-black text-[#dfb76c] focus:ring-[#dfb76c]"
                          />
                          <span className="text-neutral-400">
                            I understand that Kingsman Corporation is strictly a lawful adult companionship service. Sexual services and prostitution are strictly prohibited.
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded gold-btn text-xs uppercase tracking-[0.16em] font-bold cursor-pointer shadow-lg disabled:opacity-50 mt-4"
                      >
                        {isSubmitting ? 'Submitting Application...' : 'Submit Companion Application'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
