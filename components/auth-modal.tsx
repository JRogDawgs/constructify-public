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
import { useAuth } from "@/components/Google Auth/AuthContext"

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
  const { signInWithGoogle, loading } = useAuth()

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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success("Successfully signed in with Google!")
      onClose()
    } catch (error: any) {
      console.error("Google Sign-in Error:", error)
      
      // Handle specific Firebase errors
      if (error?.code?.includes('identitytoolkit') || error?.message?.includes('identitytoolkit')) {
        toast.error("Firebase setup required. Please check the Firebase Setup Guide in docs/FIREBASE_SETUP_GUIDE.md")
      } else if (error?.code === 'auth/popup-blocked') {
        toast.error("Popup blocked. Please allow popups and try again.")
      } else if (error?.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in cancelled.")
      } else if (error?.code === 'auth/network-request-failed') {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to sign in with Google. Please try again.")
      }
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
            
            {/* Google Sign-in Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || isSubmitting}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium py-2.5"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Signing in..." : "Continue with Google"}
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
            
            {/* Google Sign-in Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || isSubmitting}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium py-2.5"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Signing in..." : "Continue with Google"}
            </Button>

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