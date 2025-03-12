"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OrderConfirmationPage() {
  const router = useRouter()

  useEffect(() => {
    // If there's no order data, redirect to home
    // In a real app, you'd check for actual order data
    const hasOrderData = localStorage.getItem("lastOrder")
    if (!hasOrderData) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
        <p className="font-bold">Thank you for your order!</p>
        <p>Your order has been received and is being processed.</p>
      </div>
      <p className="mb-4">An email confirmation has been sent to your email address.</p>
      <p className="mb-8">Your order number is: #123456</p>
      <Link href="/" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Continue Shopping
      </Link>
    </div>
  )
}

