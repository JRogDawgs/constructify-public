/** Consistent prefix for Procore web entry flow logs. */
export const PROCORE_WEB_PREFIX = "[PROCORE_WEB]" as const

const SENSITIVE_KEYS = /^(access_token|refresh_token|id_token|client_secret|password|secret)$/i

export function sanitizeQueryForLog(
  params: URLSearchParams | Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {}
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      out[key] = SENSITIVE_KEYS.test(key) ? "[redacted]" : value
    })
  } else {
    for (const [key, value] of Object.entries(params)) {
      out[key] = SENSITIVE_KEYS.test(key) ? "[redacted]" : value
    }
  }
  return out
}

export function procoreLog(message: string, data?: Record<string, unknown>): void {
  const enabled =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_PROCORE_DEBUG_LOGS === "1"
  if (!enabled) return
  if (data !== undefined) {
    console.info(PROCORE_WEB_PREFIX, message, data)
  } else {
    console.info(PROCORE_WEB_PREFIX, message)
  }
}
