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

# Private CRM Integration (for connecting public site to private dashboard)
PRIVATE_CRM_ENDPOINT=https://constructify-private.com/api/receive-lead
PRIVATE_CRM_API_KEY=your_generated_api_key_here
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

## 🎬 Demo Scheduling System

The chatbot now includes a comprehensive demo scheduling system that enhances the user experience by collecting detailed information and automatically coordinating with the sales team.

### 🌟 Features:
- **Intelligent Demo Detection**: Automatically detects when users want to schedule demos
- **Multi-Step Information Collection**: Gathers user name, email, company, team size, industry, interests, and timing preferences
- **Professional Email Templates**: Sends beautiful, branded emails to both admin and users
- **Admin Notifications**: Jeff receives detailed demo requests with lead qualification information
- **User Confirmations**: Users receive confirmation emails with next steps
- **API Integration**: `/api/demo-request` endpoint handles all demo scheduling

### 📋 Demo Collection Process:
1. **Name Collection**: Personalizes the experience
2. **Email Verification**: Ensures valid contact information
3. **Company Information**: Gathers business context
4. **Team Size**: Helps tailor the demo to scale
5. **Industry Type**: Focuses on relevant features
6. **Specific Interests**: Customizes demo content
7. **Timing Preferences**: Coordinates scheduling

### 🎯 Trigger Phrases:
Users can trigger demo scheduling by saying:
- "I would like to see a demo"
- "Schedule a demo"
- "Book a meeting" 
- "Show me a personalized demo"
- "Can we set up a time to talk?"

### 📧 Email Templates:
- **Admin Notification**: Detailed lead information with action buttons
- **User Confirmation**: Professional confirmation with next steps
- **Both include**: Company branding, contact information, and clear CTAs

### 🔧 Testing Demo Scheduling:
```bash
curl -X POST http://localhost:3000/api/demo-request \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "John Smith",
    "userEmail": "john@example.com",
    "companyName": "Smith Construction",
    "teamSize": "11-25 employees",
    "industryType": "Commercial",
    "specificInterests": ["Employee Management", "Safety Compliance"],
    "urgency": "this_week",
    "sessionId": "demo_test_123"
  }'
```

The system seamlessly integrates with the existing chatbot infrastructure and provides a professional, automated way to capture and qualify demo leads.

## 📊 CRM Integration (Google Sheets)

The demo scheduling system now automatically syncs all demo requests to a Google Sheet for CRM tracking and lead management.

### 🔧 Setup Requirements:

**Environment Variables:**
```bash
# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=1234567890abcdefghijklmnopqrstuvwxyz

# Optional: Custom sheet name (defaults to "Demo Requests")
GOOGLE_SHEET_NAME=Demo Requests
```

### 📋 Setup Instructions:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google Sheets API in API Library

2. **Create Service Account**
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name like "Constructify Demo Sync"
   - Download JSON key file

3. **Extract Credentials from JSON**
   - Open the downloaded JSON file
   - Copy `client_email` value to `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Copy `private_key` value to `GOOGLE_PRIVATE_KEY`

4. **Create Google Sheet**
   - Create new Google Sheet
   - Copy sheet ID from URL (long string between `/d/` and `/edit`)
   - Share sheet with service account email (Editor access)

5. **Configure Environment**
   - Add variables to `.env.local`
   - Restart development server
   - Sheet will auto-initialize with headers on first demo request

### 📈 Sheet Structure:
The system automatically creates a sheet with these columns:
- **Timestamp**: When the demo was requested
- **Name**: User's name
- **Email**: Contact email
- **Company**: Company name
- **Team Size**: Number of employees
- **Industry**: Type of construction work
- **Interests**: Specific features they're interested in
- **Timing**: When they want to schedule
- **Source**: How they found us (always "Chatbot Demo Scheduler")
- **Status**: Demo status (New, Scheduled, Completed)
- **Notes**: Additional information

## 🔗 Private CRM Integration

The system now supports real-time lead transfer from the public site (constructify.com) to the private dashboard (constructify-private.com) for centralized lead management and tracking.

### 🎯 How It Works:
1. **Public Site**: Chatbot collects lead/demo information
2. **Automatic Transfer**: Lead data sent to private dashboard via secure API
3. **Lead Scoring**: Private site automatically scores and prioritizes leads
4. **Centralized Tracking**: All leads appear in private dashboard with analytics

### 🔧 Setup Instructions:

#### For Public Site (constructify.com):
```bash
# Add to .env.local
PRIVATE_CRM_ENDPOINT=https://constructify-private.com/api/receive-lead
PRIVATE_CRM_API_KEY=your_generated_api_key_here
```

#### For Private Site (constructify-private.com):
```bash
# Add to .env.local
PRIVATE_CRM_API_KEY=your_generated_api_key_here
```

### 🔐 API Key Generation:
Generate a secure API key using one of these methods:

```bash
# Method 1: OpenSSL (Linux/Mac)
openssl rand -hex 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 3: Online generator
# Visit: https://www.uuidgenerator.net/api-key-generator
```

**Example API Key**: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

### 📡 API Endpoint Details:

**Endpoint**: `POST /api/receive-lead`

**Headers**:
```
Content-Type: application/json
X-API-Key: your_generated_api_key_here
```

**Payload**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "BuildRight Co",
  "teamSize": "25",
  "industry": "Commercial",
  "interests": "Payroll, Full Platform",
  "timing": "Next Week",
  "source": "Chatbot - Demo Trigger",
  "notes": "",
  "timestamp": "2025-06-20T12:34:56Z",
  "sessionId": "session_123",
  "conversationContext": ["Previous chat messages..."]
}
```

