"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

interface SubmitResult {
  success: boolean
  message?: string
  error?: string
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = `${(formData.get("firstName") as string)?.trim() || ""} ${(formData.get("lastName") as string)?.trim() || ""}`.trim()
    const email = (formData.get("email") as string)?.trim() || ""
    const company = (formData.get("company") as string)?.trim() || ""
    const message = (formData.get("message") as string)?.trim() || ""
    const projectType = (formData.get("projectType") as string)?.trim() || ""

    const payload = {
      name,
      email,
      company,
      ...(message && { message }),
      ...(projectType && { projectType }),
    }

    try {
      const res = await fetch("/api/receive-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data: SubmitResult = await res.json()

      if (!res.ok) {
        setStatus("error")
        setErrorMessage(data.error || data.message || "Something went wrong")
        return
      }

      if (data.success) {
        setStatus("success")
        form.reset()
      } else {
        setStatus("error")
        setErrorMessage(data.error || "Something went wrong")
      }
    } catch {
      setStatus("error")
      setErrorMessage("Failed to send. Please try again.")
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="John" className="bg-white/5 border-white/20" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="Doe" className="bg-white/5 border-white/20" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="john@company.com" className="bg-white/5 border-white/20" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" placeholder="Your Construction Company" className="bg-white/5 border-white/20" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">Project Type</Label>
        <select
          id="projectType"
          name="projectType"
          title="Select your project type"
          className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-foreground"
        >
          <option value="">Select project type</option>
          <option value="residential">Residential Construction</option>
          <option value="commercial">Commercial Construction</option>
          <option value="industrial">Industrial Construction</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project and how we can help..."
          className="bg-white/5 border-white/20 min-h-[120px]"
        />
      </div>

      {status === "success" && (
        <div className="rounded-lg bg-green-500/20 border border-green-500/50 px-4 py-3 text-green-600 dark:text-green-400">
          Thank you! Your message has been sent. We'll get back to you within 24 hours.
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-3 text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="w-full font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button disabled:opacity-70"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
        {status === "submitting" ? "Sending..." : "Send Message"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
