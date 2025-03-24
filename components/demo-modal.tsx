"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { z } from "zod"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

const emailSchema = z.string().email("Please enter a valid email address")

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setError(null)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      emailSchema.parse(email)
      setIsSubmitting(true)

      // Here you would typically make an API call to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Demo request submitted successfully! We'll be in touch soon.")
      setEmail("")
      onClose()
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message)
      } else {
        toast.error("Failed to submit demo request. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [email, onClose])

  const handleClose = useCallback(() => {
    setEmail("")
    setError(null)
    onClose()
  }, [onClose])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Demo</DialogTitle>
          <DialogDescription>
            Enter your email address below and we'll reach out to schedule a personalized demo of our platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={handleEmailChange}
                required
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
              {error && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              aria-label={isSubmitting ? "Submitting demo request..." : "Request demo"}
            >
              {isSubmitting ? "Submitting..." : "Request Demo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 