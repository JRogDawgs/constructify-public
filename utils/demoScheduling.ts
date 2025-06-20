// 📅 Demo Scheduling Utility for Constructify Chatbot
// Handles demo requests, scheduling, and calendar management

interface DemoRequest {
  id: string
  userEmail: string
  userName: string
  companyName: string
  phoneNumber?: string
  teamSize: string
  industryType: string
  specificInterests: string[]
  preferredTimeSlots: string[]
  urgency: 'immediate' | 'this_week' | 'next_week' | 'flexible'
  requestedDate?: string
  requestedTime?: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  sessionId: string
  timestamp: string
  assignedTo?: string
  scheduledDateTime?: string
  meetingLink?: string
  notes?: string
}

interface AvailableTimeSlot {
  date: string
  time: string
  available: boolean
  assignedTo?: string
}

/**
 * Collects user information for demo scheduling
 * @param currentStep - Current step in the collection process
 * @param userResponse - User's response to the current question
 * @returns Object with next question and completion status
 */
export function collectDemoInformation(currentStep: string, userResponse: string): {
  nextQuestion: string
  isComplete: boolean
  nextStep: string
  data?: any
} {
  switch (currentStep) {
    case 'start':
      return {
        nextQuestion: `🎬 **Perfect! I'd love to schedule a personalized Constructify demo for you.**\n\n**First, what's your name?**\n\n*This helps us personalize your demo experience.*`,
        isComplete: false,
        nextStep: 'name'
      }
      
    case 'name':
      if (!userResponse.trim()) {
        return {
          nextQuestion: `📝 **I need your name to continue.**\n\nPlease tell me what to call you during the demo.`,
          isComplete: false,
          nextStep: 'name'
        }
      }
      return {
        nextQuestion: `👋 Nice to meet you, ${userResponse}!\n\n**What's your email address?** I'll send you the demo confirmation and calendar invite.`,
        isComplete: false,
        nextStep: 'email',
        data: { userName: userResponse.trim() }
      }
      
    case 'email':
      if (!isValidEmail(userResponse.trim())) {
        return {
          nextQuestion: `📧 **Please provide a valid email address.**\n\nFormat: your-email@company.com\n\nI'll use this to send your demo confirmation and meeting details.`,
          isComplete: false,
          nextStep: 'email'
        }
      }
      return {
        nextQuestion: `✅ Got it! **What's your company name?**\n\n*This helps us tailor the demo to your specific industry and needs.*`,
        isComplete: false,
        nextStep: 'company',
        data: { userEmail: userResponse.trim() }
      }
      
    case 'company':
      return {
        nextQuestion: `🏢 Thanks! **How many people are on your construction team?**\n\nChoose one:\n• **1-10 employees** (Small team)\n• **11-25 employees** (Growing company) \n• **26-100 employees** (Medium company)\n• **100+ employees** (Large enterprise)\n\n*This helps us show you the right features for your scale.*`,
        isComplete: false,
        nextStep: 'team_size',
        data: { companyName: userResponse.trim() }
      }
      
    case 'team_size':
      const validSizes = ['1-10', '11-25', '26-100', '100+', 'small', 'growing', 'medium', 'large', 'enterprise']
      const response = userResponse.toLowerCase()
      if (!validSizes.some(size => response.includes(size))) {
        return {
          nextQuestion: `📊 **Please select your team size:**\n\n• **1-10 employees**\n• **11-25 employees**\n• **26-100 employees** \n• **100+ employees**\n\nJust type one of these options.`,
          isComplete: false,
          nextStep: 'team_size'
        }
      }
      
      // Normalize team size
      let teamSize = '1-10 employees'
      if (response.includes('11-25') || response.includes('growing')) teamSize = '11-25 employees'
      else if (response.includes('26-100') || response.includes('medium')) teamSize = '26-100 employees'
      else if (response.includes('100+') || response.includes('large') || response.includes('enterprise')) teamSize = '100+ employees'
      
      return {
        nextQuestion: `👷 Perfect! **What type of construction work do you primarily do?**\n\nChoose one:\n• **Residential** (Homes, apartments)\n• **Commercial** (Offices, retail)\n• **Industrial** (Manufacturing, warehouses)\n• **Infrastructure** (Roads, bridges)\n• **Mixed/Multiple** types\n\n*This helps us show relevant features for your industry.*`,
        isComplete: false,
        nextStep: 'industry',
        data: { teamSize }
      }
      
    case 'industry':
      const validIndustries = ['residential', 'commercial', 'industrial', 'infrastructure', 'mixed', 'multiple']
      const industryResponse = userResponse.toLowerCase()
      if (!validIndustries.some(industry => industryResponse.includes(industry))) {
        return {
          nextQuestion: `🏗️ **Please select your primary construction type:**\n\n• **Residential**\n• **Commercial**\n• **Industrial**\n• **Infrastructure**\n• **Mixed/Multiple**\n\nJust type one of these options.`,
          isComplete: false,
          nextStep: 'industry'
        }
      }
      
      return {
        nextQuestion: `🎯 Excellent! **What specific areas interest you most?**\n\nSelect any that apply (separate with commas):\n• **Employee Management** (Profiles, onboarding)\n• **Project Management** (Scheduling, tracking)\n• **Safety Compliance** (OSHA, certifications)\n• **Payroll Integration** (Banking, expenses)\n• **Mobile Access** (Field workers)\n• **Analytics & Reporting**\n• **All Features** (Comprehensive overview)\n\n*Example: "Employee Management, Safety Compliance, Mobile Access"*`,
          isComplete: false,
          nextStep: 'interests',
          data: { industryType: userResponse.trim() }
        }
        
    case 'interests':
      return {
        nextQuestion: `⏰ **When would you like to schedule your demo?**\n\nChoose your preference:\n• **This Week** (Next 3-5 days)\n• **Next Week** (5-10 days)\n• **ASAP** (Within 24 hours)\n• **I'm Flexible** (Anytime convenient)\n\n*Our demos typically take 30-45 minutes and can be scheduled during business hours (9 AM - 6 PM EST).*`,
        isComplete: false,
        nextStep: 'timing',
        data: { specificInterests: userResponse.split(',').map(s => s.trim()) }
      }
      
    case 'timing':
      const validTimings = ['this week', 'next week', 'asap', 'flexible', 'week', 'flexible']
      const timingResponse = userResponse.toLowerCase()
      if (!validTimings.some(timing => timingResponse.includes(timing))) {
        return {
          nextQuestion: `📅 **Please select your preferred timing:**\n\n• **This Week**\n• **Next Week**\n• **ASAP**\n• **I'm Flexible**\n\nJust type one of these options.`,
          isComplete: false,
          nextStep: 'timing'
        }
      }
      
      // Normalize urgency
      let urgency: 'immediate' | 'this_week' | 'next_week' | 'flexible' = 'flexible'
      if (timingResponse.includes('asap')) urgency = 'immediate'
      else if (timingResponse.includes('this week')) urgency = 'this_week'
      else if (timingResponse.includes('next week')) urgency = 'next_week'
      
      return {
        nextQuestion: `🎉 **Perfect! I have all the information I need.**\n\n📋 **Demo Request Summary:**\n• **Company:** {companyName}\n• **Team Size:** {teamSize}\n• **Industry:** {industryType}\n• **Focus Areas:** {specificInterests}\n• **Timing:** ${userResponse}\n\n✅ **I'm scheduling your personalized demo now!**\n\n🗓️ **TWO WAYS TO BOOK YOUR DEMO:**\n\n**Option 1: Instant Booking** 📅\n[**📅 Pick Your Time Now →**](https://calendly.com/constructify-demo/30min?utm_source=chatbot&utm_medium=demo_request)\n*Choose from available slots and get instant confirmation*\n\n**Option 2: We'll Contact You** 📞\n*Our team will email you within 2 hours with time options*\n\n📧 **Either way, you'll receive:**\n• Calendar invite with meeting link\n• Pre-demo preparation guide\n• Direct contact for your demo specialist\n\n**Click the Calendly link above to book instantly, or wait for our email!** 🚀`,
        isComplete: true,
        nextStep: 'complete',
        data: { urgency, preferredTimeSlots: [userResponse] }
      }
      
    default:
      return {
        nextQuestion: `🎬 **Let's schedule your Constructify demo!**\n\nWhat's your name?`,
        isComplete: false,
        nextStep: 'name'
      }
  }
}

