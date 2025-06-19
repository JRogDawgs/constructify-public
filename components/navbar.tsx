"use client"

import { useState, useMemo } from "react"
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
  const { user, userProfile, loading, signOut } = useAuth()

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
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-white/10 hover:text-white text-white/80 h-9 px-3"
        aria-label={label}
      >
        {label}
      </Link>
    ))
  ), [])

  // Render auth section based on current state
  const renderAuthSection = () => {
    if (user) {
      // User is authenticated - show profile dropdown
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user.displayName && (
                  <p className="font-medium">{user.displayName}</p>
                )}
                {user.email && (
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {t('nav.profile')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                {t('profile.settings.accountSettings')}
              </Link>
            </DropdownMenuItem>
            {userProfile?.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link href="/admin/users" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('forms.loading')}
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.signout')}
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    } else if (loading) {
      // Still loading auth state - show minimal loading indicator
      return (
        <Button 
          size="sm" 
          variant="ghost"
          disabled
          className="text-muted-foreground"
        >
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="sr-only">Loading authentication state</span>
        </Button>
      )
    } else {
      // No user - show login button
      return (
        <Button 
          size="sm" 
          className="border-white/30 text-white hover:bg-white hover:text-constructify-blue font-medium transition-all duration-200 hover:scale-105"
          onClick={handleAuthModalOpen}
          aria-label="Log in or sign up"
          variant="outline"
        >
          {t('nav.signin')}
        </Button>
      )
    }
  }

  return (
    <>
          <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-constructify-header-gradient backdrop-blur supports-[backdrop-filter]:bg-constructify-blue/90 shadow-lg">
      <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Home">
            <img 
              src="/constructify-logo.png" 
              alt="Constructify Logo" 
              className="h-8 w-auto"
            />
          </Link>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-normal" aria-label="Main navigation">
            {memoizedNavLinks}
          </nav>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="ghost" size="sm" aria-label="Contact" className="text-white/80 hover:text-white hover:bg-white/10">
              {t('nav.contact')}
            </Button>
            <Button 
              size="sm"
              onClick={handleDemoModalOpen}
              aria-label="Get a Demo"
              className="bg-constructify-gold-gradient hover:bg-constructify-gold-dark text-black font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
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

