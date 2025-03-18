"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react"
import { useCart } from "@/app/contexts/CartContext"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/app/contexts/ToastContext"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const { showToast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    updateQuantity(itemId, newQuantity)
    showToast({
      title: "Cart updated",
      description: "Item quantity has been updated",
      type: "success"
    })
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
    showToast({
      title: "Item removed",
      description: "Item has been removed from your cart",
      type: "success"
    })
  }

  const handleCheckout = () => {
    if (!user) {
      showToast({
        title: "Login required",
        description: "Please login to continue with checkout",
        type: "warning"
      })
      router.push("/login?redirect=/checkout")
      return
    }
    
    router.push("/checkout")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex p-4 rounded-lg border border-border bg-card">
                <div className="w-24 h-24 relative rounded overflow-hidden mr-4">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-6 bg-card h-fit">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="border-t border-border my-4 pt-4">
                <div className="flex justify-between font-semibold">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Your Cart</h1>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-card-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/categories/all">
            <Button>
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item._id} 
              className="flex flex-col sm:flex-row p-4 rounded-lg border border-border bg-card"
            >
              <div className="w-full sm:w-24 h-24 relative rounded overflow-hidden mb-4 sm:mb-0 sm:mr-4">
                <Image
                  src={Array.isArray(item.product.images) ? item.product.images[0] : item.product.images}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <Link 
                    href={`/products/${item.product._id}`}
                    className="text-lg font-medium hover:underline text-card-foreground"
                  >
                    {item.product.name}
                  </Link>
                  {item.color && (
                    <p className="text-sm text-muted-foreground">
                      Color: {item.color}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center border border-border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none rounded-l-md"
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-12 text-center text-sm">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none rounded-r-md"
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-card-foreground">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border p-6 bg-card h-fit">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-card-foreground">Calculated at checkout</span>
            </div>
            <div className="border-t border-border my-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span className="text-card-foreground">Estimated Total</span>
                <span className="text-card-foreground">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Button 
            className="w-full mb-2 flex items-center justify-center"
            onClick={handleCheckout}
          >
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              clearCart()
              showToast({
                title: "Cart cleared",
                description: "All items have been removed from your cart",
                type: "success"
              })
            }}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

function ShoppingCart(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

