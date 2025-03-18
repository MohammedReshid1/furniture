"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { FilterIcon, Grid3X3, LayoutList, ShoppingCart, ChevronRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { useToast } from "@/app/contexts/ToastContext"
import { useCart } from "@/app/contexts/CartContext"
import { Skeleton } from "@/app/components/ui/skeleton"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

export default function AllProductsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | 'name-asc'>('name-asc')
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      
      try {
        // This would be an API call in a real application
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data for all products
        const mockProducts: Product[] = [
          {
            id: "prod_1",
            name: "Modern Sofa",
            price: 899.99,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "living-room",
            description: "A sleek modern sofa that adds elegance to any living room."
          },
          {
            id: "prod_2",
            name: "Leather Armchair",
            price: 499.99,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "living-room",
            description: "Premium leather armchair with durable construction and timeless style."
          },
          {
            id: "prod_3",
            name: "Coffee Table",
            price: 299.99,
            image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "living-room",
            description: "Stylish coffee table with ample surface area for entertaining."
          },
          {
            id: "prod_4",
            name: "Queen Bed Frame",
            price: 799.99,
            image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "bedroom",
            description: "Elegant queen-sized bed frame with solid wood construction."
          },
          {
            id: "prod_5",
            name: "Dresser",
            price: 599.99,
            image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "bedroom",
            description: "Spacious dresser with six drawers for ample storage."
          },
          {
            id: "prod_6",
            name: "Nightstand",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "bedroom",
            description: "Compact nightstand with drawer for bedside essentials."
          },
          {
            id: "prod_7",
            name: "Executive Desk",
            price: 699.99,
            image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "office",
            description: "Spacious executive desk with built-in cable management."
          },
          {
            id: "prod_8",
            name: "Office Chair",
            price: 349.99,
            image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "office",
            description: "Ergonomic office chair with lumbar support and adjustable height."
          },
          {
            id: "prod_9",
            name: "Bookshelf",
            price: 249.99,
            image: "https://images.unsplash.com/photo-1593085260707-5377ba37f868?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "office",
            description: "Multi-tier bookshelf for displaying books and decorative items."
          },
          {
            id: "prod_10",
            name: "Dining Table",
            price: 899.99,
            image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "kitchen",
            description: "Elegant dining table that comfortably seats six people."
          },
          {
            id: "prod_11",
            name: "Dining Chair",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "kitchen",
            description: "Comfortable dining chair with sturdy construction."
          },
          {
            id: "prod_12",
            name: "Kitchen Island",
            price: 649.99,
            image: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "kitchen",
            description: "Multi-functional kitchen island with storage and seating."
          }
        ]
        
        // Apply sorting
        const sortedProducts = sortProducts(mockProducts, sortOrder)
        setProducts(sortedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        showToast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          type: "error"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [sortOrder, showToast])
  
  const sortProducts = (products: Product[], sortOrder: string) => {
    let sortedProducts = [...products]
    
    switch (sortOrder) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }
    
    return sortedProducts
  }
  
  const handleQuickAddToCart = (product: Product) => {
    // Convert the product to match the format expected by CartContext
    const cartProduct = {
      _id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image],
      inStock: 10, // Assuming default stock
      category: product.category
    }
    
    // Add to cart with quantity 1
    addToCart(cartProduct, 1)
    
    showToast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
      type: "success"
    })
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">All Products</span>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">All Products</h1>
        
        {/* Category Quick Links */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { name: "All Products", slug: "all" },
            { name: "Living Room", slug: "living-room" },
            { name: "Bedroom", slug: "bedroom" },
            { name: "Office", slug: "office" },
            { name: "Kitchen", slug: "kitchen" }
          ].map((category) => (
            <Link 
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                category.slug === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card hover:bg-primary/10 text-card-foreground'
              } border border-border`}
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <>Showing {products.length} product{products.length !== 1 ? 's' : ''}</>
            )}
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex items-center rounded-md border border-border p-1 bg-background">
              <button
                className={`p-1 rounded-md ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 size={20} />
              </button>
              <button
                className={`p-1 rounded-md ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <LayoutList size={20} />
              </button>
            </div>
            
            <select
              className="rounded-md border border-border bg-background text-foreground p-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'price-asc' | 'price-desc' | 'name-asc')}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        // Loading skeleton
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        viewMode === 'grid' ? (
          // Grid view
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow"
              >
                <div className="relative h-48 overflow-hidden group">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-105"
                    priority={product.id === "prod_1" || product.id === "prod_2"}
                  />
                  <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 text-xs font-medium rounded-full bg-background/80 text-foreground backdrop-blur-sm capitalize">
                      {product.category.replace('-', ' ')}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-card-foreground hover:text-primary truncate">{product.name}</h3>
                  </Link>
                  <p className="text-lg font-medium text-primary mt-1 mb-4">${product.price.toFixed(2)}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      className="w-full"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="sm:w-10 hidden sm:flex"
                      onClick={() => handleQuickAddToCart(product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex flex-col sm:flex-row bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow"
              >
                <div className="relative h-48 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                    className="object-cover transition-transform hover:scale-105"
                    priority={product.id === "prod_1" || product.id === "prod_2"}
                  />
                  <div className="absolute top-2 right-2 sm:left-2 sm:right-auto">
                    <div className="px-2 py-1 text-xs font-medium rounded-full bg-background/80 text-foreground backdrop-blur-sm capitalize">
                      {product.category.replace('-', ' ')}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg text-card-foreground hover:text-primary">{product.name}</h3>
                    </Link>
                    <p className="text-xl font-medium text-primary mt-1 mb-2">${product.price.toFixed(2)}</p>
                    <p className="text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                    <Button 
                      className="w-full sm:w-auto"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => handleQuickAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
} 