"use client"

import { Users, Clock, Shield, BarChart3, ArrowRight } from "lucide-react"
import { memo } from "react"
import { Button } from "@/components/ui/button"
import { APP_BASE_URL } from "@/lib/appConfig"

const features = [
  {
    name: "Workforce Control",
    description: "Assign the right workers to the right jobs. Clear site accountability. Shift people where demand is.",
    icon: Users,
    id: "workforce-control",
  },
  {
    name: "Scheduling & Time Accuracy",
    description: "Fewer payroll disputes. Exact hours per project. No manual timesheets.",
    icon: Clock,
    id: "scheduling",
  },
  {
    name: "Compliance & Training",
    description: "Track certifications and OSHA. Fewer compliance gaps. Renew before credentials expire.",
    icon: Shield,
    id: "compliance",
  },
  {
    name: "Operational Visibility",
    description: "Project status, labor costs, performance. Faster schedule adjustments. Decisions from data, not spreadsheets.",
    icon: BarChart3,
    id: "visibility",
  },
]

const FeatureCard = memo(({ feature }: { feature: typeof features[0] }) => {
  const Icon = feature.icon

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md"
      role="article"
      aria-labelledby={`feature-${feature.id}`}
    >
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-constructify-blue-light">
          <Icon className="h-7 w-7 text-constructify-blue" aria-hidden="true" />
        </div>
      </div>

      <div>
        <h3
          id={`feature-${feature.id}`}
          className="text-xl font-bold text-slate-900 mb-3"
        >
          {feature.name}
        </h3>
        <p className="text-slate-600 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  )
})

FeatureCard.displayName = "FeatureCard"

export default function Features() {
  return (
    <section
      className="bg-slate-50 py-24 md:py-32"
      aria-labelledby="features-title"
    >
      <div className="container space-y-16">
        <div className="mx-auto max-w-[58rem] text-center">
          <h2
            id="features-title"
            className="font-black text-4xl leading-[1.0] sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-slate-900"
          >
            Built for Construction Operations
          </h2>
          <p className="mt-4 text-slate-600 sm:text-lg">
            Four pillars for workforce and job control.
          </p>
        </div>
        <div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
        <div className="flex justify-center pt-8">
          <a href={`${APP_BASE_URL}/auth/create-company`} target="_self" rel="noopener">
            <Button
              size="lg"
              className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group hero-primary-button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
