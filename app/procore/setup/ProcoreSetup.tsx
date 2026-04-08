"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { AlertCircle, CheckCircle2, Loader2, Plug } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { APP_BASE_URL } from "@/lib/appConfig"
import { getFirebaseAuth, isFirebaseConfiguredForProcore } from "@/lib/firebaseClient"
import { procoreLog } from "@/lib/procoreLog"
import { redirectToConstructifyLoginWithReturn } from "@/lib/procoreAuthRedirect"
import { consumeStoredReturnQueryIfPathMatches } from "@/lib/procoreSession"
import { ProcoreLoadingState } from "@/app/procore/ProcoreLoadingState"

type ProcoreStatusPayload = {
  connected?: boolean
  companyName?: string
  companyId?: string
  lastSyncAt?: string
  lastSyncStatus?: string
  message?: string
}

async function readCompanyFromClaims(user: User): Promise<string | null> {
  try {
    const r = await user.getIdTokenResult()
    const c = r.claims as Record<string, unknown>
    const raw =
      c.companyId ??
      c.company_id ??
      c.orgId ??
      c.org_id ??
      c.tenantId ??
      c.tenant_id
    return typeof raw === "string" && raw.length > 0 ? raw : null
  } catch {
    return null
  }
}

export function ProcoreSetup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [companyHint, setCompanyHint] = useState<string | null>(null)
  const [status, setStatus] = useState<ProcoreStatusPayload | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testMessage, setTestMessage] = useState<string | null>(null)
  const [configError, setConfigError] = useState(false)
  const [claimsLoading, setClaimsLoading] = useState(true)

  const queryError = searchParams.get("procore_error")
  const querySuccess =
    searchParams.get("procore_connected") === "1" ||
    searchParams.get("procore") === "connected"

  const fetchStatus = useCallback(async (u: User) => {
    const url = process.env.NEXT_PUBLIC_PROCORE_STATUS_URL?.trim()
    if (!url) {
      setStatus(null)
      setStatusError(null)
      return
    }
    setStatusLoading(true)
    setStatusError(null)
    procoreLog("callback/connection attempt started", { mode: "fetch_status" })
    try {
      const token = await u.getIdToken()
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const text = await res.text()
      let body: ProcoreStatusPayload | null = null
      try {
        body = text ? (JSON.parse(text) as ProcoreStatusPayload) : null
      } catch {
        body = { message: text.slice(0, 200) }
      }
      if (!res.ok) {
        setStatus(null)
        setStatusError(
          body?.message || `Status request failed (${res.status}).`
        )
        procoreLog("callback/connection failure", {
          mode: "fetch_status",
          status: res.status,
        })
        return
      }
      setStatus(body)
      procoreLog("callback/connection success", { mode: "fetch_status" })
    } catch (e) {
      setStatus(null)
      setStatusError(
        e instanceof Error ? e.message : "Could not load Procore status."
      )
      procoreLog("callback/connection failure", {
        mode: "fetch_status",
        error: String(e),
      })
    } finally {
      setStatusLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isFirebaseConfiguredForProcore()) {
      setConfigError(true)
      setUser(null)
      return
    }
    try {
      const auth = getFirebaseAuth()
      return onAuthStateChanged(auth, (next) => setUser(next))
    } catch {
      setConfigError(true)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (user) void fetchStatus(user)
  }, [user, fetchStatus])

  useLayoutEffect(() => {
    if (!user) {
      setClaimsLoading(false)
      return
    }
    setClaimsLoading(true)
  }, [user])

  useEffect(() => {
    if (!user) {
      setCompanyHint(null)
      return
    }
    let cancelled = false
    void readCompanyFromClaims(user).then((c) => {
      if (cancelled) return
      setCompanyHint(c)
      setClaimsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (user === undefined || user === null) return
    if (searchParams.toString()) return
    const restored = consumeStoredReturnQueryIfPathMatches("/procore/setup")
    if (restored) {
      router.replace(`/procore/setup?${restored}`)
    }
  }, [user, searchParams, router])

  const handleConnect = async () => {
    if (!user) return
    const startBase = process.env.NEXT_PUBLIC_PROCORE_OAUTH_START_URL?.trim()
    if (!startBase) {
      setTestMessage(
        "Connect URL is not configured. Set NEXT_PUBLIC_PROCORE_OAUTH_START_URL to your procoreOAuthStart (or equivalent) HTTPS endpoint."
      )
      return
    }
    setTestMessage(null)
    procoreLog("callback/connection attempt started", { mode: "oauth_start" })
    try {
      const token = await user.getIdToken()
      const returnTo = `${window.location.origin}/procore/setup`
      const u = new URL(startBase)
      u.searchParams.set("idToken", token)
      u.searchParams.set("returnTo", returnTo)
      window.top?.location.assign(u.toString()) ?? window.location.assign(u.toString())
    } catch (e) {
      procoreLog("callback/connection failure", {
        mode: "oauth_start",
        error: String(e),
      })
      setTestMessage(
        e instanceof Error ? e.message : "Could not start Procore connection."
      )
    }
  }

  const handleTest = async () => {
    const testUrl = process.env.NEXT_PUBLIC_PROCORE_TEST_URL?.trim()
    if (!testUrl || !user) {
      setTestMessage(
        "Test endpoint not configured. Set NEXT_PUBLIC_PROCORE_TEST_URL if your backend exposes testProcoreConnection."
      )
      return
    }
    setTestLoading(true)
    setTestMessage(null)
    procoreLog("callback/connection attempt started", { mode: "test_connection" })
    try {
      const token = await user.getIdToken()
      const res = await fetch(testUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      })
      const text = await res.text()
      if (!res.ok) {
        setTestMessage(text || `Test failed (${res.status}).`)
        procoreLog("callback/connection failure", { mode: "test_connection" })
        return
      }
      setTestMessage(text ? text.slice(0, 300) : "Connection test succeeded.")
      procoreLog("callback/connection success", { mode: "test_connection" })
      void fetchStatus(user)
    } catch (e) {
      setTestMessage(
        e instanceof Error ? e.message : "Connection test request failed."
      )
      procoreLog("callback/connection failure", {
        mode: "test_connection",
        error: String(e),
      })
    } finally {
      setTestLoading(false)
    }
  }

  if (configError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuration required</CardTitle>
          <CardDescription>
            Firebase client environment variables are missing on this deployment.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Add the same NEXT_PUBLIC_FIREBASE_* values used by the Constructify web app.</p>
        </CardContent>
      </Card>
    )
  }

  if (user === undefined) {
    return <ProcoreLoadingState label="Loading your session…" />
  }

  if (user === null) {
    const qs = searchParams.toString()
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>
            Sign in to Constructify to manage the Procore integration.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={() => {
              redirectToConstructifyLoginWithReturn({
                pathname: "/procore/setup",
                queryString: qs,
              })
            }}
          >
            Sign in
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const connected = querySuccess || status?.connected === true

  const systemSyncHref = `${APP_BASE_URL.replace(/\/$/, "")}/dashboard/admin/system-sync`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Procore</h1>
        <p className="text-sm text-muted-foreground">
          Connection status and next steps for your Constructify workspace.
        </p>
      </div>

      {querySuccess && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Procore authorization completed</AlertTitle>
          <AlertDescription>
            Your account finished the Procore OAuth step. Use the actions below if you
            need to verify or refresh the connection.
          </AlertDescription>
        </Alert>
      )}

      {queryError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Procore connection issue</AlertTitle>
          <AlertDescription>{queryError}</AlertDescription>
        </Alert>
      )}

      {user && !claimsLoading && !companyHint && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No company on this account yet</AlertTitle>
          <AlertDescription>
            If you expected a company workspace, finish onboarding in Constructify or ask
            an admin to invite you. Procore still opens here, but sync features need a
            linked organization.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plug className="h-5 w-5" aria-hidden />
            Connection
          </CardTitle>
          <CardDescription>
            {statusLoading
              ? "Checking backend status…"
              : connected
                ? "Procore appears connected for this Constructify login."
                : "Procore is not connected yet, or status could not be loaded."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {statusError && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive">
              {statusError}
            </p>
          )}

          {!process.env.NEXT_PUBLIC_PROCORE_STATUS_URL && (
            <p className="text-muted-foreground">
              Live connection status is not configured (NEXT_PUBLIC_PROCORE_STATUS_URL).
              Use Connect or your admin tools to verify Procore; once a status endpoint
              exists, details will appear here automatically.
            </p>
          )}

          {status && (
            <ul className="space-y-1 rounded-md border bg-muted/40 px-3 py-2">
              <li>
                <span className="text-muted-foreground">State: </span>
                {connected ? "Connected" : "Not connected"}
              </li>
              {(status.companyName || status.companyId) && (
                <li>
                  <span className="text-muted-foreground">Procore / org hint: </span>
                  {status.companyName || status.companyId}
                </li>
              )}
              {(status.lastSyncAt || status.lastSyncStatus) && (
                <li>
                  <span className="text-muted-foreground">Last sync: </span>
                  {status.lastSyncAt || "—"}
                  {status.lastSyncStatus ? ` (${status.lastSyncStatus})` : ""}
                </li>
              )}
              {status.message && (
                <li>
                  <span className="text-muted-foreground">Note: </span>
                  {status.message}
                </li>
              )}
            </ul>
          )}

          <p className="text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{user.email}</span>
            {companyHint ? (
              <span> · Organization claim present on this login</span>
            ) : null}
          </p>

          {testMessage && (
            <p className="rounded-md border bg-muted/50 px-3 py-2 text-muted-foreground">
              {testMessage}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button type="button" onClick={() => void handleConnect()}>
            {connected ? "Reconnect Procore" : "Connect Procore"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={
              testLoading || !process.env.NEXT_PUBLIC_PROCORE_TEST_URL?.trim()
            }
            onClick={() => void handleTest()}
          >
            {testLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing…
              </>
            ) : (
              "Test connection"
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link href={systemSyncHref}>Open system sync in Constructify</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/procore">Back to Procore entry</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
