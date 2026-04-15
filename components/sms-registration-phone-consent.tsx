import { cn } from "@/lib/utils"
import { REGISTRATION_PHONE_SMS_CONSENT_DISCLOSURE } from "@/lib/smsA2pCopy"

type Props = {
  className?: string
}

/**
 * Place immediately below the phone number field on registration / invitation onboarding
 * (e.g. app.constructifylabs.com). Text must match Twilio submission exactly.
 */
export function SmsRegistrationPhoneConsent({ className }: Props) {
  return (
    <p
      className={cn("text-xs leading-relaxed text-muted-foreground", className)}
      role="note"
    >
      {REGISTRATION_PHONE_SMS_CONSENT_DISCLOSURE}
    </p>
  )
}
