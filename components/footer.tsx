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
    className={`text-white/80 transition-colors hover:text-white text-sm footer-text-shadow ${className || ''}`}
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
  <div className="space-y-2">
    <h3 className="font-semibold text-white text-sm footer-text-shadow">{title}</h3>
    {title === "Connect" ? (
      <div className="flex space-x-3">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="text-white/80 transition-all duration-300 hover:text-white hover:scale-110 footer-text-shadow"
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </div>
    ) : title === "Solutions" ? (
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {links.map(({ href, label }) => (
          <div key={`${href}-${label}`}>
            <FooterLink href={href} label={label} />
          </div>
        ))}
      </div>
    ) : (
      <ul className="space-y-1" role="list">
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
    <footer className="relative w-full px-6 py-4 overflow-hidden" role="contentinfo">
      {/* Flowing Water-like Gradient Background - Notre Dame Colors */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/40 via-blue-800/30 via-blue-900/40 to-slate-900/50 animate-pulse"></div>
        {/* Flowing wave effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent transform -skew-x-12 animate-pulse footer-wave-1"></div>
          <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-blue-800/30 to-transparent transform skew-x-12 animate-pulse footer-wave-2"></div>
        </div>
        {/* Floating bubbles effect */}
        <div className="absolute top-4 left-8 w-2 h-2 bg-yellow-300/40 rounded-full animate-bounce footer-bubble-delay-0"></div>
        <div className="absolute top-12 right-16 w-3 h-3 bg-blue-800/40 rounded-full animate-bounce footer-bubble-delay-1"></div>
        <div className="absolute bottom-8 left-1/4 w-1.5 h-1.5 bg-yellow-400/50 rounded-full animate-bounce footer-bubble-delay-2"></div>
        <div className="absolute bottom-16 right-8 w-2.5 h-2.5 bg-blue-900/40 rounded-full animate-bounce footer-bubble-delay-0-5"></div>
      </div>
      
      <div className="mx-auto max-w-screen-2xl relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 footer-container">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">
            {/* Logo and Description - Takes 2 columns */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/3d logo.png" 
                  alt="Constructify Logo" 
                  className="h-8 w-auto filter drop-shadow-lg"
                />
                <h2 className="font-bold text-white text-lg footer-text-shadow">Constructify</h2>
              </div>
              <p className="text-white/90 text-sm leading-relaxed footer-text-shadow">
                Pioneering construction solutions for the digital age.
              </p>
            </div>
            
            {/* Solutions - Takes 2 columns with 2-column grid inside */}
            <div className="md:col-span-2">
              <FooterSection title="Solutions" links={footerLinks.solutions} />
            </div>
            
            {/* Company, Legal, and Social - Takes 2 columns with 3-column grid inside */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <FooterSection title="Company" links={footerLinks.company} />
              <FooterSection title="Legal" links={footerLinks.legal} />
              <FooterSection title="Connect" links={footerLinks.social} />
            </div>
          </div>
          
          {/* Copyright - Reduced padding */}
          <div className="border-t border-white/20 mt-4 pt-3">
            <p className="text-center text-white/80 text-xs footer-text-shadow">
              © {currentYear} Constructify, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

