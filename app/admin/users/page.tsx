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
  Mail, 
  Lock, 
  UserPlus, 
  UserCog,
  ShieldAlert,
  ShoppingBag,
  Eye,
  Ban,
  Check,
  UserX
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/app/components/ui/dialog"
import { Checkbox } from "@/app/components/ui/checkbox"
import { useToast } from "@/app/contexts/ToastContext"
import Link from "next/link"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "customer" | "editor"
  status: "active" | "inactive" | "banned"
  joinedDate: string
  lastLogin: string | null
  ordersCount: number
  avatarUrl?: string
}

// Generate random mock users
const generateMockUsers = (count: number): User[] => {
  const roles: User["role"][] = ["admin", "customer", "editor"];
  const statuses: User["status"][] = ["active", "inactive", "banned"];
  
  const getRandom = <T extends any>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
  const getRandomDate = (startYear: number, endYear: number) => {
    const start = new Date(startYear, 0, 1).getTime();
    const end = new Date(endYear, 11, 31).getTime();
    return new Date(start + Math.random() * (end - start)).toISOString();
  };
  
  const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Mohammed", "Maria", "Robert", "Olivia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = getRandom(firstNames);
    const lastName = getRandom(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const role = getRandom(roles);
    
    // Make most users active customers
    const status = i < count * 0.8 ? "active" : getRandom(statuses);
    
    // Generate more recent join dates for admins and editors
    const joinYear = role === "customer" ? 2020 : 2022;
    const joinedDate = getRandomDate(joinYear, 2023);
    
    // Some users may not have logged in recently
    const lastLogin = Math.random() > 0.1 ? getRandomDate(2023, 2024) : null;
    
    return {
      id: `user_${i + 1}`,
      name,
      email,
      role,
      status,
      joinedDate,
      lastLogin,
      ordersCount: role === "customer" ? Math.floor(Math.random() * 20) : 0,
      // Use a consistent avatar for the demo
      avatarUrl: Math.random() > 0.3 ? `https://i.pravatar.cc/150?u=${email}` : undefined
    };
  });
};

// Generate 50 mock users
const mockUsers = generateMockUsers(50);

// Sort users by role importance (admins first, then editors, then customers)
mockUsers.sort((a, b) => {
  const roleOrder = { admin: 0, editor: 1, customer: 2 };
  return roleOrder[a.role] - roleOrder[b.role];
});

const roleFilters = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Administrators" },
  { value: "editor", label: "Editors" },
  { value: "customer", label: "Customers" },
];

const statusFilters = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "banned", label: "Banned" },
];

export default function UsersPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const usersPerPage = 10;

  useEffect(() => {
    // Simulate loading users from an API
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter users based on search, role filter, and status filter
  const filteredUsers = users.filter(user => {
    // Apply search query filter
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply role filter
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    // Apply status filter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSelectAllInPage = (isChecked: boolean) => {
    if (isChecked) {
      const currentPageUserIds = currentUsers.map(user => user.id);
      setSelectedUsers(prev => 
        [...new Set([...prev, ...currentPageUserIds])]
      );
    } else {
      const currentPageUserIds = new Set(currentUsers.map(user => user.id));
      setSelectedUsers(prev => 
        prev.filter(id => !currentPageUserIds.has(id))
      );
    }
  };

  const handleDeleteUsers = () => {
    // In a real app, this would be an API call to delete the users
    setUsers(users.filter(user => !selectedUsers.includes(user.id)));
    showToast({
      title: "Users Deleted",
      description: `Successfully deleted ${selectedUsers.length} users.`,
      type: "success"
    });
    setSelectedUsers([]);
    setIsDeleteDialogOpen(false);
  };

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    // In a real app, this would be an API call
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    showToast({
      title: "Status Updated",
      description: `User status changed to ${newStatus}.`,
      type: "success"
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getUserRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin": 
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-500">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "editor": 
        return (
          <Badge variant="secondary">
            <UserCog className="h-3 w-3 mr-1" />
            Editor
          </Badge>
        );
      case "customer": 
        return (
          <Badge variant="outline">
            <ShoppingBag className="h-3 w-3 mr-1" />
            Customer
          </Badge>
        );
    }
  };

  const getUserStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active": 
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            <span>Active</span>
          </div>
        );
      case "inactive": 
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-gray-400 mr-2" />
            <span>Inactive</span>
          </div>
        );
      case "banned": 
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
            <span>Banned</span>
          </div>
        );
    }
  };

  // Calculate user statistics
  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === "active").length;
    const inactive = users.filter(u => u.status === "inactive").length;
    const banned = users.filter(u => u.status === "banned").length;
    const admins = users.filter(u => u.role === "admin").length;
    const customers = users.filter(u => u.role === "customer").length;
    
    return { total, active, inactive, banned, admins, customers };
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
                <Skeleton className="col-span-1 h-4" />
                <Skeleton className="col-span-3 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-2 h-4" />
              </div>
              
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="grid grid-cols-12 p-4 border-b">
                  <div className="col-span-1 flex items-center">
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Skeleton className="h-4 w-24" />
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

  // User statistics
  const stats = getUserStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.admins}</div>
              <div className="text-sm text-muted-foreground">Administrators</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.customers}</div>
              <div className="text-sm text-muted-foreground">Customers</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pt-6 px-6 pb-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Select 
                value={roleFilter} 
                onValueChange={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roleFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
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
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={currentUsers.length > 0 && currentUsers.every(user => selectedUsers.includes(user.id))}
                      onCheckedChange={handleSelectAllInPage}
                      aria-label="Select all users on current page"
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleUserSelection(user.id)}
                          aria-label={`Select user ${user.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getUserRoleBadge(user.role)}</TableCell>
                      <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                      <TableCell>{formatDate(user.joinedDate)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
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
                              <Link href={`/admin/users/${user.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/edit/${user.id}`} className="flex items-center">
                                <UserCog className="mr-2 h-4 w-4" />
                                Edit User
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${user.email}`} className="flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Lock className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            
                            {user.status !== "active" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                <span className="text-green-500">Activate User</span>
                              </DropdownMenuItem>
                            )}
                            
                            {user.status !== "banned" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(user.id, "banned")}>
                                <Ban className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">Ban User</span>
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUsers([user.id]);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Delete User
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
              Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Selected ({selectedUsers.length})
                </Button>
              )}
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
              Are you sure you want to delete {selectedUsers.length} {selectedUsers.length === 1 ? "user" : "users"}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUsers}>Delete Users</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 