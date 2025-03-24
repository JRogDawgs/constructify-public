"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import DemoModal from "./demo-modal"
import AuthModal from "./auth-modal"

const navigationLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
]

export default function Navbar() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleDemoModalOpen = () => setIsDemoModalOpen(true)
  const handleDemoModalClose = () => setIsDemoModalOpen(false)

  const handleAuthModalOpen = () => setIsAuthModalOpen(true)
  const handleAuthModalClose = () => setIsAuthModalOpen(false)

  const memoizedNavLinks = useMemo(() => (
    navigationLinks.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3"
        aria-label={label}
      >
        {label}
      </Link>
    ))
  ), [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Home">
            <span className="font-medium">Constructify</span>
          </Link>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-normal" aria-label="Main navigation">
            {memoizedNavLinks}
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" aria-label="Contact">
              Contact
            </Button>
            <Button 
              size="sm"
              onClick={handleDemoModalOpen}
              aria-label="Get a Demo"
            >
              Get a Demo
            </Button>
            <Button 
              size="sm" 
              className="bg-[#ffd700] text-black hover:bg-[#FFD700]/90"
              onClick={handleAuthModalOpen}
              aria-label="Log in or sign up"
            >
              Login
            </Button>
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

