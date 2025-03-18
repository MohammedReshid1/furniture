"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Eye, ShoppingBag, Clock, CheckCircle, AlertTriangle, XCircle, TruckIcon } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useToast } from "@/app/contexts/ToastContext"

interface Order {
  _id: string
  orderNumber: string
  date: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: {
    _id: string
    product: {
      name: string
      price: number
    }
    quantity: number
  }[]
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login?redirect=/account/orders")
      return
    }
    
    // Simulate fetching orders
    const fetchOrders = async () => {
      try {
        // This is where you would normally fetch from your API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data for demonstration
        const mockOrders: Order[] = [
          {
            _id: "ord_1",
            orderNumber: "FH-2023-65789",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            total: 1499.97,
            status: "delivered",
            items: [
              {
                _id: "item_1",
                product: { name: "Modern Sofa", price: 899.99 },
                quantity: 1
              },
              {
                _id: "item_2",
                product: { name: "Coffee Table", price: 299.99 },
                quantity: 2
              }
            ]
          },
          {
            _id: "ord_2",
            orderNumber: "FH-2023-65823",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            total: 249.99,
            status: "shipped",
            items: [
              {
                _id: "item_3",
                product: { name: "Bookshelf", price: 249.99 },
                quantity: 1
              }
            ]
          },
          {
            _id: "ord_3",
            orderNumber: "FH-2023-66041",
            date: new Date().toISOString(),
            total: 599.98,
            status: "processing",
            items: [
              {
                _id: "item_4",
                product: { name: "Ergonomic Chair", price: 299.99 },
                quantity: 2
              }
            ]
          },
          {
            _id: "ord_4",
            orderNumber: "FH-2023-65492",
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            total: 1299.99,
            status: "cancelled",
            items: [
              {
                _id: "item_5",
                product: { name: "Dining Table", price: 899.99 },
                quantity: 1
              },
              {
                _id: "item_6",
                product: { name: "Dining Chair", price: 99.99 },
                quantity: 4
              }
            ]
          }
        ]
        
        setOrders(mockOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
        showToast({
          title: "Error",
          description: "Failed to load your orders. Please try again later.",
          type: "error"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrders()
  }, [isAuthenticated, router, showToast])
  
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-indigo-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
    }
  }
  
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending Payment'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.push('/account')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-card rounded-lg border border-border hover:border-primary/50 transition-colors p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Placed on {formatDate(order.date)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-background border border-border">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>
                
                <div className="border-t border-border my-4 pt-4">
                  <h4 className="font-medium text-sm text-card-foreground mb-2">Order Summary</h4>
                  <ul className="text-sm space-y-2">
                    {order.items.map((item) => (
                      <li key={item._id} className="flex justify-between">
                        <span>
                          {item.quantity} × {item.product.name}
                        </span>
                        <span className="text-muted-foreground">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-2 border-t border-border flex justify-between font-medium">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link href={`/account/orders/${order._id}`}>
                      <Eye className="mr-1 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                  
                  {order.status === 'delivered' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        showToast({
                          title: "Coming Soon",
                          description: "The ability to leave reviews is coming soon!",
                          type: "info"
                        })
                      }}
                    >
                      Leave a Review
                    </Button>
                  )}
                  
                  {order.status === 'pending' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        showToast({
                          title: "Order Cancelled",
                          description: "Your order has been cancelled successfully.",
                          type: "success"
                        })
                        // Update the order status locally for demonstration
                        setOrders(orders.map(o => 
                          o._id === order._id ? {...o, status: 'cancelled' as const} : o
                        ))
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-card-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Browse our products and make your first purchase!
            </p>
            <Button asChild>
              <Link href="/categories/all">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 