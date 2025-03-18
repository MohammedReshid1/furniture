"use client"

import { useState, useEffect, ReactNode } from "react"
import { X, Check, AlertCircle, Info } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/app/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        success: "border-green-500 bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100",
        error: "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100",
        warning: "border-amber-500 bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100",
        info: "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  duration?: number
  className?: string
}

export function Toast({
  title,
  description,
  icon,
  action,
  open: controlledOpen,
  onOpenChange,
  variant = "default",
  duration = 5000,
  className,
}: ToastProps) {
  const [open, setOpen] = useState(controlledOpen !== undefined ? controlledOpen : true)
  
  // Handle controlled open state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen)
    }
  }, [controlledOpen])
  
  // Auto-hide the toast after duration
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        setOpen(false)
        onOpenChange?.(false)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [open, duration, onOpenChange])
  
  // Early return if not open
  if (!open) {
    return null
  }
  
  // Get the appropriate icon based on variant
  const getVariantIcon = () => {
    if (icon) return icon
    
    switch (variant) {
      case "success":
        return <Check className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertCircle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
      default:
        return null
    }
  }
  
  const handleClose = () => {
    setOpen(false)
    onOpenChange?.(false)
  }
  
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ease-in-out",
        open ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none",
        className
      )}
      role="alert"
    >
      <div className={cn(toastVariants({ variant }))}>
        <div className="flex items-start gap-3 w-full">
          {getVariantIcon() && (
            <div className="flex-shrink-0 self-start">
              {getVariantIcon()}
            </div>
          )}
          <div className="flex-1">
            {title && <div className="font-medium leading-none tracking-tight">{title}</div>}
            {description && (
              <div className="mt-1 text-sm opacity-90">{description}</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {action}
            <button
              onClick={handleClose}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-transparent hover:bg-muted/20"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 