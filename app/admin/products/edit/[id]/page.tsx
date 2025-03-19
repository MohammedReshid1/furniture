"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ArrowLeft, Save, Loader2, Trash2, ImagePlus } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Separator } from "@/app/components/ui/separator"
import { Switch } from "@/app/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useToast } from "@/app/contexts/ToastContext"
import { Textarea } from "@/app/components/ui/textarea"
import Image from "next/image"

export default function ProductEditPage() {
  const params = useParams()
  const productId = params.id as string
  const router = useRouter()
  const { showToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  
  // Define the ProductData type
  type ProductData = {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice: null | number;
    category: string;
    status: string;
    stock: number;
    images: Array<{
      id: string;
      url: string;
      isMain: boolean;
    }>;
    tags: string[];
    dimensions: {
      width: number;
      depth: number;
      height: number;
    };
    weight: number;
    features: string[];
    options: {
      hasColors: boolean;
      colors: string[];
      selectedColor: string;
    };
    metadata: {
      sku: string;
      barcode: string;
      vendor: string;
    };
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  }
  
  // In a real app, you would fetch the product data from an API
  const [productData, setProductData] = useState<ProductData>({
    id: productId,
    name: "Modern Sofa",
    description: "A stylish and comfortable sofa perfect for modern living rooms.",
    price: 899.99,
    salePrice: null,
    category: "Living Room",
    status: "active",
    stock: 15,
    images: [
      {
        id: "img_1",
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
        isMain: true
      }
    ],
    tags: ["sofa", "furniture", "living room"],
    dimensions: {
      width: 78,
      depth: 36,
      height: 32
    },
    weight: 120,
    features: [
      "Premium quality fabric",
      "Stain resistant",
      "Removable cushion covers",
      "Solid wood frame"
    ],
    options: {
      hasColors: true,
      colors: ["gray", "beige", "blue"],
      selectedColor: "gray"
    },
    metadata: {
      sku: "SOF-MOD-001",
      barcode: "8901234567890",
      vendor: "Furniture Haven"
    },
    seo: {
      title: "Modern Sofa | Furniture Haven",
      description: "A stylish and comfortable sofa perfect for modern living rooms.",
      keywords: "sofa, modern sofa, living room furniture"
    }
  })
  
  const handleSave = () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      
      showToast({
        title: "Product Updated",
        description: "Product information has been successfully updated.",
        type: "success"
      })
      
      // Optionally redirect back to product list
      router.push("/admin/products")
    }, 1500)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value === "" ? "" : parseFloat(value) }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({ ...prev, [name]: value }))
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
      </div>
      
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the core product details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={productData.name} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={productData.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Living Room">Living Room</SelectItem>
                      <SelectItem value="Bedroom">Bedroom</SelectItem>
                      <SelectItem value="Dining Room">Dining Room</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Outdoor">Outdoor</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={5}
                  value={productData.description} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number"
                      className="pl-8" 
                      value={productData.price} 
                      onChange={handlePriceChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input 
                      id="salePrice" 
                      name="salePrice" 
                      type="number"
                      className="pl-8" 
                      value={productData.salePrice || ""} 
                      placeholder="No sale price"
                      onChange={handlePriceChange} 
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Product Status</Label>
                  <Select 
                    value={productData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status" className="w-40">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Manage product images and gallery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productData.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-md border border-border overflow-hidden ${
                      image.isMain ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  >
                    <div className="relative aspect-square">
                      <Image 
                        src={image.url} 
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {image.isMain && (
                        <div className="bg-primary text-primary-foreground text-xs rounded px-2 py-1">
                          Main
                        </div>
                      )}
                      <Button variant="destructive" size="icon" className="h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="relative aspect-square rounded-md border border-dashed border-border flex flex-col items-center justify-center">
                  <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload image</p>
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Manage product inventory and stock levels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input 
                    id="sku" 
                    value={productData.metadata.sku} 
                    onChange={(e) => setProductData(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        sku: e.target.value
                      }
                    }))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input 
                    id="barcode" 
                    value={productData.metadata.barcode} 
                    onChange={(e) => setProductData(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        barcode: e.target.value
                      }
                    }))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input 
                    id="stock" 
                    name="stock"
                    type="number" 
                    value={productData.stock} 
                    onChange={(e) => setProductData(prev => ({
                      ...prev,
                      stock: parseInt(e.target.value)
                    }))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input 
                    id="vendor" 
                    value={productData.metadata.vendor} 
                    onChange={(e) => setProductData(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        vendor: e.target.value
                      }
                    }))} 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="track-inventory"
                  checked={true}
                />
                <Label htmlFor="track-inventory">Track inventory</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="continue-selling"
                  checked={false}
                />
                <Label htmlFor="continue-selling">Continue selling when out of stock</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="attributes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Attributes</CardTitle>
              <CardDescription>Manage product specifications and attributes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (inches)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-sm text-muted-foreground">Width</Label>
                    <Input 
                      id="width" 
                      type="number" 
                      value={productData.dimensions.width}
                      onChange={(e) => setProductData(prev => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          width: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depth" className="text-sm text-muted-foreground">Depth</Label>
                    <Input 
                      id="depth" 
                      type="number" 
                      value={productData.dimensions.depth}
                      onChange={(e) => setProductData(prev => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          depth: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm text-muted-foreground">Height</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      value={productData.dimensions.height}
                      onChange={(e) => setProductData(prev => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          height: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  value={productData.weight}
                  onChange={(e) => setProductData(prev => ({
                    ...prev,
                    weight: parseInt(e.target.value)
                  }))}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="features">Product Features</Label>
                <div className="space-y-2">
                  {productData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...productData.features]
                          newFeatures[index] = e.target.value
                          setProductData(prev => ({...prev, features: newFeatures}))
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          const newFeatures = productData.features.filter((_, i) => i !== index)
                          setProductData(prev => ({...prev, features: newFeatures}))
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setProductData(prev => ({
                        ...prev, 
                        features: [...prev.features, ""]
                      }))
                    }}
                  >
                    Add Feature
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="has-colors">Product Colors</Label>
                  <Switch
                    id="has-colors"
                    checked={productData.options.hasColors}
                    onCheckedChange={(checked) => setProductData(prev => ({
                      ...prev,
                      options: {
                        ...prev.options,
                        hasColors: checked
                      }
                    }))}
                  />
                </div>
                
                {productData.options.hasColors && (
                  <div className="mt-4 space-y-2">
                    {productData.options.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                        <Input 
                          value={color}
                          onChange={(e) => {
                            const newColors = [...productData.options.colors]
                            newColors[index] = e.target.value
                            setProductData(prev => ({
                              ...prev, 
                              options: {
                                ...prev.options,
                                colors: newColors
                              }
                            }))
                          }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            const newColors = productData.options.colors.filter((_, i) => i !== index)
                            setProductData(prev => ({
                              ...prev, 
                              options: {
                                ...prev.options,
                                colors: newColors
                              }
                            }))
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setProductData(prev => ({
                          ...prev, 
                          options: {
                            ...prev.options,
                            colors: [...prev.options.colors, "black"]
                          }
                        }))
                      }}
                    >
                      Add Color
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
              <CardDescription>Optimize your product for search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">Page Title</Label>
                <Input 
                  id="seo-title" 
                  value={productData.seo.title}
                  onChange={(e) => setProductData(prev => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      title: e.target.value
                    }
                  }))}
                />
                <p className="text-xs text-muted-foreground">Recommended length: 50-60 characters</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea 
                  id="seo-description" 
                  rows={3}
                  value={productData.seo.description}
                  onChange={(e) => setProductData(prev => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      description: e.target.value
                    }
                  }))}
                />
                <p className="text-xs text-muted-foreground">Recommended length: 150-160 characters</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seo-keywords">Meta Keywords</Label>
                <Input 
                  id="seo-keywords" 
                  value={productData.seo.keywords}
                  onChange={(e) => setProductData(prev => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      keywords: e.target.value
                    }
                  }))}
                />
                <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="tags">Product Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {productData.tags.map((tag, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      <span>{tag}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                          const newTags = productData.tags.filter((_, i) => i !== index)
                          setProductData(prev => ({...prev, tags: newTags}))
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    id="new-tag"
                    placeholder="Add new tag"
                  />
                  <Button variant="outline">Add</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 