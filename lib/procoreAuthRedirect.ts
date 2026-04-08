import { persistProcoreReturnUrl } from "@/lib/procoreSession"
import { procoreLog } from "@/lib/procoreLog"

const DEFAULT_LOGIN = "https://app.constructifylabs.com/login"

export function getConstructifyLoginBase(): string {
  return (
    process.env.NEXT_PUBLIC_APP_LOGIN_URL?.replace(/\/$/, "") || DEFAULT_LOGIN
  )
}

/**
 * Absolute URL the user should return to after Constructify login.
 */
export function buildAbsoluteAppReturnUrl(
  pathname: string,
  queryString: string
): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (typeof window === "undefined") {
    const base =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      "https://app.constructifylabs.com"
    return `${base}${path}${queryString ? `?${queryString}` : ""}`
  }
  return `${window.location.origin}${path}${queryString ? `?${queryString}` : ""}`
}

export type ProcoreLoginReturnOptions = {
  /** Defaults to /procore (embedded entry). */
  pathname?: string
  /** Query string without leading ? */
  queryString?: string
}

/**
 * Redirect to Constructify app login with return URL hints (and session backup).
 */
export function redirectToConstructifyLoginWithReturn(
  options: ProcoreLoginReturnOptions = {}
): void {
  const pathname = options.pathname ?? "/procore"
  const queryString = options.queryString ?? ""
  const returnTo = buildAbsoluteAppReturnUrl(pathname, queryString)
  persistProcoreReturnUrl(returnTo)

  const login = new URL(getConstructifyLoginBase())
  login.searchParams.set("returnUrl", returnTo)
  login.searchParams.set("redirect", returnTo)
  login.searchParams.set("next", returnTo)

  procoreLog("redirect target chosen", { target: "login", returnTo })

  window.location.replace(login.toString())
}
