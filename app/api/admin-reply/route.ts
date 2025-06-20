import { NextRequest, NextResponse } from 'next/server'

// Interface for admin reply data
interface AdminReplyData {
  sessionId: string
  answer: string
  originalQuestion: string
  userEmail: string
  adminEmail: string
}

// Email service configuration (replace with your preferred service)
async function sendEmailToUser(userEmail: string, originalQuestion: string, answer: string, sessionId: string): Promise<boolean> {
  try {
    // This would be replaced with your actual email service (SendGrid, AWS SES, etc.)
    const emailPayload = {
      to: userEmail,
      subject: `✅ Your Constructify Question Answered`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e40af, #f59e0b); color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚀 Constructify</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Construction Management Experts</p>
          </div>
          
          <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e40af; margin-top: 0;">Thanks for your question!</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #374151; margin-top: 0;">Your Question:</h3>
              <p style="font-style: italic; color: #6b7280;">"${originalQuestion}"</p>
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #059669; margin-top: 0;">Our Answer:</h3>
              <div style="color: #374151; line-height: 1.6;">
                ${answer.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d97706; margin-top: 0;">Need More Help?</h3>
              <p style="margin: 10px 0;">We're here to help you succeed with Constructify!</p>
              <ul style="margin: 10px 0;">
                <li>📞 <strong>Schedule a Demo:</strong> <a href="https://constructify.com/demo">Book a personalized walkthrough</a></li>
                <li>💬 <strong>Live Chat:</strong> <a href="https://constructify.com">Chat with our AI assistant</a></li>
                <li>📧 <strong>Direct Support:</strong> <a href="mailto:support@constructify.com">support@constructify.com</a></li>
                <li>📱 <strong>Call Us:</strong> 1-800-CONSTRUCT</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://constructify.com/pricing" 
                 style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                🚀 Get Started Today
              </a>
              <a href="https://constructify.com/demo" 
                 style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                🎬 Watch Demo
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
            <p>This answer was personally researched by our Constructify experts.</p>
            <p>Session ID: ${sessionId} | <a href="mailto:support@constructify.com">Report an Issue</a></p>
          </div>
        </div>
      `
    }
    
    // Log the email (in production, send via your email service)
    console.log('📧 SENDING USER RESPONSE EMAIL:', emailPayload)
    
    // In production, replace this with your actual email service:
    // await sendGrid.send(emailPayload)
    // OR
    // await ses.sendEmail(emailPayload)
    
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

// API endpoint for handling admin email replies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { emailBody, subject, userEmail, originalQuestion } = body
    
    if (!emailBody || !subject || !userEmail || !originalQuestion) {
      return NextResponse.json(
        { error: 'Missing required fields: emailBody, subject, userEmail, originalQuestion' },
        { status: 400 }
      )
    }
    
    // Parse the admin reply
    const parsed = parseAdminReply(emailBody, subject)
    if (!parsed) {
      return NextResponse.json(
        { error: 'Failed to parse admin reply' },
        { status: 400 }
      )
    }
    
    const { sessionId, answer } = parsed
    
    // Send the answer to the user
    const emailSent = await sendEmailToUser(userEmail, originalQuestion, answer, sessionId)
    
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
      question: originalQuestion,
      answer: answer,
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