# Firebase Setup Guide - Fix Identity Toolkit API Error

## Issue Description
Error: `auth/requests-to-this-api-identitytoolkit-method-google.cloud.identitytoolkit.v1.projectconfigservice.getprojectconfig-are-blocked`

This error occurs when the Identity Toolkit API is not enabled in Google Cloud Console or billing is not properly configured.

## Step-by-Step Fix

### 1. Enable Identity Toolkit API

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project: `constructify-463219`

2. **Navigate to APIs & Services**
   - Click on "APIs & Services" → "Library"
   - Search for "Identity Toolkit API"
   - Click on "Identity Toolkit API"
   - Click "ENABLE"

3. **Alternative Method**
   - Direct link: https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com
   - Make sure your project `constructify-463219` is selected
   - Click "ENABLE"

### 2. Verify Billing is Enabled

1. **Check Billing Account**
   - Go to: https://console.cloud.google.com/billing
   - Ensure your project has a billing account linked
   - Firebase requires a billing account for production APIs

2. **Link Billing Account**
   - If no billing account is linked:
     - Click "Link a billing account"
     - Follow the setup process
     - Add a payment method

### 3. Firebase Console Configuration

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: `constructify-463219`

2. **Check Authentication Settings**
   - Navigate to "Authentication" → "Sign-in method"
   - Ensure "Google" provider is enabled
   - Verify authorized domains include your domain

3. **Project Settings**
   - Go to "Project Settings" → "General"
   - Verify your app is properly configured
   - Check that API keys are valid

### 4. Required APIs to Enable

Make sure these APIs are enabled in Google Cloud Console:

1. **Identity Toolkit API** (Most Important)
   - https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com

2. **Firebase Authentication API**
   - https://console.cloud.google.com/apis/library/firebase.googleapis.com

3. **Cloud Firestore API**
   - https://console.cloud.google.com/apis/library/firestore.googleapis.com

### 5. Environment Variables Check

Verify your `.env.local` file has correct values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCQVe... (your actual key)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=constructify-463219.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=constructify-463219
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=constructify-463219.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 6. Test the Fix

After enabling the APIs:

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Test Google Sign-in**
   - Go to http://localhost:3000
   - Click "Login" button
   - Try Google sign-in
   - Check browser console for errors

### 7. Common Issues and Solutions

**Issue**: "API key not valid"
- **Solution**: Regenerate API key in Firebase Console → Project Settings → General → Web API Key

**Issue**: "Unauthorized domain"
- **Solution**: Add `localhost` and your domain to Firebase Console → Authentication → Settings → Authorized domains

**Issue**: "Billing required"
- **Solution**: Enable billing in Google Cloud Console

### 8. Verification Commands

Run these to verify your setup:

```bash
# Check if APIs are enabled (requires gcloud CLI)
gcloud services list --enabled --project=constructify-463219

# Test Firebase connection
npm run dev
# Then visit http://localhost:3000 and test authentication
```

### 9. Production Deployment Notes

For production deployment:
- Ensure all APIs are enabled
- Add production domain to authorized domains
- Update environment variables for production
- Test authentication flow thoroughly

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs/auth)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Identity Toolkit API](https://cloud.google.com/identity-platform/docs)

---

**After following this guide, the Firebase authentication should work without the Identity Toolkit API error.** 