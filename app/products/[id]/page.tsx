"use client"

import { useState, useEffect } from "react"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Star, ChevronRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useToast } from "@/app/contexts/ToastContext"
import { useCart } from "@/app/contexts/CartContext"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  rating?: number
  reviews?: number
  stock: number
  relatedProducts: RelatedProduct[]
}

interface RelatedProduct {
  id: string
  name: string
  price: number
  image: string
}

interface ProductParams {
  id: string
}

interface ProductDetailPageProps {
  params: Promise<ProductParams>
}

// Mock product database
const MOCK_PRODUCTS = {
  "prod_1": {
    id: "prod_1",
    name: "Modern Sofa",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      This modern sofa is the perfect centerpiece for any contemporary living space. 
      Crafted with premium upholstery and a sturdy hardwood frame, this sofa offers both 
      style and durability. The clean lines and minimalist design complement a variety of decor styles, 
      while the plush cushions provide exceptional comfort for relaxation and entertaining.
      
      Features:
      - Premium upholstery
      - Hardwood frame for durability
      - High-density foam cushions for comfort
      - Stain-resistant coating
      - Available in multiple colors
      
      Dimensions:
      - Width: 84 inches
      - Depth: 38 inches
      - Height: 34 inches
      - Seat Height: 18 inches
    `,
    category: "living-room",
    rating: 4.7,
    reviews: 124,
    stock: 15,
    relatedProducts: [
      {
        id: "prod_2",
        name: "Leather Armchair",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_3",
        name: "Coffee Table",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_10",
        name: "Floor Lamp",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_12",
        name: "Decorative Pillows Set",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1584013482381-b54c28cedb88?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_2": {
    id: "prod_2",
    name: "Leather Armchair",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Indulge in the luxury of our premium leather armchair. This elegant piece combines timeless design with unmatched comfort, making it the perfect addition to any living room, study, or bedroom.
      
      Features:
      - Genuine top-grain leather upholstery
      - Kiln-dried hardwood frame
      - High-resilience foam cushions
      - Traditional rolled arms
      - Antique brass nailhead trim
      
      Dimensions:
      - Width: 35 inches
      - Depth: 38 inches
      - Height: 36 inches
      - Seat Height: 19 inches
    `,
    category: "living-room",
    rating: 4.8,
    reviews: 86,
    stock: 8,
    relatedProducts: [
      {
        id: "prod_1",
        name: "Modern Sofa",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_3",
        name: "Coffee Table",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_3": {
    id: "prod_3",
    name: "Coffee Table",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Elevate your living space with our contemporary coffee table. Featuring a sleek design and ample surface area, this table provides the perfect balance of form and function for your home.
      
      Features:
      - Tempered glass top
      - Solid wood base
      - Modern geometric design
      - Lower shelf for storage
      - Easy assembly
      
      Dimensions:
      - Length: 48 inches
      - Width: 24 inches
      - Height: 16 inches
    `,
    category: "living-room",
    rating: 4.5,
    reviews: 54,
    stock: 20,
    relatedProducts: [
      {
        id: "prod_1",
        name: "Modern Sofa",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_2",
        name: "Leather Armchair",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_4": {
    id: "prod_4",
    name: "Queen Bed Frame",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Transform your bedroom with our elegant queen bed frame. Crafted from solid wood with impeccable attention to detail, this bed frame will be the centerpiece of your bedroom for years to come.
      
      Features:
      - Solid oak construction
      - Traditional panel design
      - Box spring required
      - Includes headboard, footboard, and rails
      - Easy assembly
      
      Dimensions:
      - Length: 85 inches
      - Width: 64 inches
      - Height: 48 inches (headboard)
    `,
    category: "bedroom",
    rating: 4.9,
    reviews: 72,
    stock: 5,
    relatedProducts: [
      {
        id: "prod_5",
        name: "Dresser",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1594131431720-7e238c45c9c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_6",
        name: "Nightstand",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1591781914058-2533ee0345fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_5": {
    id: "prod_5",
    name: "Dresser",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1594131431720-7e238c45c9c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Complete your bedroom set with our spacious dresser. Featuring six drawers with smooth glides, this dresser offers ample storage for all your clothing and accessories.
      
      Features:
      - Solid wood construction
      - Six spacious drawers
      - Metal drawer pulls
      - Anti-tip safety hardware included
      - Pre-assembled drawers
      
      Dimensions:
      - Width: 60 inches
      - Depth: 18 inches
      - Height: 32 inches
    `,
    category: "bedroom",
    rating: 4.7,
    reviews: 45,
    stock: 8,
    relatedProducts: [
      {
        id: "prod_4",
        name: "Queen Bed Frame",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_6",
        name: "Nightstand",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1591781914058-2533ee0345fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_6": {
    id: "prod_6",
    name: "Nightstand",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1591781914058-2533ee0345fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      This elegant nightstand is the perfect bedside companion. With a spacious drawer and open shelf, it provides convenient storage for your nighttime essentials.
      
      Features:
      - Solid wood construction
      - One drawer with metal glides
      - Open shelf for display or additional storage
      - Antique brass hardware
      - Easy assembly
      
      Dimensions:
      - Width: 24 inches
      - Depth: 16 inches
      - Height: 26 inches
    `,
    category: "bedroom",
    rating: 4.6,
    reviews: 38,
    stock: 12,
    relatedProducts: [
      {
        id: "prod_4",
        name: "Queen Bed Frame",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_5",
        name: "Dresser",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1594131431720-7e238c45c9c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_7": {
    id: "prod_7",
    name: "Executive Desk",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Elevate your workspace with our premium executive desk. Designed for professionals, this desk offers a spacious work surface and ample storage to help you stay organized and productive.
      
      Features:
      - Solid hardwood construction
      - Three drawers including a file drawer
      - Wire management system
      - Scratch-resistant finish
      - Adjustable levelers
      
      Dimensions:
      - Width: 60 inches
      - Depth: 30 inches
      - Height: 30 inches
    `,
    category: "office",
    rating: 4.8,
    reviews: 62,
    stock: 4,
    relatedProducts: [
      {
        id: "prod_8",
        name: "Office Chair",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_9",
        name: "Bookshelf",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1588279102920-cf33f141b0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_8": {
    id: "prod_8",
    name: "Office Chair",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Experience ultimate comfort with our ergonomic office chair. Designed to support your body during long work hours, this chair features adjustable settings and breathable mesh for personalized comfort.
      
      Features:
      - Ergonomic design
      - Adjustable height, tilt, and armrests
      - Breathable mesh back
      - Lumbar support
      - 360° swivel
      - Durable nylon base with smooth-rolling casters
      
      Dimensions:
      - Width: 27 inches
      - Depth: 27 inches
      - Height: 38-42 inches (adjustable)
    `,
    category: "office",
    rating: 4.7,
    reviews: 92,
    stock: 15,
    relatedProducts: [
      {
        id: "prod_7",
        name: "Executive Desk",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_9",
        name: "Bookshelf",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1588279102920-cf33f141b0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_9": {
    id: "prod_9",
    name: "Bookshelf",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1588279102920-cf33f141b0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Showcase your book collection and decorative items with our modern bookshelf. With its sturdy construction and elegant design, this bookshelf combines functionality with style.
      
      Features:
      - 5 adjustable shelves
      - Engineered wood with natural finish
      - Metal frame accents
      - Anti-tip wall anchoring system
      - Simple assembly required
      
      Dimensions:
      - Width: 36 inches
      - Depth: 12 inches
      - Height: 72 inches
    `,
    category: "office",
    rating: 4.4,
    reviews: 38,
    stock: 12,
    relatedProducts: [
      {
        id: "prod_7",
        name: "Executive Desk",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_8",
        name: "Office Chair",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_10": {
    id: "prod_10",
    name: "Floor Lamp",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Illuminate your living space with our stylish floor lamp. The adjustable design allows you to direct light where you need it, while the modern aesthetic complements a variety of interior styles.
      
      Features:
      - Adjustable arm and head
      - Brushed brass finish
      - Fabric drum shade
      - Foot pedal switch
      - Uses 1 standard E26 bulb (not included)
      
      Dimensions:
      - Base Diameter: 10 inches
      - Height: 65 inches
      - Shade Diameter: 14 inches
    `,
    category: "lighting",
    rating: 4.3,
    reviews: 27,
    stock: 18,
    relatedProducts: [
      {
        id: "prod_1",
        name: "Modern Sofa",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_12",
        name: "Decorative Pillows Set",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1584013482381-b54c28cedb88?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_11": {
    id: "prod_11",
    name: "Dining Table",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Gather around our elegant dining table for memorable meals with family and friends. The timeless design features a solid wood top and sturdy base that will last for years to come.
      
      Features:
      - Solid oak tabletop
      - Strong metal base
      - Seats 6 people comfortably
      - Scratch-resistant finish
      - Easy assembly
      
      Dimensions:
      - Length: 72 inches
      - Width: 36 inches
      - Height: 30 inches
    `,
    category: "dining-room",
    rating: 4.8,
    reviews: 56,
    stock: 7,
    relatedProducts: [
      {
        id: "prod_13",
        name: "Dining Chairs (Set of 4)",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_14",
        name: "Kitchen Island",
        price: 649.99,
        image: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_12": {
    id: "prod_12",
    name: "Decorative Pillows Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1584013482381-b54c28cedb88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Add the perfect finishing touch to your sofa, bed, or chair with our set of decorative pillows. The mix of patterns and textures creates visual interest and enhances your home's decor.
      
      Features:
      - Set of 4 pillows in coordinating colors and patterns
      - Premium fabric covers with hidden zippers
      - Hypoallergenic polyester filling
      - Covers are removable and machine washable
      - Variety of sizes included
      
      Dimensions:
      - 2 x 18" x 18" square pillows
      - 1 x 12" x 20" lumbar pillow
      - 1 x 16" x 16" square pillow
    `,
    category: "home-decor",
    rating: 4.5,
    reviews: 89,
    stock: 25,
    relatedProducts: [
      {
        id: "prod_1",
        name: "Modern Sofa",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_10",
        name: "Floor Lamp",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_13": {
    id: "prod_13",
    name: "Dining Chairs (Set of 4)",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Complete your dining set with our comfortable and stylish dining chairs. The modern design features an ergonomic seat and supportive back that will keep your guests comfortable throughout any meal.
      
      Features:
      - Set of 4 matching chairs
      - Solid wood legs with protective floor pads
      - Upholstered in stain-resistant fabric
      - Padded seat for extended comfort
      - Simple assembly required
      
      Dimensions:
      - Width: 20 inches
      - Depth: 22 inches
      - Height: 34 inches
      - Seat Height: 18 inches
    `,
    category: "dining-room",
    rating: 4.6,
    reviews: 43,
    stock: 9,
    relatedProducts: [
      {
        id: "prod_11",
        name: "Dining Table",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_14",
        name: "Kitchen Island",
        price: 649.99,
        image: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  },
  "prod_14": {
    id: "prod_14",
    name: "Kitchen Island",
    price: 649.99,
    image: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
    description: `
      Add valuable counter space and storage to your kitchen with our versatile kitchen island. The durable butcher block top is perfect for food preparation, while the cabinets and drawers provide ample storage for kitchen essentials.
      
      Features:
      - Solid wood butcher block top
      - Two drawers and two cabinet doors
      - Adjustable interior shelf
      - Towel bar and spice rack
      - Locking casters for mobility or stability
      
      Dimensions:
      - Length: 40 inches
      - Width: 24 inches
      - Height: 36 inches
    `,
    category: "kitchen",
    rating: 4.9,
    reviews: 31,
    stock: 6,
    relatedProducts: [
      {
        id: "prod_11",
        name: "Dining Table",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        id: "prod_13",
        name: "Dining Chairs (Set of 4)",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  }
};

export default function ProductDetailPage({ params: paramsPromise }: ProductDetailPageProps) {
  // Properly unwrap the params with React.use()
  const params = React.use(paramsPromise);
  const productId = params.id;
  
  const { showToast } = useToast()
  const { addToCart: addProductToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [notFound, setNotFound] = useState(false)
  
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      setNotFound(false)
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Look up the product by ID
        const foundProduct = MOCK_PRODUCTS[productId as keyof typeof MOCK_PRODUCTS];
        
        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          // If we don't have this product in our mock database, set not found
          setNotFound(true)
          console.error(`Product with ID ${productId} not found`)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        showToast({
          title: "Error",
          description: "Failed to load product. Please try again later.",
          type: "error"
        })
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProduct()
  }, [productId, showToast])
  
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prevQuantity => prevQuantity + 1)
    }
  }
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1)
    }
  }
  
  const addToCart = () => {
    if (!product) return
    
    // Convert the product to match the format expected by CartContext
    const cartProduct = {
      _id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image],
      inStock: product.stock,
      category: product.category
    }
    
    // Call the addToCart function from the cart context
    addProductToCart(cartProduct, quantity)
    
    showToast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart`,
      type: "success"
    })
  }
  
  const isOutOfStock = product?.stock === 0
  
  // Function to render star rating
  const renderRating = (rating?: number) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating) 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating.toFixed(1)} ({product?.reviews ?? 0} reviews)
        </span>
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }
  
  if (notFound || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/categories/all">Browse All Products</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/categories/all" className="hover:text-foreground">All Products</Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          href={`/categories/${product.category}`} 
          className="hover:text-foreground capitalize"
        >
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate">{product.name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
          <p className="text-2xl font-medium text-primary mb-4">${product.price.toFixed(2)}</p>
          
          {/* Rating */}
          {renderRating(product.rating)}
          
          {/* Stock Status */}
          <div className="mt-4 mb-6">
            {isOutOfStock ? (
              <p className="text-red-500 font-medium">Out of Stock</p>
            ) : (
              <p className="text-green-600 font-medium">In Stock ({product.stock} available)</p>
            )}
          </div>
          
          {/* Description */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
          
          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="flex items-center mb-6">
              <span className="mr-4 text-foreground font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-md">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 text-foreground hover:text-primary disabled:text-muted-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 text-foreground hover:text-primary disabled:text-muted-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <Button
            className="w-full py-6 text-lg"
            disabled={isOutOfStock}
            onClick={addToCart}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
      
      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((relatedProduct) => (
              <Link 
                key={relatedProduct.id} 
                href={`/products/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-card-foreground group-hover:text-primary truncate">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-primary mt-1">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

