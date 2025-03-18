"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, ShoppingBag, MapPin, Settings, LogOut, Edit } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/app/contexts/ToastContext"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login?redirect=/account")
      return
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, router, isLoading])
  
  const handleLogout = () => {
    logout()
    showToast({
      title: "Logged out",
      description: "You have been successfully logged out",
      type: "success"
    })
    router.push("/")
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6">
                <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-40 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto mb-6" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-lg border border-border p-6">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const accountSections = [
    {
      title: "My Orders",
      description: "View and track your orders",
      icon: ShoppingBag,
      href: "/account/orders"
    },
    {
      title: "My Addresses",
      description: "Manage your delivery addresses",
      icon: MapPin,
      href: "/account/addresses"
    },
    {
      title: "Account Settings",
      description: "Update your profile and preferences",
      icon: Settings,
      href: "/account/settings"
    },
    {
      title: "Logout",
      description: "Sign out of your account",
      icon: LogOut,
      action: handleLogout
    }
  ]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 text-center">
              <div className="relative flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-card-foreground mb-1">
                {user?.fullName || "User"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {user?.email || "user@example.com"}
              </p>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                asChild
              >
                <Link href="/account/settings">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              
              {user?.isAdmin && (
                <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/20">
                  <p className="text-sm text-primary font-medium">Admin Account</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full"
                    asChild
                  >
                    <Link href="/admin">
                      Admin Dashboard
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Account Sections */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Account Overview</h2>
              <p className="text-muted-foreground">
                Welcome back to your account dashboard. Here you can manage your orders, addresses, and account settings.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accountSections.map((section, index) => (
                <div 
                  key={index} 
                  className={`bg-card rounded-lg border border-border p-6 cursor-pointer hover:border-primary/50 transition-colors ${
                    section.action ? 'hover:bg-destructive/5' : 'hover:bg-primary/5'
                  }`}
                  onClick={section.action || (() => router.push(section.href))}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <section.icon className={`h-5 w-5 ${
                        section.action ? 'text-destructive' : 'text-primary'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-card-foreground">{section.title}</h3>
                      <p className="text-muted-foreground text-sm">{section.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

