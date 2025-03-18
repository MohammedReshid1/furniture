"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { ArrowRight, Award, Globe, Users, MapPin, Mail, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About FurnishHome</h1>
          <p className="text-xl text-muted-foreground mb-8">
            We're on a mission to help you create spaces that feel like home. 
            Quality furniture, thoughtful design, and exceptional customer service - 
            that's the FurnishHome difference.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/categories/all">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" 
            alt="Modern living room with FurnishHome furniture"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      {/* Our Story */}
      <div className="mb-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground">
            FurnishHome was founded in 2010 with a simple idea: furniture should be both beautiful and functional.
            What started as a small family business has grown into a beloved brand, but our commitment to quality and 
            customer satisfaction remains at the heart of everything we do.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-6">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Quality Craftsmanship</h3>
            <p className="text-muted-foreground">
              We partner with skilled artisans and responsible manufacturers who share our commitment to quality, sustainability, and fair labor practices.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-6">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sustainable Practices</h3>
            <p className="text-muted-foreground">
              We're committed to reducing our environmental footprint by sourcing sustainable materials and implementing eco-friendly packaging and shipping practices.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Customer-First Approach</h3>
            <p className="text-muted-foreground">
              Our team is dedicated to providing exceptional service at every step, from browsing our collection to after-sale support.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Team */}
      <div className="mb-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground">
            The passionate individuals behind FurnishHome are united by a shared vision:
            to help you create beautiful, functional spaces that bring joy to everyday living.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Founder & CEO",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80"
            },
            {
              name: "Michael Chen",
              role: "Head of Design",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80"
            },
            {
              name: "Olivia Rodriguez",
              role: "Customer Experience",
              image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80"
            },
            {
              name: "James Wilson",
              role: "Operations Director",
              image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80"
            }
          ].map((member, index) => (
            <div key={index} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="relative h-64 w-full">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Locations */}
      <div className="mb-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Locations</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground">
            Visit one of our showrooms to experience our furniture in person and receive expert guidance from our design consultants.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              city: "New York",
              address: "123 Design Avenue, NY 10001",
              phone: "(212) 555-1234",
              email: "newyork@furnishhome.com"
            },
            {
              city: "Los Angeles",
              address: "456 Furniture Boulevard, CA 90001",
              phone: "(323) 555-5678",
              email: "losangeles@furnishhome.com"
            },
            {
              city: "Chicago",
              address: "789 Home Street, IL 60601",
              phone: "(312) 555-9012",
              email: "chicago@furnishhome.com"
            }
          ].map((location, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4">{location.city}</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <span>{location.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <span>{location.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary/10 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Space?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Browse our collection of thoughtfully designed furniture pieces or visit one of our showrooms to experience the FurnishHome difference.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/categories/all">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 