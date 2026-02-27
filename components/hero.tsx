"use client"

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { APP_BASE_URL } from "@/lib/appConfig"

export default function Hero() {
  const { t } = useTranslation()

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
          {/* Dark navy gradient overlay for readability - matches Constructify Field brand */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/75 to-slate-800/70" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex max-w-screen-2xl flex-col items-center justify-center space-y-6 py-4 text-center md:py-6">
          {/* Logo with Brand Title */}
          <div className="flex flex-col items-center">
            <img 
              src="/images/3d logo.png" 
              alt="Constructify Logo" 
              className="h-56 w-auto md:h-72 lg:h-84 drop-shadow-2xl"
            />
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white -mt-6">
              Constructify
            </h1>
          </div>
          
          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-medium text-white/90 mt-4 max-w-3xl mx-auto">
            {t('hero.title')}
          </h2>
          
          {/* Elegant Continuous Spacer Line */}
          <div className="w-full max-w-2xl">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-white/40 via-white/70 via-white/40 to-transparent animate-pulse shadow-sm"></div>
          </div>
          
          {/* Hero Content - Properly Spaced */}
          <div className="space-y-4">
            <p className="text-2xl font-light tracking-tight text-white/90 sm:text-3xl">
              {t('hero.subtitle')}
            </p>
            <p className="mx-auto max-w-[42rem] leading-normal text-white/80 sm:text-xl sm:leading-8">
              {t('hero.description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href={`${APP_BASE_URL}/auth/signup`} target="_self" rel="noopener" className="inline-block p-[6px] rounded-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-lg">
              <Button 
                size="lg" 
                className="w-full sm:w-auto font-black px-8 text-lg h-14 uppercase tracking-wide bg-green-400 hover:bg-green-500 text-constructify-navy border-0 rounded-lg"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

