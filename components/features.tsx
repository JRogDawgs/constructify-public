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
    name: "Enhanced Safety Training and Awareness",
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
    name: "Scalability and Customization",
    description: "Designed to cater to both small-scale projects and large construction firms.",
    icon: Zap,
    id: "scalability",
  },
]

const FeatureCard = memo(({ feature }: { feature: typeof features[0] }) => {
  const Icon = feature.icon
  return (
    <div 
      className="relative overflow-hidden rounded-lg border bg-background p-8 transition-all hover:shadow-lg"
      role="article"
      aria-labelledby={`feature-${feature.id}`}
    >
      <div className="flex items-center gap-4">
        <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
        <h3 id={`feature-${feature.id}`} className="font-medium">{feature.name}</h3>
      </div>
      <p className="mt-2 text-muted-foreground">{feature.description}</p>
    </div>
  )
})

FeatureCard.displayName = "FeatureCard"

export default function Features() {
  return (
    <section 
      className="container space-y-16 py-24 md:py-32"
      aria-labelledby="features-title"
    >
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 
          id="features-title"
          className="font-medium text-3xl leading-[1.1] sm:text-3xl md:text-5xl"
        >
          Cutting-Edge Solutions
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how Constructify can transform your business with our innovative technologies.
        </p>
      </div>
      <div 
        className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
        role="list"
      >
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  )
}

