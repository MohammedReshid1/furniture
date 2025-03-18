"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/app/contexts/ToastContext"
import { Button } from "@/app/components/ui/button"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      showToast({
        title: "Passwords do not match",
        description: "Please make sure both passwords match",
        type: "error"
      })
      return
    }
    
    if (formData.password.length < 6) {
      showToast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        type: "error"
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const success = await register({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password
      })
      
      if (success) {
        showToast({
          title: "Registration successful",
          description: "Your account has been created",
          type: "success"
        })
        
        // Redirect to home page after successful registration
        router.push("/")
      }
    } catch (error) {
      console.error("Registration error:", error)
      showToast({
        title: "Registration failed",
        description: "An error occurred during registration",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <Image 
              src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
              alt="Furniture Haven Logo" 
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-primary hover:text-primary/90 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="full-name" className="sr-only">
                Full Name
              </label>
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-md relative block w-full px-10 py-3 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-10 py-3 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-10 py-3 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-10 py-3 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-4">
              By registering, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
            
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center">
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 