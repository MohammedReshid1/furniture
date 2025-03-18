"use client"

import { useState, useEffect } from "react"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Package, Truck, CheckCircle, Clock, AlertCircle, Calendar, CreditCard } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useToast } from "@/app/contexts/ToastContext"
import { useAuth } from "@/app/contexts/AuthContext"

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
  params: OrderParams
}

export default function OrderDetailPage({ params: paramsPromise }: OrderDetailPageProps) {
  // Unwrap the params
  const params = paramsPromise as OrderParams
  const router = useRouter()
  const { showToast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const checkAuth = async () => {
      // In a real app, check if user is authenticated
      const isAuthenticated = true
      
      if (!isAuthenticated) {
        router.push("/login?redirect=/account/orders")
        return false
      }
      
      return true
    }
    
    const fetchOrderDetails = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const isAuth = await checkAuth()
        if (!isAuth) return
        
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1200))
        
        // If order ID doesn't match expected pattern, simulate not found
        if (!/^order_\d+$/.test(params.id) && params.id !== "123") {
          setError("Order not found")
          setIsLoading(false)
          return
        }
        
        // Mock order data
        const mockOrder: Order = {
          _id: params.id,
          orderNumber: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          total: 1349.97,
          shippingCost: 15.00,
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
              name: "Floor Lamp",
              price: 149.99,
              quantity: 1,
              image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
            }
          ],
          shippingAddress: {
            addressLine1: "123 Main Street",
            addressLine2: "Apt 4B",
            city: "Brooklyn",
            state: "NY",
            postalCode: "11201",
            country: "United States"
          },
          trackingNumber: "TRK-12345678",
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
        
        setOrder(mockOrder)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrderDetails()
  }, [params.id, router, showToast])
  
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }
  
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Payment confirmed, preparing your order"
      case "processing":
        return "Your order is being processed"
      case "shipped":
        return "Your order is on the way"
      case "delivered":
        return "Your order has been delivered"
      case "cancelled":
        return "Your order has been cancelled"
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast({
        title: "Copied!",
        description: message,
        type: "success"
      })
    }).catch(err => {
      console.error('Could not copy text: ', err)
    })
  }
  
  const calculateSubtotal = () => {
    if (!order) return 0
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48 ml-2" />
          </div>
          
          <Skeleton className="h-24 w-full rounded-lg mb-6" />
          
          <Skeleton className="h-16 w-full rounded-lg mb-4" />
          <Skeleton className="h-16 w-full rounded-lg mb-4" />
          <Skeleton className="h-16 w-full rounded-lg mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center text-muted-foreground hover:text-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to orders
        </Button>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the order you're looking for. It may have been removed or the link is invalid.
          </p>
          <Button asChild>
            <Link href="/account/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  if (!order) {
    return null;
  }
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to orders
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
          <div className="flex items-center mt-2">
            <p className="text-muted-foreground mr-2">Order #{order.orderNumber}</p>
            <button 
              onClick={() => copyToClipboard(order.orderNumber, "Order number copied to clipboard")}
              className="text-primary hover:text-primary/80"
              aria-label="Copy order number"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="text-muted-foreground mt-1">Placed on {formatDate(order.date)}</p>
        </div>
        <div className="flex items-center px-4 py-2 rounded-full border border-border bg-card">
          {getStatusIcon(order.status)}
          <span className="ml-2 font-medium capitalize">{order.status}</span>
        </div>
      </div>
      
      {/* Order Status */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center">
          {getStatusIcon(order.status)}
          <div className="ml-4">
            <h2 className="font-semibold text-foreground capitalize">{order.status}</h2>
            <p className="text-muted-foreground">{getStatusText(order.status)}</p>
          </div>
        </div>
        
        {(order.status === "shipped" || order.status === "delivered") && order.trackingNumber && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Tracking Number</h3>
                <div className="flex items-center mt-1">
                  <p className="text-muted-foreground mr-2">{order.trackingNumber}</p>
                  <button 
                    onClick={() => copyToClipboard(order.trackingNumber!, "Tracking number copied to clipboard")}
                    className="text-primary hover:text-primary/80"
                    aria-label="Copy tracking number"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {order.estimatedDelivery && (
                <div className="text-right">
                  <h3 className="font-medium text-foreground">Estimated Delivery</h3>
                  <p className="text-muted-foreground mt-1">{formatDate(order.estimatedDelivery)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Order Items */}
      <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg">Items in Your Order</h2>
        </div>
        
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item._id} className="p-4 flex flex-col sm:flex-row items-start gap-4">
              <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{item.name}</h3>
                <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="font-medium text-foreground">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Shipping Information</h2>
          </div>
          <div className="p-4">
            <p className="font-medium">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Order Summary</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-4 border-t border-border mt-4">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
        {order.status === "delivered" && (
          <Button onClick={() => router.push(`/account/orders/${order._id}/review`)}>
            Leave a Review
          </Button>
        )}
        
        {(order.status === "pending" || order.status === "processing") && (
          <Button 
            variant="destructive"
            onClick={() => {
              showToast({
                title: "Order Cancelled",
                description: "Your order has been cancelled successfully.",
                type: "success"
              })
              // In a real app, make an API call to cancel the order
              setOrder({...order, status: "cancelled"})
            }}
          >
            Cancel Order
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={() => {
            showToast({
              title: "Coming Soon",
              description: "This feature is not available yet.",
              type: "info"
            })
          }}
        >
          Need Help?
        </Button>
      </div>
    </div>
  )
} 