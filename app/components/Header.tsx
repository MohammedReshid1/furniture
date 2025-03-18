"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, Search, LogOut, Package, Settings } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { useState } from "react"

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }
  
  return (
    <header className="bg-background shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <Image 
              src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
              alt="Furniture Haven Logo" 
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-2xl font-bold text-foreground">Furniture Haven</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/categories/living-room" className="text-muted-foreground hover:text-foreground">
                Living Room
              </Link>
            </li>
            <li>
              <Link href="/categories/bedroom" className="text-muted-foreground hover:text-foreground">
                Bedroom
              </Link>
            </li>
            <li>
              <Link href="/categories/office" className="text-muted-foreground hover:text-foreground">
                Office
              </Link>
            </li>
            <li>
              <Link href="/categories/kitchen" className="text-muted-foreground hover:text-foreground">
                Kitchen
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/search" className="text-muted-foreground hover:text-foreground">
            <Search size={24} />
          </Link>
          <Link href="/cart" className="text-muted-foreground hover:text-foreground">
            <ShoppingCart size={24} />
          </Link>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <User size={24} />
                <span className="ml-2 hidden sm:inline">{user?.full_name.split(' ')[0]}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <Link 
                      href="/account" 
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="inline mr-2" />
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Package size={16} className="inline mr-2" />
                      My Orders
                    </Link>
                    
                    {user?.is_admin && (
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} className="inline mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              <User size={24} />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

