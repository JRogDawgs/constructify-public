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
                <div>
                  <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using Constructify's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
                  <p>
                    Constructify provides construction management software solutions designed to help businesses streamline their operations. Our services include project management, safety compliance, resource planning, and other related features.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                  <p>
                    To access our services, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Privacy</h2>
                  <p>
                    We take your privacy seriously. Our collection and use of personal information is governed by our Privacy Policy. By using our services, you consent to our data practices as described in our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. Subscription and Payments</h2>
                  <p>
                    Access to certain features of our services requires a paid subscription. All payments are processed securely, and subscriptions will automatically renew unless cancelled according to our cancellation policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                  <p>
                    All content and materials available through our services are protected by intellectual property rights. You may not use, reproduce, or distribute our content without our express permission.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                  <p>
                    Constructify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">8. Modifications to Terms</h2>
                  <p>
                    We reserve the right to modify these terms at any time. We will notify users of any material changes to these terms. Continued use of our services following such modifications constitutes acceptance of the updated terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us at support@constructify.com.
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