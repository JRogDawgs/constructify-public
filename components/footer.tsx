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
    className={`text-slate-300 transition-colors hover:text-white text-sm ${className || ''}`}
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
    <h3 className="font-semibold text-white text-sm">{title}</h3>
    {title === "Connect" ? (
      <div className="flex space-x-3">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="text-slate-300 transition-colors hover:text-white"
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
    <footer className="relative w-full px-6 py-4 bg-slate-900" role="contentinfo">
      <div className="mx-auto max-w-screen-2xl">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">
            {/* Logo and Description - Takes 2 columns */}
            <div className="md:col-span-2 space-y-2 p-4 rounded-lg border border-slate-700/50">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/3d logo.png" 
                  alt="Constructify Logo" 
                  className="h-8 w-auto filter drop-shadow-lg"
                />
                <h2 className="font-bold text-white text-lg">Constructify</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Pioneering construction solutions for the digital age.
              </p>
            </div>
            
            {/* Solutions - Takes 2 columns with 2-column grid inside */}
            <div className="md:col-span-2 p-4 rounded-lg border border-slate-700/50">
              <FooterSection title="Solutions" links={footerLinks.solutions} />
            </div>
            
            {/* Company, Legal, and Social - Takes 2 columns with 3-column grid inside */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4 p-4 rounded-lg border border-slate-700/50">
              <FooterSection title="Company" links={footerLinks.company} />
              <FooterSection title="Legal" links={footerLinks.legal} />
              <FooterSection title="Connect" links={footerLinks.social} />
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-4 pt-3">
            <p className="text-center text-slate-400 text-xs">
              © {currentYear} Constructify, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

