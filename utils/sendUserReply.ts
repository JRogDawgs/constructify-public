// 📧 User Reply Utility for Constructify Chatbot
// Handles sending answers back to users when Jeff responds to their questions

interface UserReplyData {
  userEmail: string
  originalQuestion: string
  adminResponse: string
  sessionId: string
  adminName?: string
}

/**
 * Sends the admin's answer back to the user via email
 * @param replyData - The reply data including user email and admin response
 * @returns Promise<boolean> - Success status
 */
export async function sendUserReply(replyData: UserReplyData): Promise<boolean> {
  try {
    const response = await fetch('/api/admin-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: replyData.userEmail,
        userQuestion: replyData.originalQuestion,
        adminResponse: replyData.adminResponse,
        sessionId: replyData.sessionId
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = await response.json()
    
    console.log('✅ User reply sent successfully:', {
      userEmail: replyData.userEmail,
      sessionId: replyData.sessionId,
      timestamp: new Date().toISOString()
    })
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to send user reply:', error)
    return false
  }
}

/**
 * Processes an admin email reply and sends it to the user
 * @param emailBody - The body of Jeff's email reply
 * @param emailSubject - The subject line containing session ID
 * @param originalQuestionData - The original question data
 * @returns Promise<boolean> - Success status
 */
export async function processAdminEmailReply(
  emailBody: string, 
  emailSubject: string, 
  originalQuestionData: any
): Promise<boolean> {
  try {
    // Extract the answer from Jeff's email
    let adminAnswer = emailBody
      .replace(/^Answer:\s*/i, '') // Remove "Answer:" prefix
      .replace(/--\s*[\s\S]*$/, '') // Remove email signature
      .replace(/On .* wrote:[\s\S]*$/, '') // Remove quoted original email
      .trim()

    if (!adminAnswer) {
      throw new Error('No answer content found in email')
    }

    // Send the answer to the user
    const success = await sendUserReply({
      userEmail: originalQuestionData.userEmail,
      originalQuestion: originalQuestionData.message,
      adminResponse: adminAnswer,
      sessionId: originalQuestionData.sessionId,
      adminName: 'Jeff Rogers, COO'
    })

    if (success) {
      // Update the question status to resolved
      await updateQuestionStatus(originalQuestionData.sessionId, 'resolved', adminAnswer)
    }

    return success
    
  } catch (error) {
    console.error('❌ Failed to process admin email reply:', error)
    return false
  }
}

/**
 * Updates the status of a question in the database
 * @param sessionId - The session ID of the question
 * @param status - The new status
 * @param adminResponse - The admin's response (optional)
 * @returns Promise<boolean> - Success status
 */
export async function updateQuestionStatus(
  sessionId: string, 
  status: string, 
  adminResponse?: string
): Promise<boolean> {
  try {
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
      resolved: status === 'resolved',
      ...(adminResponse && { 
        adminResponse, 
        responseTimestamp: new Date().toISOString() 
      })
    }
    
    console.log('📝 UPDATING QUESTION STATUS:', {
      sessionId,
      status,
      hasResponse: !!adminResponse
    })
    
    // In production, this would update Firestore:
    // await db.collection('unknown_questions').doc(`question_${sessionId}`).update(updateData)
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to update question status:', error)
    return false
  }
}

/**
 * Retrieves question data by session ID
 * @param sessionId - The session ID to look up
 * @returns Promise<any> - The question data or null
 */
export async function getQuestionBySessionId(sessionId: string): Promise<any> {
  try {
    console.log('🔍 RETRIEVING QUESTION:', sessionId)
    
    // In production, this would query Firestore:
    // const doc = await db.collection('unknown_questions').doc(`question_${sessionId}`).get()
    // return doc.exists ? doc.data() : null
    
    // For now, return mock data for testing
    return {
      sessionId,
      message: "Sample question for testing",
      userEmail: "test@example.com",
      timestamp: new Date().toISOString(),
      status: 'pending_response'
    }
    
  } catch (error) {
    console.error('❌ Failed to retrieve question:', error)
    return null
  }
}

/**
 * Suggests adding the Q&A pair to the knowledge base
 * @param question - The original question
 * @param answer - Jeff's answer
 * @param sessionId - The session ID
 * @returns Promise<boolean> - Success status
 */
export async function suggestKnowledgeBaseAddition(
  question: string, 
  answer: string, 
  sessionId: string
): Promise<boolean> {
  try {
    const suggestion = {
      question: question,
      answer: answer,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      status: 'suggested_for_kb',
      category: 'admin_answered',
      approved: false
    }
    
    console.log('💡 KNOWLEDGE BASE SUGGESTION:', suggestion)
    
    // In production, this would store in a suggestions collection:
    // await db.collection('kb_suggestions').add(suggestion)
    
    // Also log for immediate admin review
    console.log(`🧠 POTENTIAL KB ADDITION:
    Q: ${question}
    A: ${answer}
    Session: ${sessionId}
    `)
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to create knowledge base suggestion:', error)
    return false
  }
} 