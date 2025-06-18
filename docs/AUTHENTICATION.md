# Constructify Google Authentication System

## Overview

This document provides comprehensive documentation for the Google Authentication system implemented in Constructify, a Next.js 15.1.0 application with Firebase integration.

## Architecture

### Core Components

1. **Firebase Configuration** (`components/Google Auth/firebase.ts`)
   - Initializes Firebase app with environment variables
   - Configures Firestore database connection
   - Validates required environment variables

2. **Authentication Context** (`components/Google Auth/AuthContext.tsx`)
   - React Context API for global authentication state
   - Manages user sign-in/sign-out operations
   - Handles authentication state changes
   - Integrates with Firestore for user profiles

3. **User Service Layer** (`components/Google Auth/userService.ts`)
   - Firestore operations for user data management
   - `createOrUpdateUser()` - Creates/updates user profiles
   - `getUserProfile()` - Retrieves user profile data
   - Login timestamp tracking

4. **Admin Service Layer** (`utils/firestore/adminService.ts`)
   - Admin-specific Firestore operations
   - User management functions (getAllUsers, searchUsers, etc.)
   - Role-based access control

5. **UI Components**
   - `components/auth-modal.tsx` - Authentication modal with Google sign-in
   - `components/navbar.tsx` - Navigation with authentication state
   - `components/Google Auth/signin/page.tsx` - Dedicated sign-in page
   - `app/admin/users/page.tsx` - Admin user management interface

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project: `constructify-450d5`
3. Enable the following services:
   - **Authentication** → Sign-in method → Google
   - **Firestore Database** → Create database
   - **Identity Toolkit API** (in Google Cloud Console)

### 2. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=constructify-450d5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=constructify-450d5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=constructify-450d5.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server-side operations)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@constructify-450d5.iam.gserviceaccount.com
```

### 3. OAuth Configuration

1. In Firebase Console → Authentication → Sign-in method → Google
2. Add your domain to authorized domains
3. Configure OAuth consent screen in Google Cloud Console
4. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://your-production-domain.com` (production)

### 4. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin users can read all user profiles
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Authentication Flow

### Sign-In Process

1. User clicks "Login" button in navbar
2. AuthModal opens with Google sign-in option
3. `signInWithGoogle()` function called from AuthContext
4. Firebase handles Google OAuth popup
5. On successful authentication:
   - User data stored in AuthContext state
   - `createOrUpdateUser()` called to save/update Firestore profile
   - UI updates to show user avatar and dropdown menu
   - Modal closes automatically

### Sign-Out Process

1. User clicks "Sign out" from dropdown menu
2. `signOut()` function called from AuthContext
3. Firebase signs out user
4. AuthContext state cleared
5. UI reverts to "Login" button

### State Management

The authentication state is managed through React Context:

```typescript
interface AuthContextType {
  user: User | null;              // Firebase User object
  userProfile: UserProfile | null; // Custom user profile from Firestore
  loading: boolean;               // Loading state for auth operations
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
```

## User Profile Structure

```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: 'user' | 'admin';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

## Admin Features

### Role-Based Access Control

- Users with `role: 'admin'` can access the admin panel
- Admin panel accessible at `/admin/users`
- Requires authentication and admin role verification

### Admin User Management

- View all users with pagination (10 users per page)
- Search users by name or email
- View user statistics and details
- Role management capabilities

## Security Features

### Content Security Policy (CSP)

The application includes security middleware (`middleware.ts`) with CSP headers:

```typescript
'connect-src': [
  "'self'",
  'https://apis.google.com',
  'https://accounts.google.com',
  'https://constructify-450d5.firebaseapp.com'
]
```

### Authentication Middleware

- Validates user authentication state
- Protects admin routes
- Implements proper error handling

## Deployment Guide

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

1. **Development**: Use `.env.local` with localhost configuration
2. **Staging**: Update Firebase configuration for staging environment
3. **Production**: 
   - Set environment variables in deployment platform
   - Update authorized domains in Firebase Console
   - Enable billing in Google Cloud Platform for production APIs

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase project properly set up
- [ ] OAuth consent screen configured
- [ ] Authorized domains added to Firebase
- [ ] Firestore security rules deployed
- [ ] CSP headers configured for production domain
- [ ] Admin users assigned appropriate roles

## Troubleshooting

### Common Issues

1. **"auth/api-key-not-valid"**
   - Check environment variables in `.env.local`
   - Verify API key is correct in Firebase Console

2. **"auth/internal-error"**
   - Ensure Identity Toolkit API is enabled
   - Check billing is enabled in Google Cloud Platform

3. **UI not updating after login**
   - Verify AuthProvider wraps the application in `app/layout.tsx`
   - Check component is using `useAuth()` hook correctly

4. **Admin panel not accessible**
   - Verify user has `role: 'admin'` in Firestore
   - Check Firestore security rules allow admin access

## API Reference

### AuthContext Methods

- `signInWithGoogle()`: Initiates Google OAuth flow
- `signOut()`: Signs out current user
- `user`: Current Firebase user object
- `userProfile`: Current user profile from Firestore
- `loading`: Authentication loading state

### User Service Functions

- `createOrUpdateUser(user: User)`: Creates/updates user profile
- `getUserProfile(uid: string)`: Retrieves user profile
- `getAllUsers()`: Admin function to get all users
- `searchUsers(query: string)`: Admin function to search users

## Support

For additional support or questions about the authentication system, refer to:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- Project README.md for general setup instructions 