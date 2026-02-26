import Hero from "@/components/hero"
import WorkerPathway from "@/components/worker-pathway"
import Features from "@/components/features"
import CeeboSection from "@/components/ceebo-section"
import CTA from "@/components/cta"

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
          <div className="h-[200px] relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-700 to-slate-100" aria-hidden="true">
            {/* Subtle caution-tape diagonal stripes */}
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 24px, rgba(234, 179, 8, 0.4) 24px, rgba(234, 179, 8, 0.4) 48px)" }} />
            {/* Center accent line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-0.5 w-full max-w-3xl mx-8 rounded-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>
          </div>
          <WorkerPathway />
          <Features />
          <CeeboSection />
          <CTA />
        </div>
      </div>
    </div>
  )
}

