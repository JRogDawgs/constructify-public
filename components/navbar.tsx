import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-medium">Constructify</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-normal">
          <Link href="/solutions" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3">
            Solutions
          </Link>
          <Link href="/industries" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3">
            Industries
          </Link>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3">
            Pricing
          </Link>
          <Link href="/about" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3">
            About Us
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm">
            Contact
          </Button>
          <Button size="sm">Get a Demo</Button>
          <Button 
            size="sm" 
            className="bg-[#ffd700] text-black hover:bg-[#FFD700]/90"
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}

