"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X, Sun, Moon, User, ShieldAlert } from "lucide-react"
import { useCart } from "@/app/contexts/CartContext"
import { useAuth } from "@/app/contexts/AuthContext"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./button"
import { cn } from "@/app/lib/utils"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { cartCount } = useCart()
  const { user, logout } = useAuth()
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/categories/all", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
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
            
            <Button
              variant="ghost"
              size="icon"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col py-4 px-4 bg-background">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-2 text-muted-foreground hover:text-foreground transition-colors",
                  pathname === link.href && "text-foreground font-medium"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px my-4 bg-border" />
            
            {user ? (
              <>
                <div className="py-2 text-sm font-medium text-foreground">
                  {user.email}
                </div>
                <Link 
                  href="/account" 
                  className="py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Account
                </Link>
                <Link 
                  href="/account/orders" 
                  className="py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Orders
                </Link>
                <Link 
                  href="/admin/dashboard" 
                  className="py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    Admin Portal
                  </div>
                </Link>
                <button 
                  onClick={logout}
                  className="py-2 text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="py-2">
                <Button className="w-full">Login</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
} 