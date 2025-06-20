# 🚀 CRM Auto-Sync & Live Booking Integration

## Overview

The Constructify demo scheduling system now includes two powerful integrations that streamline lead management and booking:

1. **📊 CRM Auto-Sync (Google Sheets)** - Automatically captures all demo requests in a Google Sheet
2. **📅 Live Booking Integration (Calendly)** - Allows instant demo scheduling with real-time availability

## 📊 CRM Auto-Sync (Google Sheets)

### Features
- **Automatic Sync**: Every demo request is instantly logged to Google Sheets
- **Non-Blocking**: CRM sync happens in background - won't affect user experience
- **Retry Logic**: Built-in retry mechanism with exponential backoff
- **Auto-Initialize**: Sheet headers are created automatically
- **Error Handling**: Comprehensive logging and graceful failure handling

### Architecture

```mermaid
graph TD
    A[User Completes Demo Form] --> B[Primary: Send Emails]
    B --> C[Secondary: Sync to CRM]
    C --> D{CRM Sync Success?}
    D -->|Yes| E[Log Success]
    D -->|No| F[Retry with Backoff]
    F --> G{Max Retries?}
    G -->|No| F
    G -->|Yes| H[Log Failure - Continue]
    E --> I[Demo Process Complete]
    H --> I
```

### API Endpoint: `/api/sync-to-sheet`

**POST Request:**
```typescript
interface DemoData {
  name: string
  email: string
  company: string
  teamSize: string
  industry: string
  interests: string[]
  timing: string
  timestamp?: string
  source?: string
}
```

**Response:**
```typescript
{
  success: boolean
  message: string
  timestamp?: string
  sheetId?: string
}
```

### Google Sheets Setup

#### 1. Create Google Cloud Project
```bash
# Navigate to Google Cloud Console
https://console.cloud.google.com

# Steps:
1. Create new project or select existing
2. Enable Google Sheets API
3. Create service account
4. Download JSON key file
```

#### 2. Service Account Configuration
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

#### 3. Environment Variables
```bash
# Required for Google Sheets integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

# Optional
GOOGLE_SHEET_NAME=Demo Requests
```

#### 4. Sheet Structure
The system automatically creates these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Timestamp | Request time | 2024-01-15T10:30:00Z |
| Name | User's name | John Smith |
| Email | Contact email | john@construction.com |
| Company | Company name | Smith Construction |
| Team Size | Employee count | 11-25 employees |
| Industry | Construction type | Commercial |
| Interests | Feature interests | Employee Management, Safety |
| Timing | Demo preference | This Week |
| Source | Request origin | Chatbot Demo Scheduler |
| Status | Lead status | New Lead |
| Notes | Additional info | Demo requested via chatbot |

### Code Integration

**Demo Scheduling Utility:**
```typescript
// utils/demoScheduling.ts
async function syncToCRM(demoData: Partial<DemoRequest>): Promise<{success: boolean; message: string}> {
  try {
    const sheetData = {
      name: demoData.userName || 'Unknown',
      email: demoData.userEmail || '',
      company: demoData.companyName || 'Unknown',
      teamSize: demoData.teamSize || 'Unknown',
      industry: demoData.industryType || 'Unknown',
      interests: demoData.specificInterests || [],
      timing: demoData.urgency || 'flexible',
      timestamp: demoData.timestamp || new Date().toISOString(),
      source: 'Chatbot Demo Scheduler'
    }
    
    const response = await fetch('/api/sync-to-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetData)
    })
    
    const result = await response.json()
    return result.success ? 
      { success: true, message: 'Synced to CRM successfully' } :
      { success: false, message: result.message || 'CRM sync failed' }
  } catch (error) {
    return { success: false, message: 'CRM sync failed' }
  }
}
```

### Testing CRM Sync

**Direct API Test:**
```bash
curl -X POST http://localhost:3000/api/sync-to-sheet \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Construction",
    "teamSize": "1-10 employees",
    "industry": "Residential",
    "interests": ["Employee Management", "Safety Compliance"],
    "timing": "flexible"
  }'
```

**Health Check:**
```bash
curl http://localhost:3000/api/sync-to-sheet
```

**Expected Response:**
```json
{
  "service": "Google Sheets Sync",
  "configured": true,
  "sheetId": "1BxiMVs0...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📅 Live Booking Integration (Calendly)

### Features
- **Instant Booking**: Users can schedule demos immediately
- **Real-Time Availability**: Shows actual available time slots
- **Pre-Filled Information**: User data auto-populates in Calendly
- **UTM Tracking**: Analytics tracking for all booking sources
- **Dual Approach**: Both instant booking and guided scheduling

### Integration Points

#### 1. Chatbot Responses
```typescript
// Demo request responses include Calendly links
return `🚀 **TWO WAYS TO GET YOUR DEMO:**

**Option 1: Instant Booking** ⚡
[**📅 Book Your Demo Now →**](https://calendly.com/constructify-demo/30min?utm_source=chatbot&utm_medium=demo_request)
*Pick your exact time, get instant confirmation!*

**Option 2: Guided Scheduling** 🎯
Say **"schedule a demo"** and I'll collect your info for a personalized experience!`
```

#### 2. Email Templates
```html
<!-- Instant Booking CTA in confirmation emails -->
<a href="https://calendly.com/constructify-demo/30min?utm_source=email&utm_medium=demo_confirmation&prefill_name=${encodeURIComponent(userName)}&prefill_email=${encodeURIComponent(userEmail)}" 
   style="background: #1d4ed8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
  📅 Pick Your Demo Time Now
