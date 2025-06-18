// Temporary debug script - DELETE AFTER TESTING
console.log('🔍 Environment Variables Debug:');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'EXISTS' : 'MISSING');
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'EXISTS' : 'MISSING');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'EXISTS' : 'MISSING');

// Show first few characters of API key for verification (safe)
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  console.log('API Key starts with:', apiKey.substring(0, 10) + '...');
  console.log('API Key length:', apiKey.length);
} 