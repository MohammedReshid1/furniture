"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useToast } from "@/app/contexts/ToastContext"

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({})
  
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login?redirect=/account/settings")
      return
    }
    
    // Initialize form with user data
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, router, user, isLoading])
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when field is updated
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when field is updated
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }
  
  const validateProfileForm = () => {
    const newErrors: typeof errors = {}
    
    if (!profileForm.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    
    if (!profileForm.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = "Email address is invalid"
    }
    
    if (profileForm.phone && !/^\+?[0-9\s\-()]+$/.test(profileForm.phone)) {
      newErrors.phone = "Phone number is invalid"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const validatePasswordForm = () => {
    const newErrors: typeof errors = {}
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateProfileForm()) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update profile in auth context
      if (updateProfile) {
        await updateProfile({
          fullName: profileForm.fullName,
          email: profileForm.email,
          phone: profileForm.phone
        })
      }
      
      showToast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
        type: "success"
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        type: "error"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      showToast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
        type: "success"
      })
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error("Error changing password:", error)
      showToast({
        title: "Update Failed",
        description: "There was an error changing your password. Please check your current password and try again.",
        type: "error"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Skeleton className="h-10 w-10 mr-2" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="bg-card rounded-lg border border-border p-6">
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              
              <Skeleton className="h-10 w-32 mt-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.push('/account')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-border">
          <div className="flex space-x-8">
            <button
              className={`pb-2 ${
                activeTab === 'profile'
                  ? 'border-b-2 border-primary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`pb-2 ${
                activeTab === 'security'
                  ? 'border-b-2 border-primary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>
        </div>
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-card rounded-lg border border-border p-6">
            <form onSubmit={handleUpdateProfile}>
              <h2 className="text-xl font-semibold mb-6 text-card-foreground">
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.fullName ? 'border-destructive' : 'border-input'
                      } rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="Your full name"
                      disabled={isSaving}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.email ? 'border-destructive' : 'border-input'
                      } rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="your.email@example.com"
                      disabled={isSaving}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                    Phone Number (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.phone ? 'border-destructive' : 'border-input'
                      } rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="+1 (555) 123-4567"
                      disabled={isSaving}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-card rounded-lg border border-border p-6">
            <form onSubmit={handleChangePassword}>
              <h2 className="text-xl font-semibold mb-6 text-card-foreground">
                Change Password
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-10 py-2 border ${
                        errors.currentPassword ? 'border-destructive' : 'border-input'
                      } rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="Enter your current password"
                      disabled={isSaving}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.currentPassword}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-10 py-2 border ${
                        errors.newPassword ? 'border-destructive' : 'border-input'
                      } rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="Enter your new password"
                      disabled={isSaving}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.newPassword}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-10 py-2 border ${
                        errors.confirmPassword ? 'border-destructive' : 'border-input'
                      } rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="Confirm your new password"
                      disabled={isSaving}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <Link 
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/90"
                >
                  Forgot your password?
                </Link>
                
                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
} 