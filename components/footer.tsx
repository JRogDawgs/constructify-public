import Link from "next/link"
import { Github, X, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
        <div className="flex-1 space-y-4">
          <h2 className="font-bold">Constructify</h2>
          <p className="text-sm text-foreground/80">Pioneering construction solutions for the digital age.</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Solutions</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/ai-analytics" className="text-foreground/80 transition-colors hover:text-primary">
                  AI Analytics
                </Link>
              </li>
              <li>
                <Link href="/cloud-services" className="text-foreground/80 transition-colors hover:text-primary">
                  Cloud Services
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-foreground/80 transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-foreground/80 transition-colors hover:text-primary">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://twitter.com/constructify"
                className="text-foreground/80 transition-colors hover:text-primary"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">X (Twitter)</span>
              </Link>
              <Link
                href="https://linkedin.com/company/constructify"
                className="text-foreground/80 transition-colors hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container border-t py-6">
        <p className="text-center text-sm text-foreground/80">
          © {new Date().getFullYear()} Constructify, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

