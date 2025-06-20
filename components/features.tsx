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

const FeatureCard = memo(({ feature, index }: { feature: typeof features[0], index: number }) => {
  const Icon = feature.icon
  
  const gradients = [
    'from-blue-500/20 via-blue-600/10 to-cyan-500/20',
    'from-emerald-500/20 via-teal-600/10 to-green-500/20', 
    'from-purple-500/20 via-violet-600/10 to-indigo-500/20',
    'from-orange-500/20 via-amber-600/10 to-yellow-500/20'
  ]
  
  const iconColors = [
    'text-blue-400 group-hover:text-blue-300',
    'text-emerald-400 group-hover:text-emerald-300',
    'text-purple-400 group-hover:text-purple-300', 
    'text-orange-400 group-hover:text-orange-300'
  ]
  
  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl border border-white/20 backdrop-blur-xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 feature-card feature-card-delay-${index}`}
      role="article"
      aria-labelledby={`feature-${feature.id}`}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Floating icon */}
      <div className="relative mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Icon className={`h-8 w-8 ${iconColors[index]} transition-all duration-300 group-hover:scale-110`} aria-hidden="true" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative">
        <h3 
          id={`feature-${feature.id}`} 
          className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors duration-300 feature-title-shadow"
        >
          {feature.name}
        </h3>
        <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {feature.description}
        </p>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
    </div>
  )
})

FeatureCard.displayName = "FeatureCard"

export default function Features() {
  return (
    <section 
      className="bg-constructify-tan-gradient py-24 md:py-32"
      aria-labelledby="features-title"
    >
      <div className="container space-y-16">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 
          id="features-title"
          className="font-black text-4xl leading-[1.0] sm:text-5xl md:text-6xl lg:text-7xl tracking-tight"
        >
          Cutting-Edge Solutions
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how Constructify can transform your business with our innovative technologies.
        </p>
      </div>
      <div 
        className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12"
      >
        {features.map((feature, index) => (
          <FeatureCard key={feature.id} feature={feature} index={index} />
        ))}
      </div>
      </div>
    </section>
  )
}

