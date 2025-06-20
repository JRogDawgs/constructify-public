// 📧 Admin Notification Utility for Constructify Chatbot
// Handles sending notifications to Jeff when users ask unknown questions

interface UnknownQuestionData {
  message: string
  timestamp: string
  conversationContext: string[]
  sessionId: string
  userEmail: string | null
  status: string
  needsFollowUp: boolean
}

/**
 * Sends admin notification email when user asks unknown question
 * @param questionData - The unknown question data with context
 * @returns Promise<boolean> - Success status
 */
export async function sendAdminNotification(questionData: UnknownQuestionData): Promise<boolean> {
  try {
    // In production, this would use SendGrid or your email service
    const emailPayload = {
      to: process.env.ADMIN_EMAIL || 'jeff@constructify.com',
      from: process.env.SUPPORT_EMAIL || 'support@constructify.com',
      subject: `🔥 Constructify Chatbot Question - ${questionData.sessionId}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #2D68C4, #f59e0b); color: white; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">🤖 Constructify Chatbot</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 16px;">New Question Needs Your Expertise</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px; background: white; border-radius: 0 0 12px 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
            <h2 style="color: #2D68C4; margin-top: 0; font-size: 20px;">🔍 Unknown Question Alert</h2>
            
            <!-- Question Details -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #374151; margin-top: 0; font-size: 16px; font-weight: 600;">❓ User Question:</h3>
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin-bottom: 0; font-style: italic;">"${questionData.message}"</p>
            </div>
            
            <!-- Session Info -->
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #059669; margin-top: 0; font-size: 16px; font-weight: 600;">📊 Session Details:</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
                <li><strong>Session ID:</strong> ${questionData.sessionId}</li>
                <li><strong>Timestamp:</strong> ${new Date(questionData.timestamp).toLocaleString()}</li>
                <li><strong>User Email:</strong> ${questionData.userEmail || 'Not collected yet'}</li>
                <li><strong>Status:</strong> ${questionData.status}</li>
              </ul>
            </div>
            
            <!-- Conversation Context -->
            ${questionData.conversationContext.length > 0 ? `
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
              <h3 style="color: #d97706; margin-top: 0; font-size: 16px; font-weight: 600;">💬 Conversation Context:</h3>
              <ol style="margin: 10px 0; padding-left: 20px; color: #374151;">
                ${questionData.conversationContext.map(msg => `<li style="margin: 5px 0;">"${msg}"</li>`).join('')}
              </ol>
            </div>
            ` : ''}
            
            <!-- Action Required -->
            <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 4px solid #ef4444;">
              <h3 style="color: #dc2626; margin-top: 0; font-size: 18px; font-weight: 600;">⚡ Action Required</h3>
              <p style="color: #991b1b; margin: 15px 0; font-size: 16px;">This user needs a personalized answer from our Constructify experts.</p>
              
              ${questionData.userEmail ? `
              <div style="margin: 20px 0;">
                <p style="color: #991b1b; font-weight: 600;">📧 Reply directly to this email with your answer, and it will be automatically sent to the user!</p>
                <p style="color: #6b7280; font-size: 14px;">Just start your reply with "Answer:" and we'll handle the rest.</p>
              </div>
              ` : `
              <div style="margin: 20px 0;">
                <p style="color: #991b1b; font-weight: 600;">⏳ User hasn't provided email yet - they may provide it in the next chat message.</p>
                <p style="color: #6b7280; font-size: 14px;">We'll notify you again once we have their contact information.</p>
              </div>
              `}
            </div>
            
            <!-- Quick Actions -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://constructify.com/admin/chatbot-questions" 
                 style="background: #2D68C4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px; font-weight: 600;">
                📊 View All Questions
              </a>
              <a href="https://constructify.com/admin/knowledge-base" 
                 style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px; font-weight: 600;">
                📚 Update Knowledge Base
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f8fafc;">
            <p style="margin: 5px 0;">This notification was generated by the Constructify AI Chatbot</p>
            <p style="margin: 5px 0;">Session ID: ${questionData.sessionId} | <a href="mailto:support@constructify.com" style="color: #2D68C4;">Report Issue</a></p>
          </div>
        </div>
      `
    }
    
    // Log the notification (in production, send via SendGrid/AWS SES)
    console.log('📧 ADMIN NOTIFICATION EMAIL:', {
      to: emailPayload.to,
      subject: emailPayload.subject,
      sessionId: questionData.sessionId,
      userEmail: questionData.userEmail,
      timestamp: questionData.timestamp
    })
    
    // In production, uncomment this:
    // if (process.env.SENDGRID_API_KEY) {
    //   await sgMail.send(emailPayload)
    //   console.log('✅ Admin notification sent successfully')
    // }
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error)
    return false
  }
}

/**
 * Stores unknown question data for admin review
 * @param questionData - The question data to store
 * @returns Promise<boolean> - Success status
 */
export async function storeUnknownQuestion(questionData: UnknownQuestionData): Promise<boolean> {
  try {
    // In production, this would store in Firestore or your database
    const questionRecord = {
      ...questionData,
      id: `question_${questionData.sessionId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminResponse: null,
      responseTimestamp: null,
      resolved: false
    }
    
    console.log('💾 STORING UNKNOWN QUESTION:', questionRecord)
    
    // In production, uncomment this:
    // await db.collection('unknown_questions').doc(questionRecord.id).set(questionRecord)
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to store unknown question:', error)
    return false
  }
} 