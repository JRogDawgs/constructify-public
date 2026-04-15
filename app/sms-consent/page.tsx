import Link from "next/link"
import CTA from "@/components/cta"
import PageBackdrop from "@/components/page-backdrop"

export default function SmsConsentPage() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative min-h-[calc(100vh-4rem)]">
        <PageBackdrop />

        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-8">
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text pb-4 text-4xl font-medium tracking-tight text-transparent leading-[1.4] sm:text-5xl md:text-6xl lg:text-7xl">
                Constructify SMS Consent
              </h1>
            </div>

            <div className="mx-auto max-w-4xl prose prose-gray dark:prose-invert">
              <section className="space-y-6">
                <p className="m-0">
                  By providing your phone number and clicking &ldquo;Create Account&rdquo; or accepting an employer invitation and completing account setup, you agree to receive SMS messages from Constructify related to your work activities.
                </p>

                <div>
                  <p className="m-0">These messages may include:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Task assignments</li>
                    <li>Scheduling updates</li>
                    <li>Clock-in and clock-out confirmations</li>
                    <li>Project notifications</li>
                    <li>Account alerts</li>
                  </ul>
                </div>

                <p>Message frequency varies (typically up to 5 messages per day).</p>
                <p>Message and data rates may apply.</p>
                <p>SMS consent is not a condition of purchase.</p>
                <p>Reply STOP to opt out at any time.</p>
                <p>Reply HELP for help.</p>

                <p className="m-0">
                  Privacy Policy:{" "}
                  <Link
                    href="https://constructifylabs.com/privacy"
                    className="text-primary underline underline-offset-4"
                  >
                    https://constructifylabs.com/privacy
                  </Link>
                </p>
                <p className="m-0">
                  Terms &amp; Conditions:{" "}
                  <Link
                    href="https://constructifylabs.com/terms"
                    className="text-primary underline underline-offset-4"
                  >
                    https://constructifylabs.com/terms
                  </Link>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <CTA />
      </div>
    </div>
  )
}
