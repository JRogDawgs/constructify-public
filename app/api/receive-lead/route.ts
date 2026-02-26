import { NextRequest, NextResponse } from 'next/server'
import { scoreLeadData, generateLeadScoreReport, type DemoRequestData } from '../../../utils/leadScoring'
import { sendLeadNotification } from '../../../lib/twilio'

// Contact form lead (public /contact page)
interface ContactFormLead {
  name: string
  email: string
  company: string
  phone: string
  message?: string
  projectType?: string
  source?: string
}

// Lead data interface for incoming requests
interface IncomingLead {
  name: string
  email: string
  company: string
  teamSize: string
  industry: string
  interests: string
  timing: string
  source: string
  notes?: string
  timestamp: string
  sessionId?: string
  conversationContext?: string[]
}

// Database lead record interface
interface LeadRecord {
  id: string
  name: string
  email: string
  company: string
  teamSize: string
  industry: string
  interests: string[]
  timing: string
  source: string
  notes: string
  timestamp: string
  leadScore: number
  priority: 'HOT' | 'HIGH' | 'MEDIUM' | 'LOW'
  isHotLead: boolean
  scoringReasons: string[]
  status: 'new' | 'contacted' | 'qualified' | 'demo_scheduled' | 'closed_won' | 'closed_lost'
  assignedTo?: string
  lastActivity: string
  sessionId?: string
  conversationContext?: string[]
}

// Mock database storage (replace with real database in production)
const leadsDatabase = new Map<string, LeadRecord>()

/**
 * Validates API key authentication
 */
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
  const validApiKey = process.env.PRIVATE_CRM_API_KEY
  
  if (!validApiKey) {
    if (process.env.NODE_ENV !== 'production') console.warn('⚠️ PRIVATE_CRM_API_KEY not configured')
    return false
  }
  
  return apiKey === validApiKey
}

/**
 * Validates and sanitizes incoming lead data
 */
function validateLeadData(data: any): { isValid: boolean; errors: string[]; sanitized?: IncomingLead } {
  const errors: string[] = []
  
  // Required fields validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string')
  }
  
  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('Valid email is required')
  }
  
  if (!data.company || typeof data.company !== 'string') {
    errors.push('Company is required and must be a string')
  }
  
  if (!data.teamSize || typeof data.teamSize !== 'string') {
    errors.push('Team size is required')
  }
  
  if (!data.industry || typeof data.industry !== 'string') {
    errors.push('Industry is required')
  }
  
  if (!data.interests || typeof data.interests !== 'string') {
    errors.push('Interests are required')
  }
  
  if (!data.timing || typeof data.timing !== 'string') {
    errors.push('Timing is required')
  }
  
  if (!data.source || typeof data.source !== 'string') {
    errors.push('Source is required')
  }
  
  if (!data.timestamp || typeof data.timestamp !== 'string') {
    errors.push('Timestamp is required')
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors }
  }
  
  // Sanitize data
  const sanitized: IncomingLead = {
    name: data.name.trim().substring(0, 100),
    email: data.email.trim().toLowerCase().substring(0, 255),
    company: data.company.trim().substring(0, 100),
    teamSize: data.teamSize.trim().substring(0, 50),
    industry: data.industry.trim().substring(0, 50),
    interests: data.interests.trim().substring(0, 500),
    timing: data.timing.trim().substring(0, 50),
    source: data.source.trim().substring(0, 100),
    notes: data.notes ? data.notes.trim().substring(0, 1000) : '',
    timestamp: data.timestamp,
    sessionId: data.sessionId ? data.sessionId.trim().substring(0, 100) : undefined,
    conversationContext: Array.isArray(data.conversationContext) ? 
      data.conversationContext.slice(0, 10).map((msg: any) => String(msg).substring(0, 500)) : undefined
  }
  
  return { isValid: true, errors: [], sanitized }
}

/**
 * Email validation helper
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Phone validation helper (basic E.164-friendly check)
 */
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10
}

/**
 * Validates contact form data (name, email, company, phone)
 */