**Response**:
```json
{
  "success": true,
  "leadId": "lead_1703123456789_abc123",
  "leadScore": {
    "score": 85,
    "priority": "HOT",
    "isHotLead": true
  },
  "message": "Lead received and processed successfully",
  "timestamp": "2025-06-20T12:34:56Z"
}
```

### 🧪 Testing the Integration:

**Test Connection**:
```bash
curl -X GET "https://constructify-private.com/api/receive-lead" \
  -H "X-API-Key: your_api_key_here"
```

**Send Test Lead**:
```bash
curl -X POST "https://constructify-private.com/api/receive-lead" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "teamSize": "11-25 employees",
    "industry": "Commercial",
    "interests": "Full platform, Payroll integration",
    "timing": "This week",
    "source": "API Test",
    "notes": "Test lead from API"
  }'
```

### 🔒 Security Features:
- **API Key Authentication**: All requests require valid API key
- **Data Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Graceful handling of invalid requests
- **Logging**: Complete audit trail of all lead transfers

### 📊 Lead Scoring Integration:
- **Automatic Scoring**: Every incoming lead gets scored immediately
- **Hot Lead Detection**: High-priority leads flagged for immediate follow-up
- **Priority Classification**: HOT, HIGH, MEDIUM, LOW priority levels
- **Detailed Analytics**: Complete scoring breakdown and reasoning

### 🚀 Benefits:
- **Real-time Transfer**: Leads appear instantly in private dashboard
- **Centralized Management**: All leads in one secure location
- **Automated Scoring**: No manual lead qualification needed
- **Enhanced Analytics**: Complete lead pipeline visibility
- **Improved Follow-up**: Priority-based lead management
- **Industry**: Construction industry type
- **Interests**: Specific feature interests
- **Timing**: Preferred demo timing
- **Source**: Always "Chatbot Demo Scheduler"
- **Status**: Defaults to "New Lead"
- **Notes**: Additional context

### 🧪 Testing CRM Sync:
```bash
# Test the sync endpoint directly
curl -X POST http://localhost:3000/api/sync-to-sheet \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Construction",
    "teamSize": "1-10 employees",
    "industry": "Residential",
    "interests": ["Employee Management"],
    "timing": "flexible"
  }'

# Check sync status
curl http://localhost:3000/api/sync-to-sheet
```

## 📅 Live Booking Integration (Calendly)

Users can now book demo times instantly through Calendly integration, providing immediate scheduling without waiting for email responses.

### 🔗 Integration Points:

**Calendly Links Included In:**
- Chatbot demo responses
- Email confirmation templates
- Buying signal responses
- Sales genius interactions

### 🛠️ Configuration:

**Update Calendly URLs:**
Replace placeholder URLs in the code with your actual Calendly links:

```typescript
// Current placeholder (update these):
https://calendly.com/constructify-demo/30min

// Locations to update:
// - components/live-chat.tsx (multiple locations)
// - app/api/demo-request/route.ts (email templates)
// - utils/demoScheduling.ts (completion message)
```

**UTM Tracking:**
All Calendly links include UTM parameters for analytics:
- `utm_source=chatbot` or `utm_source=email`
- `utm_medium=demo_request` or `utm_medium=buying_signal`

### 🎯 User Experience:

**Option 1: Instant Booking**
- User clicks Calendly link
- Sees available time slots
- Books immediately with confirmation

**Option 2: Guided Scheduling**
- User goes through chatbot demo collection
- Receives email with both Calendly link and personal outreach
- Can choose preferred method

### 📧 Email Integration:
Demo confirmation emails now include:
- Prominent Calendly booking button
- Pre-filled user information
- Instant confirmation messaging
- Alternative contact options

The dual approach (instant booking + personal outreach) maximizes conversion rates by giving users choice in how they prefer to schedule. 