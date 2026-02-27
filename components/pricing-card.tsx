"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { memo } from "react"
import { APP_BASE_URL } from "@/lib/appConfig"

interface PricingCardProps {
  name: string
  price?: string
  priceSuffix?: string
  description?: string
  annualLicense?: string
  perUserFee?: string
  features: string[]
  isPopular?: boolean
  id: string
  ctaText?: string
  ctaHref?: string
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

const DEFAULT_CTA_HREF = `${APP_BASE_URL}/auth/signup`

export const PricingCard = memo(function PricingCard({ 
  name, 
  price, 
  priceSuffix,
  description, 
  annualLicense,
  perUserFee,
  features, 
  isPopular,
  id,
  ctaText = "Choose this company size",
  ctaHref = DEFAULT_CTA_HREF,
}: PricingCardProps) {
  const isTierFormat = Boolean(annualLicense && perUserFee)
  return (
    <div 
      className="relative flex flex-col rounded-lg border-4 border-constructify-navy bg-card p-6 shadow-sm transition-all hover:shadow-md"
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
          {isTierFormat ? (
            <div className="mt-3 space-y-1">
              <p className="text-sm">
                <span className="font-semibold">Annual Platform License:</span>
                <span className="text-muted-foreground ml-1">{annualLicense}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">Per-User Fee:</span>
                <span className="text-muted-foreground ml-1">{perUserFee}</span>
              </p>
            </div>
          ) : price ? (
            <div className="mt-2">
              <span className="text-3xl font-bold">{price}</span>
              <span className="text-muted-foreground">{priceSuffix ?? "/month"}</span>
            </div>
          ) : null}
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </div>
        <FeatureList features={features} />
        <div className="mt-auto pt-4">
          <a href={ctaHref} target="_self" rel="noopener" aria-label={`${ctaText} for ${name} plan`} className="block p-[6px] rounded-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-lg">
            <Button 
              className="w-full text-sm font-semibold bg-green-400 hover:bg-green-500 text-constructify-navy border-0"
            >
              {ctaText}
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}) 