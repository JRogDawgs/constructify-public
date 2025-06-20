import { PricingCard } from "@/components/pricing-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="relative">
      <div className="relative min-h-[calc(100vh-4rem)]">
        {/* Background gradients matching home page */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-constructify-blue/10 blur-[100px]" />
          <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] bg-constructify-gold/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-constructify-navy/10 blur-[100px]" />
        </div>

        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-30"
          >
            <source src="/videos/construction-bg.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-12">
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl pb-2">
                Pricing Plans
              </h1>
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Choose the perfect plan for your construction needs. All plans include our core features with options to scale as you grow and succeed.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <PricingCard
                id="starter"
                name="Starter"
                price="$299"
                description="Perfect for small construction teams getting started with digital management."
                features={[
                  "Up to 10 team members",
                  "Basic project management",
                  "Document storage",
                  "Email support",
                  "Mobile app access"
                ]}
              />
              <PricingCard
                id="professional"
                name="Professional"
                price="$799"
                description="Ideal for growing construction companies with multiple projects."
                features={[
                  "Up to 25 team members",
                  "Advanced project management",
                  "Resource planning",
                  "Priority support",
                  "Custom reporting",
                  "API access"
                ]}
                isPopular
              />
              <PricingCard
                id="enterprise"
                name="Enterprise"
                price="$1,999"
                description="For large construction firms requiring full-scale solutions."
                features={[
                  "Unlimited team members",
                  "Full project management suite",
                  "Advanced analytics",
                  "24/7 dedicated support",
                  "Custom integrations",
                  "SLA guarantees"
                ]}
              />
            </div>

            {/* Enhanced Features Section */}
            <div className="mt-20 space-y-8">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-blue/60 via-constructify-blue via-constructify-blue/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">All Plans Include</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Every Constructify plan comes with essential features to help you manage your construction projects effectively.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
                <div className="text-center space-y-3 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-12 h-12 bg-constructify-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-blue font-bold text-lg">✓</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Cloud Storage</h3>
                  <p className="text-sm text-muted-foreground">Secure document storage and backup</p>
                </div>

                <div className="text-center space-y-3 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-12 h-12 bg-constructify-gold/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-gold font-bold text-lg">✓</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Mobile Access</h3>
                  <p className="text-sm text-muted-foreground">iOS and Android apps included</p>
                </div>

                <div className="text-center space-y-3 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-12 h-12 bg-constructify-navy/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-navy font-bold text-lg">✓</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Real-time Sync</h3>
                  <p className="text-sm text-muted-foreground">Instant updates across all devices</p>
                </div>

                <div className="text-center space-y-3 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-12 h-12 bg-constructify-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-blue font-bold text-lg">✓</span>
                  </div>
                  <h3 className="font-semibold text-foreground">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Help when you need it most</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 space-y-6 text-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Ready to Get Started?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of construction professionals already using Constructify to streamline their operations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-auth-button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 