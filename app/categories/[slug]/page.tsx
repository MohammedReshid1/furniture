"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { GridIcon, ListIcon, FilterIcon, ShoppingCart } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useToast } from "@/app/contexts/ToastContext"
import { useCart } from "@/app/contexts/CartContext"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

interface CategoryParams {
  slug: string
}

interface CategoryPageProps {
  params: Promise<CategoryParams>
}

export default function CategoryPage({ params: paramsPromise }: CategoryPageProps) {
  // Properly unwrap the params with React.use()
  const params = React.use(paramsPromise);
  const categorySlug = params.slug;
  
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortOrder, setSortOrder] = useState('default')
  const { showToast } = useToast()
  const { addToCart: addProductToCart } = useCart()
  
  const formatCategoryName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  const categoryName = formatCategoryName(categorySlug)
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - in a real app this would be fetched from the API
        const mockProducts: Product[] = [
          {
            id: "prod_1",
            name: "Modern Sofa",
            price: 899.99,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "living-room",
            description: "Comfortable modern sofa with durable fabric upholstery."
          },
          {
            id: "prod_2",
            name: "Leather Armchair",
            price: 499.99,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "living-room",
            description: "Premium leather armchair with ergonomic design."
          },
          {
            id: "prod_3",
            name: "Coffee Table",
            price: 299.99,
            image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "living-room",
            description: "Elegant coffee table with tempered glass top."
          },
          {
            id: "prod_4",
            name: "Queen Bed Frame",
            price: 799.99,
            image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "bedroom",
            description: "Sturdy queen bed frame with upholstered headboard."
          },
          {
            id: "prod_5",
            name: "Dresser",
            price: 599.99,
            image: "https://images.unsplash.com/photo-1594131431720-7e238c45c9c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "bedroom",
            description: "Six-drawer dresser with ample storage space."
          },
          {
            id: "prod_6",
            name: "Nightstand",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1591781914058-2533ee0345fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "bedroom",
            description: "Compact nightstand with drawer and open shelf."
          },
          {
            id: "prod_7",
            name: "Executive Desk",
            price: 699.99,
            image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "office",
            description: "Spacious executive desk with built-in storage."
          },
          {
            id: "prod_8",
            name: "Office Chair",
            price: 349.99,
            image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "office",
            description: "Ergonomic office chair with adjustable features."
          },
          {
            id: "prod_9",
            name: "Bookshelf",
            price: 249.99,
            image: "https://images.unsplash.com/photo-1588279102920-cf33f141b0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "office",
            description: "Modern bookshelf with five adjustable shelves."
          },
          {
            id: "prod_11",
            name: "Dining Table",
            price: 699.99,
            image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "dining-room",
            description: "Elegant dining table that seats six people comfortably."
          },
          {
            id: "prod_13",
            name: "Dining Chairs (Set of 4)",
            price: 499.99,
            image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "dining-room",
            description: "Set of four matching dining chairs with upholstered seats."
          },
          {
            id: "prod_14",
            name: "Kitchen Island",
            price: 649.99,
            image: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
            category: "kitchen",
            description: "Versatile kitchen island with butcher block top and storage."
          }
        ]
        
        // Filter products by category (if not 'all')
        const filtered = categorySlug === 'all' 
          ? mockProducts 
          : mockProducts.filter(product => product.category === categorySlug)
        
        // Sort the filtered products
        const sorted = sortProducts(filtered, sortOrder)
        
        setProducts(sorted)
      } catch (error) {
        console.error('Error fetching products:', error)
        showToast({
          title: 'Error',
          description: 'Failed to load products. Please try again later.',
          type: 'error'
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [categorySlug, sortOrder, showToast])
  
  const sortProducts = (products: Product[], sortOrder: string) => {
    let sortedProducts = [...products]
    
    switch (sortOrder) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        // Keep default order
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
      inStock: 10, // Default value since we don't have stock in this mock data
      category: product.category
    }
    
    // Add 1 quantity by default for quick add
    addProductToCart(cartProduct, 1)
    
    showToast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart`,
      type: 'success'
    })
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {categorySlug === 'all' ? 'All Products' : categoryName}
        </h1>
        <p className="text-muted-foreground">
          {isLoading ? (
            <div className="flex items-center">
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            `${products.length} products found`
          )}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {/* Sort options */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-background border border-input rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
        
        {/* View mode toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}
            aria-label="Grid view"
          >
            <GridIcon size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}
            aria-label="List view"
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>
      
      {isLoading ? (
        // Loading skeleton
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        // No products found
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Products Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find any products in this category.</p>
          <Button asChild>
            <Link href="/categories/all">View All Products</Link>
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid view
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md flex flex-col h-full">
              <Link href={`/products/${product.id}`} className="block relative h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform hover:scale-105"
                />
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/products/${product.id}`} className="block">
                  <h3 className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors mb-1 line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-primary font-medium mb-3">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{product.description}</p>
                <Button
                  onClick={() => handleQuickAddToCart(product)}
                  className="w-full mt-auto"
                  size="sm"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List view
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-card rounded-lg border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <Link href={`/products/${product.id}`} className="sm:w-1/4 h-48 sm:h-auto relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </Link>
                <div className="p-4 sm:w-3/4 flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors mb-1">{product.name}</h3>
                    </Link>
                    <p className="text-primary font-medium">${product.price.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{product.description}</p>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleQuickAddToCart(product)}
                      size="sm"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

