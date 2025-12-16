import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo',
};

// Validate Firebase configuration
const missingFields = [];
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingFields.push('NEXT_PUBLIC_FIREBASE_API_KEY');
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missingFields.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingFields.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) missingFields.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) missingFields.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missingFields.push('NEXT_PUBLIC_FIREBASE_APP_ID');

if (missingFields.length > 0) {
  console.warn('⚠️ Missing Firebase environment variables:');
  missingFields.forEach(field => console.warn(`   - ${field}`));
  console.warn('📋 Create a .env.local file with these variables from your Firebase Console');
  console.warn('⚠️ Using demo configuration - authentication features will not work');
  
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

let app: FirebaseApp;
let db: Firestore | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  // Initialize Firestore
  db = getFirestore(app);
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.warn('⚠️ Firebase features will be disabled');
  // Create a minimal app object to prevent crashes
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = null;
}

export { app, db }; 