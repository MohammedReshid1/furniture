"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Truck, ChevronRight, Home, Building, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/app/contexts/CartContext"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/app/contexts/ToastContext"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"

type Address = {
  _id: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

type PaymentMethod = "credit_card" | "paypal"

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Shipping cost and calculation
  const shippingCost = cartTotal > 500 ? 0 : 50
  const totalWithShipping = cartTotal + shippingCost
  
  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout")
      return
    }
    
    if (cartItems.length === 0) {
      router.push("/cart")
      return
    }
    
    // Simulate loading addresses from API
    const timer = setTimeout(() => {
      // Demo addresses
      const demoAddresses: Address[] = [
        {
          _id: "addr1",
          addressLine1: "123 Main St",
          addressLine2: "Apt 4B",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "United States",
          isDefault: true
        },
        {
          _id: "addr2",
          addressLine1: "456 Park Ave",
          city: "Los Angeles",
          state: "CA",
          postalCode: "90001",
          country: "United States",
          isDefault: false
        }
      ]
      
      setAddresses(demoAddresses)
      
      // Select default address if available
      const defaultAddress = demoAddresses.find(addr => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id)
      } else if (demoAddresses.length > 0) {
        setSelectedAddressId(demoAddresses[0]._id)
      }
      
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, cartItems.length, router])
  
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast({
        title: "Address required",
        description: "Please select a shipping address to continue",
        type: "error"
      })
      return
    }
    
    setIsProcessing(true)
    
    try {
      // In a real app, this would be an API call to create the order
      // For demo purposes, we'll simulate a successful order after a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart after successful order
      clearCart()
      
      showToast({
        title: "Order placed successfully",
        description: "Your order has been placed and will be shipped soon",
        type: "success"
      })
      
      // Redirect to order confirmation page
      router.push("/checkout/confirmation")
    } catch (error) {
      console.error("Error placing order:", error)
      showToast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        type: "error"
      })
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Shipping Address</h2>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Payment Method</h2>
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Order Summary</h2>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="border-t border-border my-4"></div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/cart" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold ml-4 text-foreground">Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground flex items-center">
              <Truck className="mr-2 h-5 w-5 text-primary" />
              Shipping Address
            </h2>
            
            <div className="space-y-4">
              {addresses.map(address => (
                <div 
                  key={address._id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddressId === address._id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedAddressId(address._id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {address.addressLine2 ? (
                        <Building className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Home className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium text-card-foreground">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        {address.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {address.country}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/account/addresses?redirect=/checkout">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Address
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              Payment Method
            </h2>
            
            <div className="space-y-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === "credit_card" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                    {paymentMethod === "credit_card" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-card-foreground">Credit Card</p>
                    <p className="text-muted-foreground text-sm">Pay with your credit or debit card</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === "paypal" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                    {paymentMethod === "paypal" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-card-foreground">PayPal</p>
                    <p className="text-muted-foreground text-sm">Pay with your PayPal account</p>
                  </div>
                </div>
              </div>
              
              {paymentMethod === "credit_card" && (
                <div className="mt-4 p-4 border border-border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    For demo purposes, no actual payment will be processed.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Card Number
                      </label>
                      <input 
                        type="text" 
                        placeholder="4242 4242 4242 4242" 
                        className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Expiration Date
                        </label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                          disabled={isProcessing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          CVC
                        </label>
                        <input 
                          type="text" 
                          placeholder="123" 
                          className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Order Summary</h2>
            
            <div className="space-y-4 mb-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <div className="flex-grow">
                    <span className="text-card-foreground">
                      {item.quantity} × {item.product.name}
                    </span>
                    {item.color && (
                      <span className="text-muted-foreground ml-1">
                        ({item.color})
                      </span>
                    )}
                  </div>
                  <span className="text-card-foreground font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-card-foreground">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-card-foreground">
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-card-foreground">Calculated at next step</span>
              </div>
            </div>
            
            <div className="border-t border-border my-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span className="text-card-foreground">Total</span>
                <span className="text-card-foreground">${totalWithShipping.toFixed(2)}</span>
              </div>
            </div>
            
            <Button
              className="w-full mt-4"
              disabled={!selectedAddressId || isProcessing}
              onClick={handlePlaceOrder}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Place Order
                  <ChevronRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4 text-center">
              By placing your order, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

