# 🧠 Constructify Chatbot Email System - Setup Guide

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# SendGrid Configuration (Required for email functionality)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Admin Email Configuration  
ADMIN_EMAIL=jeff@constructify.com
SUPPORT_EMAIL=support@constructify.com

# Optional: Additional configuration
NEXT_PUBLIC_SITE_URL=https://constructify.com
```

## 📧 SendGrid Setup Instructions

1. **Create SendGrid Account**
   - Go to https://sendgrid.com and create an account
   - Complete email verification

2. **Generate API Key**
   - Navigate to Settings > API Keys
   - Click "Create API Key"
   - Choose "Full Access" permissions
   - Copy the generated API key

3. **Verify Sender Email**
   - Go to Settings > Sender Authentication
   - Verify `jeff@constructify.com` as a sender
   - Complete domain authentication if needed

4. **Add to Environment**
   - Paste your API key in `.env.local`
   - Restart your development server

## 🧪 Testing the Email System

### Simple Test (Recommended)
```bash
curl -X POST http://localhost:3000/api/admin-reply \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userQuestion": "How does employee onboarding work?",
    "adminResponse": "Great question! Constructify streamlines employee onboarding with digital forms, automatic compliance tracking, and role-based access. New employees can complete their paperwork before their first day, and managers get instant notifications when everything is ready."
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Admin reply processed and sent to user",
  "sessionId": "1703123456789",
  "userEmail": "test@example.com",
  "knowledgeBaseSuggestion": {
    "question": "How does employee onboarding work?",
    "answer": "Great question! Constructify streamlines...",
    "sessionId": "1703123456789",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "status": "suggested_for_kb",
    "category": "admin_answered"
  }
}
```

## 🚀 Production Deployment

1. **Environment Variables**
   - Add all variables to your production environment
   - Use production SendGrid API key
   - Set production domain for NEXT_PUBLIC_SITE_URL

2. **Email Domain Setup**
   - Configure SPF/DKIM records for your domain
   - Set up custom sending domain in SendGrid
   - Test email deliverability

3. **Monitoring**
   - Set up SendGrid webhooks for delivery tracking
   - Monitor email bounce rates
   - Set up alerts for failed email sends

## 💡 Development Mode

If `SENDGRID_API_KEY` is not set, the system will:
- Log email details to console instead of sending
- Show helpful setup instructions
- Allow testing without email delivery

This allows development without SendGrid setup initially. 