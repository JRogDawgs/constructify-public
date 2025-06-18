"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CTA from "@/components/cta"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
  const [accountType, setAccountType] = useState("company")
  const [currentStage, setCurrentStage] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStage(2)
  }

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case "starter":
        return { name: "Starter", price: "$299/month" }
      case "professional":
        return { name: "Professional", price: "$799/month" }
      case "enterprise":
        return { name: "Enterprise", price: "$1,999/month" }
      default:
        return { name: "", price: "" }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle final form submission
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Main Content Section with Video Background */}
      <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/construction-bg.mp4" type="video/mp4" />
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/90" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-8">
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text pb-4 text-4xl font-medium tracking-tight text-transparent leading-[1.4] sm:text-5xl md:text-6xl lg:text-7xl">
                {currentStage === 1 ? "Sign Up" : "Payment Information"}
              </h1>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                {currentStage === 1 
                  ? "Join Constructify and transform your construction management process."
                  : "Complete your registration by adding payment details."}
              </p>
            </div>

            {/* Sign Up Form */}
            <div className="mx-auto max-w-2xl">
              {currentStage === 1 ? (
                <form onSubmit={handleNext} className="space-y-8 rounded-lg border bg-card p-8 shadow-sm">
                  {/* Account Type Selection */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Account Type</Label>
                    <RadioGroup 
                      defaultValue="company" 
                      className="grid grid-cols-2 gap-4"
                      onValueChange={setAccountType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company">Company</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">Individual</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Company Information */}
                  {accountType === "company" && (
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Company Information</Label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input id="companyName" placeholder="Enter company name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential">Residential Construction</SelectItem>
                              <SelectItem value="commercial">Commercial Construction</SelectItem>
                              <SelectItem value="industrial">Industrial Construction</SelectItem>
                              <SelectItem value="infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="companySize">Company Size</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Personal Information</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter first name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter last name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email address" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" placeholder="Enter phone number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="ceo">CEO</SelectItem>
                            <SelectItem value="project-manager">Project Manager</SelectItem>
                            <SelectItem value="site-supervisor">Site Supervisor</SelectItem>
                            <SelectItem value="superintendent">Superintendent</SelectItem>
                            <SelectItem value="contractor">Contractor</SelectItem>
                            <SelectItem value="subcontractor">Subcontractor</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Fields */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Additional Fields</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contact method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="text">Text Message</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc-12">UTC-12 (Baker Island)</SelectItem>
                            <SelectItem value="utc-11">UTC-11 (American Samoa)</SelectItem>
                            <SelectItem value="utc-10">UTC-10 (Hawaii)</SelectItem>
                            <SelectItem value="utc-9">UTC-9 (Alaska)</SelectItem>
                            <SelectItem value="utc-8">UTC-8 (Pacific Time - Los Angeles, Vancouver)</SelectItem>
                            <SelectItem value="utc-7">UTC-7 (Mountain Time - Denver, Phoenix)</SelectItem>
                            <SelectItem value="utc-6">UTC-6 (Central Time - Chicago, Mexico City)</SelectItem>
                            <SelectItem value="utc-5">UTC-5 (Eastern Time - New York, Toronto)</SelectItem>
                            <SelectItem value="utc-4">UTC-4 (Atlantic Time - Halifax, San Juan)</SelectItem>
                            <SelectItem value="utc-3">UTC-3 (São Paulo, Buenos Aires)</SelectItem>
                            <SelectItem value="utc-2">UTC-2 (South Georgia Islands)</SelectItem>
                            <SelectItem value="utc-1">UTC-1 (Cape Verde, Azores)</SelectItem>
                            <SelectItem value="utc+0">UTC+0 (London, Dublin, Lisbon)</SelectItem>
                            <SelectItem value="utc+1">UTC+1 (Paris, Berlin, Rome)</SelectItem>
                            <SelectItem value="utc+2">UTC+2 (Cairo, Jerusalem, Athens)</SelectItem>
                            <SelectItem value="utc+3">UTC+3 (Moscow, Istanbul, Riyadh)</SelectItem>
                            <SelectItem value="utc+4">UTC+4 (Dubai, Baku)</SelectItem>
                            <SelectItem value="utc+5">UTC+5 (Karachi, Tashkent)</SelectItem>
                            <SelectItem value="utc+6">UTC+6 (Dhaka, Almaty)</SelectItem>
                            <SelectItem value="utc+7">UTC+7 (Bangkok, Jakarta)</SelectItem>
                            <SelectItem value="utc+8">UTC+8 (Singapore, Beijing, Manila)</SelectItem>
                            <SelectItem value="utc+9">UTC+9 (Tokyo, Seoul)</SelectItem>
                            <SelectItem value="utc+10">UTC+10 (Sydney, Brisbane)</SelectItem>
                            <SelectItem value="utc+11">UTC+11 (Solomon Islands)</SelectItem>
                            <SelectItem value="utc+12">UTC+12 (Auckland, Fiji)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="plan" className="text-lg font-semibold">Plan Selection</Label>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div
                            className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                              selectedPlan === "starter" ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => setSelectedPlan("starter")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setSelectedPlan("starter")
                              }
                            }}
                          >
                            <div className="space-y-2">
                              <h3 className="font-semibold">Starter</h3>
                              <p className="text-2xl font-bold">$299</p>
                              <p className="text-sm text-muted-foreground">/month</p>
                            </div>
                          </div>
                          <div
                            className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                              selectedPlan === "professional" ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => setSelectedPlan("professional")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setSelectedPlan("professional")
                              }
                            }}
                          >
                            <div className="space-y-2">
                              <h3 className="font-semibold">Professional</h3>
                              <p className="text-2xl font-bold">$799</p>
                              <p className="text-sm text-muted-foreground">/month</p>
                            </div>
                          </div>
                          <div
                            className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                              selectedPlan === "enterprise" ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => setSelectedPlan("enterprise")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setSelectedPlan("enterprise")
                              }
                            }}
                          >
                            <div className="space-y-2">
                              <h3 className="font-semibold">Enterprise</h3>
                              <p className="text-2xl font-bold">$1,999</p>
                              <p className="text-sm text-muted-foreground">/month</p>
                            </div>
                          </div>
                        </div>
                        {!selectedPlan && (
                          <p className="mt-2 text-sm text-destructive">Please select a plan to continue</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Security</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create password" 
                            required 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Input 
                            id="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm password" 
                            required 
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Next Button */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="h-4 w-4 rounded border-gray-300" 
                        required 
                        aria-label="Accept terms and conditions"
                        title="Check to accept terms and conditions"
                      />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <a href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                    <Button type="submit" className="w-full">
                      Next
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border bg-card p-8 shadow-sm">
                  {/* Selected Plan Summary */}
                  {selectedPlan && (
                    <div className="mb-8 rounded-lg bg-primary/5 p-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-primary">Selected Plan</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold">{getPlanDetails(selectedPlan).name}</span>
                          <span className="text-xl font-bold">{getPlanDetails(selectedPlan).price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You will be charged {getPlanDetails(selectedPlan).price} when you create your account.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Billing Information */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Billing Information</Label>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="Enter name as shown on card" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="Enter card number" required />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="expiryMonth">Expiry Month</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, '0')
                                return (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiryYear">Expiry Year</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = (new Date().getFullYear() + i).toString()
                                return (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="CVV" maxLength={4} required />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Billing Address</Label>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" placeholder="Enter street address" required />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="Enter city" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input id="state" placeholder="Enter state/province" required />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                          <Input id="zipCode" placeholder="Enter ZIP/postal code" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="mx">Mexico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setCurrentStage(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section without video background */}
      <div className="relative">
        <CTA />
      </div>
    </div>
  )
} 