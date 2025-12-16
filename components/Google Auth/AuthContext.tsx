'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { app } from './firebase';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential | undefined>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    let redirectChecked = false;
    
    const checkRedirectResult = async () => {
      if (redirectChecked) return;
      redirectChecked = true;
      
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Redirect sign-in successful
        }
      } catch (error: any) {
        // Redirect sign-in error
      }
    };
    
    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      
      if (!authInitialized) {
        setLoading(false);
        setAuthInitialized(true);
      }
    });
    
    return () => unsubscribe();
  }, [auth, authInitialized]);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      try {
        const result = await signInWithPopup(auth, provider);
        return result;
        
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({
            prompt: 'select_account'
          });
          
          await signInWithRedirect(auth, provider);
          
        } else {
          throw popupError;
        }
      }
      
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many sign-in attempts. Please try again later.');
      } else if (error.code?.includes('identitytoolkit')) {
        throw new Error('Firebase configuration issue. Please check your Firebase setup.');
      } else {
        throw error;
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw error;
    }
  };

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