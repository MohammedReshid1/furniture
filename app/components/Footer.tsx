"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would handle newsletter subscription
    console.log('Newsletter subscription submitted')
  }
  
  // Don't show footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return null
  }
  
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50 text-card-foreground mt-auto">
      {/* Desktop Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Information */}
          <div>
            <Link href="/" className="flex items-center mb-5 group">
              <div className="relative w-12 h-12 mr-3 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Image
                  src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                  alt="Furniture Haven Logo"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-2xl font-bold group-hover:text-primary transition-colors">Furniture Haven</span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Modern furniture for modern living. Quality pieces designed for comfort, style, and lasting value.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <MapPin size={16} className="mr-2" />
                <span>123 Furniture Lane, Design District</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone size={16} className="mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Mail size={16} className="mr-2" />
                <span>hello@furniturehaven.com</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/categories/all" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/living-room" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/categories/bedroom" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/categories/kitchen" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  Kitchen
                </Link>
              </li>
              <li>
                <Link href="/categories/office" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  Office
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-xl mb-5">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-xl mb-5">Stay Updated</h3>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              Subscribe to our newsletter for the latest products, trends, and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                required
                className="bg-background border-border/50 focus:border-primary transition-colors"
              />
              <Button type="submit" className="w-full hover:shadow-lg transition-all">
                Subscribe
              </Button>
            </form>
            <div className="flex space-x-4 mt-8">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
                <Facebook size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
                <Twitter size={22} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
                <Instagram size={22} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
                <Linkedin size={22} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Mobile Footer - Simplified Version */}
        <div className="md:hidden">
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="flex items-center mb-2">
              <div className="relative w-10 h-10 mr-2">
                <Image 
                  src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Furniture Haven Logo" 
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">Furniture Haven</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center">
              Modern furniture for modern living
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium text-sm mb-2">Shop</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/categories/all" className="text-muted-foreground">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories/living-room" className="text-muted-foreground">
                    Living Room
                  </Link>
                </li>
                <li>
                  <Link href="/categories/bedroom" className="text-muted-foreground">
                    Bedroom
                  </Link>
                </li>
                <li>
                  <Link href="/sale" className="text-muted-foreground">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-2">Support</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/contact" className="text-muted-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-muted-foreground">
                    Shipping
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
              <Instagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Furniture Haven. All rights reserved.
          </p>
          <div className="hidden md:flex md:flex-wrap md:justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-foreground transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

