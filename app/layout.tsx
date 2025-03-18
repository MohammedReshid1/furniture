import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/app/components/ui/theme-provider"
import { ToastProvider } from "@/app/contexts/ToastContext"
import { AuthProvider } from "@/app/contexts/AuthContext"
import { CartProvider } from "@/app/contexts/CartContext"
import { Navigation } from "@/app/components/ui/Navigation"
import Footer from "@/app/components/Footer"
import { ModeToggle } from "./components/mode-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Furniture Haven",
  description: "Modern furniture for your home and office",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <Navigation />
                  <main className="flex-1 bg-background">
                    {children}
                  </main>
                  <Footer />
                </div>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