function validateContactFormData(data: any): { isValid: boolean; errors: string[]; sanitized?: ContactFormLead } {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string')
  }
  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('Valid email is required')
  }
  if (!data.company || typeof data.company !== 'string') {
    errors.push('Company is required and must be a string')
  }
  if (!data.phone || typeof data.phone !== 'string' || !isValidPhone(data.phone)) {
    errors.push('Valid phone is required')
  }

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    sanitized: {
      name: data.name.trim().substring(0, 100),
      email: data.email.trim().toLowerCase().substring(0, 255),
      company: data.company.trim().substring(0, 100),
      phone: data.phone.trim().substring(0, 20),
      message: data.message ? data.message.trim().substring(0, 1000) : undefined,
      projectType: data.projectType ? data.projectType.trim().substring(0, 50) : undefined,
      source: 'contact_form',
    },
  }
}

/**
 * Detects if request is contact form format (has name, email, company, phone; no full CRM fields)
 */
function isContactFormRequest(data: any): boolean {
  return (
    typeof data?.name === 'string' &&
    typeof data?.email === 'string' &&
    typeof data?.company === 'string' &&
    typeof data?.phone === 'string' &&
    (data.teamSize == null || data.industry == null || data.interests == null)
  )
}

/**
 * Converts timing string to urgency format for scoring
 */
function mapTimingToUrgency(timing: string): 'immediate' | 'this_week' | 'next_week' | 'flexible' {
  const timingLower = timing.toLowerCase()
  
  if (timingLower.includes('asap') || timingLower.includes('immediate') || timingLower.includes('urgent')) {
    return 'immediate'
  }
  if (timingLower.includes('this week') || timingLower.includes('soon')) {
    return 'this_week'
  }
  if (timingLower.includes('next week')) {
    return 'next_week'
  }
  return 'flexible'
}

/**
 * Saves lead to database (mock implementation)
 */
async function saveLeadToDatabase(leadRecord: LeadRecord): Promise<boolean> {
  try {
    // In production, replace with actual database save
    // await db.collection('leads').doc(leadRecord.id).set(leadRecord)
    
    leadsDatabase.set(leadRecord.id, leadRecord)
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('💾 LEAD SAVED TO DATABASE:', {
        id: leadRecord.id,
        company: leadRecord.company,
        priority: leadRecord.priority,
        score: leadRecord.leadScore
      })
    }
    
    return true
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('❌ Database save error:', error)
    return false
  }
}

/**
 * Sends notification for hot leads
 */
async function notifyHotLead(leadRecord: LeadRecord): Promise<void> {
  if (leadRecord.isHotLead && process.env.NODE_ENV !== 'production') {
    console.log('🔥 HOT LEAD ALERT:', {
      company: leadRecord.company,
      contact: leadRecord.name,
      email: leadRecord.email,
      score: leadRecord.leadScore,
      reasons: leadRecord.scoringReasons
    })
    
    // In production, send Slack/Teams notification, email alert, etc.
    // await sendSlackNotification(leadRecord)
    // await sendEmailAlert(leadRecord)
  }
}

/**
 * POST /api/receive-lead
 * Receives lead data from public site and processes it
 */
