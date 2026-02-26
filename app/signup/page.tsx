"use client"

import { useEffect } from "react"

const APP_LOGIN_URL = "https://app.constructifylabs.com/login"

export default function SignUpPage() {
  useEffect(() => {
    window.location.href = APP_LOGIN_URL
  }, [])

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-muted-foreground">Redirecting to Constructify app...</p>
    </div>
  )
}
