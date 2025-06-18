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
} from 'firebase/auth';
import { app } from './firebase';
import { createOrUpdateUser, getUserProfile, UserProfile } from './userService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    // Check for redirect result first (in case popup fallback to redirect happened)
    const checkRedirectResult = async () => {
      try {
        console.log('🔄 Checking for redirect result...');
        const result = await getRedirectResult(auth);
        console.log('🔍 Redirect result:', result);
        
        if (result?.user) {
          console.log('✅ Google sign-in redirect successful:', result.user.email);
          console.log('✅ User UID:', result.user.uid);
          const profile = await createOrUpdateUser(result.user);
          setUserProfile(profile);
          console.log('✅ User profile saved to Firestore');
        } else {
          console.log('ℹ️ No redirect result found - this is normal for popup auth');
        }
      } catch (error: any) {
        console.error('❌ Redirect sign-in error:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
      }
    };
    
    checkRedirectResult();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔍 Auth state changed:', user ? `${user.email} (${user.uid})` : 'No user');
      
      if (user) {
        console.log('🔄 Loading user profile from Firestore...');
        try {
          const profile = await createOrUpdateUser(user);
          console.log('✅ User profile loaded successfully:', profile);
          setUserProfile(profile);
          setUser(user);
          console.log('✅ User state updated in context');
        } catch (error) {
          console.error('❌ Error loading user profile from Firestore:', error);
          console.log('🔄 Continuing with basic user info (Firestore unavailable)');
          
          // Create a basic user profile from Firebase Auth data if Firestore fails
          const basicProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date(),
            lastLoginAt: new Date()
          };
          
          setUserProfile(basicProfile);
          setUser(user);
          console.log('✅ User state updated with basic profile');
          setError(new Error('Firestore connection failed, but authentication successful'));
        }
      } else {
        console.log('🔄 Clearing user state...');
        setUser(null);
        setUserProfile(null);
        console.log('✅ User state cleared');
      }
      
      setLoading(false);
      console.log('✅ Auth loading completed');
    });
    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('🔄 Starting Google sign-in...');
      console.log('🔍 Current auth state:', auth.currentUser ? auth.currentUser.email : 'No current user');
      console.log('🔍 Auth domain:', auth.app.options.authDomain);
      console.log('🔍 Project ID:', auth.app.options.projectId);
      
      // Try popup first to test if basic auth works
      console.log('🔄 Attempting popup sign-in...');
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Popup sign-in successful:', result.user.email);
      
      // Create/update user profile
      const profile = await createOrUpdateUser(result.user);
      setUserProfile(profile);
      console.log('✅ User profile saved to Firestore');
      
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      // If popup fails, let's try redirect as fallback
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        console.log('🔄 Popup blocked, trying redirect instead...');
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          console.error('❌ Redirect also failed:', redirectError);
        }
      }
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/internal-error') {
        console.error('🔧 This is usually a configuration issue. Check:');
        console.error('1. Firebase project settings');
        console.error('2. Environment variables in .env.local');
        console.error('3. Google OAuth configuration');
      }
      if (error.code === 'auth/unauthorized-domain') {
        console.error('🔧 Unauthorized domain error. Check:');
        console.error('1. Authorized domains in Firebase Console');
        console.error('2. OAuth redirect URIs in Google Cloud Console');
      }
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, signOut }}>
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