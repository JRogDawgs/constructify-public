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
          <div className="absolute inset-0 bg-background/75" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex max-w-screen-2xl flex-col items-center justify-center space-y-12 py-12 text-center md:py-16">
          {/* Logo with Text */}
          <div className="flex flex-col items-center">
            <img 
              src="/images/3d logo.png" 
              alt="Constructify Logo" 
              className="h-64 w-auto md:h-80 lg:h-96 drop-shadow-2xl"
            />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white -mt-6 md:-mt-8 lg:-mt-12 hero-title-shadow">
              Constructify
            </h1>
          </div>
          
          {/* Elegant Continuous Spacer Line */}
          <div className="w-full max-w-2xl">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-white/40 via-white/70 via-white/40 to-transparent animate-pulse shadow-sm"></div>
          </div>
          
          {/* Hero Content - Properly Spaced */}
          <div className="space-y-6">
            <h2 className="text-2xl font-light tracking-tight text-white/90 sm:text-3xl md:text-4xl">
              {t('hero.subtitle')}
            </h2>
            <p className="mx-auto max-w-[42rem] leading-normal text-white/80 sm:text-xl sm:leading-8">
              {t('hero.description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/solutions">
              <Button 
                size="lg" 
                className="w-full sm:w-auto font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group hero-primary-button"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                {t('hero.ctaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Button 
              size="lg"
              onClick={handleModalOpen}
              className="w-full sm:w-auto font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group hero-secondary-button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
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

