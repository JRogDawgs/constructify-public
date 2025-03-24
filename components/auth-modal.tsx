"use client"

import { useState } from "react"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

type AuthMode = "login" | "signup" | "forgot-password"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true)
    try {
      // Here you would typically make an API call to your auth endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast.success("Successfully logged in!")
      onClose()
      loginForm.reset()
    } catch (error) {
      toast.error("Failed to log in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      // Here you would typically make an API call to your signup endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast.success("Account created successfully! Please log in.")
      setMode("login")
      signupForm.reset()
    } catch (error) {
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true)
    try {
      // Here you would typically make an API call to your password reset endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast.success("Password reset instructions sent to your email!")
      setMode("login")
      forgotPasswordForm.reset()
    } catch (error) {
      toast.error("Failed to send reset instructions. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    loginForm.reset()
    signupForm.reset()
    forgotPasswordForm.reset()
    setMode("login")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot-password" && "Reset Password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login" && "Enter your credentials to access your account."}
            {mode === "signup" && "Fill in your information to create a new account."}
            {mode === "forgot-password" && "Enter your email to receive reset instructions."}
          </DialogDescription>
        </DialogHeader>

        {mode === "login" && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...loginForm.register("email")}
                aria-invalid={!!loginForm.formState.errors.email}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...loginForm.register("password")}
                aria-invalid={!!loginForm.formState.errors.password}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm"
              onClick={() => setMode("forgot-password")}
            >
              Forgot password?
            </Button>
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("signup")}
                disabled={isSubmitting}
              >
                Need an account? Sign up
              </Button>
            </DialogFooter>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                {...signupForm.register("name")}
                aria-invalid={!!signupForm.formState.errors.name}
              />
              {signupForm.formState.errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {signupForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...signupForm.register("email")}
                aria-invalid={!!signupForm.formState.errors.email}
              />
              {signupForm.formState.errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...signupForm.register("password")}
                aria-invalid={!!signupForm.formState.errors.password}
              />
              {signupForm.formState.errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...signupForm.register("confirmPassword")}
                aria-invalid={!!signupForm.formState.errors.confirmPassword}
              />
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {signupForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("login")}
                disabled={isSubmitting}
              >
                Already have an account? Log in
              </Button>
            </DialogFooter>
          </form>
        )}

        {mode === "forgot-password" && (
          <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...forgotPasswordForm.register("email")}
                aria-invalid={!!forgotPasswordForm.formState.errors.email}
              />
              {forgotPasswordForm.formState.errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {forgotPasswordForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Instructions"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("login")}
                disabled={isSubmitting}
              >
                Back to login
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 