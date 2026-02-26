"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { APP_BASE_URL } from "@/lib/appConfig"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

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
      <a href={`${APP_BASE_URL}/signup?type=company`} target="_self" rel="noopener" aria-label="Log in or sign up">
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
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {renderAuthSection()}
          </div>
        </div>
      </header>
    </>
  )
}

