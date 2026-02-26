import CTA from "@/components/cta"

export default function TermsPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Main Content Section with Video Background */}
      <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
        {/* Background Video */}
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
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/90" />
        </div>

        {/* Content */}
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

            {/* Terms Content */}
            <div className="mx-auto max-w-4xl prose prose-gray dark:prose-invert">
              <section className="space-y-6">
                <p className="text-muted-foreground sm:text-lg">
                  Effective Date: February 26, 2025
                </p>
                <p>
                  Please read these Terms of Service (&quot;Terms&quot;) carefully before using Constructify (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) software, website, and related services (collectively, the &quot;Services&quot;).
                </p>
                <p>
                  By accessing or using the Services, you agree to be bound by these Terms.
                </p>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">1. Eligibility</h2>
                  <p>
                    You must be at least 18 years old and legally capable of entering into binding agreements to use the Services. If you are using the Services on behalf of a company or organization, you represent that you have authority to bind that entity.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
                  <p>
                    Constructify provides construction workforce management and operational software, including but not limited to scheduling, time tracking, compliance tracking, workforce management tools, and AI-powered assistance (&quot;Ceebo&quot;).
                  </p>
                  <p>
                    The Services are intended to assist businesses in managing operations but do not replace professional judgment.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. AI Disclaimer (Ceebo)</h2>
                  <p>
                    Ceebo and any AI-generated outputs are provided for informational purposes only.
                  </p>
                  <p>Ceebo:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Does not provide legal advice</li>
                    <li>Does not provide safety certification</li>
                    <li>Does not guarantee regulatory compliance</li>
                    <li>Does not provide payroll or accounting advice</li>
                    <li>Does not replace licensed professionals</li>
                  </ul>
                  <p>
                    Users are solely responsible for verifying all AI-generated information before relying on it.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
                  <p>You are solely responsible for:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The accuracy of data entered into the Services</li>
                    <li>Compliance with labor laws and safety regulations</li>
                    <li>Payroll decisions and workforce management</li>
                    <li>Ensuring certifications and compliance records are accurate</li>
                    <li>Any actions taken based on platform outputs</li>
                  </ul>
                  <p>
                    Constructify does not verify the accuracy of user-submitted data.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. Accounts and Security</h2>
                  <p>
                    You are responsible for maintaining the confidentiality of account credentials. You agree to notify us immediately of any unauthorized access. You are responsible for all activity under your account.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Subscriptions, Fees, and Payments</h2>
                  <p>Certain features require paid subscriptions.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Fees are billed in advance.</li>
                    <li>Subscriptions automatically renew unless canceled.</li>
                    <li>Failure to pay may result in suspension or termination.</li>
                    <li>All fees are non-refundable unless required by law.</li>
                  </ul>
                  <p>
                    We reserve the right to modify pricing with reasonable notice.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. License Grant</h2>
                  <p>
                    Subject to compliance with these Terms, we grant you a limited, non-exclusive, non-transferable license to access and use the Services for internal business purposes.
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
                    All software, content, branding, and materials are owned by Constructify or its licensors and are protected by intellectual property laws.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">9. Acceptable Use</h2>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Upload unlawful, fraudulent, or harmful content</li>
                    <li>Attempt to disrupt system security</li>
                    <li>Use automated scraping tools</li>
                    <li>Interfere with other users</li>
                  </ul>
                  <p>
                    We may suspend accounts for violations.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">10. Data Ownership</h2>
                  <p>
                    You retain ownership of your data.
                  </p>
                  <p>
                    You grant Constructify a limited license to host, process, and display your data solely for providing Services.
                  </p>
                  <p>
                    We are not responsible for data loss caused by user error, third-party integrations, or force majeure events.
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

      {/* CTA Section without video background */}
      <div className="relative">
        <CTA />
      </div>
    </div>
  )
} 