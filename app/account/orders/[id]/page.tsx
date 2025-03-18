"use client"

import { useState, useEffect } from "react"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Clock, ChevronRight, Copy, Truck, XCircle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useToast } from "@/app/contexts/ToastContext"

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  _id: string
  orderNumber: string
  date: string
  total: number
  shippingCost: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

interface OrderParams {
  id: string
}

interface OrderDetailPageProps {
  params: Promise<OrderParams>
}

export default function OrderDetailPage({ params: paramsPromise }: OrderDetailPageProps) {
  // Properly unwrap the params with React.use()
  const params = React.use(paramsPromise);
  const orderId = params.id;
  
  const { showToast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  
  useEffect(() => {
    const checkAuth = async () => {
      // In a real app, this would check if the user is authenticated
      // If not, redirect to login
      // For this mockup, we'll just proceed
      return true
    }
    
    const fetchOrderDetails = async () => {
      setIsLoading(true)
      setNotFound(false)
      
      try {
        // First check if user is authenticated
        const isAuth = await checkAuth()
        if (!isAuth) return
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In a real app, this would be an API call to fetch the order
        // For now, we'll use mock data
        const mockOrder: Order = {
          _id: orderId,
          orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          total: 1249.97,
          shippingCost: 50,
          status: ["pending", "processing", "shipped", "delivered", "cancelled"][Math.floor(Math.random() * 5)] as Order["status"],
          items: [
            {
              _id: "item_1",
              name: "Modern Sofa",
              price: 899.99,
              quantity: 1,
              image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
            },
            {
              _id: "item_2",
              name: "Coffee Table",
              price: 299.99,
              quantity: 1,
              image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
            },
            {
              _id: "item_3",
              name: "Decorative Pillows Set",
              price: 49.99,
              quantity: 1,
              image: "https://images.unsplash.com/photo-1584013482381-b54c28cedb88?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
            }
          ],
          shippingAddress: {
            addressLine1: "123 Main Street",
            addressLine2: "Apt 4B",
            city: "Anytown",
            state: "CA",
            postalCode: "12345",
            country: "United States"
          }
        }
        
        // Add tracking number and estimated delivery for shipped or delivered orders
        if (mockOrder.status === "shipped" || mockOrder.status === "delivered") {
          mockOrder.trackingNumber = `TRK${Math.floor(1000000000 + Math.random() * 9000000000)}`
          mockOrder.estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        }
        
        // Set the order data
        setOrder(mockOrder)
      } catch (error) {
        console.error('Error fetching order details:', error)
        showToast({
          title: "Error",
          description: "Failed to load order details. Please try again later.",
          type: "error"
        })
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrderDetails()
  }, [orderId, showToast])
  
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-primary" />
      case "delivered":
        return <Check className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-destructive" />
    }
  }
  
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date)
  }
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    showToast({
      title: "Copied!",
      description: message,
      type: "success"
    })
  }
  
  const calculateSubtotal = () => {
    if (!order) return 0
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/account/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-36" />
          </div>
          
          <div className="border border-border rounded-lg p-6 space-y-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (notFound || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/account/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild>
            <Link href="/account/orders">View Your Orders</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/account/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Order #{order.orderNumber} 
            <button 
              onClick={() => copyToClipboard(order.orderNumber, "Order number copied to clipboard!")}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Copy order number"
            >
              <Copy className="h-4 w-4" />
            </button>
          </h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.date)}
          </p>
        </div>
        
        <div className="flex items-center px-4 py-2 rounded-full border border-border bg-card">
          {getStatusIcon(order.status)}
          <span className="ml-2 font-medium">{getStatusText(order.status)}</span>
        </div>
      </div>
      
      {/* Order Items */}
      <div className="border border-border rounded-lg p-6 mb-6 bg-card">
        <h2 className="text-xl font-semibold mb-6">Order Items</h2>
        <div className="grid grid-cols-1 gap-6">
          {order.items.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-24 h-24 rounded-md overflow-hidden bg-muted">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <Link 
                  href={`/products/${item._id}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
                <div className="flex justify-between mt-1">
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  <p className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                {order.status === "delivered" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      showToast({
                        title: "Review coming soon",
                        description: "The review feature will be available soon!",
                        type: "info"
                      })
                    }}
                  >
                    Write a Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-2">
            <p>
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.addressLine2 && (
                <>
                  {order.shippingAddress.addressLine2}<br />
                </>
              )}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
            
            {order.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tracking Number:</span>
                  <span className="font-medium flex items-center">
                    {order.trackingNumber}
                    <button 
                      onClick={() => copyToClipboard(order.trackingNumber!, "Tracking number copied to clipboard!")}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      aria-label="Copy tracking number"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </span>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-border flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 