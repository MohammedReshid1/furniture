"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { X } from "lucide-react"

export interface ToastNotification {
  id: string
  title: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastContextType {
  toasts: ToastNotification[]
  showToast: (toast: Omit<ToastNotification, "id">) => void
  hideToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
  clearToasts: () => {}
})

export const useToast = () => useContext(ToastContext)

const generateId = () => Math.random().toString(36).substring(2, 9)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const showToast = useCallback((toast: Omit<ToastNotification, "id">) => {
    const id = generateId()
    const newToast = { ...toast, id, duration: toast.duration || 5000 }
    setToasts(prev => [...prev, newToast])
    
    // Auto-dismiss toast after duration
    setTimeout(() => {
      hideToast(id)
    }, newToast.duration)
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearToasts }}>
      {children}
      
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md">
          {toasts.map(toast => (
            <div 
              key={toast.id} 
              className={`bg-card text-card-foreground p-4 rounded-lg shadow-lg border flex items-start gap-2 animate-in slide-in-from-right-5 ${
                toast.type === "error" ? "border-destructive" : 
                toast.type === "warning" ? "border-yellow-500" : 
                toast.type === "success" ? "border-green-500" : "border-border"
              }`}
            >
              {toast.type && (
                <div className={`flex-shrink-0 w-5 h-5 rounded-full ${
                  toast.type === "error" ? "bg-destructive" : 
                  toast.type === "warning" ? "bg-yellow-500" : 
                  toast.type === "success" ? "bg-green-500" : "bg-primary"
                }`} />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-sm">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs text-muted-foreground mt-1">{toast.description}</p>
                )}
              </div>
              <button 
                onClick={() => hideToast(toast.id)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
} 