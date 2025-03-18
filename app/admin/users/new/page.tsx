"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Separator } from "@/app/components/ui/separator"
import { Switch } from "@/app/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useToast } from "@/app/contexts/ToastContext"

export default function NewUserPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  
  // Initial user data for a new user
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "customer",
    status: "active",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    preferences: {
      emailNotifications: true,
      orderUpdates: true,
      marketingEmails: false,
      twoFactorEnabled: false
    }
  })
  
  const handleSave = () => {
    setIsSaving(true)
    
    // Simulate API call to create user
    setTimeout(() => {
      setIsSaving(false)
      
      showToast({
        title: "User Created",
        description: "New user has been created successfully.",
        type: "success"
      })
      
      // Redirect back to user list
      router.push("/admin/users")
    }, 1500)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setUserData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked
      }
    }))
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Enter the user's personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={userData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="John Smith"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={userData.email} 
                    onChange={handleInputChange} 
                    placeholder="john.smith@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={userData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select 
                    value={userData.role} 
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <Select 
                  value={userData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Enter the user's address details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street" 
                  value={userData.address.street} 
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      street: e.target.value
                    }
                  }))}
                  placeholder="123 Main Street" 
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={userData.address.city} 
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        city: e.target.value
                      }
                    }))}
                    placeholder="San Francisco" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input 
                    id="state" 
                    value={userData.address.state} 
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        state: e.target.value
                      }
                    }))}
                    placeholder="CA" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Postal/ZIP Code</Label>
                  <Input 
                    id="zipCode" 
                    value={userData.address.zipCode} 
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        zipCode: e.target.value
                      }
                    }))}
                    placeholder="94105" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    value={userData.address.country} 
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        country: e.target.value
                      }
                    }))}
                    placeholder="United States" 
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Configure user preferences and settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">General Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about account activity and security
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={userData.preferences.emailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about order status changes
                    </p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={userData.preferences.orderUpdates}
                    onCheckedChange={(checked) => handleSwitchChange("orderUpdates", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and special offers
                    </p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={userData.preferences.marketingEmails}
                    onCheckedChange={(checked) => handleSwitchChange("marketingEmails", checked)}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Set password and authentication methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                        <span className="inline-flex h-5 items-center rounded-full border px-2 text-xs">
                          Recommended
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to the account
                      </p>
                    </div>
                    <Switch
                      id="twoFactorEnabled"
                      checked={userData.preferences.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSwitchChange("twoFactorEnabled", checked)}
                    />
                  </div>
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create User
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