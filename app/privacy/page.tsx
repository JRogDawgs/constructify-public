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
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Name and contact information</li>
                    <li>Company details and role information</li>
                    <li>Account credentials</li>
                    <li>Payment information</li>
                    <li>Usage data and preferences</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                  <p>
                    We use the collected information for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Providing and improving our services</li>
                    <li>Processing your transactions</li>
                    <li>Communicating with you about our services</li>
                    <li>Analyzing usage patterns and trends</li>
                    <li>Ensuring security and preventing fraud</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                  <p>
                    We do not sell your personal information to third parties. We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Service providers who assist in our operations</li>
                    <li>Professional advisors and auditors</li>
                    <li>Law enforcement when required by law</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments</li>
                    <li>Access controls and authentication</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                  <p>
                    You have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Data portability</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience and collect usage data. You can control cookie settings through your browser preferences.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
                  <p>
                    Our services are not intended for children under 13. We do not knowingly collect or maintain information from children under 13.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">8. Changes to Privacy Policy</h2>
                  <p>
                    We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                  <p>
                    If you have questions about this Privacy Policy or our practices, please contact us at privacy@constructify.com.
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