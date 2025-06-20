import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const missingFields = [];
if (!firebaseConfig.apiKey) missingFields.push('NEXT_PUBLIC_FIREBASE_API_KEY');
if (!firebaseConfig.authDomain) missingFields.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
if (!firebaseConfig.projectId) missingFields.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
if (!firebaseConfig.storageBucket) missingFields.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
if (!firebaseConfig.messagingSenderId) missingFields.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
if (!firebaseConfig.appId) missingFields.push('NEXT_PUBLIC_FIREBASE_APP_ID');

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase environment variables:');
  missingFields.forEach(field => console.error(`   - ${field}`));
  console.error('📋 Create a .env.local file with these variables from your Firebase Console');
  
  // Don't throw in development to allow debugging
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ Missing Firebase environment variables in production!');
  }
} else {
  // Only log success in development
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Firebase configuration loaded successfully');
  }
}

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app); 