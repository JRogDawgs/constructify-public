/**
 * Twilio service for lead notifications (SMS follow-up).
 * Structure only - no credentials hard-coded.
 * Uses environment variables:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_PHONE_NUMBER
 */

export interface LeadNotificationPayload {
  name: string
  email: string
  company: string
  phone: string
  message?: string
  source?: string
}

/**
 * Sends SMS notification for new lead capture.
 * Ready for Twilio integration - does not call Twilio yet.
 */
export async function sendLeadNotification(payload: LeadNotificationPayload): Promise<{ ok: boolean; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('⚠️ Twilio credentials not configured - skipping SMS notification')
    return { ok: false, error: 'Twilio not configured' }
  }

  if (!payload.phone || payload.phone.trim().length < 10) {
    console.warn('⚠️ No valid phone number - skipping SMS notification')
    return { ok: false, error: 'No valid phone number' }
  }

  // Structure prepared for Twilio API call:
  // const client = require('twilio')(accountSid, authToken)
  // await client.messages.create({
  //   body: `New lead: ${payload.name} from ${payload.company}. Email: ${payload.email}, Phone: ${payload.phone}`,
  //   from: fromNumber,
  //   to: payload.phone,
  // })
  console.log('📱 Lead notification prepared (Twilio not yet invoked):', {
    lead: payload.name,
    company: payload.company,
    phone: payload.phone,
  })

  return { ok: true }
}
