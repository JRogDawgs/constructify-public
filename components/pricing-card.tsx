"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { memo } from "react"

interface PricingCardProps {
  name: string
  price?: string
  priceSuffix?: string
  description: string
  features: string[]
  isPopular?: boolean
  id: string
}

const FeatureList = memo(({ features }: { features: string[] }) => (
  <ul className="space-y-3" role="list">
    {features.map((feature, index) => (
      <li key={index} className="flex items-center gap-2 text-sm">
        <Check className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{feature}</span>
      </li>
    ))}
  </ul>
))

FeatureList.displayName = "FeatureList"

export const PricingCard = memo(function PricingCard({ 
  name, 
  price, 
  priceSuffix,
  description, 
  features, 
  isPopular,
  id 
}: PricingCardProps) {
  return (
    <div 
      className={`relative flex flex-col rounded-lg border-2 bg-card p-6 shadow-sm transition-all hover:shadow-md ${
        isPopular ? "border-primary" : "border-border"
      }`}
      role="article"
      aria-labelledby={`pricing-${id}`}
    >
      {isPopular && (
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground"
          role="status"
          aria-label="Most popular plan"
        >
          Most Popular
        </div>
      )}
      <div className="flex flex-col flex-1 space-y-4">
        <div>
          <h3 id={`pricing-${id}`} className="text-xl font-semibold">{name}</h3>
          {price && (
            <div className="mt-2">
              <span className="text-3xl font-bold">{price}</span>
              <span className="text-muted-foreground">{priceSuffix ?? "/month"}</span>
            </div>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        <FeatureList features={features} />
        <div className="mt-auto pt-4">
          <Link href="https://app.constructifylabs.com/login" target="_self" rel="noopener" aria-label={`Get started with ${name} plan`}>
            <Button 
              className="w-full" 
              variant={isPopular ? "default" : "outline"}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}) 