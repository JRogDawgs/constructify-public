import Hero from "@/components/hero"
import RoleDemosSection from "@/components/role-demos-section"
import MidCTASection from "@/components/mid-cta-section"
import PainSolutionSection from "@/components/pain-solution-section"
import RoleValueSection from "@/components/role-value-section"
import HowItWorksSection from "@/components/how-it-works-section"
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
          {/* 1. Hero — pain-driven headline + dual CTA */}
          <Hero />

          {/* 2. Video demos — see every role in action */}
          <RoleDemosSection />

          {/* 3. Mid CTA — after video section */}
          <MidCTASection
            headline="Ready to Stop Losing Money on Your Jobs?"
            subtext="Bad data, missed clock-ins, and poor visibility are costing you more than you think. Constructify fixes it — fast."
            ctaLabel="Get Control Today"
            emphasis={"You're already paying for the problem. This is the solution."}
            footnote=""
          />

          {/* 4. Divider — dark-to-light visual transition */}
          <div
            className="h-[200px] relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-700 to-slate-100"
            aria-hidden="true"
          >
            <div className="home-divider-caution-stripes absolute inset-0 opacity-15" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-0.5 w-full max-w-3xl mx-8 rounded-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>
          </div>

          {/* 5. Pain → Solution — real problems, direct answers */}
          <PainSolutionSection />

          {/* 6. Role-Based Value — 3-column roles */}
          <RoleValueSection />

          {/* 7. Mid CTA — after role section */}
          <MidCTASection
            headline="Admins get control. Supervisors get clarity. Workers get simplicity."
            subtext={"You're already paying for inefficiency. This fixes it."}
            ctaLabel="Get Control Today"
            emphasis=""
            footnote=""
          />

          {/* 8. How It Works — 3 simple steps */}
          <HowItWorksSection />

          {/* 9. Worker Pathway — field worker signup */}
          <WorkerPathway />

          {/* 10. Features — 4-pillar breakdown */}
          <Features />

          {/* 11. Ceebo AI — operations assistant */}
          <CeeboSection />

          {/* 12. Bottom CTA — final conversion push */}
          <CTA />
        </div>
      </div>
    </div>
  )
}

