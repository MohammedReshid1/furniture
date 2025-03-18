"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Label } from "@/app/components/ui/label"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Switch } from "@/app/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Separator } from "@/app/components/ui/separator"
import { Loader2, Save } from "lucide-react"
import { Textarea } from "@/app/components/ui/textarea"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSave = () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1500)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" defaultValue="Modern Furniture" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-url">Store URL</Label>
                  <Input id="store-url" defaultValue="modernfurniture.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Contact Email</Label>
                  <Input id="store-email" defaultValue="support@modernfurniture.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Contact Phone</Label>
                  <Input id="store-phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea id="store-description" rows={3} defaultValue="Modern Furniture offers high-quality, contemporary furniture for homes and offices. Our curated collections blend style, comfort, and functionality for today's living spaces." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Currency & Regional Settings</CardTitle>
              <CardDescription>
                Configure how prices and regional information are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="cst">Central Time (CT)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="tax-inclusive" defaultChecked={true} />
                <Label htmlFor="tax-inclusive">Display prices including tax</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
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
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground">
                      <span className="sr-only">Blue theme</span>
                    </div>
                    <p className="text-xs text-center">Blue</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-muted bg-[#10b981] text-white">
                      <span className="sr-only">Green theme</span>
                    </div>
                    <p className="text-xs text-center">Green</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-muted bg-[#8b5cf6] text-white">
                      <span className="sr-only">Purple theme</span>
                    </div>
                    <p className="text-xs text-center">Purple</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-muted bg-[#f43f5e] text-white">
                      <span className="sr-only">Red theme</span>
                    </div>
                    <p className="text-xs text-center">Red</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Dark Mode</Label>
                <div className="flex items-center space-x-4">
                  <div className="space-x-2">
                    <Switch id="dark-mode" />
                    <Label htmlFor="dark-mode">Enable dark mode toggle for customers</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md border border-border flex items-center justify-center bg-secondary">
                    <span className="text-sm text-muted-foreground">Logo</span>
                  </div>
                  <Input id="logo-upload" type="file" />
                </div>
                <p className="text-sm text-muted-foreground">Recommended size: 200x50px, PNG or SVG format</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
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
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which email notifications are sent and to whom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">New Order Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive an email when a new order is placed</p>
                  </div>
                  <Switch id="order-notifications" defaultChecked={true} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Inventory Alerts</h3>
                    <p className="text-sm text-muted-foreground">Receive alerts when products are low in stock</p>
                  </div>
                  <Switch id="inventory-alerts" defaultChecked={true} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Customer Account Creations</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications when new customers register</p>
                  </div>
                  <Switch id="customer-notifications" defaultChecked={false} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Product Reviews</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications for new product reviews</p>
                  </div>
                  <Switch id="review-notifications" defaultChecked={true} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
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
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage API keys and third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex">
                  <Input 
                    id="api-key" 
                    value="sk_live_3xGM8gEXAMPLEkey389ksjdf" 
                    readOnly 
                    className="rounded-r-none" 
                  />
                  <Button variant="outline" className="rounded-l-none border-l-0">
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Use this key to authenticate API requests to your store</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Button variant="ghost" size="sm" className="h-7 px-3 text-xs">
                    Generate New Key
                  </Button>
                </div>
                <Input id="webhook-url" placeholder="https://your-app.com/webhook" />
                <p className="text-sm text-muted-foreground">URL to receive webhook notifications about store events</p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Third-Party Integrations</h3>
                
                <div className="rounded-md border border-border">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                        <span className="font-medium text-blue-600">P</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Payment Processor</h4>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-md bg-yellow-100 flex items-center justify-center">
                        <span className="font-medium text-yellow-600">S</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Shipping Provider</h4>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                        <span className="font-medium text-green-600">A</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Analytics Service</h4>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Destructive actions for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium text-destructive">Reset Store Data</h3>
                  <p className="text-sm text-destructive/90">This will remove all products, orders, and customer data from your store. This action cannot be undone.</p>
                  <div className="mt-2">
                    <Button variant="destructive" size="sm">
                      Reset Store Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 