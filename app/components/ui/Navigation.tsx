"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X, User, ShieldAlert } from "lucide-react"
import { useCart } from "@/app/contexts/CartContext"
import { useAuth } from "@/app/contexts/AuthContext"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./button"
import { cn } from "@/app/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { cartCount } = useCart()
  const { user, logout } = useAuth()
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Don't show normal navigation in admin routes
  if (pathname?.startsWith("/admin")) {
    return null
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/categories/all", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-foreground">
            Furniture Haven
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground transition-colors duration-200",
                  pathname === link.href && "text-foreground font-medium"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <div className="relative group">
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-20 border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-card-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Link href="/account" className="block px-4 py-2 text-sm text-card-foreground hover:bg-primary/10">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2 text-sm text-card-foreground hover:bg-primary/10">
                    My Orders
                  </Link>
                  <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-card-foreground hover:bg-primary/10">
                    <div className="flex items-center">
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Admin Portal
                    </div>
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-card-foreground hover:bg-primary/10"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center mb-8">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <nav className="flex flex-col space-y-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "text-lg font-medium text-muted-foreground hover:text-foreground transition-colors",
                          pathname === link.href && "text-foreground font-semibold"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="mt-auto">
                    {user ? (
                      <div className="space-y-4">
                        <div className="text-sm font-medium text-muted-foreground">
                          Logged in as: {user.email}
                        </div>
                        <Link 
                          href="/account" 
                          className="block text-foreground hover:text-primary transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link 
                          href="/account/orders" 
                          className="block text-foreground hover:text-primary transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link 
                          href="/admin/dashboard" 
                          className="block text-foreground hover:text-primary transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-center">
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Admin Portal
                          </div>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full mt-2"
                          onClick={() => {
                            logout()
                            setIsOpen(false)
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button className="w-full">Login</Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">Register</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
} 