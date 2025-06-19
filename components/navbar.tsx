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

  // Debug: Log auth state changes in navbar
  useEffect(() => {
    console.log('🧭 Navbar auth state:', {
      loading,
      hasUser: !!user,
      userEmail: user?.email,
      timestamp: new Date().toISOString()
    });
  }, [user, loading]);

  const navigationLinks = [
    { href: "/solutions", label: t('nav.solutions') },
    { href: "/industries", label: t('nav.industries') },
    { href: "/pricing", label: t('nav.pricing') },
    { href: "/about", label: t('nav.about') },
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
      console.error('Error signing out:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const memoizedNavLinks = useMemo(() => (
    navigationLinks.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 hover:bg-white/20 hover:text-white h-14 px-4 border border-transparent hover:border-constructify-gold hover:shadow-md"
        style={{
          color: 'white',
          textShadow: '0 0 8px hsl(var(--constructify-navy-dark)), 0 0 4px hsl(var(--constructify-navy-dark))'
        }}
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
        className="border-white/30 text-white hover:bg-white font-semibold transition-all duration-200 hover:scale-105 rounded-xl h-14 px-6 text-base"
        style={{
          background: `linear-gradient(135deg, hsl(var(--constructify-navy-dark)) 0%, hsl(220 80% 8%) 100%)`,
          color: 'white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'white'
          e.currentTarget.style.color = 'hsl(var(--constructify-navy-dark))'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--constructify-navy-dark)) 0%, hsl(220 80% 8%) 100%)`
          e.currentTarget.style.color = 'white'
        }}
        onClick={handleAuthModalOpen}
        aria-label="Log in or sign up"
        variant="outline"
      >
        {t('nav.signin')}
      </Button>
    )
  }

  return (
    <>
          <header className="sticky top-0 z-50 w-full px-6 py-4">
            <div className="mx-auto max-w-screen-2xl">
              <div className="flex h-24 items-center justify-between px-8 bg-white/20 backdrop-blur-xl rounded-3xl border-2 border-white/30" style={{
                boxShadow: '0 20px 60px rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
              }}>
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
                  <LanguageToggle />
                  <ThemeToggle />
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    aria-label="Contact" 
                    className="hover:bg-white/20 hover:text-white rounded-xl border border-white/20 hover:border-constructify-gold transition-all duration-300 text-base h-14 px-4 font-semibold"
                    style={{
                      color: 'white',
                      textShadow: '0 0 8px hsl(var(--constructify-navy-dark)), 0 0 4px hsl(var(--constructify-navy-dark))'
                    }}
                  >
                    {t('nav.contact')}
                  </Button>
                  <Button 
                    size="lg"
                    onClick={handleDemoModalOpen}
                    aria-label="Get a Demo"
                    className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--constructify-tan-light)) 0%, hsl(var(--constructify-tan)) 100%)`,
                      borderColor: `hsl(var(--constructify-tan))`,
                      color: '#fefefe',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      fontFamily: 'Arial Black, sans-serif',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.3)',
                      animation: 'subtle-glow 3s ease-in-out infinite'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--constructify-tan)) 0%, hsl(var(--constructify-tan-light)) 100%)`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--constructify-tan-light)) 0%, hsl(var(--constructify-tan)) 100%)`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    {t('nav.getDemo')}
                  </Button>
                  
                  {/* Optimized Authentication Section */}
                  {renderAuthSection()}
                </div>
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

