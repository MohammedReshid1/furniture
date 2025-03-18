"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Home, Plus, Pencil, Trash, Building, Check } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useToast } from "@/app/contexts/ToastContext"

interface Address {
  _id: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login?redirect=/account/addresses")
      return
    }
    
    // Simulate fetching addresses
    const fetchAddresses = async () => {
      try {
        // This is where you would normally fetch from your API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data for demonstration
        const mockAddresses: Address[] = [
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
        
        setAddresses(mockAddresses)
      } catch (error) {
        console.error("Error fetching addresses:", error)
        showToast({
          title: "Error",
          description: "Failed to load your addresses. Please try again later.",
          type: "error"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAddresses()
  }, [isAuthenticated, router, showToast])
  
  const handleSetDefault = (addressId: string) => {
    // Update addresses with new default
    const updatedAddresses = addresses.map(address => ({
      ...address,
      isDefault: address._id === addressId
    }))
    
    setAddresses(updatedAddresses)
    
    showToast({
      title: "Default Address Updated",
      description: "Your default shipping address has been updated",
      type: "success"
    })
  }
  
  const handleDeleteAddress = (addressId: string) => {
    // Filter out the deleted address
    const updatedAddresses = addresses.filter(address => address._id !== addressId)
    
    setAddresses(updatedAddresses)
    setShowDeleteConfirm(null)
    
    showToast({
      title: "Address Deleted",
      description: "The address has been removed from your account",
      type: "success"
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
          <h1 className="text-3xl font-bold text-foreground">My Addresses</h1>
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <p className="text-muted-foreground">
            Manage your shipping addresses for faster checkout
          </p>
          <Button asChild>
            <Link href="/account/addresses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Skeleton className="h-10 w-24 mr-2" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div 
                key={address._id} 
                className={`bg-card rounded-lg border ${
                  address.isDefault ? 'border-primary/50' : 'border-border'
                } p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {address.addressLine2 ? (
                        <Building className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Home className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-card-foreground">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </h3>
                        {address.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-muted-foreground">
                        {address.country}
                      </p>
                    </div>
                  </div>
                  
                  {/* Show delete confirmation or actions */}
                  {showDeleteConfirm === address._id ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground mr-2">Delete this address?</span>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        Yes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        No
                      </Button>
                    </div>
                  ) : null}
                </div>
                
                <div className="border-t border-border pt-4 flex justify-end space-x-2">
                  {!address.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSetDefault(address._id)}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Set as Default
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                  >
                    <Link href={`/account/addresses/${address._id}`}>
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  
                  {!showDeleteConfirm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(address._id)}
                      className="text-destructive border-destructive/20 hover:bg-destructive/10"
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="flex justify-center mb-4">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-card-foreground mb-2">No addresses yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't added any addresses yet. Add an address to make checkout faster.
            </p>
            <Button asChild>
              <Link href="/account/addresses/new">Add Your First Address</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 