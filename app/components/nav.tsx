"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <div className="mr-8 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="text-xl font-bold">Constructify</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/about"
              className={
                pathname === "/about"
                  ? "text-foreground"
                  : "text-foreground/60 transition-colors hover:text-foreground"
              }
            >
              About
            </Link>
            <Link
              href="/pricing"
              className={
                pathname === "/pricing"
                  ? "text-foreground"
                  : "text-foreground/60 transition-colors hover:text-foreground"
              }
            >
              Pricing
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="https://app.constructifylabs.com/login" target="_self" rel="noopener">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
} 