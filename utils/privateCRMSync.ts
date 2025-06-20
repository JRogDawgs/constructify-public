// 🌐 Private CRM Sync Utility for Constructify Public Site
// Sends lead data to the private dashboard for centralized tracking

interface LeadData {
  name: string
  email: string
  company: string
  teamSize: string
  industry: string
  interests: string | string[]
  timing: string
  source: string
  notes?: string
  sessionId?: string
  conversationContext?: string[]
}

interface CRMSyncResponse {
  success: boolean
  leadId?: string
  leadScore?: {
    score: number
    priority: string
    isHotLead: boolean
  }
  message?: string
  error?: string
  timestamp?: string
}

/**
 * Sends lead data to the private CRM dashboard
 * @param leadData - Lead information to send
 * @returns Promise with sync result
 */
export async function sendLeadToPrivateCRM(leadData: LeadData): Promise<CRMSyncResponse> {
  try {
    const endpoint = process.env.PRIVATE_CRM_ENDPOINT
    const apiKey = process.env.PRIVATE_CRM_API_KEY
    
    if (!endpoint || !apiKey) {
      console.warn('⚠️ Private CRM not configured:', { 
        hasEndpoint: !!endpoint, 
        hasApiKey: !!apiKey 
      })
      return {
        success: false,
        error: 'Private CRM configuration missing'
      }
    }
    
    // Prepare payload
    const payload = {
      name: leadData.name,
      email: leadData.email,
      company: leadData.company,
      teamSize: leadData.teamSize,
      industry: leadData.industry,
      interests: Array.isArray(leadData.interests) 
        ? leadData.interests.join(', ') 
        : leadData.interests,
      timing: leadData.timing,
      source: leadData.source,
      notes: leadData.notes || '',
      timestamp: new Date().toISOString(),
      sessionId: leadData.sessionId,
      conversationContext: leadData.conversationContext
    }
    
    console.log('🌐 SENDING LEAD TO PRIVATE CRM:', {
      endpoint,
      company: payload.company,
      email: payload.email,
      source: payload.source
    })
    
    // Send to private CRM
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'User-Agent': 'Constructify-Public-Site/1.0'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result: CRMSyncResponse = await response.json()
    
    if (result.success) {
      console.log('✅ PRIVATE CRM SYNC SUCCESS:', {
        leadId: result.leadId,
        priority: result.leadScore?.priority,
        isHotLead: result.leadScore?.isHotLead
      })
    } else {
      console.warn('⚠️ PRIVATE CRM SYNC FAILED:', result.error)
    }
    
    return result
    
  } catch (error) {
    console.error('❌ PRIVATE CRM SYNC ERROR:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Sends demo request data to private CRM
 * @param demoData - Demo request information
 * @returns Promise with sync result
 */
export async function sendDemoToPrivateCRM(demoData: any): Promise<CRMSyncResponse> {
  const leadData: LeadData = {
    name: demoData.userName || 'Unknown',
    email: demoData.userEmail || '',
    company: demoData.companyName || 'Unknown',
    teamSize: demoData.teamSize || 'Unknown',
    industry: demoData.industryType || 'Unknown',
    interests: demoData.specificInterests || [],
    timing: demoData.urgency || 'flexible',
    source: 'Chatbot - Demo Request',
    notes: `Demo request submitted. Preferred time slots: ${demoData.preferredTimeSlots?.join(', ') || 'None specified'}`,
    sessionId: demoData.sessionId,
    conversationContext: demoData.conversationContext
  }
  
  return sendLeadToPrivateCRM(leadData)
}

/**
 * Sends contact form data to private CRM
 * @param contactData - Contact form information
 * @returns Promise with sync result
 */
export async function sendContactToPrivateCRM(contactData: any): Promise<CRMSyncResponse> {
  const leadData: LeadData = {
    name: contactData.name || 'Unknown',
    email: contactData.email || '',
    company: contactData.company || 'Unknown',
    teamSize: contactData.teamSize || 'Unknown',
    industry: contactData.industry || 'Unknown',
    interests: contactData.interests || contactData.message || '',
    timing: 'flexible',
    source: 'Contact Form',
    notes: contactData.message || '',
    sessionId: contactData.sessionId
  }
  
  return sendLeadToPrivateCRM(leadData)
}

/**
 * Sends newsletter signup to private CRM
 * @param signupData - Newsletter signup information
 * @returns Promise with sync result
 */
export async function sendNewsletterToPrivateCRM(signupData: any): Promise<CRMSyncResponse> {
  const leadData: LeadData = {
    name: signupData.name || 'Newsletter Subscriber',
    email: signupData.email || '',
    company: signupData.company || 'Unknown',
    teamSize: 'Unknown',
    industry: 'Unknown',
    interests: 'Newsletter Subscription',
    timing: 'flexible',
    source: 'Newsletter Signup',
    notes: 'Subscribed to newsletter for updates',
    sessionId: signupData.sessionId
  }
  
  return sendLeadToPrivateCRM(leadData)
}

/**
 * Tests the private CRM connection
 * @returns Promise with connection test result
 */
export async function testPrivateCRMConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const endpoint = process.env.PRIVATE_CRM_ENDPOINT
    const apiKey = process.env.PRIVATE_CRM_API_KEY
    
    if (!endpoint || !apiKey) {
      return {
        success: false,
        message: 'Private CRM configuration missing (endpoint or API key)'
      }
    }
    
    // Test with GET request to check endpoint status
    const testEndpoint = endpoint.replace('/api/receive-lead', '/api/receive-lead')
    const response = await fetch(testEndpoint, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'User-Agent': 'Constructify-Public-Site/1.0'
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      return {
        success: true,
        message: `Connected successfully. ${result.totalLeads || 0} leads in CRM.`
      }
    } else {
      return {
        success: false,
        message: `Connection failed: HTTP ${response.status}`
      }
    }
    
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Batches multiple leads for efficient sending
 * @param leads - Array of lead data
 * @returns Promise with batch sync results
 */
export async function batchSendToPrivateCRM(leads: LeadData[]): Promise<{
  successful: number
  failed: number
  results: CRMSyncResponse[]
}> {
  const results: CRMSyncResponse[] = []
  let successful = 0
  let failed = 0
  
  console.log(`🔄 BATCH SENDING ${leads.length} LEADS TO PRIVATE CRM`)
  
  // Send leads with small delay to avoid overwhelming the server
  for (const lead of leads) {
    const result = await sendLeadToPrivateCRM(lead)
    results.push(result)
    
    if (result.success) {
      successful++
    } else {
      failed++
    }
    
    // Small delay between requests
    if (leads.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  console.log(`✅ BATCH COMPLETE: ${successful} successful, ${failed} failed`)
  
  return { successful, failed, results }
}

/**
 * Validates lead data before sending
 * @param leadData - Lead data to validate
 * @returns Validation result
 */
export function validateLeadData(leadData: LeadData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!leadData.name || leadData.name.trim().length === 0) {
    errors.push('Name is required')
  }
  
  if (!leadData.email || !isValidEmail(leadData.email)) {
    errors.push('Valid email is required')
  }
  
  if (!leadData.company || leadData.company.trim().length === 0) {
    errors.push('Company is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Email validation helper
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Gets CRM sync statistics
 * @returns Current sync configuration and status
 */
export function getCRMSyncStatus(): {
  configured: boolean
  endpoint?: string
  hasApiKey: boolean
  lastSync?: string
} {
  return {
    configured: !!(process.env.PRIVATE_CRM_ENDPOINT && process.env.PRIVATE_CRM_API_KEY),
    endpoint: process.env.PRIVATE_CRM_ENDPOINT,
    hasApiKey: !!process.env.PRIVATE_CRM_API_KEY,
    lastSync: new Date().toISOString()
  }
} 