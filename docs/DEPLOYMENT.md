# Constructify Deployment Guide

## Overview

This guide covers the deployment process for Constructify, a Next.js application with Google Authentication and Firebase integration.

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Firebase project set up and configured
- [ ] Environment variables properly configured
- [ ] OAuth consent screen configured in Google Cloud Console
- [ ] Authorized domains added to Firebase Console
- [ ] Firestore security rules deployed
- [ ] Admin users assigned appropriate roles

### 2. Code Preparation
- [ ] All tests passing
- [ ] Production build successful (`npm run build`)
- [ ] No TypeScript errors
- [ ] Security headers configured in middleware
- [ ] CSP policies updated for production domains

## Deployment Platforms

### Vercel (Recommended)

Vercel provides seamless deployment for Next.js applications:

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set the following in Vercel dashboard:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=constructify-463219.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=constructify-463219
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=constructify-463219.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   FIREBASE_ADMIN_PRIVATE_KEY=your_admin_private_key
   FIREBASE_ADMIN_CLIENT_EMAIL=your_admin_client_email
   ```

3. **Domain Configuration**
   - Add production domain to Firebase authorized domains
   - Update CSP headers in `middleware.ts` for production domain

### Netlify

1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Environment Variables**
   Set in Netlify dashboard under Site settings → Environment variables

### Docker Deployment

1. **Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci --only=production
   
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t constructify .
   docker run -p 3000:3000 constructify
   ```

## Firebase Configuration for Production

### 1. Update Authorized Domains

In Firebase Console → Authentication → Settings → Authorized domains:
- Add your production domain
- Add any staging domains
- Keep localhost for development

### 2. Firestore Security Rules

Deploy the following security rules:

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

Deploy rules using Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

### 3. Enable Required APIs

In Google Cloud Console, ensure these APIs are enabled:
- Identity Toolkit API
- Cloud Firestore API
- Firebase Authentication API

## Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use platform-specific environment variable management
- Rotate API keys regularly

### 2. Content Security Policy
Update `middleware.ts` for production:
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  connect-src 'self' https://apis.google.com https://accounts.google.com https://constructify-463219.firebaseapp.com https://your-production-domain.com;
  frame-src 'self' https://accounts.google.com;
`;
```

### 3. HTTPS Configuration
- Ensure production deployment uses HTTPS
- Update Firebase authorized domains to use HTTPS URLs
- Configure proper SSL certificates

## Monitoring and Logging

### 1. Firebase Analytics
Enable Firebase Analytics for user tracking:
```typescript
// In firebase.ts
import { getAnalytics } from 'firebase/analytics';

if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app);
}
```

### 2. Error Monitoring
Consider integrating error monitoring services:
- Sentry
- LogRocket
- Bugsnag

### 3. Performance Monitoring
- Firebase Performance Monitoring
- Vercel Analytics
- Google PageSpeed Insights

## Post-Deployment Tasks

### 1. Test Authentication Flow
- [ ] Google sign-in works on production
- [ ] User profiles are created in Firestore
- [ ] Admin panel accessible to admin users
- [ ] Sign-out functionality works

### 2. Verify Security
- [ ] CSP headers are properly set
- [ ] HTTPS is enforced
- [ ] Unauthorized access is blocked
- [ ] Admin routes are protected

### 3. Performance Testing
- [ ] Page load times are acceptable
- [ ] Authentication flow is responsive
- [ ] Database queries are optimized

## Rollback Plan

### 1. Version Control
- Tag releases for easy rollback
- Maintain staging environment for testing

### 2. Database Migrations
- Backup Firestore data before major changes
- Test migrations on staging first

### 3. Environment Rollback
- Keep previous environment variable configurations
- Document all configuration changes

## Troubleshooting Production Issues

### Common Production Issues

1. **Authentication Failures**
   - Check authorized domains in Firebase
   - Verify environment variables are set correctly
   - Ensure HTTPS is properly configured

2. **CSP Violations**
   - Check browser console for CSP errors
   - Update middleware.ts with required domains
   - Test on multiple browsers

3. **Database Connection Issues**
   - Verify Firestore security rules
   - Check Firebase project configuration
   - Ensure proper API keys are set

### Debug Commands

```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Test production build locally
npm run build && npm start
```

## Scaling Considerations

### 1. Firebase Limits
- Firestore: 1 million document reads per day (free tier)
- Authentication: 10,000 phone authentications per month
- Consider upgrading to Blaze plan for production

### 2. Performance Optimization
- Implement proper caching strategies
- Use Next.js Image optimization
- Consider CDN for static assets

### 3. Database Optimization
- Index frequently queried fields
- Implement pagination for large datasets
- Use Firestore subcollections for hierarchical data

## Support and Maintenance

### Regular Tasks
- [ ] Monitor authentication metrics
- [ ] Review security logs
- [ ] Update dependencies regularly
- [ ] Backup critical data
- [ ] Test disaster recovery procedures

### Contact Information
- Firebase Support: [Firebase Support](https://firebase.google.com/support)
- Vercel Support: [Vercel Support](https://vercel.com/support)
- Project Maintainer: [Your Contact Information] 