"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { APP_BASE_URL } from "@/lib/appConfig"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LayoutDashboard } from "lucide-react"

export default function Navbar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const navigationLinks = useMemo(
    () =>
      [
        { href: "/solutions", label: t("nav.solutions") },
        { href: "/industries", label: t("nav.industries") },
        { href: "/pricing", label: t("nav.pricing") },
        { href: "/about", label: t("nav.about") },
        { href: "/contact", label: t("nav.contact") },
      ] as const,
    [t]
  )

  const linkIsActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href))

  const navLinkClass = (href: string) => {
    const active = linkIsActive(href)
    return `inline-flex shrink-0 items-center justify-center rounded-xl border font-semibold transition-all duration-300 hover:bg-white/20 hover:text-white hover:border-constructify-gold hover:shadow-md navbar-link whitespace-nowrap
      h-10 px-2.5 text-sm sm:h-11 sm:px-3 sm:text-[0.9375rem]
      lg:h-14 lg:px-3 lg:text-base xl:px-4
      ${
        active
          ? "bg-white/10 text-constructify-gold border-constructify-gold/60 border-b-2 border-b-constructify-gold shadow-sm"
          : "border-transparent"
      }`
  }

  const ownersPortalButtonClass =
    "group relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-600/70 bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-slate-200 shadow-md transition-all duration-300 hover:border-amber-400/80 hover:from-slate-700/95 hover:to-slate-800/95 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:h-14 sm:w-14"

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] overflow-x-hidden">
        <div className="mx-auto flex h-20 min-w-0 max-w-[100vw] items-center justify-between gap-2 px-3 sm:h-24 sm:gap-3 sm:px-4 lg:px-6 xl:px-8 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700/50 shadow-lg backdrop-blur-sm navbar-header-container">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex shrink-0 items-center sm:mr-1 lg:mr-8 xl:mr-12"
              aria-label="Home"
            >
              <img
                src="/images/3d logo.png"
                alt="Constructify Logo"
                className="h-11 w-auto max-h-14 filter drop-shadow-lg sm:h-14"
              />
            </Link>
            <nav
              className="navbar-nav-scroll min-h-[2.5rem] min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain lg:min-h-0 lg:flex-initial lg:overflow-visible"
              aria-label="Main navigation"
            >
              <div className="flex h-full w-max flex-nowrap items-center gap-1 pr-1 sm:gap-1.5 lg:h-auto lg:w-auto lg:gap-2 lg:pr-0 xl:gap-4">
                {navigationLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={navLinkClass(href)}
                    aria-current={linkIsActive(href) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-4">
            <ThemeToggle />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={`${APP_BASE_URL}/owners`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ownersPortalButtonClass}
                    aria-label="Owners Portal — opens in a new tab"
                  >
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      aria-hidden
                    />
                    <LayoutDashboard
                      className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6"
                      aria-hidden
                    />
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={8}
                  className="border-slate-600 bg-slate-950 px-3 py-2 text-white shadow-xl"
                >
                  <p className="text-sm font-semibold tracking-tight">Owners Portal</p>
                  <p className="text-xs font-normal text-slate-400">
                    Owner & admin dashboard
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <a
              href={`${APP_BASE_URL}/auth/login`}
              target="_self"
              rel="noopener"
              aria-label="Log in or sign up"
              className="inline-flex min-w-0 max-w-full"
            >
              <Button
                size="default"
                className="navbar-auth-button relative h-10 overflow-hidden rounded-xl border-2 px-2.5 text-[0.65rem] font-black uppercase tracking-wide shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group sm:h-12 sm:px-4 sm:text-xs lg:h-14 lg:px-8 lg:text-lg"
                onMouseEnter={(e) => {
                  e.currentTarget.classList.add("navbar-auth-button:hover")
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.classList.remove("navbar-auth-button:hover")
                }}
                variant="outline"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full transition-transform duration-700 group-hover:translate-x-[-200%]" />
                <span className="relative truncate">{t("nav.signin")}</span>
              </Button>
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
