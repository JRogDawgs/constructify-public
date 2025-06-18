import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
  lastLoginAt: any;
  provider: string;
  role?: string; // Added role field for admin functionality
  
  // Extended profile fields
  phone?: string;
  location?: string;
  bio?: string;
  company?: string;
  position?: string;
  profileType?: 'individual' | 'company'; // Profile type differentiation
  
  // Company-specific fields (when profileType === 'company')
  companyName?: string;
  companyLogo?: string;
  licenseNumber?: string;
  certifications?: string[];
  
  // Individual-specific fields  
  skills?: string[];
  certifications_individual?: string[];
}

// Create or update user document in Firestore
export const createOrUpdateUser = async (user: User): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  
  try {
    // Check if user document exists
    const userSnap = await getDoc(userRef);
    
    const userData: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      provider: 'google'
    };

    if (userSnap.exists()) {
      // Update existing user's last login
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      });
      console.log('✅ User updated in Firestore:', user.email);
    } else {
      // Create new user document
      await setDoc(userRef, userData);
      console.log('✅ New user created in Firestore:', user.email);
    }

    return userData;
  } catch (error) {
    console.error('❌ Error creating/updating user in Firestore:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    throw error;
  }
}; 