/**
 * Syncs demo data to Google Sheets CRM
 */
async function syncToCRM(demoData: Partial<DemoRequest>): Promise<{ success: boolean; message: string }> {
  try {
    console.log('📊 Syncing to Google Sheets CRM...')
    
    // Transform demo data to match Google Sheets format
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData)
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ Demo data synced to Google Sheets CRM')
      return { success: true, message: 'Synced to CRM successfully' }
    } else {
      console.warn('⚠️ CRM sync failed (non-critical):', result.message)
      return { success: false, message: result.message || 'CRM sync failed' }
    }
  } catch (error) {
    console.warn('⚠️ CRM sync error (non-critical):', error)
    return { success: false, message: 'CRM sync failed' }
  }
}

/**
 * Creates a demo request and sends notifications
 * @param demoData - Complete demo request data
 * @returns Promise<boolean> - Success status
 */
export async function createDemoRequest(demoData: Partial<DemoRequest>): Promise<boolean> {
  try {
    console.log('📅 CREATING DEMO REQUEST:', demoData)
    
    // Primary: Send to API endpoint for email notifications
    const response = await fetch('/api/demo-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demoData)
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('✅ DEMO REQUEST SUCCESS:', result)
    
    // Save to user profile (non-blocking)
    if (demoData.userEmail) {
      fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: demoData.userEmail,
          sessionId: demoData.sessionId,
          demoData: {
            id: result.demoId || demoData.id,
            userName: demoData.userName,
            companyName: demoData.companyName,
            phoneNumber: demoData.phoneNumber,
            teamSize: demoData.teamSize,
            industryType: demoData.industryType,
            specificInterests: demoData.specificInterests,
            urgency: demoData.urgency,
            status: demoData.status || 'pending'
          }
        })
      }).then(profileResponse => {
        if (profileResponse.ok) {
          console.log('✅ User profile updated successfully')
        } else {
          console.warn('⚠️ User profile update failed (non-critical)')
        }
      }).catch(error => {
        console.warn('⚠️ User profile update error (non-critical):', error)
      })
    }
    
    // Secondary: Sync to Google Sheets CRM (non-blocking)
    syncToCRM(demoData).then((crmResult) => {
      if (crmResult.success) {
        console.log('✅ CRM sync completed successfully')
      } else {
        console.warn('⚠️ CRM sync failed (non-critical):', crmResult.message)
      }
    }).catch((error) => {
      console.warn('⚠️ CRM sync error (non-critical):', error)
    })
    
    // Tertiary: Send to Private CRM Dashboard (non-blocking)
    if (typeof window === 'undefined') { // Server-side only
      import('../utils/privateCRMSync').then(({ sendDemoToPrivateCRM }) => {
        sendDemoToPrivateCRM(demoData).then((privateCRMResult) => {
          if (privateCRMResult.success) {
            console.log('✅ Private CRM sync completed successfully:', {
              leadId: privateCRMResult.leadId,
              priority: privateCRMResult.leadScore?.priority,
              isHotLead: privateCRMResult.leadScore?.isHotLead
            })
          } else {
            console.warn('⚠️ Private CRM sync failed (non-critical):', privateCRMResult.error)
          }
        }).catch((error) => {
          console.warn('⚠️ Private CRM sync error (non-critical):', error)
        })
      }).catch((error) => {
        console.warn('⚠️ Private CRM module load error:', error)
      })
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to create demo request:', error)
    return false
  }
}

