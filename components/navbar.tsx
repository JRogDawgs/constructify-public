"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
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
import { LogOut, User, Settings } from "lucide-react"

const navigationLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
]

export default function Navbar() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, userProfile, loading, signOut } = useAuth()

  const handleDemoModalOpen = () => setIsDemoModalOpen(true)
  const handleDemoModalClose = () => setIsDemoModalOpen(false)

  const handleAuthModalOpen = () => setIsAuthModalOpen(true)
  const handleAuthModalClose = () => setIsAuthModalOpen(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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
            
            {/* Authentication Section */}
            {loading ? (
              <Button size="sm" disabled>
                Loading...
              </Button>
            ) : user ? (
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
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
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
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                size="sm" 
                className="bg-[#ffd700] text-black hover:bg-[#FFD700]/90"
                onClick={handleAuthModalOpen}
                aria-label="Log in or sign up"
              >
                Login
              </Button>
            )}
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

