'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import type { User, UserCredential } from 'firebase/auth';
import { app } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential | undefined>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const stubValue: AuthContextType = {
  user: null,
  loading: false,
  signInWithGoogle: async () => undefined,
  signOut: async () => {},
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!app) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      const { getAuth, onAuthStateChanged, getRedirectResult } = await import('firebase/auth');
      const auth = getAuth(app);

      let redirectChecked = false;
      const checkRedirectResult = async () => {
        if (redirectChecked) return;
        redirectChecked = true;
        try {
          await getRedirectResult(auth);
        } catch {
          // Ignore redirect errors
        }
      };
      await checkRedirectResult();

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    };

    initAuth();
  }, []);

  const signInWithGoogle = async () => {
    if (!app) return undefined;
    const {
      signInWithPopup,
      signInWithRedirect,
      GoogleAuthProvider,
    } = await import('firebase/auth');
    const auth = (await import('firebase/auth')).getAuth(app);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      try {
        return await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        if (
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/cancelled-popup-request'
        ) {
          const redirectProvider = new GoogleAuthProvider();
          redirectProvider.setCustomParameters({ prompt: 'select_account' });
          await signInWithRedirect(auth, redirectProvider);
          return undefined;
        }
        throw popupError;
      }
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many sign-in attempts. Please try again later.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    if (!app) return;
    const { getAuth, signOut: firebaseSignOut } = await import('firebase/auth');
    const auth = getAuth(app);
    await firebaseSignOut(auth);
  };

  if (!app) {
    return (
      <AuthContext.Provider value={stubValue}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 