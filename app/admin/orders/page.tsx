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
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  Printer, 
  Truck, 
  X, 
  Clock, 
  Check, 
  PackageCheck,
  CalendarIcon,
  Calendar
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/app/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/app/components/ui/dialog"
import { useToast } from "@/app/contexts/ToastContext"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar"
import Link from "next/link"

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: number
  paymentStatus: "paid" | "refunded" | "pending"
}

// Mock orders data
const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const statuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const paymentStatuses: Order["paymentStatus"][] = ["paid", "refunded", "pending"];
  
  const getRandomDateInRange = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
  };
  
  // Generate dates within the last 60 days
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 60);
  
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const paymentStatus = randomStatus === "cancelled" ? "refunded" : 
                        (randomStatus === "pending" ? (Math.random() > 0.5 ? "pending" : "paid") : "paid");
  
  return {
    id: `order_${i + 1}`,
    orderNumber: `ORD-${String(10000 + i + 1).slice(1)}`,
    customer: {
      name: [
        "John Smith", "Jane Doe", "Alex Johnson", "Maria Garcia", "Mohamed Ali",
        "Sarah Williams", "Robert Brown", "Emma Wilson", "Michael Davis", "Olivia Miller"
      ][Math.floor(Math.random() * 10)],
      email: [
        "john@example.com", "jane@example.com", "alex@example.com", "maria@example.com", 
        "mohamed@example.com", "sarah@example.com", "robert@example.com", "emma@example.com",
        "michael@example.com", "olivia@example.com"
      ][Math.floor(Math.random() * 10)]
    },
    date: getRandomDateInRange(start, end),
    total: Math.floor(Math.random() * 15000) / 100 + 50,
    status: randomStatus,
    items: Math.floor(Math.random() * 5) + 1,
    paymentStatus: paymentStatus
  };
});

// Sort orders by date (most recent first)
mockOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const statusFilters = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentStatusFilters = [
  { value: "all", label: "All Payments" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "refunded", label: "Refunded" },
];

export default function OrdersPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const ordersPerPage = 10;

  useEffect(() => {
    // Simulate loading orders from an API
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter orders based on search, status filter, and date
  const filteredOrders = orders.filter(order => {
    // Apply search query filter
    const matchesSearch = searchQuery === "" || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    // Apply payment status filter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    
    // Apply date filter
    let matchesDate = true;
    if (date?.from) {
      const orderDate = new Date(order.date);
      matchesDate = orderDate >= date.from;
      
      if (date.to) {
        const endDate = new Date(date.to);
        endDate.setHours(23, 59, 59, 999); // End of day
        matchesDate = matchesDate && orderDate <= endDate;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setDate(undefined);
    setCurrentPage(1);
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    // In a real app, this would be an API call
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    showToast({
      title: "Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
      type: "success"
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending": return { variant: "outline", text: "Pending", icon: <Clock className="h-3.5 w-3.5 mr-1" /> };
      case "processing": return { variant: "secondary", text: "Processing", icon: <PackageCheck className="h-3.5 w-3.5 mr-1" /> };
      case "shipped": return { variant: "default", text: "Shipped", icon: <Truck className="h-3.5 w-3.5 mr-1" /> };
      case "delivered": return { variant: "success", text: "Delivered", icon: <Check className="h-3.5 w-3.5 mr-1" /> };
      case "cancelled": return { variant: "destructive", text: "Cancelled", icon: <X className="h-3.5 w-3.5 mr-1" /> };
    }
  };

  const getPaymentBadgeVariant = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid": return { color: "text-green-500 bg-green-50", text: "Paid" };
      case "pending": return { color: "text-yellow-500 bg-yellow-50", text: "Pending" };
      case "refunded": return { color: "text-red-500 bg-red-50", text: "Refunded" };
    }
  };
  
  const getOrdersStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === "pending").length;
    const processing = orders.filter(o => o.status === "processing").length;
    const shipped = orders.filter(o => o.status === "shipped").length;
    const delivered = orders.filter(o => o.status === "delivered").length;
    const cancelled = orders.filter(o => o.status === "cancelled").length;
    
    return { total, pending, processing, shipped, delivered, cancelled };
  };
  
  const stats = getOrdersStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-12" />
              </CardContent>
            </Card>
          ))}
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
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-3 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-1 h-4" />
                <Skeleton className="col-span-2 h-4" />
              </div>
              
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="grid grid-cols-12 p-4 border-b">
                  <div className="col-span-2">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="col-span-3">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="col-span-1">
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="col-span-2 flex justify-end">
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
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shipped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pt-6 px-6 pb-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={paymentFilter} 
                onValueChange={(value) => {
                  setPaymentFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatusFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className="w-[260px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setCurrentPage(1);
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              
              {(searchQuery || statusFilter !== "all" || paymentFilter !== "all" || date) && (
                <Button 
                  variant="ghost" 
                  onClick={handleResetFilters}
                  className="h-10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No orders found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link href={`/admin/orders/${order.id}`} className="hover:text-primary">
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                      </TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === "shipped" || order.status === "delivered" ? "default" :
                            order.status === "processing" ? "secondary" :
                            order.status === "cancelled" ? "destructive" : "outline"
                          }
                          className="flex items-center w-fit"
                        >
                          {getStatusBadgeVariant(order.status).icon}
                          {getStatusBadgeVariant(order.status).text}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPaymentBadgeVariant(order.paymentStatus).color}`}>
                          {getPaymentBadgeVariant(order.paymentStatus).text}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${order.total.toFixed(2)}
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
                              <Link href={`/admin/orders/${order.id}`} className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            
                            {order.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "processing")}>
                                <PackageCheck className="mr-2 h-4 w-4" />
                                Mark as Processing
                              </DropdownMenuItem>
                            )}
                            
                            {order.status === "processing" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "shipped")}>
                                <Truck className="mr-2 h-4 w-4" />
                                Mark as Shipped
                              </DropdownMenuItem>
                            )}
                            
                            {order.status === "shipped" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "delivered")}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Delivered
                              </DropdownMenuItem>
                            )}
                            
                            {(order.status === "pending" || order.status === "processing") && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, "cancelled")}
                                className="text-destructive focus:text-destructive"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
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
                      href="#"
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
                            href="#"
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
                      href="#"
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
              Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div>
              {orders.length} total orders
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 