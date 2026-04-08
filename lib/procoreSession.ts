import { procoreLog } from "@/lib/procoreLog"

/** Session key for full return URL before Constructify login (same origin). */
export const PROCORE_RETURN_STORAGE_KEY = "constructify_procore_return_v1"

function normalizePath(p: string): string {
  const t = p.replace(/\/$/, "")
  return t || "/"
}

export function persistProcoreReturnUrl(absoluteUrl: string): void {
  try {
    sessionStorage.setItem(PROCORE_RETURN_STORAGE_KEY, absoluteUrl)
    procoreLog("preserved return params (sessionStorage)", {
      length: absoluteUrl.length,
    })
  } catch {
    /* quota or private mode */
  }
}

/**
 * If the user landed without query params after login, restore the stored URL’s
 * search string when its pathname matches `expectedPathname`.
 * @returns query string (without "?") to merge, or null
 */
export function consumeStoredReturnQueryIfPathMatches(
  expectedPathname: string
): string | null {
  try {
    const raw = sessionStorage.getItem(PROCORE_RETURN_STORAGE_KEY)
    if (!raw) return null
    const u = new URL(raw)
    if (normalizePath(u.pathname) !== normalizePath(expectedPathname)) {
      return null
    }
    const q = u.searchParams.toString()
    if (!q) return null
    sessionStorage.removeItem(PROCORE_RETURN_STORAGE_KEY)
    procoreLog("preserved return params restored", {
      path: expectedPathname,
      keys: [...new URLSearchParams(q).keys()],
    })
    return q
  } catch {
    return null
  }
}
