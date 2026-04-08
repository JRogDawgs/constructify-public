import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

let app: FirebaseApp | undefined
let auth: Auth | undefined

function readFirebaseWebConfig(): {
  apiKey: string
  authDomain: string
  projectId: string
  appId?: string
} | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!apiKey || !authDomain || !projectId) {
    return null
  }
  return {
    apiKey,
    authDomain,
    projectId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
}

/**
 * Browser-only Firebase Auth singleton for the Procore entry flow.
 * Uses the same web config as the main Constructify app.
 */
export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser")
  }
  if (auth) return auth

  const config = readFirebaseWebConfig()
  if (!config) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, or NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    )
  }

  app = getApps().length > 0 ? getApps()[0]! : initializeApp(config)
  auth = getAuth(app)
  return auth
}

export function isFirebaseConfiguredForProcore(): boolean {
  return readFirebaseWebConfig() !== null
}
