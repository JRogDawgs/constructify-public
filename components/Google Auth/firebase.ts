/**
 * Firebase configuration.
 * When NEXT_PUBLIC_FIREBASE_* env vars are not set, exports nulls.
 * Public marketing site builds without Firebase SDK dependency.
 */

type FirebaseAppType = import('firebase/app').FirebaseApp | null;
type FirestoreType = import('firebase/firestore').Firestore | null;

export const hasFirebaseConfig = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
);

export let app: FirebaseAppType = null;
export let db: FirestoreType = null;

if (hasFirebaseConfig) {
  try {
    const firebase = require('firebase/app');
    const firestore = require('firebase/firestore');
    app = !firebase.getApps().length
      ? firebase.initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        })
      : firebase.getApp();
    db = firestore.getFirestore(app);
  } catch {
    app = null;
    db = null;
  }
}
