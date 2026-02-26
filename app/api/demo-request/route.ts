// 📅 Demo Request API Endpoint for Constructify
// Handles demo scheduling requests from the chatbot

import { NextRequest, NextResponse } from 'next/server'
import * as sgMail from '@sendgrid/mail'
import { scoreLeadData, generateLeadScoreReport, type DemoRequestData } from '../../../utils/leadScoring'

// Initialize SendGrid (if API key is available)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

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
  conversationContext?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const demoData: Partial<DemoRequest> = await request.json()
    
    // Validate required fields
    if (!demoData.userEmail || !demoData.userName || !demoData.companyName) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, userName, companyName' },
        { status: 400 }
      )
    }
    
    // Create complete demo request (required fields ensured by validation above)
    const demoRequest: DemoRequest = {
      ...(demoData as Partial<DemoRequest>),
      id: `demo_${Date.now()}`,
      userEmail: demoData.userEmail,
      userName: demoData.userName,
      companyName: demoData.companyName,
      teamSize: demoData.teamSize ?? '',
      industryType: demoData.industryType ?? '',
      specificInterests: demoData.specificInterests ?? [],
      preferredTimeSlots: demoData.preferredTimeSlots ?? [],
      urgency: demoData.urgency ?? 'flexible',
      sessionId: demoData.sessionId || Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending',
    }
    
    // Calculate lead score
    const leadData: DemoRequestData = {
      userName: demoRequest.userName,
      userEmail: demoRequest.userEmail,
      companyName: demoRequest.companyName,
      teamSize: demoRequest.teamSize,
      industryType: demoRequest.industryType,
      specificInterests: demoRequest.specificInterests,
      urgency: demoRequest.urgency,
      conversationContext: demoRequest.conversationContext,
      triggerMessage: demoRequest.conversationContext?.[0] // First message as trigger
    }
    
    const leadScore = scoreLeadData(leadData)
    const scoreReport = generateLeadScoreReport(leadData, leadScore)
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📅 DEMO REQUEST RECEIVED:', {
        id: demoRequest.id,
        company: demoRequest.companyName,
        email: demoRequest.userEmail,
        urgency: demoRequest.urgency,
        interests: demoRequest.specificInterests,
        leadScore: leadScore.score,
        priority: leadScore.priority,
        isHotLead: leadScore.isHotLead
      })
      console.log('🎯 LEAD SCORE REPORT:\n', scoreReport)
    }
    
    // Send admin notification with lead scoring
    const adminNotified = await sendDemoNotificationToAdmin(demoRequest, leadScore)
    
    // Send user confirmation
    const userNotified = await sendDemoConfirmationToUser(demoRequest)
    
    // In production, store in database
    // await db.collection('demo_requests').doc(demoRequest.id).set(demoRequest)
    
    return NextResponse.json({
      success: true,
      demoId: demoRequest.id,
      message: 'Demo request created successfully',
      adminNotified,
      userNotified,
      estimatedResponse: 'Within 2 hours during business hours'
    })
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('❌ Demo request error:', error)
    return NextResponse.json(
      { error: 'Failed to process demo request' },
      { status: 500 }
    )
  }
}

/**
 * Sends demo notification email to admin with lead scoring
 */
