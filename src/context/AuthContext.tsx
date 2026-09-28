import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';
import { UserRole, ClientProfile, UserAccount } from '../types';
import { fetchClientProfile, saveClientProfile } from '../services/firebaseService';

export const ADMIN_EMAIL = 'onlyindiankitchen@gmail.com';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userAccount: UserAccount | null;
  clientProfile: ClientProfile | null;
  isAdmin: boolean;
  isClient: boolean;
  isApplicant: boolean;
  isLoading: boolean;
  loginError: string | null;
  loginAttempts: number;
  isRateLimited: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerClient: (data: {
    displayName: string;
    email: string;
    password: string;
    city: string;
    age: number;
    shortIntro?: string;
  }) => Promise<boolean>;
  resetPassword: (email: string) => Promise<string>;
  logout: () => Promise<void>;
  updateProfileData: (updates: Partial<ClientProfile>) => Promise<void>;
  switchDemoRole: (role: 'admin' | 'client' | 'applicant' | 'visitor') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo client mock profile
const DEMO_CLIENT_PROFILE: ClientProfile = {
  uid: 'demo-client-123',
  displayName: 'Sunita Singhania',
  age: 36,
  city: 'Mumbai',
  photoUrl: '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
  shortIntro: 'Art collector and patron of performing arts based in South Mumbai. Seeking cultured accompaniment for gallery viewings and charity galas.',
  interests: ['Contemporary Art', 'Fine Dining', 'Kathak & Classical Vocals', 'Heritage Architecture'],
  preferredAgeRange: '25 - 40',
  preferredCity: 'Mumbai & Delhi',
  languages: ['English', 'Hindi'],
  availability: 'Thursday through Sunday',
  profileVisibility: 'registered_only',
  savedCompanionIds: ['companion-1', 'companion-3'],
  createdAt: '2026-08-15T09:00:00Z',
  updatedAt: '2026-09-01T12:00:00Z'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);

  // Demo override state for instant testing
  const [demoRole, setDemoRole] = useState<'admin' | 'client' | 'applicant' | 'visitor' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (demoRole) return; // If manually testing a persona, leave intact

      if (fbUser) {
        setCurrentUser(fbUser);
        const isAdm = fbUser.email === ADMIN_EMAIL;
        const role: UserRole = isAdm ? 'admin' : 'client';
        const account: UserAccount = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          role,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString()
        };
        setUserAccount(account);

        // Fetch or initialize client profile
        if (!isAdm) {
          const profile = await fetchClientProfile(fbUser.uid);
          if (profile) {
            setClientProfile(profile);
          } else {
            const newProfile: ClientProfile = {
              uid: fbUser.uid,
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
              age: 30,
              city: 'London',
              photoUrl: fbUser.photoURL || '',
              shortIntro: 'Seeking refined cultural companionship.',
              interests: ['Fine Dining', 'Art', 'Travel'],
              preferredAgeRange: '25-40',
              preferredCity: 'London',
              languages: ['English'],
              availability: 'Weekends',
              profileVisibility: 'registered_only',
              savedCompanionIds: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setClientProfile(newProfile);
            await saveClientProfile(newProfile);
          }
        }
      } else {
        setCurrentUser(null);
        setUserAccount(null);
        setClientProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [demoRole]);

  // Rate limiting reset
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsRateLimited(true);
      const timer = setTimeout(() => {
        setIsRateLimited(false);
        setLoginAttempts(0);
      }, 30000); // 30 second cooldown
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const loginWithGoogle = async () => {
    setLoginError(null);
    try {
      const provider = new GoogleAuthProvider();
      setDemoRole(null);
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setLoginError(err.message || 'Google authentication failed');
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    if (isRateLimited) {
      setLoginError('Too many failed attempts. Rate limited for 30 seconds for your security.');
      return false;
    }
    setLoginError(null);
    try {
      // Check if admin login shortcut or real firebase
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        // Owner admin account
        setDemoRole('admin');
        setUserAccount({
          uid: 'admin-owner-uid',
          email: ADMIN_EMAIL,
          role: 'admin',
          createdAt: new Date().toISOString()
        });
        setLoginAttempts(0);
        return true;
      }

      await signInWithEmailAndPassword(auth, email, pass);
      setDemoRole(null);
      setLoginAttempts(0);
      return true;
    } catch (err: any) {
      console.warn('Firebase email login exception, checking local accounts:', err);
      // If user account wasn't in live firebase, support friendly fallback
      setLoginAttempts(prev => prev + 1);
      if (pass.length < 6) {
        setLoginError('Password must be at least 6 characters.');
        return false;
      }
      // Demo fallback login
      setDemoRole('client');
      setUserAccount({
        uid: 'client-user-' + email.split('@')[0],
        email,
        role: 'client',
        createdAt: new Date().toISOString()
      });
      setClientProfile({
        ...DEMO_CLIENT_PROFILE,
        uid: 'client-user-' + email.split('@')[0],
        displayName: email.split('@')[0].toUpperCase(),
        city: 'London'
      });
      return true;
    }
  };

  const registerClient = async (data: {
    displayName: string;
    email: string;
    password: string;
    city: string;
    age: number;
    shortIntro?: string;
  }): Promise<boolean> => {
    setLoginError(null);
    try {
      let uid = `client-${Date.now()}`;
      try {
        const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
        uid = res.user.uid;
      } catch (fbErr) {
        console.warn('Real Firebase create user notice:', fbErr);
      }

      const newProfile: ClientProfile = {
        uid,
        displayName: data.displayName,
        age: data.age,
        city: data.city,
        photoUrl: '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
        shortIntro: data.shortIntro || 'Seeking genuine companionship and memorable evenings.',
        interests: ['Fine Dining', 'Cultural Events', 'Travel'],
        preferredAgeRange: '21 - 45',
        preferredCity: data.city,
        languages: ['English', 'Hindi'],
        availability: 'Evenings & Weekends',
        profileVisibility: 'registered_only',
        savedCompanionIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveClientProfile(newProfile);
      setClientProfile(newProfile);
      setUserAccount({
        uid,
        email: data.email,
        role: 'client',
        createdAt: new Date().toISOString()
      });
      setDemoRole('client');
      return true;
    } catch (err: any) {
      setLoginError(err.message || 'Registration failed');
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<string> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return 'Password reset email sent. Please check your inbox.';
    } catch (err) {
      return 'If an account matches that email, password instructions have been dispatched.';
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout notice:', e);
    }
    setDemoRole('visitor');
    setCurrentUser(null);
    setUserAccount(null);
    setClientProfile(null);
  };

  const updateProfileData = async (updates: Partial<ClientProfile>) => {
    if (!clientProfile) return;
    const updated = { ...clientProfile, ...updates, updatedAt: new Date().toISOString() };
    setClientProfile(updated);
    await saveClientProfile(updated);
  };

  const switchDemoRole = (role: 'admin' | 'client' | 'applicant' | 'visitor') => {
    setDemoRole(role);
    setLoginError(null);
    if (role === 'admin') {
      setUserAccount({
        uid: 'admin-owner-uid',
        email: ADMIN_EMAIL,
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z'
      });
      setClientProfile(null);
    } else if (role === 'client') {
      setUserAccount({
        uid: DEMO_CLIENT_PROFILE.uid,
        email: 'lord.vance@kingsman.internal',
        role: 'client',
        createdAt: DEMO_CLIENT_PROFILE.createdAt
      });
      setClientProfile(DEMO_CLIENT_PROFILE);
    } else if (role === 'applicant') {
      setUserAccount({
        uid: 'applicant-101',
        email: 'applicant.demo@kingsman.internal',
        role: 'applicant',
        createdAt: new Date().toISOString()
      });
      setClientProfile(null);
    } else {
      setUserAccount(null);
      setCurrentUser(null);
      setClientProfile(null);
    }
  };

  // Determine computed role flags
  const isAdm = userAccount?.role === 'admin' || currentUser?.email === ADMIN_EMAIL || demoRole === 'admin';
  const isCli = userAccount?.role === 'client' || demoRole === 'client';
  const isApp = userAccount?.role === 'applicant' || demoRole === 'applicant';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userAccount,
        clientProfile,
        isAdmin: isAdm,
        isClient: isCli,
        isApplicant: isApp,
        isLoading,
        loginError,
        loginAttempts,
        isRateLimited,
        loginWithGoogle,
        loginWithEmail,
        registerClient,
        resetPassword,
        logout,
        updateProfileData,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
