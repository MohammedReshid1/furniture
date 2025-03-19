"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Separator } from "@/app/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]
  
  const NavLink = ({ href, children, icon: Icon, onClick }: { href?: string | null; children: React.ReactNode; icon: any; onClick?: () => void }) => {
    const isActive = href ? (pathname === href || pathname?.startsWith(`${href}/`)) : false
    
    // If href is undefined, null, or empty string, render a non-clickable element
    if (!href) {
      return (
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4" />
          {children}
        </div>
      );
    }
    
    return (
      <Link 
        href={href}
        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
          ${isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        onClick={onClick}
      >
        <Icon className="h-4 w-4" />
        {children}
      </Link>
    )
  }
  
  const MobileNav = () => (
    <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <div className="flex items-center border-b border-border p-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setIsMobileNavOpen(false)}>
            <Package className="h-5 w-5" />
            <span>Admin Portal</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileNavOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => (
              <NavLink 
                key={item.name} 
                href={item.href} 
                icon={item.icon}
                onClick={() => setIsMobileNavOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t border-border p-4">
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <Link href="/" onClick={() => setIsMobileNavOpen(false)}>
              <LogOut className="mr-2 h-4 w-4" />
              Back to Store
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
  
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Top header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background px-4 sm:px-6">
        <MobileNav />
        
        <div className="hidden md:flex md:items-center md:gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5" />
            <span>Admin Portal</span>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              Back to Store
            </Link>
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar navigation - desktop */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
          <ScrollArea className="h-[calc(100vh-56px)] py-6">
            <nav className="grid gap-1 px-2">
              {navigation.map((item) => (
                <NavLink 
                  key={item.name} 
                  href={item.href} 
                  icon={item.icon}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 