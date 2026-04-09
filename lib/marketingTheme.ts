const MARKETING_PATHS = new Set([
  "/",
  "/solutions",
  "/industries",
  "/pricing",
  "/about",
  "/contact",
  "/careers",
  "/privacy",
  "/terms",
  "/sms-consent",
  "/account-deletion",
])

function normalizePathname(pathname: string | null): string {
  if (pathname == null || pathname === "") return ""
  const trimmed = pathname.replace(/\/$/, "")
  return trimmed === "" ? "/" : trimmed
}

export function isMarketingPath(pathname: string | null): boolean {
  return MARKETING_PATHS.has(normalizePathname(pathname))
}
