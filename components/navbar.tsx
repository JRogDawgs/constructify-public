"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { APP_BASE_URL } from "@/lib/appConfig"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LayoutDashboard } from "lucide-react"

export default function Navbar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const memoizedNavLinks = useMemo(() => {
    const navigationLinks = [
      { href: "/solutions", label: t('nav.solutions') },
      { href: "/industries", label: t('nav.industries') },
      { href: "/pricing", label: t('nav.pricing') },
      { href: "/about", label: t('nav.about') },
      { href: "/contact", label: t('nav.contact') },
    ]
    return navigationLinks.map(({ href, label }) => {
      const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href))
      return (
        <Link
          key={href}
          href={href}
          className={`inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 hover:bg-white/20 hover:text-white h-14 px-4 border hover:border-constructify-gold hover:shadow-md navbar-link ${
            isActive
              ? "bg-white/10 text-constructify-gold border-constructify-gold/60 border-b-2 border-b-constructify-gold shadow-sm"
              : "border-transparent"
          }`}
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
        >
          {label}
        </Link>
      )
    })
  }, [t, pathname])

  const renderAuthSection = () => {
    return (
      <a href={`${APP_BASE_URL}/auth/login`} target="_self" rel="noopener" aria-label="Log in or sign up">
        <Button 
          size="lg" 
          className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-auth-button"
          onMouseEnter={(e) => {
            e.currentTarget.classList.add('navbar-auth-button:hover')
          }}
          onMouseLeave={(e) => {
            e.currentTarget.classList.remove('navbar-auth-button:hover')
          }}
          variant="outline"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
          {t('nav.signin')}
        </Button>
      </a>
    )
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="flex h-24 items-center justify-between px-8 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700/50 shadow-lg backdrop-blur-sm navbar-header-container">
          <div className="flex items-center">
            <Link href="/" className="mr-12 flex items-center space-x-3" aria-label="Home">
              <img 
                src="/images/3d logo.png" 
                alt="Constructify Logo" 
                className="h-16 w-auto filter drop-shadow-lg"
              />
            </Link>
            <nav className="flex items-center space-x-8 text-lg font-medium" aria-label="Main navigation">
              {memoizedNavLinks}
            </nav>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={`${APP_BASE_URL}/owners`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-600/70 bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-slate-200 shadow-md transition-all duration-300 hover:border-amber-400/80 hover:from-slate-700/95 hover:to-slate-800/95 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    aria-label="Owners Portal — opens in a new tab"
                  >
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      aria-hidden
                    />
                    <LayoutDashboard
                      className="relative h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                      aria-hidden
                    />
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={8}
                  className="border-slate-600 bg-slate-950 px-3 py-2 text-white shadow-xl"
                >
                  <p className="text-sm font-semibold tracking-tight">Owners Portal</p>
                  <p className="text-xs font-normal text-slate-400">
                    Owner & admin dashboard
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {renderAuthSection()}
          </div>
        </div>
      </header>
    </>
  )
}

