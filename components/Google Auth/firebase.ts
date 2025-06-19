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

// Debug: Log what we're actually getting
console.log('🔍 Firebase Config Debug:');
console.log('API Key:', firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : '❌ MISSING');
console.log('Project ID:', firebaseConfig.projectId || '❌ MISSING');
console.log('Auth Domain:', firebaseConfig.authDomain || '❌ MISSING');
console.log('Storage Bucket:', firebaseConfig.storageBucket || '❌ MISSING');
console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId || '❌ MISSING');
console.log('App ID:', firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : '❌ MISSING');

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
  console.error('🔗 https://console.firebase.google.com/project/constructify-463219-ee7d8/settings/general/');
  
  // Don't throw in development to allow debugging
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ Missing Firebase environment variables in production!');
  }
} else {
  console.log('✅ All Firebase config variables present');
}

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app); 