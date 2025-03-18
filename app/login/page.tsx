"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/app/contexts/ToastContext"
import { Button } from "@/app/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // For demo purposes, we'll use the login from AuthContext
      const success = await login({
        email,
        password
      })
      
      if (success) {
        showToast({
          title: "Login successful",
          description: "Welcome back!",
          type: "success"
        })
        
        // Redirect to the requested page or home
        router.push(redirect)
      }
    } catch (error) {
      console.error("Login error:", error)
      showToast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Demo account info for easy testing
  const fillDemoAccount = (type: 'user' | 'admin') => {
    if (type === 'user') {
      setEmail("user@example.com")
      setPassword("password")
    } else {
      setEmail("admin@example.com")
      setPassword("admin")
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link 
              href="/register" 
              className="text-primary hover:text-primary/90 font-medium"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <div className="mt-4 flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fillDemoAccount('user')}
            disabled={isLoading}
          >
            Demo User
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fillDemoAccount('admin')}
            disabled={isLoading}
          >
            Demo Admin
          </Button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link 
                href="/forgot-password" 
                className="text-primary hover:text-primary/90"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in
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

