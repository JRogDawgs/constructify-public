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

  // Debug: Check immediate auth state
  useEffect(() => {
    console.log('🔍 AuthProvider mounted, checking immediate auth state...');
    console.log('🔍 Current auth.currentUser:', auth.currentUser);
    console.log('🔍 Auth ready state:', {
      currentUser: auth.currentUser?.email || 'none',
      isSignedIn: !!auth.currentUser
    });
  }, []);

  useEffect(() => {
    let redirectChecked = false;
    
    // Check for redirect result ONCE on app initialization
    const checkRedirectResult = async () => {
      if (redirectChecked) return;
      redirectChecked = true;
      
      console.log('🔍 Checking for redirect result...');
      
      try {
        const result = await getRedirectResult(auth);
        console.log('🔍 Redirect result:', result);
        
        if (result?.user) {
          console.log('✅ Google redirect sign-in successful:', result.user.email);
          console.log('👤 User details:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          });
        } else {
          console.log('ℹ️ No redirect result found (normal for popup auth or direct navigation)');
        }
      } catch (error: any) {
        console.error('❌ Redirect sign-in error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
      }
    };
    
    checkRedirectResult();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔄 Auth state change detected:', {
        hasUser: !!firebaseUser,
        userEmail: firebaseUser?.email,
        userUID: firebaseUser?.uid,
        timestamp: new Date().toISOString()
      });
      
      if (firebaseUser) {
        console.log('🔐 Firebase user detected');
        setUser(firebaseUser);
      } else {
        console.log('🔓 No user detected, clearing state');
        setUser(null);
      }
      
      // Set loading to false after first auth check
      if (!authInitialized) {
        setLoading(false);
        setAuthInitialized(true);
        console.log('✅ Auth initialization completed');
      }
    });
    
    return () => unsubscribe();
  }, [auth, authInitialized]);

  const signInWithGoogle = async () => {
    // Don't set global loading state - use local loading in components
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('🔄 Starting Google sign-in...');
      
      // Try popup first - this is more reliable for development
      try {
        const result = await signInWithPopup(auth, provider);
        console.log('✅ Popup sign-in successful:', result.user.email);
        
        return result;
        
      } catch (popupError: any) {
        console.warn('⚠️ Popup sign-in failed:', popupError.code);
        
        // Only fallback to redirect for specific popup issues
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          
          console.log('🔄 Popup blocked/closed, trying redirect...');
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({
            prompt: 'select_account'
          });
          
          await signInWithRedirect(auth, provider);
          // Don't return here - redirect will complete later
          
        } else {
          // For other errors, don't retry with redirect
          throw popupError;
        }
      }
      
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      
      // Provide specific error messages for common issues
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
      console.log('✅ Sign-out successful');
    } catch (error) {
      console.error('❌ Sign-out error:', error);
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