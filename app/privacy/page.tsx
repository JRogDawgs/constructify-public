import CTA from "@/components/cta"

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                We are committed to protecting your privacy and personal information.
              </p>
            </div>

            {/* Privacy Policy Content */}
            <div className="mx-auto max-w-4xl prose prose-gray dark:prose-invert">
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                  <p>
                    When you use Constructify Field, we may collect the following types of information:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>User Profile Data:</strong> Name, email address, phone number, job role, and company affiliation</li>
                    <li><strong>Employee Time Tracking Data:</strong> Clock in/out times, work hours, project assignments, and attendance records</li>
                    <li><strong>Task &amp; Training Activity Data:</strong> Task completion status, video view records, training acknowledgments, and safety material engagement (we do NOT monitor physical behavior or verify actual safety outcomes)</li>
                    <li><strong>Location Information:</strong> GPS coordinates may be captured at the time of clock-in and clock-out solely for job site verification and safety compliance purposes. Constructify Field does not continuously track, monitor, or record real-time location data outside of these specific work-related events.</li>
                    <li><strong>Photos and Documents:</strong> ID scans, profile photos, and safety documentation uploaded by workers</li>
                    <li><strong>Communication Data:</strong> Messages, project updates, task assignments, and team communications</li>
                    <li><strong>Device Information:</strong> Basic device logs, app usage statistics, and technical performance data</li>
                  </ul>
                  <div className="my-4 pl-4 border-l-4 border-muted-foreground">
                    <p className="m-0"><strong>Note:</strong> All data collection is directly related to providing construction management services and ensuring workplace safety compliance.</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. How We Use Information</h2>
                  <p>We use collected data to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>Workforce Management:</strong> Manage employee rosters, project assignments, and time tracking</li>
                    <li><strong>Safety Support &amp; Training Delivery:</strong> Provide access to task guidance, safety videos, and training materials to support safer work practices (not to guarantee safety outcomes)</li>
                    <li><strong>Compliance Documentation:</strong> Verify attendance, perform location-based checks, and help document training completion (employers remain responsible for actual OSHA compliance). Location data is used only at clock-in and clock-out events and is not used for continuous employee monitoring.</li>
                    <li><strong>Communication:</strong> Enable supervisor/admin communication and project coordination</li>
                    <li><strong>Service Improvement:</strong> Monitor performance, identify issues, and improve user experience</li>
                    <li><strong>Security:</strong> Protect against fraud, unauthorized access, and maintain data integrity</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. Safety &amp; Training Content Disclaimer</h2>
                  <p>
                    Constructify Field provides access to task videos, safety videos, and training materials as educational resources intended to support safer work practices. These materials are informational only and should not be relied upon as a substitute for professional safety judgment, on-site supervision, or formal safety training programs.
                  </p>
                  <div className="my-4 pl-4 border-l-4 border-muted-foreground">
                    <p className="m-0"><strong>Important:</strong> Constructify does not guarantee injury prevention, workplace safety outcomes, or regulatory compliance. Users should not rely solely on app content for safety decisions.</p>
                  </div>
                  <p>Employer Responsibilities:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>Workplace Safety:</strong> Employers remain fully responsible for maintaining safe job site conditions, providing proper equipment, and ensuring adherence to safety protocols</li>
                    <li><strong>Training Adequacy:</strong> Employers must verify that all training (including app-based training) meets their specific operational needs and regulatory requirements</li>
                    <li><strong>OSHA &amp; Regulatory Compliance:</strong> Employers are solely responsible for achieving and maintaining compliance with OSHA, state, and local safety regulations</li>
                    <li><strong>Supervision &amp; Oversight:</strong> Competent on-site supervision is required; digital tools do not replace human judgment or direct oversight</li>
                  </ul>
                  <p>What We Do Not Do:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>We do not monitor physical behavior or verify correct execution of tasks</li>
                    <li>We do not control or inspect job site conditions</li>
                    <li>We do not guarantee that viewing training materials will prevent accidents or injuries</li>
                    <li>We do not certify competency or compliance based on app usage alone</li>
                  </ul>
                  <div className="my-4 pl-4 border-l-4 border-muted-foreground">
                    <p className="m-0"><strong>Limitation of Reliance:</strong> Real-world job site conditions vary and may differ significantly from digital guidance. Always prioritize on-site assessment, professional judgment, and direct supervision over app-based information.</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                  <p>We implement industry-standard safeguards to protect your data:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>Encryption:</strong> Data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                    <li><strong>Access Controls:</strong> Limited to authorized company administrators and supervisors</li>
                    <li><strong>Secure Infrastructure:</strong> Enterprise-grade cloud hosting with regular audits</li>
                    <li><strong>No Data Sales:</strong> We do not sell, rent, or trade personal data to third parties</li>
                    <li><strong>Ongoing Updates:</strong> Our security practices are regularly updated to address new risks</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. User Rights</h2>
                  <p>Depending on your location, you may have the right to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data (subject to business/legal requirements)</li>
                    <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
                    <li><strong>Restriction:</strong> Request limitation of processing in certain cases</li>
                  </ul>
                  <div className="my-4 pl-4 border-l-4 border-muted-foreground">
                    <p className="m-0"><strong>To exercise these rights:</strong> Email us at support@constructifylabs.com. We will respond within 30 days.</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Children&apos;s Data</h2>
                  <p>
                    Constructify Field is intended for business use only and is not directed to children under 13 (or 16 in the EU/UK). We do not knowingly collect personal information from children. If we become aware that we have collected such data, we will delete it immediately.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. Compliance</h2>
                  <p>We comply with applicable data protection laws, including:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>United States:</strong> Federal and state data protection laws</li>
                    <li><strong>GDPR (EU/UK):</strong> General Data Protection Regulation</li>
                    <li><strong>CCPA (California):</strong> California Consumer Privacy Act</li>
                    <li><strong>Industry Standards:</strong> Construction industry data handling best practices</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">8. Updates to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. Any changes will be posted at <a href="https://constructifylabs.com/privacy" className="text-primary underline underline-offset-4">https://constructifylabs.com/privacy</a> with a revised &quot;Last Updated&quot; date.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                  <p><strong>Constructify Labs LLC</strong></p>
                  <p>Louisville, Kentucky, United States</p>
                  <p>Email: support@constructifylabs.com</p>
                  <p>Website: <a href="https://constructifylabs.com" className="text-primary underline underline-offset-4">https://constructifylabs.com</a></p>
                </div>

                <div className="pt-6 mt-6 border-t border-muted">
                  <p className="text-sm text-muted-foreground italic text-center m-0">Last Updated: February 5, 2026</p>
                  <p className="text-sm text-muted-foreground italic text-center mt-2 m-0">This privacy policy is effective as of the date listed above and will remain in effect except with respect to any changes in its provisions in the future.</p>
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