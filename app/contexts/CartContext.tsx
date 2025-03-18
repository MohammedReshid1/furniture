"use client"

import { createContext, useState, useContext, useEffect } from "react"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  images: string[]
  inStock: number
  category: string
}

interface CartItem {
  _id: string
  product: Product
  quantity: number
  color?: string
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product, quantity: number, color?: string) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Update localStorage and cart metrics when cartItems changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
    
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(count)
    
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    setCartTotal(total)
  }, [cartItems])

  const addToCart = (product: Product, quantity: number, color?: string) => {
    setCartItems(prev => {
      // Check if product is already in cart (with same color if specified)
      const existingItemIndex = prev.findIndex(item => 
        item.product._id === product._id && 
        (!color || item.color === color)
      )
      
      if (existingItemIndex >= 0) {
        // If already in cart, update the quantity
        const updatedItems = [...prev]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // If not in cart, add new item
        return [...prev, {
          _id: `${product._id}_${Date.now()}`,
          product,
          quantity,
          color
        }]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return
    
    setCartItems(prev => 
      prev.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        cartTotal, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

