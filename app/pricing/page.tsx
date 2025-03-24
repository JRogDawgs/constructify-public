import { PricingCard } from "@/components/pricing-card"

export default function PricingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
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
          <div className="space-y-4 text-center">
            <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl pb-2">
              Pricing Plans
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Choose the perfect plan for your construction needs. All plans include our core features with options to scale as you grow.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard
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
        </div>
      </div>
    </div>
  )
} 