"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/app/components/ui/table"
import { Skeleton } from "@/app/components/ui/skeleton"
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis,
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/app/components/ui/pagination"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/app/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/app/components/ui/select"
import { Badge } from "@/app/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { useToast } from "@/app/contexts/ToastContext"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: "active" | "inactive" | "draft"
  image: string
}

// Mock products data
const mockProducts: Product[] = [
  { 
    id: "prod_1", 
    name: "Modern Sofa", 
    category: "Living Room", 
    price: 899.99, 
    stock: 15, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_2", 
    name: "Coffee Table", 
    category: "Living Room", 
    price: 299.99, 
    stock: 24, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_3", 
    name: "Leather Sofa", 
    category: "Living Room", 
    price: 999.99, 
    stock: 8, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_4", 
    name: "Bookshelf", 
    category: "Living Room", 
    price: 349.99, 
    stock: 12, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1588279102906-e65676a34760?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_5", 
    name: "Dresser", 
    category: "Bedroom", 
    price: 499.99, 
    stock: 10, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1551375560-93c1a50b8d49?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_6", 
    name: "Nightstand", 
    category: "Bedroom", 
    price: 149.99, 
    stock: 18, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_7", 
    name: "Executive Desk", 
    category: "Office", 
    price: 749.99, 
    stock: 5, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_8", 
    name: "Office Chair", 
    category: "Office", 
    price: 299.99, 
    stock: 14, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1505657121987-19365bca6e16?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_9", 
    name: "Floor Lamp", 
    category: "Lighting", 
    price: 129.99, 
    stock: 22, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_10", 
    name: "Dining Table", 
    category: "Dining Room", 
    price: 849.99, 
    stock: 7, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_11", 
    name: "Dining Chairs (Set of 4)", 
    category: "Dining Room", 
    price: 599.99, 
    stock: 9, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_12", 
    name: "Kitchen Island", 
    category: "Kitchen", 
    price: 799.99, 
    stock: 3, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_13", 
    name: "Outdoor Patio Set", 
    category: "Outdoor", 
    price: 1299.99, 
    stock: 0, 
    status: "inactive", 
    image: "https://images.unsplash.com/photo-1533377088493-77d9ddfe67ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_14", 
    name: "Decorative Pillows Set", 
    category: "Accessories", 
    price: 49.99, 
    stock: 35, 
    status: "active", 
    image: "https://images.unsplash.com/photo-1584013482381-b54c28cedb88?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  },
  { 
    id: "prod_15", 
    name: "Wall Art Collection", 
    category: "Accessories", 
    price: 199.99, 
    stock: 7, 
    status: "draft", 
    image: "https://images.unsplash.com/photo-1605883705077-8d3d375fede2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  }
];

const filters = [
  { value: "all", label: "All Products" },
  { value: "active", label: "Active Products" },
  { value: "inactive", label: "Inactive Products" },
  { value: "draft", label: "Draft Products" },
  { value: "low-stock", label: "Low Stock (<5)" },
  { value: "out-of-stock", label: "Out of Stock" },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Living Room", label: "Living Room" },
  { value: "Bedroom", label: "Bedroom" },
  { value: "Dining Room", label: "Dining Room" },
  { value: "Office", label: "Office" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Outdoor", label: "Outdoor" },
  { value: "Lighting", label: "Lighting" },
  { value: "Accessories", label: "Accessories" },
];

export default function ProductsPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsPerPage = 10;

  useEffect(() => {
    // Simulate loading products from an API
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter products based on search, status filter, and category
  const filteredProducts = products.filter(product => {
    // Apply search query filter
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    let matchesFilter = true;
    if (currentFilter === "active") matchesFilter = product.status === "active";
    else if (currentFilter === "inactive") matchesFilter = product.status === "inactive";
    else if (currentFilter === "draft") matchesFilter = product.status === "draft";
    else if (currentFilter === "low-stock") matchesFilter = product.stock > 0 && product.stock < 5;
    else if (currentFilter === "out-of-stock") matchesFilter = product.stock === 0;
    
    // Apply category filter
    const matchesCategory = currentCategory === "all" || product.category === currentCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const confirmDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      // In a real app, this would be an API call
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      showToast({
        title: "Product Deleted",
        description: `${selectedProduct.name} has been deleted successfully.`,
        type: "success"
      });
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleStatusChange = (product: Product, newStatus: "active" | "inactive" | "draft") => {
    // In a real app, this would be an API call
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    showToast({
      title: "Status Updated",
      description: `${product.name} is now ${newStatus}.`,
      type: "success"
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Skeleton className="h-10 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <div className="grid grid-cols-12 p-4 border-b">
                <Skeleton className="col-span-4 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-2 h-4" />
              </div>
              
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="grid grid-cols-12 p-4 border-b">
                  <div className="col-span-4 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pt-6 px-6 pb-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Select 
                value={currentFilter} 
                onValueChange={(value) => {
                  setCurrentFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  {filters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={currentCategory} 
                onValueChange={(value) => {
                  setCurrentCategory(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No products found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted relative overflow-hidden">
                            {product.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={product.stock === 0 ? "text-destructive" : (product.stock < 5 ? "text-orange-500" : "")}>
                          {product.stock} {product.stock === 1 ? "unit" : "units"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          product.status === "active" ? "default" : 
                          product.status === "draft" ? "outline" : "secondary"
                        }>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <a href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View Product
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/admin/products/edit/${product.id}`} className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                              </a>
                            </DropdownMenuItem>
                            {product.status !== "active" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(product, "active")}>
                                <span className="flex items-center text-green-500">
                                  Activate Product
                                </span>
                              </DropdownMenuItem>
                            )}
                            {product.status !== "inactive" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(product, "inactive")}>
                                <span className="flex items-center text-orange-500">
                                  Deactivate Product
                                </span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => confirmDeleteProduct(product)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, and pages around the current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Show ellipsis for skipped pages
                    if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          <div className="flex justify-between items-center p-4 text-sm text-muted-foreground">
            <div>
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div>
              {products.length} total products
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 