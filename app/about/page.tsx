"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { ArrowRight, Award, Globe, Users, MapPin, Mail, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-texture">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="animate-fade-in-up">
            <h1 className="mb-8">About Furniture Haven</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed font-light">
              We're on a mission to help you create spaces that feel like home.
              Quality furniture, thoughtful design, and exceptional customer service -
              that's the Furniture Haven difference.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="hover:shadow-lg hover:scale-105 transition-all">
                <Link href="/categories/all">
                  Browse Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="hover:bg-primary/5">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl hover-lift animate-fade-in-up stagger-1">
            <Image
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
              alt="Modern living room with Furniture Haven furniture"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      
        {/* Our Story */}
        <div className="mb-32">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="mb-6">Our Story</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-accent to-secondary mx-auto mb-10 rounded-full"></div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Furniture Haven was founded in 2010 with a simple idea: furniture should be both beautiful and functional.
              What started as a small family business has grown into a beloved brand, but our commitment to quality and
              customer satisfaction remains at the heart of everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-10 hover-lift">
              <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-2xl w-fit mb-8 shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Quality Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                We partner with skilled artisans and responsible manufacturers who share our commitment to quality, sustainability, and fair labor practices.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-10 hover-lift">
              <div className="bg-gradient-to-br from-secondary to-primary p-4 rounded-2xl w-fit mb-8 shadow-lg">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Sustainable Practices</h3>
              <p className="text-muted-foreground leading-relaxed">
                We're committed to reducing our environmental footprint by sourcing sustainable materials and implementing eco-friendly packaging and shipping practices.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-10 hover-lift">
              <div className="bg-gradient-to-br from-accent to-secondary p-4 rounded-2xl w-fit mb-8 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Customer-First Approach</h3>
              <p className="text-muted-foreground leading-relaxed">
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
            <div key={index} className="bg-card border border-border/50 rounded-2xl overflow-hidden hover-lift group">
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-7">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground text-base">{member.role}</p>
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
        <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-14 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grain opacity-20" />
          <div className="relative z-10">
            <h2 className="text-white mb-6">Ready to Transform Your Space?</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Browse our collection of thoughtfully designed furniture pieces or visit one of our showrooms to experience the Furniture Haven difference.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild variant="secondary" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-xl">
                <Link href="/categories/all">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-all">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 