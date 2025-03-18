"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck, Home, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useAuth } from "@/app/contexts/AuthContext"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [orderNumber, setOrderNumber] = useState("")
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated && !isLoading) {
      router.push("/login")
      return
    }
    
    // Generate a random order number for demo purposes
    const generateOrderNumber = () => {
      const prefix = "ORD"
      const randomNumber = Math.floor(10000000 + Math.random() * 90000000)
      return `${prefix}-${randomNumber}`
    }
    
    // Simulate loading order details
    const timer = setTimeout(() => {
      setOrderNumber(generateOrderNumber())
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, router, isLoading])
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-card rounded-lg border border-border p-8">
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full max-w-xs mx-auto" />
          </div>
        </div>
      </div>
    )
  }
  
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)
  const formattedDeliveryDate = estimatedDelivery.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-card rounded-lg border border-border p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-card-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase, {user?.fullName?.split(' ')[0] || 'valued customer'}.
          </p>
          <p className="text-muted-foreground mt-1">
            A confirmation email has been sent to {user?.email || 'your email address'}.
          </p>
        </div>
        
        <div className="border-t border-border pt-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Order Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-card-foreground">Order Number</h3>
                <p className="text-muted-foreground">{orderNumber}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-card-foreground">Shipping</h3>
                <p className="text-muted-foreground">Standard Shipping</p>
                <p className="text-muted-foreground mt-1">
                  Estimated delivery: {formattedDeliveryDate}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-card-foreground">Shipping Address</h3>
                <p className="text-muted-foreground">123 Main St, Apt 4B</p>
                <p className="text-muted-foreground">New York, NY 10001</p>
                <p className="text-muted-foreground">United States</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-card-foreground">Order Date</h3>
                <p className="text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Button asChild>
            <Link href="/account/orders" className="flex items-center">
              View Order Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Link 
            href="/categories/all"
            className="text-primary hover:text-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
} 