export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📨 INCOMING LEAD REQUEST from:', request.headers.get('origin') || 'unknown')
    }
    const requestData = await request.json()
    if (process.env.NODE_ENV !== 'production') console.log('📦 RAW PAYLOAD:', requestData)

    // ----- Contact form flow (public /contact page) -----
    if (isContactFormRequest(requestData)) {
      const validation = validateContactFormData(requestData)
      if (!validation.isValid) {
        if (process.env.NODE_ENV !== 'production') console.warn('❌ CONTACT FORM VALIDATION FAILED:', validation.errors)
        return NextResponse.json(
          { success: false, error: 'Validation failed', details: validation.errors },
          { status: 400 }
        )
      }
      const lead = validation.sanitized!

      try {
        await sendLeadNotification(lead)
      } catch (twilioError) {
        if (process.env.NODE_ENV !== 'production') console.error('❌ Twilio notification error (non-blocking):', twilioError)
        // Still return success - lead was captured; Twilio is optional
      }

      return NextResponse.json({
        success: true,
        message: 'Lead received successfully. We\'ll be in touch soon.',
        timestamp: new Date().toISOString(),
      })
    }

    // ----- CRM flow (API key required) -----
    if (!validateApiKey(request)) {
      if (process.env.NODE_ENV !== 'production') console.warn('🚫 UNAUTHORIZED: Invalid API key')
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      )
    }
    
    // Validate and sanitize data
    const validation = validateLeadData(requestData)
    if (!validation.isValid) {
      if (process.env.NODE_ENV !== 'production') console.warn('❌ VALIDATION FAILED:', validation.errors)
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }
    
    const leadData = validation.sanitized!
    
    // Convert to scoring format
    const scoringData: DemoRequestData = {
      userName: leadData.name,
      userEmail: leadData.email,
      companyName: leadData.company,
      teamSize: leadData.teamSize,
      industryType: leadData.industry,
      specificInterests: leadData.interests.split(',').map(s => s.trim()).filter(s => s.length > 0),
      urgency: mapTimingToUrgency(leadData.timing),
      conversationContext: leadData.conversationContext,
      triggerMessage: leadData.source
    }
    
    // Calculate lead score
    const leadScore = scoreLeadData(scoringData)
    const scoreReport = generateLeadScoreReport(scoringData, leadScore)
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('🎯 LEAD SCORING COMPLETE:', {
        score: leadScore.score,
        priority: leadScore.priority,
        isHotLead: leadScore.isHotLead
      })
      console.log('📋 SCORING REPORT:\n', scoreReport)
    }
    
    // Create lead record
    const leadRecord: LeadRecord = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: leadData.name,
      email: leadData.email,
      company: leadData.company,
      teamSize: leadData.teamSize,
      industry: leadData.industry,
      interests: scoringData.specificInterests,
      timing: leadData.timing,
      source: leadData.source,
      notes: leadData.notes || '',
      timestamp: leadData.timestamp,
      leadScore: leadScore.score,
      priority: leadScore.priority,
      isHotLead: leadScore.isHotLead,
      scoringReasons: leadScore.reasons,
      status: 'new',
      lastActivity: new Date().toISOString(),
      sessionId: leadData.sessionId,
      conversationContext: leadData.conversationContext
    }
    
    // Save to database
    const saved = await saveLeadToDatabase(leadRecord)
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Failed to save lead to database' },
        { status: 500 }
      )
    }
    
    // Send hot lead notifications
    await notifyHotLead(leadRecord)

    try {
      await sendLeadNotification({
        name: leadRecord.name,
        email: leadRecord.email,
        company: leadRecord.company,
        phone: (leadRecord as any).phone || '',
        source: leadRecord.source,
      })
    } catch (twilioError) {
      if (process.env.NODE_ENV !== 'production') console.error('❌ Twilio notification error (non-blocking):', twilioError)
    }

    // Success response
    const response = {
      success: true,
      leadId: leadRecord.id,
      leadScore: {
        score: leadScore.score,
        priority: leadScore.priority,
        isHotLead: leadScore.isHotLead
      },
      message: 'Lead received and processed successfully',
      timestamp: new Date().toISOString()
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ LEAD PROCESSING COMPLETE:', {
        leadId: leadRecord.id,
        company: leadRecord.company,
        priority: leadRecord.priority,
        saved: saved
      })
    }
    return NextResponse.json(response)
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('❌ LEAD PROCESSING ERROR:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/receive-lead
 * Returns API status and recent leads for testing
 */
export async function GET(request: NextRequest) {
  try {
    // Validate API key for GET requests too
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      )
    }
    
    // Get recent leads from storage
    const recentLeads = Array.from(leadsDatabase.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
    
    return NextResponse.json({
      success: true,
      status: 'API endpoint active',
      totalLeads: leadsDatabase.size,
      recentLeads: recentLeads.map(lead => ({
        id: lead.id,
        company: lead.company,
        contact: lead.name,
        priority: lead.priority,
        score: lead.leadScore,
        timestamp: lead.timestamp
      })),
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('❌ GET request error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Utility function to get all leads (for admin dashboard)
 */
async function getAllLeads(): Promise<LeadRecord[]> {
  return Array.from(leadsDatabase.values())
}

/**
 * Utility function to get lead by ID
 */
async function getLeadById(id: string): Promise<LeadRecord | undefined> {
  return leadsDatabase.get(id)
}

/**
 * Utility function to update lead status
 */
async function updateLeadStatus(id: string, status: LeadRecord['status'], assignedTo?: string): Promise<boolean> {
  const lead = leadsDatabase.get(id)
  if (!lead) return false
  
  lead.status = status
  lead.lastActivity = new Date().toISOString()
  if (assignedTo) lead.assignedTo = assignedTo
  
  leadsDatabase.set(id, lead)
  return true
} 