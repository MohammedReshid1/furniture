"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { useToast } from "@/app/contexts/ToastContext"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, HelpCircle } from "lucide-react"

export default function ContactPage() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success toast
      showToast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
        type: "success"
      })
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          Have questions about our products or services? Our team is here to help.
          Get in touch with us through any of the methods below.
        </p>
      </div>
      
      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="text-muted-foreground mb-4">
            Our customer service team is available Monday through Friday, 9am-6pm ET.
          </p>
          <a
            href="tel:+18001234567"
            className="text-primary hover:underline font-medium"
          >
            (800) 123-4567
          </a>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email Us</h3>
          <p className="text-muted-foreground mb-4">
            Send us an email and we'll get back to you within 24 hours.
          </p>
          <a
            href="mailto:support@furnishhome.com"
            className="text-primary hover:underline font-medium"
          >
            support@furnishhome.com
          </a>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Help Center</h3>
          <p className="text-muted-foreground mb-4">
            Browse our knowledge base for answers to frequently asked questions.
          </p>
          <Link
            href="/help"
            className="text-primary hover:underline font-medium"
          >
            Visit Help Center
          </Link>
        </div>
      </div>
      
      {/* Contact Form & Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What is your message about?"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="How can we help you?"
                rows={5}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-8 bg-primary/10 rounded-lg p-6">
            <div className="flex items-start">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5 mr-3" />
              <p className="text-sm text-muted-foreground">
                Our team typically responds within 24 hours during business days. 
                For urgent matters, please call our customer support line.
              </p>
            </div>
          </div>
        </div>
        
        {/* Locations */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Visit Our Showrooms</h2>
          <div className="space-y-8">
            {[
              {
                city: "New York",
                address: "123 Design Avenue, NY 10001",
                phone: "(212) 555-1234",
                hours: "Mon-Sat: 10am-7pm, Sun: 11am-6pm",
                image: "https://images.unsplash.com/photo-1546636889-ba9fdd63583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
              },
              {
                city: "Los Angeles",
                address: "456 Furniture Boulevard, CA 90001",
                phone: "(323) 555-5678",
                hours: "Mon-Sat: 10am-8pm, Sun: 11am-6pm",
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
              },
              {
                city: "Chicago",
                address: "789 Home Street, IL 60601",
                phone: "(312) 555-9012",
                hours: "Mon-Sat: 10am-7pm, Sun: 12pm-5pm",
                image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
              }
            ].map((location, index) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image 
                    src={location.image} 
                    alt={`${location.city} Showroom`} 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-semibold text-white">{location.city}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <span className="text-muted-foreground">{location.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <span className="text-muted-foreground">{location.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-3" />
                    <span className="text-muted-foreground">{location.hours}</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`https://maps.google.com/?q=${location.address}`} target="_blank" rel="noopener noreferrer">
                        Get Directions
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="mt-16">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border">
          <Image 
            src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=500&q=80" 
            alt="Map of our store locations" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-md text-center border border-border">
              <h3 className="text-xl font-semibold mb-3">Our Locations</h3>
              <p className="text-muted-foreground mb-4">
                Visit one of our showrooms to experience our furniture in person and receive expert guidance from our design consultants.
              </p>
              <Button asChild>
                <Link href="/about#locations">
                  View All Locations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 