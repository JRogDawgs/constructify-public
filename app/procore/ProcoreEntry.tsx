"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getFirebaseAuth, isFirebaseConfiguredForProcore } from "@/lib/firebaseClient"
import { procoreLog, sanitizeQueryForLog } from "@/lib/procoreLog"
import { consumeStoredReturnQueryIfPathMatches } from "@/lib/procoreSession"
import { redirectToConstructifyLoginWithReturn } from "@/lib/procoreAuthRedirect"
import { ProcoreLoadingState } from "@/app/procore/ProcoreLoadingState"

type EntryPhase =
  | "auth_loading"
  | "redirect_login"
  | "forward_callback"
  | "goto_setup"
  | "restore_query"
  | "config_error"
  | "fatal"

export function ProcoreEntry() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchString = searchParams.toString()
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [phase, setPhase] = useState<EntryPhase>("auth_loading")
  const [message, setMessage] = useState<string | null>(null)
  const loginRedirectStarted = useRef(false)
  const postAuthFlowDone = useRef(false)

  useEffect(() => {
    procoreLog("/procore route hit", {
      query: sanitizeQueryForLog(searchParams),
    })
  }, [searchParams])

  useEffect(() => {
    if (!isFirebaseConfiguredForProcore()) {
      procoreLog("auth state resolved", { error: "firebase_config_missing" })
      setPhase("config_error")
      return
    }

    let unsub: (() => void) | undefined
    try {
      const auth = getFirebaseAuth()
      unsub = onAuthStateChanged(auth, (u) => {
        procoreLog("auth state resolved", {
          authenticated: !!u,
          uid: u?.uid ?? null,
        })
        setUser(u)
      })
    } catch (e) {
      procoreLog("auth state resolved", {
        error: e instanceof Error ? e.message : "init_failed",
      })
      setMessage(
        e instanceof Error ? e.message : "Could not start authentication."
      )
      setPhase("fatal")
    }
    return () => unsub?.()
  }, [])

  useEffect(() => {
    if (user === undefined) return
    if (phase === "config_error" || phase === "fatal") return

    if (user === null) {
      if (loginRedirectStarted.current) return
      loginRedirectStarted.current = true
      setPhase("redirect_login")
      redirectToConstructifyLoginWithReturn({ queryString: searchString })
      return
    }

    // Authenticated: restore query string if login stripped it
    if (!searchString) {
      const restored = consumeStoredReturnQueryIfPathMatches("/procore")
      if (restored) {
        setPhase("restore_query")
        router.replace(`/procore?${restored}`)
        return
      }
    }

    if (postAuthFlowDone.current) return

    const oauthError = searchParams.get("error")
    if (oauthError) {
      const desc = searchParams.get("error_description")
      postAuthFlowDone.current = true
      setMessage(desc || oauthError)
      procoreLog("callback/connection failure", { oauthError, desc })
      router.replace(
        `/procore/setup?procore_error=${encodeURIComponent(desc || oauthError)}`
      )
      setPhase("goto_setup")
      return
    }

    const code = searchParams.get("code")
    if (code) {
      const callbackBase =
        process.env.NEXT_PUBLIC_PROCORE_OAUTH_CALLBACK_URL?.replace(/\/$/, "") ||
        ""
      if (!callbackBase) {
        postAuthFlowDone.current = true
        procoreLog("callback/connection attempt started", {
          outcome: "blocked",
          reason: "missing_callback_env",
        })
        router.replace(
          `/procore/setup?procore_error=${encodeURIComponent(
            "Authorization code received, but the app is not configured to forward it to the Procore callback (NEXT_PUBLIC_PROCORE_OAUTH_CALLBACK_URL)."
          )}`
        )
        setPhase("goto_setup")
        return
      }

      postAuthFlowDone.current = true
      setPhase("forward_callback")
      procoreLog("callback/connection attempt started", {
        mode: "forward_to_cloud_function",
      })
      const target = new URL(callbackBase)
      searchParams.forEach((v, k) => target.searchParams.set(k, v))
      procoreLog("redirect target chosen", { target: "procore_oauth_callback" })
      window.location.replace(target.toString())
      return
    }

    postAuthFlowDone.current = true
    setPhase("goto_setup")
    const next =
      searchString.length > 0 ? `/procore/setup?${searchString}` : "/procore/setup"
    procoreLog("redirect target chosen", { target: next })
    router.replace(next)
  }, [user, searchString, searchParams, router, phase])

  if (phase === "config_error") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Procore connection unavailable</CardTitle>
          <CardDescription>
            This deployment is missing Firebase web configuration required to detect your
            Constructify session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and
            NEXT_PUBLIC_FIREBASE_PROJECT_ID for the app that serves /procore.</p>
          <Button variant="outline" asChild>
            <a href="https://app.constructifylabs.com/login">Open Constructify login</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (phase === "fatal" && message) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <a href="/procore">Try again</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (phase === "redirect_login") {
    return <ProcoreLoadingState label="Redirecting to sign in…" />
  }

  if (phase === "forward_callback") {
    return <ProcoreLoadingState label="Finishing Procore authorization…" />
  }

  if (phase === "restore_query" || phase === "goto_setup") {
    return (
      <ProcoreLoadingState
        label={
          phase === "restore_query"
            ? "Restoring your Procore session…"
            : "Opening Procore setup…"
        }
      />
    )
  }

  return <ProcoreLoadingState label="Checking your Constructify session…" />
}