</a>
```

#### 3. Buying Signal Detection
```typescript
// When users show buying intent
if (hasBuyingSignal) {
  return `🔥 **I can hear you're ready to move forward - SMART decision!**

**🚀 TWO WAYS TO GET STARTED:**

**Option 1: Book Demo Instantly** ⚡
[**📅 Schedule Your Demo →**](https://calendly.com/constructify-demo/30min?utm_source=chatbot&utm_medium=buying_signal)
*Get instant confirmation and start seeing results!*`
}
```

### Calendly Configuration

#### 1. Update URLs
Replace placeholder URLs with your actual Calendly links:

**Files to Update:**
- `components/live-chat.tsx` (multiple locations)
- `app/api/demo-request/route.ts` (email templates)
- `utils/demoScheduling.ts` (completion message)

**Current Placeholders:**
```typescript
// Replace these with your actual Calendly URLs:
https://calendly.com/constructify-demo/30min
https://calendly.com/constructify-demos
```

#### 2. UTM Parameters
All Calendly links include tracking parameters:

| Parameter | Values | Purpose |
|-----------|--------|---------|
| utm_source | chatbot, email | Traffic source |
| utm_medium | demo_request, buying_signal, demo_confirmation | Specific trigger |
| utm_campaign | Optional | Campaign tracking |

#### 3. Pre-filled Data
Calendly links can pre-fill user information:
```typescript
const calendlyUrl = `https://calendly.com/constructify-demo/30min?` +
  `utm_source=email&utm_medium=demo_confirmation&` +
  `prefill_name=${encodeURIComponent(userName)}&` +
  `prefill_email=${encodeURIComponent(userEmail)}`
```

### User Experience Flow

#### Option 1: Instant Booking Path
```mermaid
graph TD
    A[User Wants Demo] --> B[Clicks Calendly Link]
    B --> C[Sees Available Times]
    C --> D[Selects Time Slot]
    D --> E[Fills Contact Info]
    E --> F[Confirms Booking]
    F --> G[Receives Calendar Invite]
    G --> H[Demo Scheduled ✅]
```

#### Option 2: Guided Scheduling Path
```mermaid
graph TD
    A[User Wants Demo] --> B[Says 'Schedule Demo']
    B --> C[Chatbot Collects Info]
    C --> D[Sends Confirmation Email]
    D --> E[Email Contains Calendly Link]
    E --> F{User Choice}
    F -->|Instant| G[Books via Calendly]
    F -->|Personal| H[Waits for Sales Contact]
    G --> I[Demo Scheduled ✅]
    H --> I
```

### Analytics & Tracking

#### UTM Parameter Tracking
Monitor booking sources in your analytics:
- **chatbot/demo_request**: Direct chatbot demo requests
- **chatbot/buying_signal**: Users showing buying intent
- **email/demo_confirmation**: Email confirmation bookings

#### Conversion Metrics
Track these key metrics:
- **Calendly Click Rate**: % of users who click booking links
- **Booking Completion Rate**: % who complete Calendly booking
- **Instant vs Guided**: Preference split between booking methods
- **Source Attribution**: Which triggers drive most bookings

## 🚀 Implementation Benefits

### For Sales Team
- **Automatic Lead Capture**: All demo requests in Google Sheets
- **Real-Time Notifications**: Instant email alerts
- **Lead Qualification**: Detailed information collection
- **Booking Flexibility**: Instant + personal outreach options

### For Users
- **Immediate Gratification**: Book demos instantly
- **Convenience**: Choose preferred scheduling method
- **Professional Experience**: Branded emails and booking flow
- **Confirmation**: Instant booking confirmations

### For Business
- **Higher Conversion**: Dual booking approach
- **Better Analytics**: UTM tracking and CRM data
- **Process Automation**: Reduced manual work
- **Scalability**: Handles increased demo volume

## 🔧 Troubleshooting

### Common Issues

#### Google Sheets Sync Fails
```bash
# Check configuration
curl http://localhost:3000/api/sync-to-sheet

# Common fixes:
1. Verify service account email has sheet access
2. Check private key formatting (include \n characters)
3. Ensure Google Sheets API is enabled
4. Verify sheet ID is correct
```

#### Calendly Links Not Working
```typescript
// Check URL formatting
const validUrl = 'https://calendly.com/your-username/30min'

// Ensure UTM parameters are properly encoded
const params = new URLSearchParams({
  utm_source: 'chatbot',
  utm_medium: 'demo_request',
  prefill_name: userName,
  prefill_email: userEmail
})
```

#### Environment Variables
```bash
# Verify all required variables are set
echo $GOOGLE_SERVICE_ACCOUNT_EMAIL
echo $GOOGLE_SHEET_ID
# Private key should start with -----BEGIN PRIVATE KEY-----
```

### Development vs Production

#### Development Mode
- CRM sync logs to console if not configured
- Email templates show placeholder Calendly links
- All functionality works without external services

#### Production Mode
- Requires all environment variables
- Real Google Sheets integration
- Live Calendly booking
- Full email delivery

## 📈 Next Steps

### Potential Enhancements
1. **HubSpot Integration**: Replace/supplement Google Sheets
2. **Salesforce Sync**: Enterprise CRM integration
3. **Calendar Sync**: Two-way calendar integration
4. **Automated Follow-up**: Scheduled email sequences
5. **Analytics Dashboard**: Real-time booking metrics

### Scaling Considerations
- **Rate Limiting**: Google Sheets API limits
- **Error Handling**: Enhanced retry mechanisms  
- **Data Validation**: Stricter input validation
- **Security**: Audit service account permissions
- **Monitoring**: Health checks and alerting

The CRM Auto-Sync and Live Booking integration transforms the demo scheduling process from a manual, time-consuming task into an automated, user-friendly experience that captures every lead and maximizes conversion opportunities. 