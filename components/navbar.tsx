"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import LanguageToggle from "./language-toggle"
import DemoModal from "./demo-modal"
import AuthModal from "./auth-modal"
import { useAuth } from "@/components/Google Auth/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, Loader2 } from "lucide-react"

export default function Navbar() {
  const { t } = useTranslation()
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, loading, signOut } = useAuth()

  const navigationLinks = [
    { href: "/solutions", label: t('nav.solutions') },
    { href: "/industries", label: t('nav.industries') },
    { href: "/pricing", label: t('nav.pricing') },
    { href: "/about", label: t('nav.about') },
    { href: "/contact", label: t('nav.contact') },
  ]

  const handleDemoModalOpen = () => setIsDemoModalOpen(true)
  const handleDemoModalClose = () => setIsDemoModalOpen(false)

  const handleAuthModalOpen = () => setIsAuthModalOpen(true)
  const handleAuthModalClose = () => setIsAuthModalOpen(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      // Error signing out
    } finally {
      setIsSigningOut(false)
    }
  }

  const memoizedNavLinks = useMemo(() => (
    navigationLinks.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 hover:bg-white/20 hover:text-white h-14 px-4 border border-transparent hover:border-constructify-gold hover:shadow-md navbar-link"
        aria-label={label}
      >
        {label}
      </Link>
    ))
  ), [])

  // Always show login button since this is the marketing site
  // Users get redirected to private app after authentication
  const renderAuthSection = () => {
    return (
      <Button 
        size="lg" 
        className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-auth-button"
        onMouseEnter={(e) => {
          e.currentTarget.classList.add('navbar-auth-button:hover')
        }}
        onMouseLeave={(e) => {
          e.currentTarget.classList.remove('navbar-auth-button:hover')
        }}
        onClick={handleAuthModalOpen}
        aria-label="Log in or sign up"
        variant="outline"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
        {t('nav.signin')}
      </Button>
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
            <LanguageToggle />
            <Button 
              size="lg"
              onClick={handleDemoModalOpen}
              aria-label="Get a Demo"
              className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('navbar-demo-button:hover')
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('navbar-demo-button:hover')
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
              {t('nav.getDemo')}
            </Button>
            
            {/* Optimized Authentication Section */}
            {renderAuthSection()}
          </div>
        </div>
      </header>

      <DemoModal 
        isOpen={isDemoModalOpen} 
        onClose={handleDemoModalClose} 
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
      />
    </>
  )
}

