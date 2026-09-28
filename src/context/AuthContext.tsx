import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';

import { auth } from '../firebase';
import { UserRole, ClientProfile, UserAccount } from '../types';
import {
  fetchClientProfile,
  saveClientProfile
} from '../services/firebaseService';

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
  switchDemoRole: (
    role: 'admin' | 'client' | 'applicant' | 'visitor'
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [clientProfile, setClientProfile] =
    useState<ClientProfile | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);

  // Demo role support can be used for UI preview only.
  // It must never be used as a real authentication mechanism.
  const [demoRole, setDemoRole] = useState<
    'admin' | 'client' | 'applicant' | 'visitor' | null
  >(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (demoRole) {
        setIsLoading(false);
        return;
      }

      try {
        if (!fbUser) {
          setCurrentUser(null);
          setUserAccount(null);
          setClientProfile(null);
          setIsLoading(false);
          return;
        }

        setCurrentUser(fbUser);

        const authenticatedEmail = (fbUser.email || '').trim().toLowerCase();
        const isAdm = authenticatedEmail === ADMIN_EMAIL.toLowerCase();

        const role: UserRole = isAdm ? 'admin' : 'client';

        const account: UserAccount = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          role,
          createdAt:
            fbUser.metadata.creationTime || new Date().toISOString()
        };

        setUserAccount(account);

        // Admin does not get a client profile.
        if (isAdm) {
          setClientProfile(null);
          setIsLoading(false);
          return;
        }

        // Normal client profile.
        const profile = await fetchClientProfile(fbUser.uid);

        if (profile) {
          setClientProfile(profile);
        } else {
          const newProfile: ClientProfile = {
            uid: fbUser.uid,
            displayName:
              fbUser.displayName ||
              fbUser.email?.split('@')[0] ||
              'Member',
            age: 30,
            city: '',
            photoUrl: fbUser.photoURL || '',
            shortIntro: '',
            interests: [],
            preferredAgeRange: '',
            preferredCity: '',
            languages: ['English'],
            availability: '',
            profileVisibility: 'registered_only',
            savedCompanionIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          setClientProfile(newProfile);

          try {
            await saveClientProfile(newProfile);
          } catch (profileError) {
            console.warn(
              'Could not initialize client profile:',
              profileError
            );
          }
        }
      } catch (error) {
        console.error('Authentication state error:', error);
        setLoginError('Unable to load your account.');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [demoRole]);

  // Login rate-limit reset.
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsRateLimited(true);

      const timer = setTimeout(() => {
        setIsRateLimited(false);
        setLoginAttempts(0);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const loginWithGoogle = async () => {
    setLoginError(null);

    try {
      const provider = new GoogleAuthProvider();

      setDemoRole(null);

      const result = await signInWithPopup(auth, provider);

      const signedInEmail = (
        result.user.email || ''
      ).trim().toLowerCase();

      // Owner/admin must use email + password.
      if (signedInEmail === ADMIN_EMAIL.toLowerCase()) {
        await firebaseSignOut(auth);

        setLoginError(
          'The owner account must sign in with email and password.'
        );

        return;
      }

      setLoginAttempts(0);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);

      setLoginError(
        err?.message || 'Google authentication failed.'
      );
    }
  };

  const loginWithEmail = async (
    email: string,
    pass: string
  ): Promise<boolean> => {
    if (isRateLimited) {
      setLoginError(
        'Too many failed attempts. Please try again after 30 seconds.'
      );
      return false;
    }

    setLoginError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !pass) {
      setLoginError('Please enter your email and password.');
      return false;
    }

    try {
      // REAL Firebase authentication is required.
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        pass
      );

      const firebaseUser = credential.user;
      const authenticatedEmail = (
        firebaseUser.email || ''
      ).trim().toLowerCase();

      // Owner/admin account.
      if (authenticatedEmail === ADMIN_EMAIL.toLowerCase()) {
        // Require verified email for owner account.
        if (!firebaseUser.emailVerified) {
          setLoginError(
            'Please verify the owner email address before signing in.'
          );

          await firebaseSignOut(auth);
          return false;
        }

        setDemoRole(null);
        setCurrentUser(firebaseUser);

        setUserAccount({
          uid: firebaseUser.uid,
          email: firebaseUser.email || ADMIN_EMAIL,
          role: 'admin',
          createdAt:
            firebaseUser.metadata.creationTime ||
            new Date().toISOString()
        });

        setClientProfile(null);
        setLoginAttempts(0);

        return true;
      }

      // Normal client account.
      setDemoRole(null);
      setCurrentUser(firebaseUser);

      setUserAccount({
        uid: firebaseUser.uid,
        email: firebaseUser.email || normalizedEmail,
        role: 'client',
        createdAt:
          firebaseUser.metadata.creationTime ||
          new Date().toISOString()
      });

      setLoginAttempts(0);

      return true;
    } catch (err: any) {
      console.error('Firebase login error:', err);

      setLoginAttempts((prev) => prev + 1);

      switch (err?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setLoginError('Invalid email or password.');
          break;

        case 'auth/too-many-requests':
          setLoginError(
            'Too many login attempts. Please try again later.'
          );
          break;

        case 'auth/user-disabled':
          setLoginError(
            'This account has been disabled. Please contact support.'
          );
          break;

        default:
          setLoginError(
            err?.message ||
              'Login failed. Please check your email and password.'
          );
      }

      return false;
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
      if (data.age < 18) {
        setLoginError(
          'You must be 18 years of age or older to register.'
        );
        return false;
      }

      if (!data.email || !data.password) {
        setLoginError(
          'Email and password are required.'
        );
        return false;
      }

      if (data.password.length < 6) {
        setLoginError(
          'Password must be at least 6 characters.'
        );
        return false;
      }

      const normalizedEmail = data.email.trim().toLowerCase();

      // Prevent the admin email from being registered as a client.
      if (
        normalizedEmail === ADMIN_EMAIL.toLowerCase()
      ) {
        setLoginError(
          'This email address is reserved for the owner account.'
        );
        return false;
      }

      const res = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        data.password
      );

      const uid = res.user.uid;

      // Require email verification.
      await sendEmailVerification(res.user);

      const newProfile: ClientProfile = {
        uid,
        displayName: data.displayName.trim(),
        age: data.age,
        city: data.city.trim(),
        photoUrl: '',
        shortIntro: data.shortIntro?.trim() || '',
        interests: [],
        preferredAgeRange: '',
        preferredCity: data.city.trim(),
        languages: ['English'],
        availability: '',
        profileVisibility: 'registered_only',
        savedCompanionIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveClientProfile(newProfile);

      setCurrentUser(res.user);

      setUserAccount({
        uid,
        email: normalizedEmail,
        role: 'client',
        createdAt:
          res.user.metadata.creationTime ||
          new Date().toISOString()
      });

      setClientProfile(newProfile);
      setDemoRole(null);
      setLoginAttempts(0);

      setLoginError(
        'Account created. Please verify your email before continuing.'
      );

      return true;
    } catch (err: any) {
      console.error('Registration error:', err);

      if (err?.code === 'auth/email-already-in-use') {
        setLoginError(
          'An account already exists with this email.'
        );
      } else if (err?.code === 'auth/invalid-email') {
        setLoginError('Please enter a valid email address.');
      } else if (err?.code === 'auth/weak-password') {
        setLoginError('Please choose a stronger password.');
      } else {
        setLoginError(
          err?.message || 'Registration failed.'
        );
      }

      return false;
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<string> => {
    try {
      await sendPasswordResetEmail(
        auth,
        email.trim().toLowerCase()
      );

      return 'Password reset email sent. Please check your inbox.';
    } catch (err) {
      console.warn('Password reset request:', err);

      return 'If an account matches that email, password instructions have been sent.';
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout notice:', e);
    }

    setDemoRole(null);
    setCurrentUser(null);
    setUserAccount(null);
    setClientProfile(null);
    setLoginError(null);
  };

  const updateProfileData = async (
    updates: Partial<ClientProfile>
  ) => {
    if (!clientProfile) {
      return;
    }

    const updated: ClientProfile = {
      ...clientProfile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    setClientProfile(updated);

    await saveClientProfile(updated);
  };

  // Demo persona switcher for UI testing only.
  // This does NOT replace real Firebase authentication.
  const switchDemoRole = (
    role: 'admin' | 'client' | 'applicant' | 'visitor'
  ) => {
    setLoginError(null);

    if (role === 'visitor') {
      setDemoRole('visitor');
      setUserAccount(null);
      setClientProfile(null);
      setCurrentUser(null);
      return;
    }

    if (role === 'admin') {
      setDemoRole('admin');

      setUserAccount({
        uid: 'demo-admin',
        email: ADMIN_EMAIL,
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z'
      });

      setClientProfile(null);
      return;
    }

    if (role === 'applicant') {
      setDemoRole('applicant');

      setUserAccount({
        uid: 'demo-applicant',
        email: 'applicant.demo@example.com',
        role: 'applicant',
        createdAt: new Date().toISOString()
      });

      setClientProfile(null);
      return;
    }

    // Demo client.
    setDemoRole('client');

    const demoClientProfile: ClientProfile = {
      uid: 'demo-client',
      displayName: 'Demo Client',
      age: 30,
      city: 'Mumbai',
      photoUrl: '',
      shortIntro: 'Demo client profile for UI testing.',
      interests: [],
      preferredAgeRange: '21-45',
      preferredCity: 'Mumbai',
      languages: ['English'],
      availability: 'Demo availability',
      profileVisibility: 'registered_only',
      savedCompanionIds: [],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    };

    setUserAccount({
      uid: demoClientProfile.uid,
      email: 'demo.client@example.com',
      role: 'client',
      createdAt: demoClientProfile.createdAt
    });

    setClientProfile(demoClientProfile);
  };

  const isAdm =
    userAccount?.role === 'admin' ||
    currentUser?.email?.toLowerCase() ===
      ADMIN_EMAIL.toLowerCase() ||
    demoRole === 'admin';

  const isCli =
    userAccount?.role === 'client' ||
    demoRole === 'client';

  const isApp =
    userAccount?.role === 'applicant' ||
    demoRole === 'applicant';

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

  if (!ctx) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return ctx;
};
