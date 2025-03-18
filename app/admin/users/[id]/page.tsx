"use client"

import React from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ArrowLeft, User, Clock, ShoppingBag, MapPin, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"

export default function UserDetailsPage() {
  const router = useRouter()
  
  // Mock user data
  const user = {
    id: "user_123",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "customer",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    joinedDate: "2023-06-15T10:30:00Z",
    lastLogin: "2023-12-10T18:45:22Z",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    },
    orders: [
      {
        id: "ord_789",
        date: "2023-11-05T14:20:15Z",
        total: 349.99,
        status: "delivered"
      },
      {
        id: "ord_456",
        date: "2023-09-22T09:15:30Z",
        total: 129.95,
        status: "delivered"
      },
      {
        id: "ord_123",
        date: "2023-07-10T16:42:10Z",
        total: 599.99,
        status: "delivered"
      }
    ],
    recentActivity: [
      {
        type: "login",
        date: "2023-12-10T18:45:22Z",
        details: "Logged in from Chrome on macOS"
      },
      {
        type: "order",
        date: "2023-11-05T14:20:15Z",
        details: "Placed order #789"
      },
      {
        type: "profile_update",
        date: "2023-10-15T11:12:45Z",
        details: "Updated shipping address"
      },
      {
        type: "login",
        date: "2023-09-30T08:25:10Z",
        details: "Logged in from Safari on iOS"
      }
    ]
  }
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleString(undefined, options)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        {/* User Profile Card */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                <p className="text-sm capitalize">{user.role}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <Badge variant={user.status === "active" ? "success" : "secondary"}>
                  {user.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <address className="not-italic">
                    {user.address.street}, {user.address.city}, {user.address.state} {user.address.zipCode}, {user.address.country}
                  </address>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Account Information</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Customer ID:</span>
                  <span className="font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Joined:</span>
                  <span>{formatDate(user.joinedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Login:</span>
                  <span>{formatDate(user.lastLogin)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href={`/admin/users/edit/${user.id}`}>
                  Edit User
                </a>
              </Button>
              <Button variant="destructive" size="sm" className="flex-1">
                Deactivate Account
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* User Details Tabs */}
        <div className="md:col-span-4">
          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Order History</CardTitle>
                  <CardDescription>
                    View all orders placed by this customer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.map(order => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div>
                            <h4 className="font-medium">Order #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                            <Badge className="mt-1" variant="outline">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      This customer hasn't placed any orders yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>
                    Recent actions and events from this user.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.recentActivity.map((activity, index) => (
                      <div key={index} className="flex gap-4 border-b pb-4 last:border-0">
                        <div className="mt-0.5 h-9 w-9 rounded-full border bg-muted flex items-center justify-center">
                          {activity.type === 'login' && <User className="h-5 w-5 text-muted-foreground" />}
                          {activity.type === 'order' && <ShoppingBag className="h-5 w-5 text-muted-foreground" />}
                          {activity.type === 'profile_update' && <User className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <h4 className="font-medium capitalize">{activity.type.replace('_', ' ')}</h4>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {formatDateTime(activity.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Customer Notes</CardTitle>
                  <CardDescription>
                    Internal notes about this customer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-4">
                    No notes have been added yet.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 