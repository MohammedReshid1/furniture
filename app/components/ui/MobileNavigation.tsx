"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react"
import { useCart } from "@/app/contexts/CartContext"
import { cn } from "@/app/lib/utils"

export function MobileNavigation() {
  const pathname = usePathname()
  const { cartCount } = useCart()
  
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/categories/all", label: "Shop", icon: ShoppingBag },
    { href: "/cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { href: "/account", label: "Account", icon: User },
  ]

  // Don't show mobile navigation in admin routes
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className="relative">
              <item.icon className="h-6 w-6" />
              {item.badge ? (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
} 