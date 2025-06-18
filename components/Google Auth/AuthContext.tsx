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
  const [authInitialized, setAuthInitialized] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    let redirectChecked = false;
    
    // Check for redirect result ONCE on app initialization
    const checkRedirectResult = async () => {
      if (redirectChecked) return;
      redirectChecked = true;
      
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('✅ Google sign-in redirect successful:', result.user.email);
          // User profile will be handled by onAuthStateChanged
        }
      } catch (error: any) {
        console.error('❌ Redirect sign-in error:', error);
      }
    };
    
    checkRedirectResult();

    // Listen for auth state changes - OPTIMIZED
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔍 Auth state changed:', firebaseUser ? `${firebaseUser.email}` : 'No user');
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Only fetch/create user profile if we don't have one or user changed
        if (!userProfile || userProfile.uid !== firebaseUser.uid) {
          console.log('🔄 Loading user profile...');
          try {
            // Try to get existing profile first (faster than create/update)
            let profile = await getUserProfile(firebaseUser.uid);
            
            // Only create/update if profile doesn't exist
            if (!profile) {
              console.log('📝 Creating new user profile...');
              profile = await createOrUpdateUser(firebaseUser);
            }
            
            setUserProfile(profile);
            console.log('✅ User profile loaded');
          } catch (error) {
            console.error('❌ Error loading user profile:', error);
            
            // Create minimal profile from Firebase Auth data
            const basicProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              provider: 'google'
            };
            
            setUserProfile(basicProfile);
            console.log('✅ Using basic profile (Firestore unavailable)');
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      
      // Set loading to false after first auth check
      if (!authInitialized) {
        setLoading(false);
        setAuthInitialized(true);
        console.log('✅ Auth initialization completed');
      }
    });
    
    return () => unsubscribe();
  }, [auth, userProfile, authInitialized]);

  const signInWithGoogle = async () => {
    // Don't set global loading state - use local loading in components
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('🔄 Starting Google sign-in...');
      
      // Try popup first
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Sign-in successful:', result.user.email);
      
      // User profile will be handled by onAuthStateChanged automatically
      
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      
      // Fallback to redirect for popup-blocked scenarios
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        console.log('🔄 Popup blocked, trying redirect...');
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          console.error('❌ Redirect also failed:', redirectError);
          throw redirectError;
        }
      } else {
        throw error;
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      console.log('✅ Sign-out successful');
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      throw error;
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