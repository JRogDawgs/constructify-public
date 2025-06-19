"use client"

import Link from "next/link"
import { Github, X, Linkedin, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { memo } from "react"

const footerLinks = {
  solutions: [
    { href: "/solutions#project-management", label: "Project Management" },
    { href: "/solutions#safety-compliance", label: "Safety Compliance" },
    { href: "/solutions#resource-planning", label: "Resource Planning" },
    { href: "/solutions#quality-control", label: "Quality Control" },
    { href: "/solutions#cost-management", label: "Cost Management" },
    { href: "/solutions#analytics", label: "Analytics & Reporting" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
  social: [
    { href: "https://facebook.com/constructify", icon: Facebook, label: "Facebook" },
    { href: "https://x.com/constructify", icon: X, label: "X (formerly Twitter)" },
    { href: "https://linkedin.com/company/constructify", icon: Linkedin, label: "LinkedIn" },
  ],
}

const FooterLink = memo(({ href, label, className }: { href: string; label: string; className?: string }) => (
  <Link 
    href={href} 
    className={`text-white/80 transition-colors hover:text-white ${className || ''}`}
    aria-label={label}
  >
    {label}
  </Link>
))

FooterLink.displayName = "FooterLink"

const FooterSection = memo(({ 
  title, 
  links 
}: { 
  title: string
  links: Array<{ href: string; label: string; icon?: any }>
}) => (
  <div className="space-y-4">
    <h3 className="text-sm font-medium text-white">{title}</h3>
    {title === "Connect" ? (
      <div className="flex space-x-4">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="text-white/80 transition-colors hover:text-white"
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </div>
    ) : (
      <ul className="space-y-3 text-sm" role="list">
        {links.map(({ href, label }) => (
          <li key={`${href}-${label}`}>
            <FooterLink href={href} label={label} />
          </li>
        ))}
      </ul>
    )}
  </div>
))

FooterSection.displayName = "FooterSection"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/20 bg-constructify-header-gradient shadow-lg" role="contentinfo">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/constructify-logo.png" 
              alt="Constructify Logo" 
              className="h-8 w-auto"
            />
            <h2 className="font-bold text-white">Constructify</h2>
          </div>
          <p className="text-sm text-white/80">
            Pioneering construction solutions for the digital age.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-4">
          <FooterSection title="Solutions" links={footerLinks.solutions} />
          <FooterSection title="Company" links={footerLinks.company} />
          <FooterSection title="Legal" links={footerLinks.legal} />
          <FooterSection title="Connect" links={footerLinks.social} />
        </div>
      </div>
      <div className="container border-t border-white/10 py-6">
        <p className="text-center text-sm text-white/80">
          © {currentYear} Constructify, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

