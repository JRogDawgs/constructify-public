"use client"

import { Brain, Cloud, Shield, Zap } from "lucide-react"
import { memo } from "react"

const features = [
  {
    name: "Data Insights for Continuous Improvement",
    description: "Aggregate and analyze data from various interactions and inputs within the app.",
    icon: Brain,
    id: "data-insights",
  },
  {
    name: "Real-Time Safety & OSHA Tracking",
    description: "Make it easier for workers to access and engage with vital safety information.",
    icon: Cloud,
    id: "safety-training",
  },
  {
    name: "Enterprise-Grade Security",
    description: "State-of-the-art security measures to protect your most valuable assets.",
    icon: Shield,
    id: "security",
  },
  {
    name: "Built-In Workforce Scheduling",
    description: "Designed to cater to both small-scale projects and large construction firms.",
    icon: Zap,
    id: "scalability",
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
          Cutting-Edge Solutions
        </h2>
        <p className="mt-4 text-slate-600 sm:text-lg">
          Discover how Constructify can transform your business with our innovative technologies.
        </p>
      </div>
      <div 
        className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12"
      >
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
      </div>
    </section>
  )
}