async function sendDemoNotificationToAdmin(demoRequest: DemoRequest, leadScore?: any): Promise<boolean> {
  try {
    const emailPayload = {
      to: process.env.ADMIN_EMAIL || 'jeff@constructify.com',
      from: process.env.SUPPORT_EMAIL || 'support@constructify.com',
      subject: `${leadScore?.emailSubjectPrefix || '[📝 NEW LEAD]'} Demo Request from ${demoRequest.userName} at ${demoRequest.companyName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #2D68C4, #f59e0b); color: white; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">🎬 Constructify Demo Request</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 16px;">High-quality lead ready for demo scheduling</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px; background: white; border-radius: 0 0 12px 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
            ${leadScore ? `
            <!-- Lead Score Section -->
            <div style="background: ${leadScore.isHotLead ? 'linear-gradient(135deg, #fee2e2, #fecaca)' : leadScore.priority === 'HIGH' ? 'linear-gradient(135deg, #fef3c7, #fed7aa)' : 'linear-gradient(135deg, #dbeafe, #bfdbfe)'}; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 4px solid ${leadScore.isHotLead ? '#ef4444' : leadScore.priority === 'HIGH' ? '#f59e0b' : '#3b82f6'};">
              <h3 style="color: ${leadScore.isHotLead ? '#dc2626' : leadScore.priority === 'HIGH' ? '#d97706' : '#1d4ed8'}; margin-top: 0; font-size: 18px; font-weight: 600;">
                ${leadScore.isHotLead ? '🔥 HOT LEAD DETECTED!' : leadScore.priority === 'HIGH' ? '⚡ HIGH PRIORITY LEAD' : leadScore.priority === 'MEDIUM' ? '📈 QUALIFIED LEAD' : '📝 NEW LEAD'}
              </h3>
              <p style="color: ${leadScore.isHotLead ? '#991b1b' : leadScore.priority === 'HIGH' ? '#92400e' : '#1e40af'}; margin: 10px 0; font-size: 16px; font-weight: 600;">
                Lead Score: ${leadScore.score}/100 | Priority: ${leadScore.priority}
              </p>
              <div style="text-align: left; margin: 15px 0;">
                <p style="color: ${leadScore.isHotLead ? '#991b1b' : leadScore.priority === 'HIGH' ? '#92400e' : '#1e40af'}; font-weight: 600; margin-bottom: 10px;">Scoring Factors:</p>
                ${leadScore.reasons.map((reason: string) => `<p style="margin: 5px 0; color: #374151; font-size: 14px;">• ${reason}</p>`).join('')}
              </div>
              <p style="color: ${leadScore.isHotLead ? '#991b1b' : leadScore.priority === 'HIGH' ? '#92400e' : '#1e40af'}; font-size: 14px; margin-top: 15px; font-weight: 600;">
                ${leadScore.isHotLead ? '⚡ CALL WITHIN 1 HOUR!' : leadScore.priority === 'HIGH' ? '📞 Follow up within 2-4 hours' : leadScore.priority === 'MEDIUM' ? '📧 Follow up within 24 hours' : '📝 Add to nurture sequence'}
              </p>
            </div>
            ` : ''}
            
            <h2 style="color: #2D68C4; margin-top: 0; font-size: 20px;">${leadScore?.isHotLead ? '🔥 HOT LEAD' : '📈 Demo Lead'}</h2>
            
            <!-- Contact Info -->
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #059669; margin-top: 0; font-size: 16px; font-weight: 600;">👤 Contact Information:</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
                <li><strong>Name:</strong> ${demoRequest.userName}</li>
                <li><strong>Email:</strong> <a href="mailto:${demoRequest.userEmail}" style="color: #2D68C4;">${demoRequest.userEmail}</a></li>
                <li><strong>Company:</strong> ${demoRequest.companyName}</li>
                ${demoRequest.phoneNumber ? `<li><strong>Phone:</strong> ${demoRequest.phoneNumber}</li>` : ''}
              </ul>
            </div>
            
            <!-- Company Details -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #374151; margin-top: 0; font-size: 16px; font-weight: 600;">🏢 Company Profile:</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
                <li><strong>Team Size:</strong> ${demoRequest.teamSize}</li>
                <li><strong>Industry:</strong> ${demoRequest.industryType}</li>
                <li><strong>Timing Preference:</strong> ${demoRequest.urgency.replace('_', ' ').toUpperCase()}</li>
              </ul>
            </div>
            
            <!-- Specific Interests -->
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
              <h3 style="color: #d97706; margin-top: 0; font-size: 16px; font-weight: 600;">🎯 Demo Focus Areas:</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
                ${demoRequest.specificInterests.map(interest => `<li><strong>${interest}</strong></li>`).join('')}
              </ul>
            </div>
            
            <!-- Action Required -->
            <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 4px solid #ef4444;">
              <h3 style="color: #dc2626; margin-top: 0; font-size: 18px; font-weight: 600;">⚡ Action Required</h3>
              <p style="color: #991b1b; margin: 15px 0; font-size: 16px; font-weight: 600;">Schedule demo within 2 hours for maximum conversion!</p>
              
              <div style="margin: 20px 0;">
                <p style="color: #991b1b; font-weight: 600;">📅 Recommended Demo Strategy:</p>
                <p style="color: #6b7280; font-size: 14px;">Focus on ${demoRequest.teamSize} ${demoRequest.industryType} construction company needs</p>
                <p style="color: #6b7280; font-size: 14px;">Emphasize: ${demoRequest.specificInterests.slice(0, 2).join(', ')}</p>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="mailto:${demoRequest.userEmail}?subject=Constructify Demo - ${demoRequest.companyName}&body=Hi ${demoRequest.userName},%0D%0A%0D%0AThank you for your interest in Constructify! I'd love to schedule your personalized demo.%0D%0A%0D%0AWhen would be the best time for a 30-45 minute demo session?%0D%0A%0D%0AAvailable times:%0D%0A• This week: [Your availability]%0D%0A• Next week: [Your availability]%0D%0A%0D%0ABased on your interests in ${demoRequest.specificInterests.join(', ')}, I'll prepare a customized demonstration.%0D%0A%0D%0ABest regards,%0D%0AJeff Rogers%0D%0AConstructify Team" 
                 style="background: #2D68C4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px; font-weight: 600;">
                📧 Reply to Lead
              </a>
              <a href="https://calendly.com/constructify-demos" 
                 style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px; font-weight: 600;">
                📅 Schedule Demo
              </a>
            </div>
            
            <!-- Conversation Context -->
            ${demoRequest.conversationContext && demoRequest.conversationContext.length > 0 ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b7280;">
              <h3 style="color: #374151; margin-top: 0; font-size: 16px; font-weight: 600;">💬 Conversation Context:</h3>
              <div style="font-size: 14px; color: #6b7280;">
                ${demoRequest.conversationContext.slice(-3).map(msg => `<p style="margin: 5px 0;">• ${msg}</p>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f8fafc;">
            <p style="margin: 5px 0;"><strong>Demo Request ID:</strong> ${demoRequest.id}</p>
            <p style="margin: 5px 0;"><strong>Generated:</strong> ${new Date(demoRequest.timestamp).toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Urgency:</strong> ${demoRequest.urgency.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>
      `
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 SENDING DEMO ADMIN NOTIFICATION:', {
        to: emailPayload.to,
        subject: emailPayload.subject,
        company: demoRequest.companyName,
        urgency: demoRequest.urgency
      })
    }
    // Send via SendGrid in production
    if (process.env.SENDGRID_API_KEY && process.env.NODE_ENV === 'production') {
      await sgMail.send(emailPayload)
      if (process.env.NODE_ENV !== 'production') console.log('✅ Admin demo notification sent via SendGrid')
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Demo admin notification (development mode - not sent)')
    }
    
    return true
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('❌ Failed to send demo admin notification:', error)
    return false
  }
}

/**
 * Sends demo confirmation email to user
 */
async function sendDemoConfirmationToUser(demoRequest: DemoRequest): Promise<boolean> {
  try {
    const emailPayload = {
      to: demoRequest.userEmail,
      from: process.env.ADMIN_EMAIL || 'jeff@constructify.com',
      subject: `🎬 Your Constructify Demo is Being Scheduled!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #2D68C4, #f59e0b); color: white; border-radius: 12px 12px 0 0;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">🎬</span>
            </div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Demo Confirmed!</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 16px;">We're excited to show you Constructify</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: white; border-radius: 0 0 12px 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
            <h2 style="color: #2D68C4; margin-top: 0; font-size: 24px; font-weight: 600;">Hi ${demoRequest.userName}! 👋</h2>
            <p style="color: #6b7280; font-size: 16px; margin-bottom: 30px;">Thank you for your interest in Constructify! We're thrilled to show you how our platform can transform ${demoRequest.companyName}'s construction operations.</p>
            
            <!-- Demo Details -->
            <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #10b981;">
              <h3 style="color: #059669; margin-top: 0; font-size: 18px; font-weight: 600;">📋 Your Demo Request:</h3>
              <ul style="margin: 15px 0; padding-left: 20px; color: #374151; line-height: 1.6;">
                <li><strong>Company:</strong> ${demoRequest.companyName}</li>
                <li><strong>Team Size:</strong> ${demoRequest.teamSize}</li>
                <li><strong>Industry:</strong> ${demoRequest.industryType}</li>
                <li><strong>Focus Areas:</strong> ${demoRequest.specificInterests.join(', ')}</li>
                <li><strong>Timing Preference:</strong> ${demoRequest.urgency.replace('_', ' ')}</li>
              </ul>
            </div>
            
            <!-- Instant Booking Option -->
            <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 30px; border-radius: 12px; margin: 25px 0; text-align: center; border-left: 5px solid #3b82f6;">
              <h3 style="color: #1d4ed8; margin-top: 0; font-size: 20px; font-weight: 700;">🗓️ Book Your Demo Time Instantly!</h3>
              <p style="color: #1e40af; font-size: 16px; margin-bottom: 20px;">Why wait? Schedule your demo right now and get instant confirmation!</p>
              
              <a href="https://calendly.com/constructify-demo/30min?utm_source=email&utm_medium=demo_confirmation&prefill_name=${encodeURIComponent(demoRequest.userName)}&prefill_email=${encodeURIComponent(demoRequest.userEmail)}" 
                 style="background: #1d4ed8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 16px; margin: 10px 0;">
                📅 Pick Your Demo Time Now
              </a>
              
              <p style="color: #1e40af; font-size: 14px; margin-top: 15px;">✅ Instant confirmation • 🎯 Pre-filled with your info • ⚡ Available slots shown live</p>
            </div>
            
            <!-- Alternative: We'll Contact You -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #f59e0b;">
              <h3 style="color: #374151; margin-top: 0; font-size: 18px; font-weight: 600;">📞 Or We'll Contact You:</h3>
              <ol style="margin: 15px 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li><strong>Within 2 hours:</strong> Our demo specialist will email you with available time slots</li>
                <li><strong>Calendar invite:</strong> You'll receive a meeting invite with video call link</li>
                <li><strong>Preparation guide:</strong> Quick overview to maximize your demo experience</li>
                <li><strong>Personalized demo:</strong> 30-45 minute session tailored to ${demoRequest.companyName}</li>
              </ol>
            </div>
            
            <!-- Demo Preview -->
            <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h3 style="color: #d97706; margin-top: 0; font-size: 20px; font-weight: 600;">🎯 What You'll See in Your Demo:</h3>
              <div style="text-align: left; margin: 20px 0;">
                ${demoRequest.specificInterests.map(interest => 
                  `<div style="margin: 10px 0; color: #92400e;">✅ <strong>${interest}</strong> - Live walkthrough with real examples</div>`
                ).join('')}
              </div>
              <p style="color: #92400e; font-size: 16px; margin-top: 20px;">Plus Q&A time for all your specific questions!</p>
            </div>
            
            <!-- Contact Info -->
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
              <h3 style="color: #374151; margin-top: 0; font-size: 18px; font-weight: 600;">📞 Questions Before Your Demo?</h3>
              <div style="margin: 15px 0;">
                <p style="margin: 5px 0; color: #374151;"><strong>📧 Email:</strong> <a href="mailto:demos@constructify.com" style="color: #2D68C4;">demos@constructify.com</a></p>
                <p style="margin: 5px 0; color: #374151;"><strong>📞 Phone:</strong> <a href="tel:1-800-CONSTRUCT" style="color: #2D68C4;">1-800-CONSTRUCT</a></p>
                <p style="margin: 5px 0; color: #374151;"><strong>💬 Live Chat:</strong> <a href="https://constructify.com" style="color: #2D68C4;">Available 24/7 on our website</a></p>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 25px 20px; color: #6b7280; font-size: 14px; background: #f8fafc;">
            <p style="margin: 5px 0;"><strong>Demo Request ID: ${demoRequest.id}</strong></p>
            <p style="margin: 5px 0;">We can't wait to show you what Constructify can do for ${demoRequest.companyName}!</p>
            <p style="margin: 15px 0 5px 0; font-size: 12px; opacity: 0.8;">© 2024 Constructify. Building the future of construction management.</p>
          </div>
        </div>
      `
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 SENDING DEMO USER CONFIRMATION:', {
        to: emailPayload.to,
        subject: emailPayload.subject,
        company: demoRequest.companyName
      })
    }
    // Send via SendGrid in production
    if (process.env.SENDGRID_API_KEY && process.env.NODE_ENV === 'production') {
      await sgMail.send(emailPayload)
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Demo user confirmation (development mode - not sent)')
    }
    
    return true
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('❌ Failed to send demo user confirmation:', error)
    return false
  }
} 