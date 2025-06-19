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
    style={{
      textShadow: '0 0 8px hsl(var(--constructify-navy-dark)), 0 0 4px hsl(var(--constructify-navy-dark))'
    }}
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
    <h3 className="font-semibold text-white" style={{
      textShadow: '0 0 8px hsl(var(--constructify-navy-dark)), 0 0 4px hsl(var(--constructify-navy-dark))'
    }}>{title}</h3>
    {title === "Connect" ? (
      <div className="flex space-x-4">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="text-white/80 transition-all duration-300 hover:text-white hover:scale-110"
            style={{
              textShadow: '0 0 8px hsl(var(--constructify-navy-dark)), 0 0 4px hsl(var(--constructify-navy-dark))'
            }}
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
      <ul className="space-y-3" role="list">
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
    <footer className="w-full px-6 py-8" role="contentinfo">
      <div className="mx-auto max-w-screen-2xl">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl border-2 border-white/30 p-8" style={{
          boxShadow: '0 20px 60px rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
        }}>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/3d logo.png" 
                  alt="Constructify Logo" 
                  className="h-10 w-auto filter drop-shadow-lg"
                />
                <h2 className="font-bold text-white text-xl" style={{
                  textShadow: '0 0 8px hsl(var(--constructify-navy-dark)), 0 0 4px hsl(var(--constructify-navy-dark))'
                }}>Constructify</h2>
              </div>
              <p className="text-white/90 leading-relaxed" style={{
                textShadow: '0 0 8px hsl(var(--constructify-navy-dark)), 0 0 4px hsl(var(--constructify-navy-dark))'
              }}>
                Pioneering construction solutions for the digital age.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
              <FooterSection title="Solutions" links={footerLinks.solutions} />
              <FooterSection title="Company" links={footerLinks.company} />
              <FooterSection title="Legal" links={footerLinks.legal} />
              <FooterSection title="Connect" links={footerLinks.social} />
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6">
            <p className="text-center text-white/80" style={{
              textShadow: '0 0 8px hsl(var(--constructify-navy-dark)), 0 0 4px hsl(var(--constructify-navy-dark))'
            }}>
              © {currentYear} Constructify, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

