'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '@/app/utils/api'

// User type definition
export type User = {
  id: number
  email: string
  full_name: string
  is_admin: boolean
  is_active: boolean
  created_at: string
}

// Auth context state
interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: { email: string; full_name: string; password: string }) => Promise<void>
  logout: () => void
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    
    if (storedToken) {
      setToken(storedToken)
      
      // Fetch current user
      authAPI
        .getCurrentUser()
        .then((userData) => {
          setUser(userData)
        })
        .catch((error) => {
          console.error('Failed to fetch user', error)
          // Token might be invalid or expired
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      const data = await authAPI.login(email, password)
      
      // Save token
      localStorage.setItem('token', data.access_token)
      setToken(data.access_token)
      
      // Fetch user data
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Login failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData: { email: string; full_name: string; password: string }) => {
    setIsLoading(true)
    
    try {
      await authAPI.register(userData)
      // After successful registration, log the user in
      await login(userData.email, userData.password)
    } catch (error) {
      console.error('Registration failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    authAPI.logout()
    setUser(null)
    setToken(null)
  }

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token

  // Context value
  const contextValue = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
} 