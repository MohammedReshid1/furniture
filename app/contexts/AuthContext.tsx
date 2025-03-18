"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "./ToastContext"

export interface User {
  _id: string
  email: string
  fullName: string
  isAdmin: boolean
  phone?: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  fullName: string
}

interface UpdateProfileData {
  fullName: string
  email: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (data: UpdateProfileData) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => false,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { showToast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setUser(null)
          return
        }
        
        // For demo purposes, we'll use a timeout to simulate API call
        // In a real app, you would call your API to validate the token
        setTimeout(() => {
          // Demo user data
          const userData = JSON.parse(localStorage.getItem('user') || 'null')
          setUser(userData)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Authentication error:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    try {
      // For demo purposes, we'll use a timeout to simulate API call
      // In a real app, you would call your API to authenticate
      
      // Demo credentials check
      if (credentials.email === 'user@example.com' && credentials.password === 'password') {
        const demoUser: User = {
          _id: 'user123',
          email: 'user@example.com',
          fullName: 'Demo User',
          isAdmin: false
        }
        
        localStorage.setItem('token', 'demo-token-user')
        localStorage.setItem('user', JSON.stringify(demoUser))
        setUser(demoUser)
        
        showToast({
          title: 'Login successful',
          description: `Welcome back, ${demoUser.fullName}!`,
          type: 'success'
        })
        
        return true
      } else if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
        const adminUser: User = {
          _id: 'admin123',
          email: 'admin@example.com',
          fullName: 'Admin User',
          isAdmin: true
        }
        
        localStorage.setItem('token', 'demo-token-admin')
        localStorage.setItem('user', JSON.stringify(adminUser))
        setUser(adminUser)
        
        showToast({
          title: 'Login successful',
          description: `Welcome back, ${adminUser.fullName}!`,
          type: 'success'
        })
        
        return true
      }
      
      showToast({
        title: 'Login failed',
        description: 'Invalid email or password',
        type: 'error'
      })
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      showToast({
        title: 'Login failed',
        description: 'An error occurred during login',
        type: 'error'
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      // For demo purposes, we'll use a timeout to simulate API call
      // In a real app, you would call your API to register
      
      // Demo email check
      if (data.email === 'user@example.com' || data.email === 'admin@example.com') {
        showToast({
          title: 'Registration failed',
          description: 'Email already exists',
          type: 'error'
        })
        return false
      }
      
      const newUser: User = {
        _id: `user_${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        isAdmin: false
      }
      
      localStorage.setItem('token', `demo-token-${newUser._id}`)
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      
      showToast({
        title: 'Registration successful',
        description: 'Your account has been created',
        type: 'success'
      })
      
      return true
    } catch (error) {
      console.error('Register error:', error)
      showToast({
        title: 'Registration failed',
        description: 'An error occurred during registration',
        type: 'error'
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    
    showToast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
      type: 'info'
    })
    
    // Redirect to home page if on a protected route
    if (pathname.startsWith('/account') || pathname === '/checkout') {
      router.push('/')
    }
  }

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone
      };
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      showToast({
        title: 'Update failed',
        description: 'An error occurred while updating your profile',
        type: 'error'
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 