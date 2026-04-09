import CTA from "@/components/cta"

export default function TermsPage() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/construction-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/90" />
        </div>

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
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">9. Changes to Service</h2>
                  <p>
                    We may modify, suspend, or discontinue features of the Services from time to time. Where changes materially affect your use of paid Services, we will use reasonable efforts to provide notice in line with your agreement or applicable law. Continued use after non-material updates constitutes acceptance of those updates as they apply to your use.
                  </p>
                  <p>
                    We may update these Terms periodically. When we do, we will post the revised Terms on this page and update the effective date above. Your continued use of the Services after the effective date of changes constitutes acceptance of the revised Terms.
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

                <div className="pt-6 mt-6 border-t border-muted">
                  <p className="text-sm text-muted-foreground italic text-center m-0">Last Updated: April 9, 2026</p>
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
