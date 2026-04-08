"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { APP_BASE_URL } from "@/lib/appConfig"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LayoutDashboard, Menu } from "lucide-react"

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

  const desktopLinkClass = (href: string) => {
    const active = linkIsActive(href)
    return `inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 hover:bg-white/20 hover:text-white h-14 px-3 xl:px-4 border hover:border-constructify-gold hover:shadow-md navbar-link shrink-0 ${
      active
        ? "bg-white/10 text-constructify-gold border-constructify-gold/60 border-b-2 border-b-constructify-gold shadow-sm"
        : "border-transparent"
    }`
  }

  const mobileLinkClass = (href: string) => {
    const active = linkIsActive(href)
    return `flex w-full items-center rounded-xl border px-4 py-3 text-base font-semibold transition-colors navbar-link ${
      active
        ? "border-constructify-gold/60 bg-white/10 text-constructify-gold"
        : "border-transparent text-white hover:bg-white/10"
    }`
  }

  const renderAuthSection = (compact: boolean) => {
    return (
      <a
        href={`${APP_BASE_URL}/auth/login`}
        target="_self"
        rel="noopener"
        aria-label="Log in or sign up"
        className={compact ? "inline-flex min-w-0" : undefined}
      >
        <Button
          size={compact ? "default" : "lg"}
          className={`font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl uppercase tracking-wide relative overflow-hidden group navbar-auth-button ${
            compact
              ? "h-11 px-3 text-xs sm:px-5 sm:text-sm sm:h-12 lg:h-14 lg:px-8 lg:text-lg"
              : "px-8 text-lg h-14"
          }`}
          onMouseEnter={(e) => {
            e.currentTarget.classList.add("navbar-auth-button:hover")
          }}
          onMouseLeave={(e) => {
            e.currentTarget.classList.remove("navbar-auth-button:hover")
          }}
          variant="outline"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700" />
          <span className="relative truncate">{t("nav.signin")}</span>
        </Button>
      </a>
    )
  }

  const ownersPortalButtonClass =
    "group relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-600/70 bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-slate-200 shadow-md transition-all duration-300 hover:border-amber-400/80 hover:from-slate-700/95 hover:to-slate-800/95 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:h-14 sm:w-14"

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] overflow-x-hidden">
        <div className="mx-auto flex h-20 min-w-0 max-w-[100vw] items-center justify-between gap-2 px-3 sm:h-24 sm:gap-3 sm:px-4 lg:px-6 xl:px-8 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700/50 shadow-lg backdrop-blur-sm navbar-header-container">
          <div className="flex min-w-0 flex-1 items-center">
            <Link
              href="/"
              className="mr-2 flex shrink-0 items-center space-x-2 sm:mr-4 lg:mr-8 xl:mr-12"
              aria-label="Home"
            >
              <img
                src="/images/3d logo.png"
                alt="Constructify Logo"
                className="h-11 w-auto max-h-14 filter drop-shadow-lg sm:h-14"
              />
            </Link>
            <nav
              className="hidden min-w-0 items-center gap-2 text-lg font-medium lg:flex xl:gap-4"
              aria-label="Main navigation"
            >
              {navigationLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={desktopLinkClass(href)}
                  aria-label={label}
                  aria-current={linkIsActive(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
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
            <div className="hidden min-[380px]:block lg:hidden">
              {renderAuthSection(true)}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 text-white hover:bg-white/10 hover:text-white lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="z-[100] w-[min(100vw-1rem,22rem)] border-slate-700 bg-slate-900 text-white"
              >
                <SheetHeader className="text-left">
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <nav
                  className="mt-6 flex flex-col gap-2 border-t border-slate-700 pt-4"
                  aria-label="Mobile navigation"
                >
                  {navigationLinks.map(({ href, label }) => (
                    <SheetClose key={href} asChild>
                      <Link
                        href={href}
                        className={mobileLinkClass(href)}
                        aria-current={linkIsActive(href) ? "page" : undefined}
                      >
                        {label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <a
                      href={`${APP_BASE_URL}/owners`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-2 rounded-xl border border-transparent px-4 py-3 text-base font-semibold text-white hover:bg-white/10"
                    >
                      <LayoutDashboard className="h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                      Owners Portal
                    </a>
                  </SheetClose>
                  <div className="min-[380px]:hidden pt-2">
                    <SheetClose asChild>{renderAuthSection(true)}</SheetClose>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="hidden lg:block">{renderAuthSection(false)}</div>
          </div>
        </div>
      </header>
    </>
  )
}
