import CTA from "@/components/cta"
import PageBackdrop from "@/components/page-backdrop"

export default function TermsPage() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative min-h-[calc(100vh-4rem)]">
        <PageBackdrop />

        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-8">
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text pb-4 text-4xl font-medium tracking-tight text-transparent leading-[1.4] sm:text-5xl md:text-6xl lg:text-7xl">
                Terms of Service
              </h1>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Please read these terms carefully before using our services.
              </p>
            </div>

            <div className="mx-auto max-w-4xl prose prose-gray dark:prose-invert">
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
                  <p>
                    These Terms of Service (&quot;Terms&quot;) govern your access to and use of software, websites, and related services offered by Constructify Labs LLC (&quot;Constructify,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) (collectively, the &quot;Services&quot;). By using the Services, you agree to these Terms.
                  </p>
                  <p className="text-muted-foreground sm:text-lg m-0">
                    Effective date: April 9, 2026
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
                  <p>
                    The Services are provided for legitimate business and operational use in connection with construction workforce and field operations. You agree to use the Services only in compliance with applicable law, these Terms, and any instructions or policies we publish for the Services.
                  </p>
                  <p>
                    If you use the Services on behalf of a company or organization, you represent that you have authority to bind that entity to these Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. License Grant</h2>
                  <p>
                    Subject to your ongoing compliance with these Terms, Constructify grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your internal business purposes during your subscription or other authorized relationship with us.
                  </p>
                  <p>
                    This license is granted subject to the restrictions outlined in these Terms and any applicable proprietary software license provided with the Services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                  <p>You agree not to misuse the Services. For example, you must not:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Use the Services in violation of law or third-party rights</li>
                    <li>Attempt to gain unauthorized access to the Services, other accounts, or our systems</li>
                    <li>Interfere with or disrupt the integrity or performance of the Services</li>
                    <li>Use automated means to access the Services in a way that places unreasonable load on our infrastructure</li>
                    <li>Upload unlawful, fraudulent, or harmful content</li>
                  </ul>
                  <p>
                    You may not attempt to replicate, duplicate, or recreate the platform&apos;s workflows, structure, or feature design for the purpose of building a competing product or service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. SMS Communications</h2>
                  <p>
                    By providing a mobile phone number to Constructify, you may receive SMS messages from Constructify Labs related to account notifications, onboarding, employee invitations, and work-related operational updates. Message frequency may vary. Message and data rates may apply, depending on your carrier and plan.
                  </p>
                  <p>
                    You may opt out of SMS at any time by replying <strong>STOP</strong> to any message. After you opt out, you may receive a one-time confirmation message. For help with SMS, reply <strong>HELP</strong> or contact us at{" "}
                    <a href="mailto:support@constructifylabs.com" className="text-primary underline underline-offset-4">support@constructifylabs.com</a>.
                  </p>
                  <p>
                    Constructify does not share, sell, rent, or disclose mobile phone numbers or SMS opt-in data to third parties for marketing or promotional purposes. Mobile information is used only to provide services directly related to your account, employment-related onboarding, and platform operations.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Disclaimers</h2>
                  <p>
                    The Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, Constructify disclaims warranties of merchantability, fitness for a particular purpose, and non-infringement, and any warranties arising from course of dealing or usage.
                  </p>
                  <p>
                    All outputs, recommendations, and system indicators are provided as support tools and should not be solely relied upon for operational, legal, safety, or compliance decisions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                  <p>
                    To the fullest extent permitted by law, Constructify and its affiliates will not be liable for any indirect, incidental, special, consequential, or exemplary damages, or for lost profits, revenues, or data, arising out of or related to your use of the Services.
                  </p>
                  <p>
                    To the fullest extent permitted by law, Constructify&apos;s total liability for any claim arising out of or relating to the Services is limited to the amount you paid us for the Services in the twelve (12) months before the event giving rise to the claim (or, if no fees applied, one hundred U.S. dollars (USD $100)).
                  </p>
                  <p>
                    This license is granted subject to the restrictions outlined in these Terms and any applicable proprietary software license provided with the Services.
                  </p>
                  <p>You may not:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Reverse engineer the software</li>
                    <li>Attempt to access source code</li>
                    <li>Resell or sublicense the Services</li>
                    <li>Use the Services for unlawful purposes</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
                  <p>
                    The Services, including software, branding, documentation, and related content, are owned by Constructify or its licensors and are protected by applicable intellectual property laws.
                  </p>
                  <p>
                    In addition to the protections described above, the Constructify platform, including its structure, workflows, system design, and feature behavior, is proprietary to Constructify Labs LLC. Use of the Services is also governed by our proprietary software license, which restricts copying, modification, distribution, and competitive replication of the platform or its components.
                  </p>
                  <p>
                    The current proprietary license terms are published in the LICENSE file associated with Constructify&apos;s software.
                  </p>
                  <p>
                    In addition to the protections described above, the Constructify platform, including its structure, workflows, system design, and feature behavior, is proprietary to Constructify Labs LLC. Use of the Services is also governed by our proprietary software license, which restricts copying, modification, distribution, and competitive replication of the platform or its components.
                  </p>
                  <p>
                    The current proprietary license terms are published in the LICENSE file associated with Constructify&apos;s software.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">9. Changes to Service</h2>
                  <p>
                    You may not attempt to replicate, duplicate, or recreate the platform&apos;s workflows, structure, or feature design for the purpose of building a competing product or service.
                  </p>
                  <p>
                    We may suspend accounts for violations.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                  <p><strong>Constructify Labs LLC</strong></p>
                  <p>Louisville, Kentucky, United States</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:support@constructifylabs.com" className="text-primary underline underline-offset-4">support@constructifylabs.com</a>
                  </p>
                  <p>
                    Website:{" "}
                    <a href="https://constructifylabs.com" className="text-primary underline underline-offset-4">https://constructifylabs.com</a>
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">11. Service Availability</h2>
                  <p>
                    The Services are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis.
                  </p>
                  <p>We do not guarantee:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Continuous uptime</li>
                    <li>Error-free performance</li>
                    <li>Compatibility with all systems</li>
                  </ul>
                  <p>
                    Scheduled maintenance or outages may occur.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">12. Third-Party Services</h2>
                  <p>
                    The Services may integrate with third-party providers (e.g., payment processors, cloud providers). We are not responsible for third-party services or their actions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">13. Disclaimer of Warranties</h2>
                  <p>
                    To the fullest extent permitted by law, Constructify disclaims all warranties, express or implied, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Merchantability</li>
                    <li>Fitness for a particular purpose</li>
                    <li>Non-infringement</li>
                    <li>Accuracy or reliability of outputs</li>
                  </ul>
                  <p>
                    All outputs, recommendations, and system indicators are provided as support tools and should not be solely relied upon for operational, legal, safety, or compliance decisions.
                  </p>
                  <p>
                    You use the Services at your own risk.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">14. Limitation of Liability</h2>
                  <p>
                    To the fullest extent permitted by law, Constructify shall not be liable for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Lost profits</li>
                    <li>Lost business opportunities</li>
                    <li>Regulatory fines</li>
                    <li>Payroll disputes</li>
                    <li>Employment claims</li>
                  </ul>
                  <p>
                    Our total liability shall not exceed the amount paid by you to Constructify in the twelve (12) months preceding the claim.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">15. Indemnification</h2>
                  <p>
                    You agree to indemnify and hold harmless Constructify from any claims, damages, losses, or legal fees arising from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your misuse of the Services</li>
                    <li>Employment disputes</li>
                    <li>Regulatory violations</li>
                    <li>Data you submit</li>
                    <li>Decisions made using the platform</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">16. Termination</h2>
                  <p>
                    We may suspend or terminate your account:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For non-payment</li>
                    <li>For violation of these Terms</li>
                    <li>For unlawful activity</li>
                  </ul>
                  <p>
                    Upon termination, your right to use the Services ceases immediately.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">17. Governing Law</h2>
                  <p>
                    These Terms are governed by the laws of the State of Kentucky, without regard to conflict of law principles.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">18. Arbitration and Class Action Waiver</h2>
                  <p>
                    Any disputes shall be resolved through binding arbitration in Kentucky.
                  </p>
                  <p>
                    You agree to waive any right to participate in class action lawsuits.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">19. Force Majeure</h2>
                  <p>
                    We are not liable for delays or failures caused by events beyond our reasonable control, including natural disasters, cyberattacks, labor disputes, or infrastructure outages.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">20. Modifications</h2>
                  <p>
                    We may update these Terms at any time. Continued use after changes constitutes acceptance.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">SMS Terms of Service</h2>
                  <p>
                    Constructify may send SMS messages to mobile numbers you provide or that are used in connection with your account, including messages related to account activity, onboarding, employee invitations, and work-related notifications. Message frequency may vary. Message and data rates may apply, depending on your carrier and plan.
                  </p>
                  <p>
                    You may opt out of SMS at any time by replying <strong>STOP</strong> to any message. For help with SMS, reply <strong>HELP</strong> or contact{" "}
                    <a href="mailto:support@constructifylabs.com" className="text-primary underline underline-offset-4">support@constructifylabs.com</a>.
                  </p>
                  <p>
                    Consent to receive SMS is not a condition of purchasing or using Constructify services generally; however, where SMS is used to complete an invited onboarding flow, verify account access, or deliver time-sensitive work-related notices you have agreed to receive, you may need to complete those steps through the channels we provide (including SMS) to access certain features.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">21. Contact Information</h2>
                  <p>
                    For legal inquiries regarding these Terms, contact:
                  </p>
                  <p>
                    support@ConstructifyLabs.com
                  </p>
                </div>
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