// Email functions are now handled by the API endpoint

/**
 * Email validation helper
 * @param email - Email address to validate
 * @returns boolean - Whether email is valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Checks if user has previous demo submissions and returns prefill data
 * @param email - User's email address
 * @param sessionId - Optional session ID for fallback
 * @returns Promise with user profile and prefill data
 */
export async function getUserProfile(email?: string, sessionId?: string): Promise<{
  isReturningUser: boolean
  prefillData?: any
  profile?: any
}> {
  try {
    if (!email && !sessionId) {
      return { isReturningUser: false }
    }
    
    const params = new URLSearchParams()
    if (email) params.append('email', email)
    if (sessionId) params.append('sessionId', sessionId)
    
    const response = await fetch(`/api/user-profile?${params.toString()}`)
    
    if (!response.ok) {
      console.warn('Failed to fetch user profile')
      return { isReturningUser: false }
    }
    
    const result = await response.json()
    
    if (result.success && result.profile) {
      console.log('👤 RETURNING USER DETECTED:', {
        email: result.profile.email,
        totalDemos: result.profile.totalDemoRequests,
        lastActive: result.profile.lastActive
      })
      
      return {
        isReturningUser: result.isReturningUser,
        prefillData: result.prefillData,
        profile: result.profile
      }
    }
    
    return { isReturningUser: false }
    
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { isReturningUser: false }
  }
}

/**
 * Updates demo status in user profile
 * @param email - User's email
 * @param demoId - Demo request ID
 * @param updates - Status updates
 */
export async function updateDemoStatus(email: string, demoId: string, updates: any): Promise<boolean> {
  try {
    const response = await fetch('/api/user-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        demoId,
        updates
      })
    })
    
    if (response.ok) {
      console.log('✅ Demo status updated in user profile')
      return true
    } else {
      console.warn('⚠️ Failed to update demo status')
      return false
    }
  } catch (error) {
    console.error('Error updating demo status:', error)
    return false
  }
}

/**
 * Gets available demo time slots (mock data for now)
 * @returns Array of available time slots
 */
export function getAvailableTimeSlots(): AvailableTimeSlot[] {
  // In production, this would query a real calendar system
  const mockSlots: AvailableTimeSlot[] = [
    { date: '2024-01-22', time: '10:00 AM EST', available: true },
    { date: '2024-01-22', time: '2:00 PM EST', available: true },
    { date: '2024-01-23', time: '11:00 AM EST', available: true },
    { date: '2024-01-23', time: '3:00 PM EST', available: false, assignedTo: 'Demo booked' },
    { date: '2024-01-24', time: '9:00 AM EST', available: true },
    { date: '2024-01-24', time: '1:00 PM EST', available: true },
  ]
  
  return mockSlots.filter(slot => slot.available)
}

/**
 * Schedules a demo at a specific time slot
 * @param demoId - Demo request ID
 * @param dateTime - Selected date and time
 * @returns Promise<boolean> - Success status
 */
export async function scheduleDemoAtTime(demoId: string, dateTime: string): Promise<boolean> {
  try {
    console.log(`📅 SCHEDULING DEMO: ${demoId} at ${dateTime}`)
    
    // In production, this would:
    // 1. Update the demo request in database
    // 2. Create calendar event
    // 3. Send calendar invites
    // 4. Update availability
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to schedule demo:', error)
    return false
  }
} 