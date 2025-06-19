"use client"

import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import DemoModal from "./demo-modal"

export default function Hero() {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = useCallback(() => setIsModalOpen(true), [])
  const handleModalClose = useCallback(() => setIsModalOpen(false), [])

  return (
    <>
      <section className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden" aria-label="Hero section">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            poster="/placeholder.jpg"
            preload="auto"
          >
            <source src="/videos/construction-bg.mp4" type="video/mp4" />
            <p>Your browser does not support the video tag.</p>
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/90" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex max-w-screen-2xl flex-col items-center justify-center space-y-12 py-24 text-center md:py-32">
          {/* Full Logo with Text */}
          <div className="flex flex-col items-center space-y-6">
            <img 
              src="/constructify-full-logo.png" 
              alt="Constructify - Complete Construction Management Platform" 
              className="h-40 w-auto md:h-50 lg:h-60 drop-shadow-2xl"
            />
          </div>
          
          {/* Elegant Continuous Spacer Line */}
          <div className="w-full max-w-2xl">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-white/40 via-white/70 via-white/40 to-transparent animate-pulse shadow-sm"></div>
          </div>
          
          {/* Hero Content - Properly Spaced */}
          <div className="space-y-6">
            <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-3xl font-medium tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="text-[80%] font-light">{t('hero.subtitle')}</span>
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              {t('hero.description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/solutions">
              <Button size="lg" className="w-full sm:w-auto bg-constructify-gold-gradient hover:bg-constructify-gold-dark text-black font-semibold border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {t('hero.ctaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleModalOpen}
              className="w-full sm:w-auto border-constructify-gold text-constructify-gold hover:bg-constructify-gold hover:text-black font-semibold transition-all duration-200"
            >
              {t('hero.ctaSecondary')}
            </Button>
          </div>
        </div>
      </section>

      <DemoModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </>
  )
}

