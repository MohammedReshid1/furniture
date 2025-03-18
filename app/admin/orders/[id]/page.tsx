"use client"

import { useState, useEffect } from "react"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Clock, ChevronRight, Copy, Truck, XCircle, Calendar, AlertCircle, Printer } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useToast } from "@/app/contexts/ToastContext"
import { Badge } from "@/app/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/app/components/ui/select"
import { Separator } from "@/app/components/ui/separator"

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
  customer: {
    name: string
    email: string
  }
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
  paymentStatus: "paid" | "refunded" | "pending"
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true)
      setNotFound(false)
      
      try {
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
          customer: {
            name: "John Doe",
            email: "john.doe@example.com"
          },
          shippingAddress: {
            addressLine1: "123 Main Street",
            addressLine2: "Apt 4B",
            city: "Anytown",
            state: "CA",
            postalCode: "12345",
            country: "United States"
          },
          paymentStatus: ["paid", "refunded", "pending"][Math.floor(Math.random() * 3)] as Order["paymentStatus"]
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
  
  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!order) return;
    setIsUpdatingStatus(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status
      setOrder({
        ...order,
        status: newStatus
      });
      
      showToast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
        type: "success"
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        type: "error"
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
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
  
  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "outline";
      case "processing": return "secondary";
      case "shipped": return "default";
      case "delivered": return "success";
      case "cancelled": return "destructive";
    }
  };
  
  const getPaymentBadgeVariant = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid": return "success";
      case "pending": return "outline";
      case "refunded": return "destructive";
    }
  };
  
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
      <div className="space-y-6">
        <div className="mb-6">
          <Link href="/admin/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        
        <Skeleton className="h-96 w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }
  
  if (notFound || !order) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <Link href="/admin/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Order Number</div>
                  <div className="font-medium flex items-center">
                    {order.orderNumber}
                    <button 
                      onClick={() => copyToClipboard(order.orderNumber, "Order number copied to clipboard!")}
                      className="ml-1.5 text-muted-foreground hover:text-foreground"
                      aria-label="Copy order number"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Date Placed</div>
                <div className="font-medium">{formatDate(order.date)}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Payment Status</div>
                <Badge variant={getPaymentBadgeVariant(order.paymentStatus)}>
                  {order.paymentStatus === "paid" ? "Paid" : 
                   order.paymentStatus === "pending" ? "Payment Pending" : "Refunded"}
                </Badge>
              </div>
              
              {order.trackingNumber && (
                <div>
                  <div className="text-sm text-muted-foreground">Tracking Number</div>
                  <div className="font-medium flex items-center">
                    {order.trackingNumber}
                    <button 
                      onClick={() => copyToClipboard(order.trackingNumber!, "Tracking number copied to clipboard!")}
                      className="ml-1.5 text-muted-foreground hover:text-foreground"
                      aria-label="Copy tracking number"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
              
              {order.estimatedDelivery && (
                <div>
                  <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                  <div className="font-medium flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    {formatDate(order.estimatedDelivery)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{order.customer.name}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium flex items-center">
                  {order.customer.email}
                  <button 
                    onClick={() => copyToClipboard(order.customer.email, "Email copied to clipboard!")}
                    className="ml-1.5 text-muted-foreground hover:text-foreground"
                    aria-label="Copy email"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Shipping Address</div>
                <div className="font-medium">
                  {order.shippingAddress.addressLine1}<br />
                  {order.shippingAddress.addressLine2 && (
                    <>
                      {order.shippingAddress.addressLine2}<br />
                    </>
                  )}
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Order Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="font-medium">Current Status: 
              <Badge variant={getStatusBadgeVariant(order.status)} className="ml-2 flex items-center gap-1">
                {getStatusIcon(order.status)}
                {getStatusText(order.status)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <div className="text-sm text-muted-foreground mr-2">Update Status:</div>
              <Select
                value={order.status}
                onValueChange={(value) => handleStatusChange(value as Order["status"])}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item._id} className="py-4 flex flex-col sm:flex-row items-start gap-4">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium mt-1 sm:mt-0">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 