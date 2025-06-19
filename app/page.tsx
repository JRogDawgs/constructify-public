import Hero from "@/components/hero"
import Features from "@/components/features"
import CTA from "@/components/cta"
import Testimonials from "@/components/testimonials"

export default function Home() {
  return (
    <div className="relative">
      <div className="relative min-h-[calc(100vh-4rem)]">
        {/* Background gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Hero />
          <Features />
          <CTA />
          <Testimonials />
        </div>
      </div>
    </div>
  )
}

