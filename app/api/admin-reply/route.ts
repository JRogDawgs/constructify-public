import { NextRequest, NextResponse } from 'next/server'
import * as sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Interface for admin reply data
interface AdminReplyData {
  sessionId: string
  answer: string
  originalQuestion: string
  userEmail: string
  adminEmail: string
}

// Enhanced email service with SendGrid integration
async function sendEmailToUser(userEmail: string, originalQuestion: string, answer: string, sessionId: string): Promise<boolean> {
  try {
    const emailPayload = {
      to: userEmail,
      from: process.env.ADMIN_EMAIL || 'jeff@constructify.com',
      cc: process.env.ADMIN_EMAIL || 'jeff@constructify.com', // CC Jeff on all responses
      subject: `✅ Constructify Support – Your Question Answered`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #2D68C4, #f59e0b); color: white; border-radius: 12px 12px 0 0;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">🏗️</span>
            </div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Constructify</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 16px;">Your Construction Management Experts</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: white; border-radius: 0 0 12px 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
            <h2 style="color: #2D68C4; margin-top: 0; font-size: 24px; font-weight: 600;">Thanks for reaching out! 🎉</h2>
            <p style="color: #6b7280; font-size: 16px; margin-bottom: 30px;">Our team has personally researched your question and we're excited to help you succeed with Constructify.</p>
            
            <!-- Question Block -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #f59e0b;">
              <h3 style="color: #374151; margin-top: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                <span style="margin-right: 8px;">❓</span> Your Question:
              </h3>
              <p style="font-style: italic; color: #6b7280; font-size: 16px; line-height: 1.5; margin-bottom: 0;">"${originalQuestion}"</p>
            </div>
            
            <!-- Answer Block -->
            <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #10b981;">
              <h3 style="color: #059669; margin-top: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                <span style="margin-right: 8px;">💡</span> Our Expert Answer:
              </h3>
              <div style="color: #374151; line-height: 1.7; font-size: 16px;">
                ${answer.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <!-- CTA Section -->
            <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h3 style="color: #d97706; margin-top: 0; font-size: 20px; font-weight: 600;">Ready to Transform Your Construction Business? 🚀</h3>
              <p style="margin: 15px 0; color: #92400e; font-size: 16px;">Join thousands of construction professionals who trust Constructify to streamline their operations.</p>
              
              <div style="margin: 25px 0;">
                <a href="https://constructify.com/demo" 
                   style="background: #2D68C4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(45, 104, 196, 0.3);">
                  📅 Schedule Free Demo
                </a>
                <a href="https://constructify.com/pricing" 
                   style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                  💰 View Pricing
                </a>
              </div>
            </div>
            
            <!-- Support Options -->
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
              <h3 style="color: #374151; margin-top: 0; font-size: 18px; font-weight: 600;">Need Additional Support? 🤝</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div>
                  <p style="margin: 5px 0;"><strong>💬 Live Chat:</strong> <a href="https://constructify.com" style="color: #2D68C4;">Chat with our AI</a></p>
                  <p style="margin: 5px 0;"><strong>📞 Phone:</strong> <a href="tel:1-800-CONSTRUCT" style="color: #2D68C4;">1-800-CONSTRUCT</a></p>
                </div>
                <div>
                  <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:support@constructify.com" style="color: #2D68C4;">support@constructify.com</a></p>
                  <p style="margin: 5px 0;"><strong>📚 Help Center:</strong> <a href="https://constructify.com/help" style="color: #2D68C4;">Browse guides</a></p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 25px 20px; color: #6b7280; font-size: 14px; background: #f8fafc;">
            <p style="margin: 5px 0;"><strong>This answer was personally researched by our Constructify experts.</strong></p>
            <p style="margin: 5px 0;">Session ID: ${sessionId} | <a href="mailto:support@constructify.com" style="color: #2D68C4;">Report an Issue</a></p>
            <p style="margin: 15px 0 5px 0; font-size: 12px; opacity: 0.8;">© 2024 Constructify. All rights reserved.</p>
          </div>
        </div>
      `
    }
    
    // Send email via SendGrid
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(emailPayload)
      console.log('✅ Email sent successfully via SendGrid to:', userEmail)
    } else {
      // Fallback: Log the email for development
      console.log('📧 DEVELOPMENT MODE - Email would be sent:', {
        to: emailPayload.to,
        from: emailPayload.from,
        subject: emailPayload.subject,
        cc: emailPayload.cc
      })
      console.log('💡 To enable email sending, add SENDGRID_API_KEY to your .env.local file')
    }
    
    return true
  } catch (error) {
    console.error('❌ Failed to send email to user:', error)
    return false
  }
}

// Parse admin email reply to extract session ID and answer
function parseAdminReply(emailBody: string, subject: string): { sessionId: string; answer: string } | null {
  try {
    // Extract session ID from subject line
    const sessionIdMatch = subject.match(/Chatbot Question - (\d+)/)
    if (!sessionIdMatch) {
      throw new Error('Session ID not found in subject')
    }
    
    const sessionId = sessionIdMatch[1]
    
    // Extract answer from email body (remove email signatures, etc.)
    let answer = emailBody
      .replace(/^Answer:\s*/i, '') // Remove "Answer:" prefix
      .replace(/--\s*[\s\S]*$/, '') // Remove email signature
      .replace(/On .* wrote:[\s\S]*$/, '') // Remove quoted original email
      .trim()
    
    if (!answer) {
      throw new Error('No answer content found')
    }
    
    return { sessionId, answer }
  } catch (error) {
    console.error('❌ Failed to parse admin reply:', error)
    return null
  }
}

// API endpoint for handling admin email replies (simplified format as requested)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Support both formats: the original complex format and the simple format you requested
    let userEmail: string, userQuestion: string, adminResponse: string, sessionId: string
    
    if (body.userEmail && body.userQuestion && body.adminResponse) {
      // Simple format as requested
      userEmail = body.userEmail
      userQuestion = body.userQuestion  
      adminResponse = body.adminResponse
      sessionId = body.sessionId || Date.now().toString()
      
      console.log('📧 Processing simple admin reply format')
      
    } else if (body.emailBody && body.subject && body.userEmail && body.originalQuestion) {
      // Original complex email parsing format
      const parsed = parseAdminReply(body.emailBody, body.subject)
      if (!parsed) {
        return NextResponse.json(
          { error: 'Failed to parse admin reply' },
          { status: 400 }
        )
      }
      
      userEmail = body.userEmail
      userQuestion = body.originalQuestion
      adminResponse = parsed.answer
      sessionId = parsed.sessionId
      
      console.log('📧 Processing complex email parsing format')
      
    } else {
      return NextResponse.json(
        { error: 'Missing required fields. Provide either: {userEmail, userQuestion, adminResponse} OR {emailBody, subject, userEmail, originalQuestion}' },
        { status: 400 }
      )
    }
    
    // Validate we have all required data
    if (!userEmail || !userQuestion || !adminResponse) {
      return NextResponse.json(
        { error: 'Missing required fields after parsing' },
        { status: 400 }
      )
    }
    
    // Send the answer to the user
    const emailSent = await sendEmailToUser(userEmail, userQuestion, adminResponse, sessionId)
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email to user' },
        { status: 500 }
      )
    }
    
    // Log successful processing
    console.log(`✅ Successfully processed admin reply for session ${sessionId}`)
    
    // Suggest adding to knowledge base
    const knowledgeBaseSuggestion = {
      question: userQuestion,
      answer: adminResponse,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      status: 'suggested_for_kb',
      category: 'admin_answered'
    }
    
    console.log('💡 KNOWLEDGE BASE SUGGESTION:', knowledgeBaseSuggestion)
    
    return NextResponse.json({
      success: true,
      message: 'Admin reply processed and sent to user',
      sessionId: sessionId,
      userEmail: userEmail,
      knowledgeBaseSuggestion
    })
    
  } catch (error) {
    console.error('❌ Error processing admin reply:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// API endpoint for manual admin reply submission (via web interface)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { sessionId, answer, originalQuestion, userEmail, adminEmail } = body as AdminReplyData
    
    // Validate admin email (basic security check)
    if (adminEmail !== 'jeff@constructify.com' && adminEmail !== 'support@constructify.com') {
      return NextResponse.json(
        { error: 'Unauthorized admin email' },
        { status: 403 }
      )
    }
    
    // Send the answer to the user
    const emailSent = await sendEmailToUser(userEmail, originalQuestion, answer, sessionId)
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email to user' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Answer sent to user successfully',
      sessionId: sessionId,
      userEmail: userEmail
    })
    
  } catch (error) {
    console.error('❌ Error processing manual admin reply:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 