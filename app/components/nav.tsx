"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import DemoModal from "./demo-modal"

export default function Navbar() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
            <Link
              href="/careers"
              className={
                pathname === "/careers"
                  ? "text-foreground"
                  : "text-foreground/60 transition-colors hover:text-foreground"
              }
            >
              Careers
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
            >
              Get a Demo
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <DemoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
} 